FROM mcr.microsoft.com/playwright:v1.56.1-jammy
WORKDIR /work

# === Install and Build SDK Project ===
WORKDIR /work/sdk
COPY sdk/package.json ./
RUN npm install
RUN npm install @types/mongodb typescript --save-dev
COPY sdk/ .
RUN npm run build

# === Install Java for Allure ===
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk wget unzip && \
    apt-get clean

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# === Install Allure CLI ===
RUN npm install -g allure-commandline --save-dev

# === Install Playwright (TypeScript) Dependencies ===
WORKDIR /work/playwright_ts
COPY playwright_ts/package*.json ./
RUN npm install
RUN npm install -D @playwright/test allure-commandline
RUN npx playwright install
COPY playwright_ts/ .
COPY .env ./.env

RUN mkdir -p /work/playwright_ts/allure-results /work/playwright_ts/allure-report

# Default command: run tests
CMD ["npx", "playwright", "test", "--reporter=allure-playwright"]
