# D-D-Exercise
A mobile app developed in React Native for gamification of exercising. It is fo university degree

# Environment variables
It uses 2 *.env* files.

##  compose .env

A file in the root directory for *docker compose*
```
BACKEND_PORT=8000
FRONTEND_PORT=8081
POSTGRES_DB=db_name
POSTGRES_USER=username
POSTGRES_PASSWORD=Password
POSTGRES_PORT=5432
```

## backend .env

A file in /backend/ for backend

```
DATABASE_URL=postgresql://username:password@db:5432/dbname
SECRET_KEY=supersecret123456
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MIN=10080 # a week in minutes
GEMINI_API_KEY=API_KEY
ADMIN_API_KEY=supersecret
```

# Starting it

```bash
git clone https://gunicsroland/d-d-exercise

#start frontend
cd frontend
npx expo start

#start backend
source backend/.venv/bin/activate
uvicorn backend.main:app --reload --port 8000
```

# Using with docker

```bash
docker compose up
```

go to `localhost:8081`

