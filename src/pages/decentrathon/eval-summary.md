---
layout: ../../layouts/Doc.astro
title: "Eval summary"
group: "Метрики"
---



Sample: in-sample (tickets_valid: the code was tuned on these); code 1a8707b.

Tickets: 1000 (seed 20261030, limit all); model `gemini-3.5-flash-lite` / `gemini-3.5-flash-lite`, draft mode `neutral`.

## Targets

| target | goal | value | ok |
|---|---|---|---|
| mean_cost_usd | <= 0.0015 | 0.000000 | yes |
| max_cost_usd | <= 0.002 | 0.000000 | yes |
| latency_p95_ms | <= 4500 | 4.0 | yes |
| nonexistent_citations | 0 | 0 | yes |
| always_human_violations | 0 | 0 | yes |
| human_drafts_without_handoff | 0 | 0 | yes |
| rule_recall_at_draft | >= 0.70 | 0.678100 | NO |
| silver_category_agreement | >= 0.78 | 0.801000 | yes |

## Silver labels (an LLM, not people)

Category accuracy 80.1% on 1000 tickets (classifier alone 80.4%), macro-F1 0.728. Complaints 79.4%, reports 83.1%.

| class | F1 | precision | recall | n |
|---|---|---|---|---|
| complaint.insult | 0.875 | 0.849 | 0.902 | 236 |
| complaint.admin | 0.843 | 0.817 | 0.870 | 200 |
| complaint.invalid | 0.647 | 0.685 | 0.614 | 163 |
| complaint.dm | 0.830 | 0.811 | 0.849 | 126 |
| report.offtopic | 0.876 | 0.898 | 0.854 | 103 |
| complaint.other | 0.421 | 0.500 | 0.364 | 44 |
| report.help | 0.805 | 0.721 | 0.912 | 34 |
| report.complaint | 0.820 | 0.862 | 0.781 | 32 |
| complaint.scam | 0.840 | 0.840 | 0.840 | 25 |
| complaint.cheat | 0.872 | 1.000 | 0.773 | 22 |
| report.question | 0.640 | 0.667 | 0.615 | 13 |
| complaint.rmt_ads | 1.000 | 1.000 | 1.000 | 1 |
| report.payment | 0.000 | 0.000 | 0.000 | 1 |

Priority accuracy 43.8%, macro-F1 0.290 on 1000.

| class | F1 | precision | recall | n |
|---|---|---|---|---|
| p3 | 0.509 | 0.914 | 0.353 | 663 |
| p2 | 0.406 | 0.257 | 0.973 | 187 |
| p1 | 0.243 | 0.647 | 0.150 | 147 |
| p0 | 0.000 | 0.000 | 0.000 | 3 |

## Gold labels (hand-labelled)

- `tune` (n=15): category accuracy 80.0%, macro-F1 0.811; priority accuracy 60.0%, macro-F1 0.638.
- Silver vs gold category agreement: 86.7%, kappa 0.837 (n=15).
- Interrater agreement: not available (no second label set).

## Citations

- Nonexistent citations: 0
- Recall@draft (the real reply cites a rule; the draft cites one of them): 67.8% of 320 tickets
- Same, violated rules only (complaint-format points excluded): 81.3% of 267
- Precision when both cite: 84.8%; drafts with any citation: 370

## Routing

- needs_human 91.6%, auto-reply 8.4% {'report.offtopic': 84}
- Always-human violations: 0; p0 without a human: 0; human drafts without the handoff sentence: 0; cp1251 letters in output: 0
- Guard failures: 0 tickets (0.0%) {}
- Paths: {'offline': 871, 'fast': 129}; model errors: {}

## Latency and cost

- Latency ms: p50 1.0, p95 4.0, p99 9.0, mean 1.7, max 18; over 4500 ms: 0
- Cost per ticket: mean $0.000000 (when the model was called $0.000000), max $0.000000, tickets over $0.002: 0, total $0.000

## By reply language

| lang | n | silver cat. acc. | classifier alone | silver prio acc. | needs_human | guard fail | recall@draft | p95 ms | mean cost |
|---|---|---|---|---|---|---|---|---|---|
| kk | 7 | 71.4% | 71.4% | 28.6% | 100.0% | 0.0% | 50.0% | 2.7 | $0.000000 |
| ru | 865 | 79.8% | 80.1% | 45.1% | 91.8% | 0.0% | 66.9% | 4.0 | $0.000000 |
| uz | 128 | 82.8% | 82.8% | 35.9% | 89.8% | 0.0% | 87.5% | 5.0 | $0.000000 |

## Priority table variants against silver (counterfactual, nothing shipped)

| variant | accuracy | macro-F1 |
|---|---|---|
| current | 43.8% | 0.290 |
| appeal_no_evidence_p3 | 54.4% | 0.335 |

## Priority disagreements with silver (truth rows, predicted columns)

| silver \ predicted | p0 | p1 | p2 | p3 |
|---|---|---|---|---|
| p0 | 0 | 0 | 3 | 0 |
| p1 | 0 | 22 | 108 | 17 |
| p2 | 0 | 0 | 182 | 5 |
| p3 | 1 | 12 | 416 | 234 |
