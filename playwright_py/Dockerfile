FROM python:3.11-slim-bookworm

RUN apt-get update && apt-get install -y \
    python3-venv \
    libnss3 libfontconfig \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /work/playwright_py
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && playwright install --with-deps

COPY . .
CMD ["pytest", "."]
