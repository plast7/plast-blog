# 베이스 이미지 선택
FROM python:3.11-slim

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y build-essential

# 작업 디렉토리 설정
WORKDIR /app

# Poetry 설치
ENV POETRY_VERSION=1.4.0
RUN pip install "poetry==$POETRY_VERSION"

# Poetry 설정
ENV POETRY_NO_INTERACTION=1
ENV POETRY_VIRTUALENVS_CREATE=false

# 종속성 파일 복사 및 설치
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-dev --no-interaction --no-ansi

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 8080

# 환경 변수 설정
ENV PORT=8080

# 정적 파일 수집
# RUN python manage.py collectstatic --noinput

# 애플리케이션 실행
CMD gunicorn config.wsgi:application --bind 0.0.0.0:${PORT}
