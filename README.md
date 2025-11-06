## QA Portfolio – Running Playwright (TypeScript) Tests

**Requirements:**
- [Docker Desktop](https://docs.docker.com/desktop/) installed and running

### 1) Recommended: Run via the main Dockerfile

From the root of the repository (`qa-portfolio`):

```powershell
docker run --rm -v "${PWD}/playwright_ts:/app" mcr.microsoft.com/playwright:v1.56.1-jammy sh -c "cd /app && npm install"
docker build -t qa-portfolio .
docker run --rm --shm-size=1g --env-file .env qa-portfolio
```
docker compose up --build -d
docker compose up

What happens:
- A Docker image is built based on `mcr.microsoft.com/playwright:v1.56.1-jammy`
- The `playwright_ts` project is copied into the image and dependencies are installed
- By default, `npx playwright test` runs inside playwright_ts

### Project Structure
- `playwright_ts/` – Playwright TypeScript tests
  - `tests/`
  - `interfaces/`
  - `constants/`
