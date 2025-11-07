# # Official Playwright image (Node, Playwright, browsers preinstalled)
# FROM mcr.microsoft.com/playwright:v1.56.1-jammy
# WORKDIR /work

# # Install only Playwright TS project dependencies first (better cache)
# COPY playwright_ts/package*.json ./playwright_ts/
# COPY playwright_ts/package-lock.json ./playwright_ts/
# WORKDIR /work/playwright_ts
# RUN npm install

# # Copy tests and configs
# WORKDIR /work
# COPY playwright_ts ./playwright_ts
# COPY .env ./playwright_ts/.env   

# # Default command: run Playwright tests from playwright_ts
# WORKDIR /work/playwright_ts
# CMD ["npx", "playwright", "test"]
# Official Playwright image (Node, Playwright, browsers preinstalled)
FROM mcr.microsoft.com/playwright:v1.56.1-jammy
WORKDIR /work/playwright_ts

# Копируем только package.json и package-lock.json для кэширования зависимостей
COPY playwright_ts/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY playwright_ts ./
COPY .env ./.env

# Default command: запуск тестов
CMD ["npx", "playwright", "test"]
