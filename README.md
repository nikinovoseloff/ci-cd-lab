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
| `compose.yaml` | стек `db + api + web` (появится на L3) |
| `.github/workflows/` | CI и CD (появятся на L5–L6) |

## Локальная проверка

Проверки выполняются на lab VM в контейнерах:

```bash
./scripts/lab-check.sh    # pytest + сборка frontend
./scripts/lab-build.sh    # образы api и web
```

## Статус

В разработке: этап L0–L1 (фундамент). Публичный адрес появится после L4.
