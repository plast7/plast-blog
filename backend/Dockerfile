# Choose base image
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential

# Set working directory
WORKDIR /app

# Install Poetry
ENV POETRY_VERSION=1.4.0
RUN pip install "poetry==$POETRY_VERSION"

# Configure Poetry
ENV POETRY_NO_INTERACTION=1
ENV POETRY_VIRTUALENVS_CREATE=false

# Copy dependency files and install
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-dev --no-interaction --no-ansi

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Set environment variable
ENV PORT=8080

# Collect static files
# RUN python manage.py collectstatic --noinput

# Run the application
CMD gunicorn config.wsgi:application --bind 0.0.0.0:${PORT}
