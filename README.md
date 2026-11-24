# ci-cd-lab

Учебный проект модуля 0.7: приложение-трекер задач и полный цикл доставки —
от ручных контейнеров до CI/CD на GitHub Actions.

## Стек

- **backend:** Python 3.12, FastAPI, SQLAlchemy 2, psycopg 3
- **database:** PostgreSQL 16
- **frontend:** React 18, Vite 5, nginx 1.27
- **инфраструктура:** Docker, Docker Compose, GitHub Actions, GHCR
- **TLS:** Let's Encrypt + nginx на VPS

## Структура

| Путь | Назначение |
|---|---|
| `backend/` | API, модели, тесты, Dockerfile |
| `frontend/` | SPA, nginx-конфиг, Dockerfile |
| `scripts/` | проверки и деплой |
| `compose.yaml` | стек `db + api + web` |
| `.github/workflows/` | CI и CD (появятся на L5–L6) |

## Запуск на VPS

```bash
cp .env.example .env       # заменить POSTGRES_PASSWORD и DATABASE_URL
docker compose up -d
docker compose ps
curl -fsS http://127.0.0.1:8080/api/health
```

`web` слушает только `127.0.0.1:8080`; наружу его отдаёт host-nginx с TLS.

## Локальная проверка

Проверки выполняются на lab VM в контейнерах:

```bash
./scripts/lab-check.sh    # pytest + сборка frontend
./scripts/lab-build.sh    # образы api и web
```

## Статус

В разработке: этапы L0–L3. Публичный HTTPS-адрес появится после L4.
