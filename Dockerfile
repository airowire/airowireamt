# syntax=docker/dockerfile:1

FROM python:3.9.16-slim-buster

# Set environment variables to avoid any issues
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libc-dev \
        libmariadb-dev-compat \
        pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy project
COPY . .

# Expose the port to listen on (set a default port)
EXPOSE 5000

# Run the application
CMD ["python", "./app.py"]