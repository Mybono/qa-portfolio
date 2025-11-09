# QA Portfolio – Automated Testing Platform 🚀

This repository presents a unified automated testing platform. We use **Docker Compose** to fully isolate the testing environments, ensuring stable and reproducible test runs for various components (E2E, API, and Integration).

## Requirements

* **[Docker Desktop](https://docs.docker.com/desktop/)** installed and running.
* The **`docker compose`** command is available (standard in modern Docker Desktop installations).

---

## 🏗️ Core Architecture (Docker Compose)

The project uses `docker compose` to orchestrate several key services:


| Service Name | Technology | Role |
| :--- | :--- | :--- |
| **`mongo`** | MongoDB | Isolated database for storing and managing test data. |
| **`playwright_ts`** | Playwright / **TypeScript** | Environment for running **End-to-End tests** using Node.js. |
| **`playwright_py`** | Playwright / **Python** | Environment for running **End-to-End tests** using Pytest. |

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
 
To run tests with Playwright on TypeScript
```powershell
docker compose exec -w /work/playwright_ts playwright_ts npx playwright test
docker compose exec -w /work/playwright_ts playwright_ts npm run allure:generate
```

docker compose exec playwright_ts sh
npx prettier --write "playwright_ts/**/*.ts"
npm install
