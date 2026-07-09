# SIM — Requirements Elicitation Questionnaire (Google Form Design)

**Project:** SIM (Security Incident Mapping) · AAUA campus & villa community
**Course:** SEN 202 — Weekend Dev 1 · **Lecturer:** Dr. O. O. Ajayi

## Purpose
Gather structured, uniform data from the three affected stakeholder groups —
**Students / villa mates, University staff, Landlords** — to validate the need
for SIM and prioritise its features. The form uses **only close-ended items**
(multiple choice, checkbox grids, Likert scales) so responses are uniform and
easy to analyse and to seed automatically (see `scripts/populate_form.py`).

## How to build it
Create a new Google Form → title **"SIM — Campus Security Reporting Survey"**.
Turn ON *Settings → Make this a quiz: OFF*, *Collect email: OFF* (respect anonymity).
Add a **Section per stage** and use *"Go to section based on answer"* on the Role
question to route each respondent to the block relevant to them.

---

## Section 0 — Consent & Role (all respondents)

| # | Question | Type | Options |
|---|----------|------|---------|
| Q0.1 | Do you consent to this anonymous academic survey? | Multiple choice (required) | Yes / No |
| Q0.2 | **Your role in the campus community** | Multiple choice (required, routes sections) | Student / Villa mate · University staff · Landlord |
| Q0.3 | How long have you been part of this community? | Multiple choice | < 1 yr · 1–2 yrs · 3–4 yrs · 5+ yrs |

*Routing:* Student → Section 1, Staff → Section 2, Landlord → Section 3, then all
converge on Section 4 (shared perception block).

---

## Section 1 — Students / Villa mates

| # | Question | Type | Options |
|---|----------|------|---------|
| Q1.1 | Where do you live? | Multiple choice | On-campus hostel · Off-campus villa · Family house |
| Q1.2 | **Which crimes have you witnessed or experienced near campus?** | Checkboxes | Theft/Stealing · Assault · Stabbing · Rape/Sexual assault · Robbery · Harassment/Threat · None |
| Q1.3 | When do incidents most often happen? | Multiple choice | Morning · Afternoon · Evening · Late night |
| Q1.4 | Have you ever *not* reported a crime you knew about? | Multiple choice | Yes · No |
| Q1.5 | **Main reason you would not report** | Multiple choice | Fear of retaliation · No easy channel · Distrust of authorities · Thought it was minor · Would report |

---

## Section 2 — University staff

| # | Question | Type | Options |
|---|----------|------|---------|
| Q2.1 | Department type | Multiple choice | Academic · Security/Works · Administrative · Health |
| Q2.2 | How are incidents currently logged in your unit? | Multiple choice | Paper register · Verbal report · Phone call · Nothing formal |
| Q2.3 | **How quickly does a report currently reach security?** | Multiple choice | < 1 hr · 1–6 hrs · Same day · > 1 day / unclear |
| Q2.4 | Would a central digital portal improve response time? | Likert 1–5 | 1 Strongly disagree … 5 Strongly agree |

---

## Section 3 — Landlords

| # | Question | Type | Options |
|---|----------|------|---------|
| Q3.1 | Number of student tenants you host | Multiple choice | 1–5 · 6–15 · 16–30 · 30+ |
| Q3.2 | **Safety features on your property** | Checkboxes | Perimeter fence · Security light · Gateman · CCTV · None |
| Q3.3 | Have tenants reported crimes to you? | Multiple choice | Often · Sometimes · Rarely · Never |
| Q3.4 | Would you use a portal to flag threats around your villa? | Likert 1–5 | 1 Strongly disagree … 5 Strongly agree |

---

## Section 4 — Shared perception & priorities (all respondents)

Use a **Multiple-choice grid** (rows = statements, columns = 5-point Likert):

| Statement (row) | 1 | 2 | 3 | 4 | 5 |
|-----------------|---|---|---|---|---|
| I feel safe on/around campus at night | ○ | ○ | ○ | ○ | ○ |
| Reporting a crime today is quick and easy | ○ | ○ | ○ | ○ | ○ |
| I would report more if I could stay anonymous | ○ | ○ | ○ | ○ | ○ |
| A live crime map would help me avoid danger zones | ○ | ○ | ○ | ○ | ○ |

*(Columns: 1 = Strongly disagree … 5 = Strongly agree)*

| # | Question | Type | Options |
|---|----------|------|---------|
| Q4.1 | **Most useful SIM feature to you** | Multiple choice | Anonymous reporting · Live threat map · Instant alerts to security · Evidence upload |
| Q4.2 | Would you prefer to report **anonymously**? | Multiple choice | Yes · No |
| Q4.3 | Preferred device for reporting | Multiple choice | Smartphone · Laptop · Either |

---

## Target field summary (for analysis & the seed script)

| Field | Feeds which artefact |
|-------|----------------------|
| Role | Segmentation of all results |
| Crime Type | Ishikawa validation, heatmap categories |
| Location / Villa Name | Heatmap zones |
| Time of day | Peak-risk analysis |
| Safety Comfort Level (Likert) | Problem-severity evidence |
| Likelihood to Report (Likert) | Justifies anonymity requirement |
| Anonymous Flag (Yes/No) | Justifies masking feature |
| Witnessed-before (Yes/No) | Under-reporting rate |

These eight fields map 1:1 to the `FIELDS` dictionary in
`scripts/populate_form.py`, so the automated verification layer can generate
100 realistic mock responses against exactly these questions.
