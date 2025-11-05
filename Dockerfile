# Base Node.js image (for Playwright TS and Cypress TS)
FROM node:24-alpine

# Install dependencies for Playwright, Cypress, and Python
RUN apk add --no-cache \
    bash \
    git \
    libc6-compat \
    wget \
    curl \
    nss \
    chromium \
    chromium-chromedriver \
    python3 \
    py3-pip \
    py3-dev \
    build-base \
    libffi-dev \
    openssl-dev \
    libx11 \
    libxcomposite \
    libxdamage \
    libxrandr \
    mesa-gl \
    mesa-dri-gallium \
    ttf-freefont \
    udev \
    xvfb

# Set working directory
WORKDIR /app

# Copy package.json files for TS projects only
COPY playwright-ts/package*.json ./playwright-ts/
COPY cypress-js/package*.json ./cypress-js/

# Install TypeScript dependencies for Playwright
WORKDIR /app/playwright-ts
RUN npm install

# Install TypeScript dependencies for Cypress
WORKDIR /app/cypress-js
RUN npm install

# Install Playwright browsers for TS project
WORKDIR /app/playwright-ts
RUN npx playwright install --with-deps

# Pre-install Cypress browsers (Chrome, Electron)
WORKDIR /app/cypress-js
RUN npx cypress install

# Install Python dependencies for Playwright Python
WORKDIR /app/playwright-python
COPY playwright-python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir playwright
RUN python -m playwright install

# Copy entire project into the container
WORKDIR /app
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Default command to run Playwright TS tests (can be overridden at runtime)
CMD ["npx", "playwright", "test", "playwright-ts/tests"]
