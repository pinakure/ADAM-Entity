FROM python:3.12-slim

# Evita que Python escriba archivos .pyc y almacene en búfer de salida
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Crear el usuario y grupo 'melodify'
RUN groupadd -r adam && useradd -r -g adam adam

WORKDIR /src/adam

# Instalar dependencias como root
COPY requirements.txt /src/adam

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /src/adam/requirements.txt

# Crear estructura necesaria
RUN mkdir -p \
    /static/adam \
    /media/adam 

# Copiar proyecto directamente con ownership correcto
COPY --chown=adam:adam . /src/adam

# Cambiar a usuario no-root
#USER adam

# Ejecutar migraciones, recopilar estáticos y arrancar Gunicorn
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn adam.wsgi:application --bind 0.0.0.0:8000"]
