# === Base image with Node & Playwright ===
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Set working directory
WORKDIR /work/playwright_ts
COPY playwright_ts/package*.json ./
RUN echo "@mybono:registry=https://npm.pkg.github.com" > .npmrc

ARG GITHUB_TOKEN
ENV NODE_AUTH_TOKEN=$GITHUB_TOKEN
# Correct .npmrc for GitHub Packages
RUN echo "@mybono:registry=https://npm.pkg.github.com" > .npmrc \
    && echo "//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}" >> .npmrc

# Install dependencies including private SDK
RUN npm install

# Install Playwright browsers
RUN npx playwright install

# Copy project files
COPY playwright_ts/ .
COPY .env ./.env

# Default command: run tests
CMD ["npx", "playwright", "test", "--reporter=allure-playwright"]
