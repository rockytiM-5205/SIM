# SIM — Security Incident Mapping System

A web-based platform that allows students, staff, and landlords around **Adekunle Ajasin University, Akungba-Akoko (AAUA)** to quickly report campus and community security incidents — such as stabbing, rape, stealing, and murder — and allows an administrator to monitor and manage those reports.

Built as coursework for **SEN202 — Weekend Dev 1**, under **Dr. O. O. Ajayi**.

---

## 📌 Problem

Insecurity is a major challenge facing Nigeria today, and campus communities are not exempt from it. Students, staff, and landlords around campus often have no fast, reliable, or centralized way to report security incidents as they happen. SIM was built to close that gap with a simple, accessible web-based reporting tool.

A full root-cause breakdown of this problem is documented in [`docs/Ishikawa_Diagram.png`](docs/Ishikawa_Diagram.png).

---

## ✨ Features

- 📝 **Submit Incident Report** — structured form capturing incident type, location, description, and time
- 🆔 **Tracking ID** — every report gets a unique reference ID for follow-up
- 🔍 **Track Report Status** — reporters can check on a report using their tracking ID
- 🔐 **Admin Login** — authenticated access to the management dashboard
- 📊 **Admin Dashboard** — radar / map-grid themed view of all reports, with filter and status-update controls
- 💾 **Client-side persistence** — runs fully in the browser using `localStorage`, no backend required

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage` (Web Storage API)

No frameworks, no backend, no external dependencies — kept intentionally lightweight for the scope of this submission.

---

## 📂 Project Structure

```
SIM/
├── index.html              # Landing page
├── report.html              # Incident report submission form
├── track.html                # Report status tracking page
├── admin-login.html      # Admin authentication page
├── admin-dashboard.html  # Admin dashboard (view/filter/manage reports)
├── css/
│   └── style.css
├── js/
│   ├── report.js
│   ├── track.js
│   ├── admin.js
│   └── storage.js        # localStorage helper functions
├── docs/
│   ├── SIM_SRS.docx           # Software Requirements Specification
│   ├── UseCase_Diagram.png    # Use-case diagram
│   └── Ishikawa_Diagram.png   # Fishbone / root-cause analysis diagram
└── README.md
```

> Adjust file/folder names above to match your actual repo before pushing.

---

## 🚀 Getting Started

No installation or build step required.

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/SIM.git
   cd SIM
   ```
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. That's it — the app runs entirely client-side

---

## 👤 User Roles

| Role | Capabilities |
|------|-------------|
| **Reporter** (Student / Staff / Landlord) | Submit an incident report, track report status |
| **Administrator** | Log in, view all reports, filter/search, update report status, view dashboard |

---

## 📄 Documentation

This repository includes the full set of deliverables required for SEN202 Weekend Dev 1:

- [x] Software Requirements Specification (SRS) — `docs/SIM_SRS.docx`
- [x] Use-Case Diagram — `docs/UseCase_Diagram.png`
- [x] Ishikawa (Fishbone) Diagram — `docs/Ishikawa_Diagram.png`
- [x] Community questionnaire (Google Form) results — `docs/Survey_Summary.pdf`

---

## 🎓 Author

**Agbaje Peter Oluwatimilehin**
200-Level Computer Science, Adekunle Ajasin University, Akungba-Akoko (AAUA)
Course: SEN202 | Facilitator: Dr. O. O. Ajayi

---

## 📜 License

Built for academic purposes as part of SEN202 coursework.
