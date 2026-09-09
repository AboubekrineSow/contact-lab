# Contributing — and practising pull requests

This repo exists to make you comfortable with the **GitHub pull-request (PR) loop**.
Every change, however small, goes through a branch and a PR. Follow the steps below
literally the first few times; they become muscle memory fast.

- [1. One-time setup](#1-one-time-setup)
- [2. The pull-request loop](#2-the-pull-request-loop)
- [3. Branch names & commit messages](#3-branch-names--commit-messages)
- [4. Keeping your branch up to date](#4-keeping-your-branch-up-to-date)
- [5. Review & merge (yes, your own)](#5-review--merge-yes-your-own)
- [6. Make it real: branch protection](#6-make-it-real-branch-protection)
- [7. Working on someone else's repo (fork flow)](#7-working-on-someone-elses-repo-fork-flow)
- [8. Practice tasks](#8-practice-tasks)
- [9. When CI is red](#9-when-ci-is-red)

---

## 1. One-time setup

- **Git**, a **JDK 17+**, **Node 20+**.
- Optional but recommended: the **GitHub CLI** (`gh`). Run `gh auth login` once.
- Create the repo on GitHub and push this folder to it:

```bash
cd contacts-lab
git init
git add .
git commit -m "chore: initial project"
git branch -M main

# with gh:
gh repo create contacts-lab --private --source=. --push
# or manually: create an empty repo on github.com, then
#   git remote add origin git@github.com:<you>/contacts-lab.git
#   git push -u origin main
```

Check that the **CI** tab shows a green run for `main`.

---

## 2. The pull-request loop

You never commit straight to `main`. The loop is always the same:

```bash
# 1. start from an up-to-date main
git switch main
git pull

# 2. create a branch for ONE change
git switch -c feat/add-city-field

# 3. ... make the change, then verify locally ...
cd backend  && ./gradlew build            # if you touched the backend
cd ../frontend && npm run format:check && npm run build && npm test   # if you touched the frontend

# 4. stage and commit (small, focused commits)
git add -A
git commit -m "feat: add a city field to contacts"

# 5. push the branch and set its upstream
git push -u origin feat/add-city-field
```

**6. Open the PR.**

```bash
gh pr create --fill --base main         # uses your commit message + the PR template
# or open the URL that `git push` printed, or click "Compare & pull request" on GitHub
```

Fill in the template (What / Why / How to test). If it closes an issue, write
`Closes #3` in the description.

**7. Watch CI on the PR.** The `backend` and `frontend` checks run automatically.
Red? See [section 9](#9-when-ci-is-red). Push more commits to the same branch — the PR
updates itself:

```bash
git add -A && git commit -m "fix: handle null city" && git push
```

**8. Review it** (section 5), **merge it** (squash), **delete the branch**, and go back to step 1.

---

## 3. Branch names & commit messages

**Branches:** `type/short-kebab-summary` — e.g. `feat/quick-filter`, `fix/email-validation`,
`docs/readme-typo`, `chore/bump-angular`, `ci/cache-npm`.

**Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — a `type:` prefix
and an imperative summary under ~72 chars.

| Prefix | For |
|---|---|
| `feat:` | a user-visible feature |
| `fix:` | a bug fix |
| `refactor:` | code change with no behaviour change |
| `test:` | adding or fixing tests |
| `docs:` | documentation only |
| `chore:` / `ci:` / `build:` | tooling, deps, pipeline |

Good: `feat: add city column to the contacts grid`
Bad: `updates`, `wip`, `fix stuff`

---

## 4. Keeping your branch up to date

If `main` moved while your PR was open, sync before merging. Two options:

```bash
git switch feat/my-branch
git fetch origin

# option A — merge (simple, keeps a merge commit)
git merge origin/main

# option B — rebase (linear history; rewrites your commits)
git rebase origin/main
# resolve conflicts, then: git add <files> && git rebase --continue
git push --force-with-lease        # only needed after a rebase
```

Use **merge** while you're learning. Use **rebase** once conflicts don't scare you.

---

## 5. Review & merge (yes, your own)

Practising the review side matters as much as writing code.

1. On the PR, open the **Files changed** tab. Read every line as if someone else wrote it.
2. Leave at least one **comment** (start a review, add a comment on a line, submit).
   Even "nit: rename `x` to `city`" counts — the point is the mechanics.
3. Resolve it: either push a fix commit, or reply and mark the thread resolved.
4. When CI is green and you're happy, **Squash and merge**. Edit the squash commit
   message to a clean Conventional Commit.
5. Click **Delete branch**. Locally:

```bash
git switch main
git pull
git branch -d feat/my-branch                 # local
git push origin --delete feat/my-branch      # remote (or rely on the GitHub button)
```

---

## 6. Make it real: branch protection

This is what turns "I could push to main" into "I must open a PR". On GitHub:

**Settings → Branches → Add branch ruleset** (or *Add rule*) for `main`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass — select **`Backend (Spring Boot)`** and **`Frontend (Angular)`**
- ✅ Require branches to be up to date before merging
- (optional) ✅ Require conversation resolution before merging

Now try to `git push` to `main` directly — it's rejected. That's the whole exercise.

---

## 7. Working on someone else's repo (fork flow)

You can't push branches to a repo you don't own, so you **fork** it:

```bash
gh repo fork <owner>/<repo> --clone
cd <repo>
git remote -v                 # origin = your fork, upstream = the original
git switch -c fix/typo
# ... change, commit ...
git push -u origin fix/typo
gh pr create --repo <owner>/<repo> --fill
```

Keep your fork current with `git fetch upstream && git merge upstream/main`.

---

## 8. Practice tasks

Open an issue for each (use the templates), then do it as a PR. Roughly easy → harder.

1. **`docs:`** fix or improve a sentence in this file or the README.
2. **`feat:`** add a **"City"** field. Backend: a field on `Contact.java` **and a new
   Liquibase changeset** under `backend/src/main/resources/db/changelog/changes/`
   (`addColumn` on `contact`) referenced from `db.changelog-master.yaml` — never edit an
   applied changeset, always add a new one. Frontend: one entry in
   `frontend/src/app/contacts/contact-form.fields.ts`, a column in
   `contacts.component.ts`, and the type in `contact.model.ts`.
3. **`feat:`** add a **"Favorites only"** toggle above the grid that filters the rows.
4. **`fix:`** the phone field accepts anything — tighten the `@Pattern` on `Contact.java`
   and add a `pattern` prop to the Formly field, plus a validation message.
5. **`test:`** add a backend test that `PUT /api/contacts/{unknown-id}` returns `404`.
6. **`ci:`** make each CI job run **only** when its folder changed (add `paths` filters),
   and note in this file why that needs a small tweak to the branch-protection settings.

---

## 9. When CI is red

Open the failed run from the **Checks** section of the PR and read the failing step.

| Step failed | Fix locally, then push |
|---|---|
| `./gradlew build` | `cd backend && ./gradlew build` — read the test report it prints |
| `npm run format:check` | `cd frontend && npm run format` then commit the reformat |
| `npm run build` | `cd frontend && npm run build` — usually a TypeScript or template error |
| `npm run test:ci` | `cd frontend && npm test` — fix the failing spec |

Every push to the branch re-runs CI and updates the PR. Don't merge until it's green.
