---
layout: ../../layouts/Doc.astro
title: "Этап 8: Docker и деплой"
group: "Журнал этапов"
---



> Обновлено на этапе 17b: классификатор теперь `models/classifier.npz` в самом образе (`COPY models`), в архив артефактов
> он не входит; `make bundle` без `classifier.joblib`. Режим без ключа: [17b-local-mode.md](/decentrathon/stage-17b-local-mode/).

**Сделано.** Файлы: `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `Caddyfile`, `deploy.env.example`,
цели `bundle`, `docker-build`, `predict-docker` в `Makefile`, `docs/deploy.md` (пошагово для чистой Ubuntu).
Код сервиса не менялся (`core/pipeline.py`, `cli/eval.py` не тронуты).

- **Образ** (3 стадии): Node 22 собирает `frontend/dist`; `python:3.12-slim` ставит зависимости из
  `pyproject.toml` в venv (только колёса, без компилятора); итоговый слой копирует venv, `core/ api/ cli/` и
  `dist`. Код лежит в `/app` и подключён через `PYTHONPATH` (пакет не ставится в site-packages, иначе
  `ROOT` в `core/config.py` указывал бы в site-packages и сервис не нашёл бы `frontend/dist`). Пользователь
  `app` (uid 10001), `/data` принадлежит ему (том базы), `HEALTHCHECK` на `/health`, один воркер:
  `uvicorn api.main:app --host 0.0.0.0 --port 8000 --proxy-headers`. Образ: 568 МБ на диске, 122 МБ в сжатом виде
  (в основном scipy 82 МБ, sklearn 35 МБ, numpy).
- **Доверие к прокси.** `--proxy-headers` доверяет `X-Forwarded-*` только адресам из `FORWARDED_ALLOW_IPS`
  (в образе по умолчанию 127.0.0.1). В публичном compose сеть `edge` 172.30.0.0/24, у Caddy фиксированный
  адрес 172.30.0.2, он и записан в `FORWARDED_ALLOW_IPS`; динамические адреса выдаются из верхней половины
  подсети (без `ip_range` приложение занимало .2 первым, и Caddy не стартовал).
- **`.dockerignore`**: `.env*`, `deploy.env`, `artifacts*`, `*.tgz`, `runs`, `handout*`, `data`, `*.jsonl*`,
  `*.csv`, `*.sqlite`, `private`, `tests`, `docs`, `.git`, `node_modules`, `frontend/dist`.
- **compose**: `docker-compose.yml` (публичный: `app` без публикации порта + `caddy` с 80/443, `DOMAIN` обязателен через
  `${DOMAIN:?}`, в Caddy передаётся только он) и `docker-compose.local.yml` (жюри: сервис `local`, порт 8000,
  `PUBLIC_MODE=0`, без Caddy; отдельный файл, потому что `${DOMAIN:?}` в одном файле ломал бы и локальный запуск).
  Профили не используются. На всех сервисах `logging: json-file`, `max-size 10m`, `max-file 3`. `app`: `read_only`, `tmpfs /tmp`,
  `cap_drop ALL`, `no-new-privileges`; тома: `./artifacts-runtime:/srv/artifacts:ro`,
  `${HANDOUT_DIR}/rules.json:/srv/handout/rules.json:ro` (один файл, не папка), именованный том
  `appdata:/data`. Публичные команды идут с `--env-file deploy.env` (без него compose прочёл бы `.env` из папки) (оттуда подстановка `HANDOUT_DIR`).
- **`make bundle`**: `artifacts-runtime.tgz` из `ARTIFACTS_DIR`: `classifier.joblib`, `category_rules.json`,
  `exemplars.json`, `kb.json`, `kb_index.joblib`, `uz_vocab.json`, `eval_report.json` (если есть). Печатает
  предупреждение о конфиденциальности; нет ни одного файла: ошибка. `*.tgz`, `deploy.env`, `artifacts-runtime/`,
  `private/`, `io/` добавлены в `.gitignore`.
- **`make predict-docker DIR=./io IN=tickets.jsonl OUT=pred.jsonl`** = `docker compose -f docker-compose.local.yml run --rm
  --no-deps --user $(id -u):$(id -g) -v DIR:/io local python -m cli.predict ...`.

**Проверка (реальный Docker, OrbStack, все числа с этой машины; только выдуманные тексты).**
- `docker build` проходит. В образе `find /` по `.env*`, `artifacts*`, `*.joblib`, `*.jsonl*`, `handout*`, `*.sqlite`
  находит только пустые точки монтирования `/srv/artifacts`, `/srv/handout`. Пользователь uid 10001; `/data`
  доступен на запись, `/srv/artifacts` только на чтение, `/app` только на чтение (public).
- Локальный файл, **без артефактов и без ключа**: `/health` ok (`artifacts` все false, `llm_key` false),
  `POST /triage` без учётных данных: 200, `report.complaint`, `needs_human`, причина «Модель недоступна
  (no_gemini_key; fallback_skipped)». **С артефактами** (смонтированы, `make bundle` + распаковка): все
  шесть файлов true, тот же запрос как `complaint`: `complaint.insult`, `p3`. Healthcheck: healthy.
- Публичный файл (Caddy только на HTTP через временный override на порту 18089, потому что настоящий сертификат
  локально не получить), одноразовые `SESSION_SECRET` и `JURY_PASSWORD`, ключей моделей нет: `/health`
  `{"status":"ok"}`; анонимный `/triage` 401; неверный пароль 401; вход 200; `/triage` с сессией 200
  (`report.payment`, `p0`); `/` 200 `text/html`; `/docs` без сессии 401; порт 8000 с хоста недоступен;
  очередь засеяна 35 выдуманными обращениями; `/api/rules/2.1` при смонтированном `rules.json` отдаёт
  `available: true`. `restart app` и `down` + `up` (том сохранён): в БД по-прежнему 35 тикетов и одна
  телеметрия на тикет (36 с одним запросом), повторного сида нет; сессия пережила перезапуск.
- `make predict-docker` на JSONL из 3 выдуманных тикетов: 3/3, `pred.jsonl` и `pred.jsonl.telemetry.jsonl`
  появились на хосте с uid хоста (`complaint.cheat`/p1, `report.payment`/p0, `report.offtopic`/p3).
- `docker compose -f docker-compose.local.yml config -q` ok; `--env-file deploy.env config -q` ok;
  без `deploy.env` публичный файл честно падает («env file not found»), без `DOMAIN` тоже (`required variable DOMAIN is missing`); локальный файл ничего из этого не требует.
- Caddyfile: `caddy validate` в контейнере `caddy:2-alpine` с `DOMAIN=copilot.example.test`: «Valid
  configuration», `caddy fmt` без изменений; без `DOMAIN` валидация падает (так и задумано).
- Живых вызовов модели не было (ключи из окружения сняты), расход $0.

**Правки после независимого ревью (PR #9).**
- Логи: json-file 10m x 3 на `app`, `caddy`, `local` (проверено `docker inspect`: `max-file:3 max-size:10m`).
- Журнал Caddy: раньше печатал `X-Api-Key`. Фильтр `delete` по списку (X-Api-Key, Authorization, Cookie) пропускал
  придуманный заголовок `X-Session-Token`, поэтому теперь вырезаются все `request>headers` и `resp_headers`.
  Проверка: запросы с канарейками в `X-Api-Key`, `Authorization`, `Cookie`, `X-Session-Token`, вход с паролем:
  `docker compose logs caddy` содержит 3 строки доступа и 0 вхождений канареек, `copilot_session` и пароля.
- Правила в локальном запуске: `core/config.data_file(name)` ищет `rules.json` и `taxonomy.json` сначала в
  `HANDOUT_DIR`, потом в `ARTIFACTS_DIR` (`core/rules.py`, `core/context.py`); `make bundle` кладёт их в архив из
  `HANDOUT_DIR` (адрес спрашивается у `core.config`, то есть учитывает `.env`). В контейнере без монтирования
  handout: `rules_available True`, 266 пунктов, кандидаты в контекст с настоящими номерами (2.1, 5.2, 2.4, 2.6);
  `make predict-docker` на тикете с `rule_refs_raw: "2.1"` вернул `extracted.rule_refs ["2.1"]`, предупреждения
  про отсутствие правил нет. `cited` без модели пуст по построению (шаблонные ответы не цитируют), живых вызовов
  не делалось.
- Воспроизводимость: в `pyproject.toml` закреплены scikit-learn 1.9.1, numpy 2.5.4, scipy 1.18.1, joblib 1.6.0
  (версии из venv сборки), образ пересобран; в контейнере `python -W error` грузит `classifier.joblib` и
  `kb_index.joblib` без предупреждений. В `docs/deploy.md` сказано: образ и архив из одного коммита.
- `api/auth.client_key`: `X-Forwarded-For` учитывается только при `PUBLIC_MODE` или если прямой адрес входит в
  `FORWARDED_ALLOW_IPS` (по умолчанию 127.0.0.1). Тест `test_forwarded_for_is_ignored_from_an_untrusted_peer`;
  фикстура `tests/apifix.py` объявляет TestClient доверенным прокси для старых тестов.
- В `PUBLIC_MODE` без `JURY_PASSWORD` сервис не стартует (`auth.init_secret`, тест
  `test_public_mode_refuses_to_start_without_jury_password`; в контейнере то же сообщение об ошибке).
- Предупреждение про автоподстановку `.env` и пример `--env-file /dev/null` в `docs/deploy.md` и в шапке
  `docker-compose.local.yml`.

**Не сделано, риски.**
- Настоящий выпуск сертификата Let's Encrypt и работа за реальным DNS не проверены (нужны домен и инстанс).
  Не проверен путь Caddy -> uvicorn с `X-Forwarded-Proto: https` (Secure-cookie) на настоящем HTTPS.
- Сборка образа заняла около 3 минут на arm64 (OrbStack); на amd64 образ не собирался.
- Локальный файл передаёт `GEMINI_API_KEY` из оболочки; compose дополнительно читает `.env` в папке проекта.
  Для проверок я подставлял пустой `--env-file`, чтобы не потратить платный ключ.
- Если `${HANDOUT_DIR}/rules.json` нет, Docker создаст каталог на его месте: правила не загрузятся (заглушка).
- Целевой инстанс не выбран, ничего не развёртывалось и не пушилось в реестры.
