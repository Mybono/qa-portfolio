FROM mcr.microsoft.com/playwright:v1.48.2-jammy
WORKDIR /work

# === Install and Build SDK Project (where MongoDB types are needed) ===
WORKDIR /work/sdk
COPY sdk/package.json ./
RUN npm install
RUN npm install @types/mongodb typescript --save-dev
COPY sdk/ .
RUN npm run build

# === Install Playwright Dependencies ===
WORKDIR /work/playwright_ts
COPY playwright_ts/package*.json ./
RUN npm install
COPY playwright_ts/ .
COPY .env ./.env

# Default command: run tests
CMD ["npx", "playwright", "test"]
