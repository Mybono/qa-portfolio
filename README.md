## QA Portfolio – Running Playwright (TypeScript) Tests

**Requirements:**
- Docker Desktop installed and running

### 1) Recommended: Run via the main Dockerfile

From the root of the repository (`qa-portfolio`):

```powershell
docker build -t qa-portfolio .
docker run --rm --shm-size=1g --env-file .env qa-portfolio
```

What happens:
- A Docker image is built based on `mcr.microsoft.com/playwright:v1.48.2-jammy`
- The `playwright_ts` project is copied into the image and dependencies are installed
- By default, `npx playwright test` runs inside playwright_ts

### Project Structure
- `playwright_ts/` – тесты Playwright TypeScript
  - `tests/` – файлы тестов (`*.ts`)
  - `package.json` – скрипты и dev-зависимости тестового проекта
  - `tsconfig.json` – конфиг TypeScript
  