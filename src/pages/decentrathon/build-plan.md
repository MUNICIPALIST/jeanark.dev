---
layout: ../../layouts/Doc.astro
title: "План сборки"
group: "Обзор"
---



Архитектура и решения лежат в
[рабочем документе](https://claude.ai/artifact/EfnzjQ6DRbEGGJdExasHyX). Этот файл задаёт порядок
работ и контракты модулей.

## Как идёт работа

1. Каждый этап живёт в своей ветке `stage/<номер>-<имя>` от `ja-track-3`.
2. Этап заканчивается PR в `ja-track-3`.
3. Независимый ревьюер проверяет PR, не зная деталей реализации.
4. Агент-исполнитель чинит замечания, ревьюер проверяет снова. Автор не принимает свою работу.
5. Сливаем только при зелёном CI и закрытых замечаниях ревью. Если GitHub Actions недоступен, условием
   слияния служит результат `make ci`, вставленный в PR: он берёт чистый worktree от HEAD (только
   закоммитированное), гоняет pytest без данных и артефактов, собирает фронтенд (`npm ci && npm run
   build`) и печатает одну строку `CI PASSED @ <sha>: ...`. Запускать после последнего коммита.
6. Каждый этап оставляет отчёт `docs/stages/<номер>-<имя>.md`. Следующий агент читает отчёты
   этапов, от которых зависит, вместо пересказа в чате.

## Отчёт этапа

Отчёт короткий и содержит только то, что нужно следующему агенту:

- что сделано и какие файлы важны;
- решения и причины, особенно отступления от контрактов;
- как проверить: команды и фактические результаты;
- что не сделано, известные риски, что важно следующему этапу.

Данные кейса в отчёты не попадают: только агрегаты, номера пунктов и выдуманные примеры.

## Этапы

| Этап | Что делаем | Зависит от |
|---|---|---|
| 0 | каркас, схемы, нормализация, контракты, CI, демо интерфейса | нет |
| 1 | правила, карта пунктов, образцы стиля, база знаний | 0 |
| 2 | разметка, классификатор, приоритет, `extracted` | 0 |
| 3 | шаблоны, клиент LLM, проверка кодом | 0 |
| 4 | конвейер, `POST /triage`, `make predict` | 1, 2, 3 |
| 5 | `make eval`, сравнение моделей и режимов черновика | 4 |
| 6 | API очереди, вход, живой интерфейс | 4 |
| 7 | дедупликация и предложение шаблонов | 4 |
| 8 | Docker и деплой на инстанс | 6 |
| 9 | отчёт, README, финальная проверка | все |

## Контракты модулей

Менять сигнатуры можно только через PR, где это явно указано.

```python
# core/rules.py
def load_rules() -> list[RuleCandidate]: ...
def by_ref(ref: str) -> RuleCandidate | None: ...
def all_refs() -> set[str]: ...
def normalize_ref(raw: str) -> str | None: ...

# core/classify.py
def predict_topk(text: str, kind: str, k: int = 3) -> list[tuple[str, float]]: ...
def rule_flags(text: str) -> dict[str, bool]: ...  # payment, account, threat_irl, evidence, appeal
def extract(req: TriageRequest, text: str) -> Extracted: ...
def priority_for(category: str, flags: dict[str, bool], has_evidence: bool,
                 llm_threat: bool = False, llm_large_property: bool = False) -> str: ...

# core/context.py
@dataclass
class Context:
    rules: list[RuleCandidate]
    exemplars: list[str]
    kb: list[dict]
    glossary: dict[str, str]

def build_context(categories: list[str], reply_lang: str, kind: str, text: str) -> Context: ...
def primary_ref(category: str) -> str | None: ...

# core/templates.py
def render_complaint(category: str, lang: str, mode: str, slots: dict[str, str]) -> str: ...
def safe_reply(category: str, lang: str) -> str: ...
def fast_reply(kind: str, lang: str) -> str: ...  # empty or offtopic tickets

# core/draft.py
@dataclass
class LLMResult:
    output: LLMOutput | None
    model: str | None
    prompt_tokens: int
    output_tokens: int
    cost_usd: float
    latency_ms: int
    hedged: bool
    error: str | None

async def generate(text: str, reported_text: str, kind: str, reply_lang: str,
                   top_categories: list[str], context: Context) -> LLMResult: ...

# core/guard.py
def check(output: LLMOutput, final_text: str, reply_lang: str,
          candidates: list[RuleCandidate], top_categories: list[str]) -> list[str]: ...

# core/pipeline.py
async def triage(req: TriageRequest) -> tuple[TriageResponse, Telemetry]: ...
```

## Правила для всех этапов

- Данные кейса нельзя коммитить, ни целиком, ни частями. Всё, что собрано из них, лежит в
  `artifacts/`. В коде, тестах, документах и отчётах агентов только выдуманные примеры.
- Настоящие тикеты отправляем только через ключи из `.env`.
- Тесты не зависят от данных и сети. Что требует артефактов, пропускается при их отсутствии.
- Черновик не обещает исход, снятие бана или возврат и ничего не утверждает о содержимом скриншотов.
- Новые зависимости добавляем в `pyproject.toml`, только если без них нельзя.
