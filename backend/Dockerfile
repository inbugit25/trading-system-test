
FROM python:3.10
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn kiteconnect sqlalchemy psycopg2-binary supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord"]
