## QA Portfolio – запуск тестов Playwright (TypeScript)

Требования:
- Установлен и запущен Docker Desktop

### 1) Запуск через общий Dockerfile (рекомендуется)

Из корня репозитория (`qa-portfolio`):

```powershell
docker build -t qa-portfolio .
docker run --rm --shm-size=1g qa-portfolio
```

Что происходит:
- Собирается образ на базе `mcr.microsoft.com/playwright:v1.48.2-jammy`
- В образ копируется проект `playwright_ts`, устанавливаются зависимости
- По умолчанию запускается `npx playwright test` внутри `playwright_ts`

### 2) Альтернатива: запуск только папки `playwright_ts` без сборки образа

Из папки `playwright_ts`:

```powershell
npm run test:docker
```

Скрипт использует официальный образ Playwright, монтирует текущую директорию и запускает `playwright test` внутри контейнера (Node/npm на хосте не требуются).

### Полезные команды

Открыть интерактивную оболочку в контейнере в контексте `playwright_ts`:

```powershell
npm run "run docker"
```

Запустить headed/UI режимы (из контейнера):

```sh
npx playwright test --headed
npx playwright test --ui
```

### Структура
- `playwright_ts/` – тесты Playwright TypeScript
  - `tests/` – файлы тестов (`*.ts`)
  - `package.json` – скрипты и dev-зависимости тестового проекта
  - `tsconfig.json` – конфиг TypeScript


