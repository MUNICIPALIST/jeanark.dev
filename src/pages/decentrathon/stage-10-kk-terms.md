---
layout: ../../layouts/Doc.astro
title: "Stage 10: Kazakh term for administrator, `kz` display"
group: "Журнал этапов"
---



- Kazakh administrator term is now «админ» (админге, админнің, админді, админнен, админдер) in templates, glossary and demo data.
- `core/pipeline.py: kk_terms` maps old forms (әкімші, әкімшіге, әкімшінің, әкімшіні, әкімшіден, әкімшілер, әкімшілік, capitalized too) in kk drafts before the guard check. Test in `tests/test_pipeline.py`.
- Input recognition unchanged: classify patterns, normalize vocabulary and guard markers keep «әкімші»; guard adds «админ» forms with a suffix, plain Russian «админ» is not a Kazakh marker.
- UI shows `kz` via `displayLang` (queue column, ticket panel, sandbox presets, language filter labels). API values stay `kk`.
