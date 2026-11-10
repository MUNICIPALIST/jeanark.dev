---
layout: ../../layouts/Doc.astro
title: "Eval summary"
group: "Метрики"
---



Sample: holdout (train tickets outside every label, sample and gold file, n=300); code bc2c7fa.

Tickets: 300 (seed 20261030, limit all); model `gemini-3.5-flash-lite` / `gemini-3.5-flash-lite`, draft mode `conditional`.

## Targets

| target | goal | value | ok |
|---|---|---|---|
| mean_cost_usd | <= 0.0015 | 0.000449 | yes |
| max_cost_usd | <= 0.002 | 0.001316 | yes |
| latency_p95_ms | <= 4500 | 1193.1 | yes |
| nonexistent_citations | 0 | 0 | yes |
| always_human_violations | 0 | 0 | yes |
| rule_recall_at_draft | >= 0.70 | 0.663000 | NO |
| silver_category_agreement | >= 0.78 | None | n/a |

## Silver labels (an LLM, not people)

No silver labels found.

## Gold labels (hand-labelled)

No filled gold rows in this run.
- `final`: withheld (0 labelled rows); run with `--final` for the last check.
- Interrater agreement: not available (no second label set).

## Citations

- Nonexistent citations: 0
- Recall@draft (the real reply cites a rule; the draft cites one of them): 66.3% of 92 tickets
- Same, violated rules only (complaint-format points excluded): 74.4% of 82
- Precision when both cite: 82.4%; drafts with any citation: 145

## Routing

- needs_human 91.0%, auto-reply 9.0% {'report.offtopic': 27}
- Always-human violations: 0; p0 without a human: 0
- Guard failures: 0 tickets (0.0%) {}
- Paths: {'llm': 250, 'fast': 48, 'fallback': 2}; model errors: {'budget_timeout_in_call': 2}

## Latency and cost

- Latency ms: p50 881.5, p95 1193.1, p99 1543.28, mean 807.4, max 4451; over 4500 ms: 0
- Cost per ticket: mean $0.000449 (when the model was called $0.000535), max $0.001316, tickets over $0.002: 0, total $0.135

## By reply language

| lang | n | silver cat. acc. | classifier alone | silver prio acc. | needs_human | guard fail | recall@draft | p95 ms | mean cost |
|---|---|---|---|---|---|---|---|---|---|
| ru | 261 | n/a | n/a | n/a | 90.4% | 0.0% | 64.6% | 1195.0 | $0.000442 |
| uz | 39 | n/a | n/a | n/a | 94.9% | 0.0% | 80.0% | 1184.0 | $0.000501 |
