# Hanna Center Dashboards — Static Site

A static password-gated site bundling fundraising dashboards and deployed via GitHub Pages - https://ntmbayfield.github.io/DevDashboards/.

```
site/
├── index.html                          ← landing page + password gate
├── assets/
│   └── gate.js                         ← shared auth logic
└── dashboards/
    ├── fundraising-performance-fy26.html   (FY26 Fundraising Overview)
    ├── campaign-revenue.html               (Year-over-Year Fundraising)
    ├── fy26-progress-to-goal.html          (FY26 Progress to Goal)
    ├── weekly-giving-jul6-12.html          (Weekly Giving: July 6th-12th, 2026)
    ├── weekly-giving-jul1-5.html           (Weekly Giving: July 1st-July 5th, 2026)
    ├── weekly-giving-jul13-19.html         (Weekly Giving: July 13th-19th, 2026)
    └── officer-performance.html            (Development Officer Performance — prototype)
```

The landing page groups these into three sections: **FY26 Fundraising**, **FY27
FYTD Fundraising**, and **Prototypes**.

---

## Dashboard reference

For each dashboard: the source file(s) it was built from, and the definition
of every metric shown, including how it's calculated. All dollar figures are
`Gf_Amount` (or the weekly report's equivalent) unless noted otherwise; all
fiscal years run July 1 – June 30 and are named for the ending year (FY26 =
July 2025–June 2026).

### Year-over-Year Fundraising (`campaign-revenue.html`)

**Source files:**
- `Reclassification_Impact_Data_for_Dashboard.xlsx` — authoritative source
  for the Reclassification Impact chart/table and the Original vs. Revised
  revenue-by-campaign figures used throughout this dashboard. Tabs: `FY23-24`,
  `FY24-25`, `FY25-26`.
- `Updated_Fundraising_Totals_by_Fiscal_Year.xlsx` — pivot tables (one per FY)
  mapping original campaign names to revised campaign names; used to build
  and cross-check the above.
- `Difference_in_Revenue_by_Campaign__FY24_Fy25_FY26.xlsx` — revised-
  classification revenue by campaign across all three years; used to
  cross-check year-over-year figures.
- `Revenue_Growth__with_and_without_Planned_Giving.xlsx` — revised-
  classification revenue and % of total, with and without Planned Giving;
  used to cross-check the Include/Exclude Planned Giving toggle.

**Metrics:**

| Metric | Calculation |
|---|---|
| Total Revenue, Selected Year | Sum of revised-classification revenue across active campaigns (excludes Planned Giving when the toggle is set to "Excluded") |
| Reclassification Impact chart | Clustered bars: x-axis = Original Classification / Revised Classification, one bar per campaign in each cluster, values pulled directly from the source file |
| % of Total (Orig./Rev.) | Campaign revenue ÷ total revenue for that classification, recalculated live for the active toggle state (not the file's static percentage, which always includes Planned Giving) |
| Change ($) | Revised revenue − Original revenue |
| Change (%) | Change ($) ÷ Original revenue (shown as N/A if Original = $0) |
| Year-over-year slope chart | Revised-classification revenue per campaign, plotted at FY24, FY25, and FY26 |
| FY24→FY25 / FY25→FY26 tables | Δ$ = revenue(to year) − revenue(from year); Δ% = Δ$ ÷ revenue(from year) (N/A if the from-year value is $0) |
| Year 1 to Year 3 dumbbell plot | FY24 vs. FY26 revised-classification revenue per campaign, rows sorted by absolute dollar change |

**Known data caveat shown on this dashboard:** the decline in the "Other"
campaign (Foundation/Government grants) reflects a change in what Raiser's
Edge tracks, not a real drop in institutional funding — those gift types
moved to a separate external reporting system partway through this period.

### FY26 Fundraising Overview (`fundraising-performance-fy26.html`)

**Source files:** `FY24_GIFTS.xlsx`, `FY25_GIFTS.xlsx`, `FY26_GIFTS.xlsx`
(gift-level exports, one row per gift; see [Data schema](#data-schema-and-relationships) below).

**Filtering rule applied to all metrics:** gifts with `Gf_Gift_status` =
`Terminated`, or with a blank `Gf_Date`/`Gf_Amount`, are excluded.

**Metrics:**

| Metric | Calculation |
|---|---|
| Total Revenue | Sum of `Gf_Amount` for valid gifts in the selected fiscal year |
| Total Gifts Received | Count of valid gift rows in the selected fiscal year |
| Unique Donors | Count of distinct `Gf_CnBio_ID` values with at least one valid gift that year |
| Average Gift Amount | Total Revenue ÷ Total Gifts |
| Avg. Gifts per Donor | Total Gifts ÷ Unique Donors |
| Revenue by Quarter | `Gf_Amount` summed by fiscal quarter from `Gf_Date` (Q1 Jul–Sep, Q2 Oct–Dec, Q3 Jan–Mar, Q4 Apr–Jun) |
| New Donors | Donor gave this FY, and never gave in either of the two prior years on file |
| Retained Donors | Donor gave this FY and also gave the immediately preceding FY |
| Recaptured Donors (FY26 only) | Donor gave this FY and gave two years prior, but did **not** give in the immediately preceding FY |
| Lapsing / LYBUNT | Donor gave the immediately preceding FY but not this FY ("Last Year But Not This") |
| Lost Donors (FY26 only) | Donor gave two years prior only — not the preceding FY, not this FY |
| SYBUNT | All donors who gave in any prior year on file but not this FY ("Some Year But Not This") — equals Lapsing ∪ Lost |
| LYBUNT / SYBUNT rosters | Donor name, most recent gift date, and most recent gift amount, sorted by amount, searchable by name |

**Data availability caveat:** New/Retained are computable for FY25 and FY26;
Recaptured/Lost require two full prior years of history and are only
computable for FY26, since FY24 is the earliest year in this dataset.

### FY26 Progress to Goal (`fy26-progress-to-goal.html`)

**Source files:** originally built from a user-provided React component
(`FY26ProgressToGoal.jsx`) containing each campaign's final FY26 raised
amount and fundraising goal; raised figures were cross-checked against the
revised-classification FY26 revenue in the files listed under *Year-over-Year
Fundraising* above.

**Metrics:**

| Metric | Calculation |
|---|---|
| % of Goal | Raised ÷ Goal, per campaign |
| Surplus / (Deficit) | Raised − Goal, per campaign |
| Combined Controllable Revenue | Direct Marketing + Event Income + Major Gifts raised, against the sum of their three goals (excludes Planned Giving; "Other" and Hanna Academy revenue, which carry no goal, are added into the total-raised figure only) |
| Total Raised / Total Goal / Gap / % of Goal | Same formulas as above, summed across whichever campaign set is active (Include/Exclude Planned Giving toggle) |

The Executive Summary narrative on this dashboard is written commentary, not
a calculated field — it explains why the FY25→FY26 total revenue drop is a
Planned Giving timing effect rather than a fundraising performance issue, and
flags the same Foundation/Government tracking-change caveat noted above.

### Weekly Giving: July 6th-12th, 2026 (`weekly-giving-jul6-12.html`)

**Source file:** `Weekly_Gift_Detail_Report_07_06_26-07_12_26.csv`
(gift-level export for a single reporting week; see [Data schema](#data-schema-and-relationships) below).

**Metrics:**

| Metric | Calculation |
|---|---|
| Amount (per gift) | `Cash` + `Stocks` + `Stock` + `Pledge Payment` (all four columns summed per row) |
| Gift Type | `Gift Subtype` if present; otherwise inferred from which amount column is populated (Stock/Property, Pledge Payment, else Cash) |
| Total Gifts / Total Amount / Average Gift | Count and sum of Amount across all gifts in the file |
| Unique Donors | Count of distinct values in `Constituent Name` (this field holds the constituent ID, not a name, in this export) |
| Giving by Day | Amount summed by `Date` |
| Giving by Campaign / Appeal / Fund | Amount and gift count grouped by `Campaign ID`, `Appeal Description`, and `Fund Description` respectively, each with % of the week's total |
| Gift Detail table | One row per gift: date, amount, gift type, campaign, fund, appeal, fundraiser, and constituent ID — sortable and searchable |
| FYTD Totals (Gifts / Amount / Donors, by Campaign / Appeal / Fund) | Same fields as above, but summed across every weekly report processed so far this fiscal year (July 1 through the end of this report's week), not just the current week |

**FYTD Totals note:** each weekly dashboard's FYTD Totals section is a
cumulative rollup of gift-level data from every prior weekly report in the
same fiscal year, combined with the current week. It is recalculated fresh
each time a new week's dashboard is built — there is no running database;
the underlying gift rows from each week's file are simply concatenated and
re-aggregated by campaign, appeal, and fund.

### Weekly Giving: July 1st-July 5th, 2026 (`weekly-giving-jul1-5.html`)

**Source file:** `Weekly_Gift_Detail_Report_07_01_26-07_05_26.xlsx`
(gift-level export for a single reporting week; same schema and metric
definitions as the July 6th-12th dashboard above, applied to a different
week's data — see [Data schema](#data-schema-and-relationships) below).

### Weekly Giving: July 13th-19th, 2026 (`weekly-giving-jul13-19.html`)

**Source file:** `Weekly_Gift_Detail_Report_07_13_26-07_19_26.csv`
(gift-level export for a single reporting week; same schema and metric
definitions as the July 6th-12th dashboard above, applied to a different
week's data — see [Data schema](#data-schema-and-relationships) below).

### Development Officer Performance — Prototype (`officer-performance.html`)

**Source file:** none. This dashboard uses **illustrative sample data only**,
built to review the design and layout before connecting it to a real data
source. A banner on the page states this. The three "officers" shown reuse
fundraiser names that appear in `Weekly_Gift_Detail_Report_07_06_26-07_12_26.csv`
for continuity, but their activity, portfolio, and gift data are invented.

**Metrics (as designed — pending a real data source):**

| Metric | Intended calculation |
|---|---|
| Actions This Week (by type) | Count of logged contact reports this week, grouped into Qualification / Cultivation / Solicitation / Stewardship (standard moves-management stages) |
| Open Proposals | Count and total ask amount of proposals not yet closed |
| No Contact in 10+ Days | Portfolio constituents whose most recent contact report is more than 10 days old |
| Upcoming Birthdays | Portfolio constituents with a birthday in the next 14 days |
| Gifts This Week | Gifts received this week from constituents in the officer's portfolio |
| Donors / Non-Donors FYTD | Portfolio constituents split by whether they've made a gift this fiscal year |
| Portfolio Yield FYTD vs. Goal | Sum of this fiscal year's gifts from portfolio constituents, against the officer's assigned portfolio goal |
| Closed Won Proposals FYTD | Proposals marked closed-won this fiscal year, with donor, proposal name, and amount |

Once connected to Raiser's Edge, most of these map directly to standard RE
entities: Actions (`Interactions` connector), Proposals (`Opportunities` in
the `Prospects` connector), and Gifts (`Gifts` connector).

---

## Data schema and relationships

### Gift-level files: `FY24_GIFTS.xlsx`, `FY25_GIFTS.xlsx`, `FY26_GIFTS.xlsx`

One row per gift transaction. Each is a single-sheet export named for its
fiscal year (`FY23-24`, `FY24-25`, `FY25-26`).

| Column | Description |
|---|---|
| `Gf_Gift_ID` | Unique gift identifier (primary key) |
| `Gf_Date` | Gift date |
| `Gf_Amount` | Gift amount |
| `Gf_Type` | Original gift type (Cash, Pledge, Stock/Property, etc.) |
| `Revised Type` | Cleaned-up gift type, where reclassified |
| `Gf_Gift_subtype` | Subtype, e.g. Recurring Gift Pay-Cash |
| `Gf_Gift_status` | Active / Completed / Terminated |
| `Gf_GL_post_date` | General ledger posting date |
| `Gf_Campaign` | Original campaign name |
| `Revised Campaign` | Cleaned-up campaign name (the basis for every "revised classification" figure across all dashboards) |
| `Logic` | Internal note on the campaign remapping (FY24/FY25 exports only) |
| `Gf_Appeal` | Original appeal |
| `Revised Appeal` | Cleaned-up appeal |
| `Gf_Fund` | Fund designation |
| `Gf_Import_ID` | Import batch identifier |
| `Gf_Balance` | Outstanding balance (relevant to pledges) |
| `Gf_CnBio_ID` | **Donor identifier (foreign key)** — links this gift to a constituent, and across fiscal years |
| `Gf_CnBio_Name` | Donor name |
| `Gf_CnBio_Import_ID` | Donor import batch identifier |
| `Gf_CnBio_Key_Indicator` | Donor flag/indicator field |

**This is the relationship that everything else is built on:** `Gf_CnBio_ID`
appearing (or not appearing) across the three yearly files is the entire
mechanism behind the FY26 Fundraising Overview dashboard's New / Retained /
Recaptured / Lapsing / Lost / SYBUNT donor-movement metrics — those are
computed purely by comparing the sets of donor IDs present in each year's
file, nothing more.

### Weekly file: `Weekly_Gift_Detail_Report_07_06_26-07_12_26.csv`

One row per gift transaction for a single reporting week — a differently
formatted export than the annual gift files above, at a similar grain.

| Column | Description |
|---|---|
| `Date` | Gift date |
| `Cash`, `Stocks`, `Stock`, `Pledge Payment` | Amount columns by payment method (summed together for total gift amount) |
| `Gift Subtype` | e.g. Recurring Gift Pay Cash, Recurring Gift Master Card/Visa |
| `Campaign ID` / `Campaign Description` | Revised campaign name / broader campaign grouping |
| `Fund ID` / `Fund Description` | Fund code / fund name |
| `Appeal ID` / `Appeal Description` | Appeal code / appeal name |
| `Constituent Name` | **Holds the constituent ID**, not a name, in this export — the same underlying concept as `Gf_CnBio_ID` above, from a different report format |
| `Fundraiser Name` | Assigned development officer, where applicable |
| `Anonymous`, `Soft credit` | Present in the file; not currently surfaced on the dashboard |

### Campaign-level (pre-aggregated) files

These four workbooks are **not gift-level data** — they're pre-aggregated
summaries, each answering a slightly different question about the same
underlying `Revised Campaign` totals found in the gift-level files above:

| File | Grain | Purpose |
|---|---|---|
| `Updated_Fundraising_Totals_by_Fiscal_Year.xlsx` | Campaign × FY (3 sheets, one per FY) | Pivot tables mapping original → revised campaign names, with combined revenue |
| `Difference_in_Revenue_by_Campaign__FY24_Fy25_FY26.xlsx` | Campaign × FY (1 sheet) | Revised-classification revenue by campaign, all three years in one table |
| `Revenue_Growth__with_and_without_Planned_Giving.xlsx` | Campaign (1 sheet) | Revised-classification revenue and % of total, with/without Planned Giving |
| `Reclassification_Impact_Data_for_Dashboard.xlsx` | Campaign × FY (3 sheets, one per FY) | Original vs. revised revenue, % of total, and $ change — the authoritative source for the Year-over-Year Fundraising dashboard |

**In short:** if you sum `Gf_Amount` from the gift-level files by
`Revised Campaign` and fiscal year, you get the numbers in all four of these
workbooks. They exist because different views of the same rollup were
requested at different points — not because the underlying revenue figures
differ between them.

### Entity-relationship summary

```
Gf_CnBio_ID (donor) ──< Gf_Gift_ID (gift)  [one donor, many gifts — annual files]
     │
     └── same donor concept, differently formatted ──> Constituent Name field [weekly file]

Gf_Campaign / Gf_Appeal (original) ──> Revised Campaign / Revised Appeal (cleaned)
     │
     └── aggregated by campaign + FY ──> the four campaign-level workbooks above
                                          ──> Year-over-Year Fundraising dashboard
                                          ──> FY26 Progress to Goal dashboard (Raised figures)

Gf_Gift_ID + Gf_Date + Gf_Amount + Gf_Gift_status ──> FY26 Fundraising Overview
                                                        (revenue, gift counts, donor retention)

FY26ProgressToGoal.jsx (user-provided goals) ──> FY26 Progress to Goal dashboard
                                                   (paired with Raised from gift-level rollups)

Officer/portfolio entities (Actions, Proposals, Gifts) ──> Development Officer
     [no file yet — illustrative prototype]                Performance (prototype)
```
