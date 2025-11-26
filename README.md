# QA Portfolio – Automated Testing Platform 🚀

### 🛠️ Tech Stack & Status

[![Playwright](https://img.shields.io/badge/Playwright-42CC96?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Star on GitHub](https://img.shields.io/github/stars/mybono/qa-portfolio?style=for-the-badge)](https://github.com/mybono/qa-portfolio/stargazers)

[![CI Status](https://github.com/Mybono/qa-portfolio/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/Mybono/qa-portfolio/actions/workflows/pr-checks.yml)

This repository presents a unified automated testing platform. We use **Docker Compose** to fully isolate the testing environments, ensuring stable and reproducible test runs for various components (E2E, API, and Integration).

> 💫 If you like this project, please consider giving it a star!  
> It helps others find it and keeps me motivated

## Requirements

- **[Docker Desktop](https://docs.docker.com/desktop/)** installed and running.
- The **`docker compose`** command is available (standard in modern Docker Desktop installations).

---

## 🚀 Quick Start: Run All Tests (Recommended)

The most efficient way to run the End-to-End tests and automatically generate the HTML report is via a single command. This command handles the container build, dependency installation, test execution, and report opening.

**Prerequisite:** Ensure Docker Desktop is running.

```powershell
docker compose up --build -d; docker compose exec -w /work/playwright_ts playwright_ts sh -c "npm install && npx playwright test --reporter=html"
```

💡 Tip: To open the HTML report after tests, you can run:

```powershell
# macOS
open ./playwright_ts/playwright-report/index.html
```

```powershell
# Windows
start ./playwright_ts/playwright-report/index.html
```

## 🐳 Run from Docker Hub

You can run the **full Playwright + Docker + Allure CI/CD pipeline** directly from Docker Hub —  
no cloning, no setup, just one command 🚀

```bash
docker run --rm -it mybono/qa-portfolio:latest
```

## 🧹 Cleaning Up Resources

To stop and remove all containers, networks, and volumes created by `docker compose` after the tests are complete and free up system resources:

```bash
docker compose down
```

## 🏗️ Core Architecture (Docker Compose)

The project uses `docker compose` to orchestrate several key services:

| Service Name                                                             | Technology                  | Role                                                               |
| :----------------------------------------------------------------------- | :-------------------------- | :----------------------------------------------------------------- |
| **[SDK](https://www.npmjs.com/package/sdk_automation?activeTab=readme)** | **TypeScript**              | Shared library for Playwright TypeScript projects (playwright_ts). |
| **`playwright_ts`**                                                      | Playwright / **TypeScript** | Environment for running **End-to-End tests** using Node.js.        |

---

## 🔁 CI/CD Workflow Overview

Our repository uses **GitHub Actions** to enforce quality and safety checks on all pull requests.


### 🔍 Pull Request Workflow
- **Trigger:** Runs on `pull_request` events targeting the `main` branch (`opened`, `synchronize`, `reopened`).  
- **Purpose:** Executes a full CI workflow for every PR before merge.  

#### Jobs:

- 🚀 [pr-checkmate](https://dev.to/deftoexplore/pr-checkmate-stop-debating-style-and-start-coding-ij) 
**A set of automated checks for Pull Requests**
  - ESLint checks  
  - Dependency change detection  
  - Prettier auto-formatting  
  - Spellcheck (`cspell`)
  - NPM audit
  - Scans for secrets using

- ✅ pr-validation
  - Checks PR size (number of files and lines changed)  
  - Generates PR metrics summary for quick review  

- 📝 update-changelog
  - Automatically updates `CHANGELOG.md` based on conventional commits  
  - Determines semantic version bump (patch/minor/major) according to commit types  

- 🤖 auto-merge
  - Automatically merges the PR once all checks pass and changelog is updated

---

![Workflow Example](./assets/pr_pipeline.png)
