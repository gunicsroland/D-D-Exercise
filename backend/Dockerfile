FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .
EXPOSE 8000

CMD sh -c "gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:${BACKEND_PORT} --access-logfile - --error-logfile - src.main:app"