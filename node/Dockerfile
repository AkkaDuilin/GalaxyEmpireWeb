FROM python:3.10-alpine

COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY . /app

WORKDIR /app

CMD ["python3", "main.py"]
