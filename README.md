# QA Portfolio – Automated Testing Platform 🚀

This repository presents a unified automated testing platform. We use **Docker Compose** to fully isolate the testing environments, ensuring stable and reproducible test runs for various components (E2E, API, and Integration).

## Requirements

- **[Docker Desktop](https://docs.docker.com/desktop/)** installed and running.
- The **`docker compose`** command is available (standard in modern Docker Desktop installations).

---

## 🏗️ Core Architecture (Docker Compose)

The project uses `docker compose` to orchestrate several key services:

| Service Name                                                             | Technology                  | Role                                                               |
| :----------------------------------------------------------------------- | :-------------------------- | :----------------------------------------------------------------- |
| **[SDK](https://www.npmjs.com/package/sdk_automation?activeTab=readme)** | **TypeScript**              | Shared library for Playwright TypeScript projects (playwright_ts). |
| **`playwright_ts`**                                                      | Playwright / **TypeScript** | Environment for running **End-to-End tests** using Node.js.        |

---

## 🏃 Running the Tests

The recommended method is using **Docker Compose**, which handles the build process, networking, and execution of all test suites.

### 1. Setup and Initialization (Build and Run)

Build all project images (TypeScript and Python) and run the necessary services (Mongo, Test Runners) in detached mode (`-d`). This command also handles the MongoDB initialization.

From the root of the repository (`qa-portfolio`):

### Starting the Project

☕ **Grab a coffee!** Building and setting up the containers might take a few minutes.

```powershell
docker compose up --build -d
```

Run Playwright Tests (TypeScript)

1. Start an interactive shell in the container:

```powershell
docker compose exec playwright_ts sh
```

2. Install dependencies (if not already installed):

```powershell
npm install
```

3. Run all tests:

```powershell
docker compose exec -w /work/playwright_ts playwright_ts npx playwright test
```

💡 Tip: To open the HTML report after tests, you can run:

```powershell
# macOS
open ./playwright_ts/playwright-report/index.html
# Windows
start ./playwright_ts/playwright-report/index.html
```

```powershell
docker compose exec playwright_ts sh
```


## CI/CD Workflow Overview
Our repository uses **GitHub Actions** to enforce quality and safety checks on all pull requests.

### 🔍 PR Quality Checks
For every PR (`opened`, `synchronize`, `reopened`):

#### 1. PR Validation
- Checks PR size (files/lines changed)  
- Validates PR title against **conventional commits**  
- Ensures PR description is adequate  

#### 2. Automated Code Review
- Runs code quality checks: **linting (ESLint, Prettier)**  

#### 3. Dependency Check
- Detects changes to `package.json`  
- Ensures:
  - Security audit has been run
  - License compatibility is verified
  - Bundle size impact is acceptable  
