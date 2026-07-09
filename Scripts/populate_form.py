"""
populate_form.py
------------------------------------------------------------------
SIM (Security Incident Mapping) - Elicitation Automated Verification Layer
AAUA SEN 202 | Weekend Dev 1

Purpose
    Populate YOUR OWN SIM Google Form with realistic mock stakeholder
    responses so you have a statistically varied dataset to analyse
    (charts, cross-tabs) before real responses arrive. It also serves
    as a lightweight automated check that every required field on the
    form accepts and stores the values your questionnaire promises.

How it works
    A Google Form exposes a public POST endpoint at
        https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
    Each answer is keyed by a field token that looks like `entry.123456789`.
    We build a randomized payload per submission and POST it directly,
    which is faster than driving a browser for 100 records.

Only run this against a form you own. Delete the mock responses from the
form's response sheet before collecting real data.

Standard libraries only: requests, random, time.
    pip install requests      (requests is the one non-stdlib dependency)
"""

import random
import time
import requests

# =================================================================
# 1. CONFIG  --  paste your own values here
# =================================================================
# Open your form -> Send -> Link, or "Get pre-filled link" to read the
# entry.* tokens. Replace the FORM_ID and every entry token below.

FORM_ID = "REPLACE_WITH_YOUR_FORM_ID"   # the long id in the /viewform URL
POST_URL = f"https://docs.google.com/forms/d/e/{FORM_ID}/formResponse"

# Map each questionnaire field to its form field token.
FIELDS = {
    "role":          "entry.111111111",   # Reporter role
    "crime_type":    "entry.222222222",   # Crime type
    "location":      "entry.333333333",   # Location / Villa name
    "time_of_day":   "entry.444444444",   # Time incident occurred
    "safety_level":  "entry.555555555",   # Safety comfort (Likert 1-5)
    "would_report":  "entry.666666666",   # Likelihood to report (Likert 1-5)
    "anonymous":     "entry.777777777",   # Anonymous flag (Yes/No)
    "witnessed":     "entry.888888888",   # Witnessed a crime before (Yes/No)
}

# =================================================================
# 2. REALISTIC VALUE POOLS  --  must match your Google Form options
# =================================================================
ROLES        = ["Student / Villa mate", "University staff", "Landlord"]
CRIME_TYPES  = ["Theft / Stealing", "Assault", "Stabbing",
                "Rape / Sexual assault", "Robbery", "Harassment / Threat"]
LOCATIONS    = ["Main Gate", "Ijaw Villa", "Housing Estate", "Ibaka",
                "Science Complex", "Female Hostel Road"]
TIMES_OF_DAY = ["Morning", "Afternoon", "Evening", "Late night"]
LIKERT       = ["1", "2", "3", "4", "5"]      # 1 = strongly disagree ... 5 = strongly agree
YES_NO       = ["Yes", "No"]

# Weights make the mock dataset realistic instead of uniform noise:
# most reports are theft, most people feel less safe at night, etc.
CRIME_WEIGHTS = [40, 18, 8, 10, 14, 10]       # aligns with CRIME_TYPES
TIME_WEIGHTS  = [10, 15, 30, 45]              # aligns with TIMES_OF_DAY


def build_payload():
    """Return one randomized, realistic form payload keyed by entry token."""
    crime = random.choices(CRIME_TYPES, weights=CRIME_WEIGHTS, k=1)[0]
    tod   = random.choices(TIMES_OF_DAY, weights=TIME_WEIGHTS, k=1)[0]

    # People generally feel LESS safe (lower score) and report LESS for
    # sensitive crimes -- bias the random draws so the data tells a story.
    safety = random.choices(LIKERT, weights=[25, 30, 25, 15, 5], k=1)[0]
    report = random.choices(LIKERT, weights=[20, 25, 25, 20, 10], k=1)[0]

    return {
        FIELDS["role"]:         random.choice(ROLES),
        FIELDS["crime_type"]:   crime,
        FIELDS["location"]:     random.choice(LOCATIONS),
        FIELDS["time_of_day"]:  tod,
        FIELDS["safety_level"]: safety,
        FIELDS["would_report"]: report,
        FIELDS["anonymous"]:    random.choices(YES_NO, weights=[70, 30], k=1)[0],
        FIELDS["witnessed"]:    random.choices(YES_NO, weights=[55, 45], k=1)[0],
    }


def submit(payload):
    """POST one response. Returns True on HTTP 200."""
    headers = {"User-Agent": "Mozilla/5.0 (SIM-elicitation-seed)"}
    resp = requests.post(POST_URL, data=payload, headers=headers, timeout=10)
    return resp.status_code == 200


def main(n=100):
    if "REPLACE" in FORM_ID:
        print("[!] Edit FORM_ID and the entry.* tokens before running.")
        return

    ok = 0
    for i in range(1, n + 1):
        payload = build_payload()
        try:
            if submit(payload):
                ok += 1
                print(f"[{i:>3}/{n}] OK   {payload[FIELDS['crime_type']]}")
            else:
                print(f"[{i:>3}/{n}] FAIL non-200 response")
        except requests.RequestException as e:
            print(f"[{i:>3}/{n}] ERROR {e}")

        # Be gentle: small randomized delay avoids hammering the endpoint.
        time.sleep(random.uniform(0.4, 1.1))

    print(f"\nDone. {ok}/{n} mock responses accepted.")


if __name__ == "__main__":
    main(100)
