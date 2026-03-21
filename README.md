# D-D-Exercise
A mobile app developed in React Native for gamification of exercising. It is fo university degree

# Development

For development follow these steps:

## Environment variables
It uses 2 *.env* files.

###  compose .env

A file in the root directory for *docker compose*
```
BACKEND_PORT=8000
FRONTEND_PORT=8081
POSTGRES_DB=db_name
POSTGRES_USER=username
POSTGRES_PASSWORD=Password
POSTGRES_PORT=5432
```

### backend .env

A file in /backend/ for backend

```
DATABASE_URL=postgresql://dndne_admin:admin@db:5432/dndne
BACKEND_PORT=8000
SECRET_KEY=supersecret123456
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MIN=10080 # a week in minutes
GEMINI_API_KEY=API_KEY
ADMIN_API_KEY=supersecret
CORS_ORIGINS=http://localhost:8081,
MODEL_NAME=gemini-2.5-flash
```

### frontend .env

A file in /fronend/ fro the frontend

```
EXPI_PUBLIC_API_URL=http://localhost:8000
```

## Starting it

```bash
git clone https://gunicsroland/d-d-exercise

#start frontend
cd frontend
npm install
npx expo start

#start backend
cd ../backend
python -m venv .venv
source .venv/bin/activate
uvicorn src.main:app --reload --port 8000
```

## Using with docker

```bash
docker compose up
```

go to `localhost:FRONTEND_PORT` for frontend and `localhost:BACKEND_PORT/docs` for swagger documentation
