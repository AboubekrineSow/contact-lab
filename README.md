# contacts-lab

A tiny full-stack playground to **practise the GitHub pull-request workflow** and CI.

- **Backend** — Spring Boot 3 (Java 17), a REST API for contacts. **H2** database, schema
  and seed data managed by **Liquibase** migrations, Spring Data JPA on top.
- **Frontend** — Angular 18 (standalone). The list is **ag-Grid**, the add/edit form is
  **ngx-formly** (form described as data).
- **CI** — GitHub Actions builds and tests both sides on every push and pull request.

> New to pull requests? Read [`CONTRIBUTING.md`](CONTRIBUTING.md) — it walks the whole
> loop (branch → commit → push → PR → review → merge) with the exact commands, and lists
> small tasks to practise on.

---

## Run it locally

Two terminals.

**Backend** — needs a JDK (17+):

```bash
cd backend
./gradlew bootRun            # http://localhost:8080/api/contacts
```

On startup, Liquibase creates the `contact` table and inserts three sample rows into an
H2 file database at `backend/data/` (git-ignored). Browse it at
http://localhost:8080/h2-console (JDBC URL `jdbc:h2:file:./data/contacts`, user `sa`).

**Frontend** — needs Node 20+:

```bash
cd frontend
npm install
npm start                    # http://localhost:4200  (proxies /api to :8080)
```

Open http://localhost:4200 — you get a grid of three seeded contacts, and **New / Edit /
Delete** buttons that drive a Formly form.

## Test & check (same as CI)

```bash
cd backend  && ./gradlew build
cd frontend && npm run format:check && npm run build && npm test
```

## Layout

```
contacts-lab/
├─ backend/                     Spring Boot (Gradle)
│  └─ src/main/
│     ├─ java/com/example/contacts/
│     │  ├─ ContactsApplication.java
│     │  └─ contact/            Contact (@Entity), ContactRepository (JPA), ContactController, ...
│     └─ resources/db/changelog/   Liquibase: db.changelog-master.yaml + changes/*.yaml
├─ frontend/                    Angular
│  └─ src/app/
│     ├─ app.component.ts       shell
│     └─ contacts/              ContactsComponent (ag-Grid) + contact-form.fields.ts (Formly)
├─ .github/
│  ├─ workflows/ci.yml          the CI
│  ├─ pull_request_template.md
│  └─ ISSUE_TEMPLATE/
├─ CONTRIBUTING.md              ← the pull-request guide
└─ LICENSE                      MIT
```

## API

| Method | Path | Body | Result |
|---|---|---|---|
| GET | `/api/contacts` | — | list (sorted by last name) |
| GET | `/api/contacts/{id}` | — | one, or `404` |
| POST | `/api/contacts` | contact (no id) | `201` + `Location` |
| PUT | `/api/contacts/{id}` | contact | updated, or `404` |
| DELETE | `/api/contacts/{id}` | — | `204`, or `404` |

Validation errors return `400` with `{ "errors": { "field": "message" } }`.
