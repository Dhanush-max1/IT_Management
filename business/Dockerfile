FROM python:3.13-slim-bookworm
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --upgrade pip && \
pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/staticfiles /app/media

EXPOSE 8000

CMD ["gunicorn", "business.wsgi:application", "--bind", "0.0.0.0:8000"]