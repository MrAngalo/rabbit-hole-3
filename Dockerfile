FROM python:3.10-alpine3.19

ENV PYTHONUNBUFFERED=1

COPY . .

WORKDIR /api

RUN pip install -r requirements.txt

EXPOSE 8000

CMD "sh" "-c" \
    "python3 manage.py makemigrations && \
     python3 manage.py migrate --run-syncdb && \
     python3 manage.py runserver 0.0.0.0:8000"