# Nocountry

¡Bienvenido al proyecto Nocountry!

[![Built with Cookiecutter Django](https://img.shields.io/badge/built%20with-Cookiecutter%20Django-ff69b4.svg?logo=cookiecutter)](https://github.com/cookiecutter/cookiecutter-django/)
[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)

Licencia: MIT

## Configuración

Más información en [settings](https://cookiecutter-django.readthedocs.io/en/latest/1-getting-started/settings.html).

## Comandos con Justfile

Este proyecto incluye un [justfile](https://github.com/casey/just) para ejecutar tareas comunes de desarrollo. Asegúrate de tener [just](https://github.com/casey/just) instalado.

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `just` | Lista todos los comandos disponibles |
| `just build [args]` | Construye la imagen de Python (ej: `just build --no-cache`) |
| `just up` | Inicia los contenedores en segundo plano |
| `just down` | Detiene los contenedores |
| `just prune [args]` | Detiene contenedores y elimina volúmenes |
| `just logs [args]` | Muestra los logs de los contenedores (ej: `just logs django`) |
| `just manage <comando>` | Ejecuta comandos de `manage.py` (ej: `just manage runserver`) |

### Ejemplos de uso

```bash
# Ver comandos disponibles
just

# Iniciar el entorno de desarrollo
just up

# Crear un superusuario
just manage createsuperuser

# Ejecutar migraciones
just manage migrate

# Ver logs del contenedor Django
just logs django

# Detener todo y limpiar volúmenes
just prune
```

## Guía para valientes que desprecian Docker

*¿Docker? ¿Qué es eso? ¿Un lugar donde guardan cosas?* Si prefieres instalar todo a mano como en los viejos tiempos (año 2015), aquí van los pasos. Spoiler: vas a necesitar PostgreSQL y Python 3.13. Sí, en tu máquina. Qué locura.

### Requisitos previos (sí, hay que instalarlos)

- **Python 3.13** — No, 3.11 no vale. No, 3.12 tampoco.
- **PostgreSQL** — Sí, la base de datos esa que Docker instala automáticamente.
- **[uv](https://github.com/astral-sh/uv)** — El gestor de paquetes que usa el proyecto. `curl -LsSf https://astral.sh/uv/install.sh | sh`

### Configuración

1. Crea una base de datos en PostgreSQL llamada `nocountry` (o el nombre que prefieras).

2. Crea un archivo `.env` en la raíz del proyecto con algo como:

   ```
   DJANGO_READ_DOT_ENV_FILE=True
   DATABASE_URL=postgres://usuario:contraseña@localhost:5432/nocountry
   DJANGO_EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
   ```

   *(Sin el backend de consola, Django intentará conectar con Mailpit en el puerto 1025 y te dará errores. Pero seguro que eso no te pasará.)*

3. Instala dependencias: `uv sync`

4. Migraciones: `uv run python manage.py migrate`

5. Servidor: `uv run uvicorn config.asgi:application --reload`

¡Listo! Ahora tu entorno es *exactamente igual* que el de Docker, excepto que tú lo configuraste todo. ¿No te sientes especial?

---

## Comandos básicos

### Configuración de usuarios

- Para crear una **cuenta de usuario normal**, ve a Registrarse y completa el formulario. Tras enviarlo, verás una página "Verifica tu correo electrónico". Revisa la consola para ver el mensaje de verificación simulado. Copia el enlace en tu navegador y el correo del usuario quedará verificado.

- Para crear una **cuenta de superusuario**, usa:

      uv run python manage.py createsuperuser

Para mayor comodidad, puedes mantener al usuario normal en Chrome y al superusuario en Firefox (o similar), y ver el comportamiento del sitio para ambos tipos de usuarios.

### Verificación de tipos

Ejecutar la verificación de tipos con mypy:

    uv run mypy nocountry

### Cobertura de tests

Para ejecutar los tests, ver la cobertura y generar un informe HTML:

    uv run coverage run -m pytest
    uv run coverage html
    uv run open htmlcov/index.html

#### Ejecutar tests con pytest

    uv run pytest

### Recarga en vivo y compilación de Sass CSS

Más información en [Live reloading and SASS compilation](https://cookiecutter-django.readthedocs.io/en/latest/2-local-development/developing-locally.html#using-webpack-or-gulp).

### Servidor de correo

En desarrollo suele ser útil ver los correos enviados por la aplicación. Para eso está disponible [Mailpit](https://github.com/axllent/mailpit), un servidor SMTP local con interfaz web como contenedor Docker.

El contenedor de Mailpit se iniciará automáticamente al ejecutar todos los contenedores Docker.
Consulta la [documentación Docker de cookiecutter-django](https://cookiecutter-django.readthedocs.io/en/latest/2-local-development/developing-locally-docker.html) para más detalles sobre cómo iniciar los contenedores.

Con Mailpit en ejecución, abre tu navegador en `http://127.0.0.1:8025` para ver los mensajes enviados por la aplicación.

## Despliegue

A continuación se describe cómo desplegar esta aplicación.

### Docker

Consulta la [documentación Docker de cookiecutter-django](https://cookiecutter-django.readthedocs.io/en/latest/3-deployment/deployment-with-docker.html).
