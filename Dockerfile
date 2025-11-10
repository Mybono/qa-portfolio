FROM mcr.microsoft.com/playwright:v1.56.1-jammy
WORKDIR /work

# === Install and Build SDK Project ===
WORKDIR /work/sdk
COPY sdk/package.json ./
RUN npm install
RUN npm install @types/mongodb typescript --save-dev
COPY sdk/ .
RUN npm run build

# === Install Playwright (TypeScript) Dependencies ===
WORKDIR /work/playwright_ts
COPY playwright_ts/package*.json ./
RUN npm install
RUN npx playwright install
COPY playwright_ts/ .
COPY .env ./.env

# Default command: run tests
CMD ["npx", "playwright", "test", "--reporter=allure-playwright"]
