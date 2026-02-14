# Backend - Gestion de Acompanamientos Terapeuticos

Proyecto backend base con Node.js, Express, Prisma y PostgreSQL.
Sirve como template para que el equipo entienda como agregar nuevos modelos, controladores y rutas.

## Requisitos previos

- [Node.js](https://nodejs.org/) (version 18 o superior)
- [PostgreSQL](https://www.postgresql.org/) (version 14 o superior)

## Instalacion

1. Clonar el repositorio y entrar a la carpeta del backend:

```bash
cd backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear el archivo `.env` copiando el ejemplo:

```bash
cp .env.example .env
```

4. Editar el archivo `.env` con tus credenciales de PostgreSQL:

```
DATABASE_URL="postgresql://TU_USUARIO:TU_PASSWORD@localhost:5432/acompanantes_db?schema=public"
PORT=3000
```

> Asegurate de que la base de datos `acompanantes_db` exista en tu PostgreSQL.
> Podes crearla con: `CREATE DATABASE acompanantes_db;`

5. Correr las migraciones para crear las tablas en la base de datos:

```bash
npx prisma migrate dev --name init
```

6. Levantar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor va a estar disponible en `http://localhost:3000`.

## Endpoints disponibles

### Verificar que el servidor funciona

```
GET http://localhost:3000/
```

Respuesta:

```json
{
  "success": true,
  "data": null,
  "message": "servidor funcionando correctamente"
}
```

### Crear un producto

```
POST http://localhost:3000/api/productos
Content-Type: application/json

{
  "nombre": "Laptop",
  "descripcion": "Laptop gamer 16GB RAM",
  "precio": 999.99,
  "stock": 10
}
```

Respuesta (201):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Laptop",
    "descripcion": "Laptop gamer 16GB RAM",
    "precio": "999.99",
    "stock": 10,
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "producto creado exitosamente"
}
```

### Listar todos los productos

```
GET http://localhost:3000/api/productos
```

Respuesta (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Laptop",
      "descripcion": "Laptop gamer 16GB RAM",
      "precio": "999.99",
      "stock": 10,
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "message": "productos obtenidos exitosamente"
}
```

## Como agregar un nuevo modulo

Para agregar un nuevo recurso (por ejemplo: pacientes), segui estos pasos:

1. **Modelo**: agregar el modelo en `prisma/schema.prisma` y correr `npx prisma migrate dev --name agregar_paciente`
2. **Controller**: crear `src/controllers/paciente.controller.js` con las funciones necesarias
3. **Rutas**: crear `src/routes/paciente.routes.js` definiendo los endpoints
4. **Registrar rutas**: en `src/routes/index.js` importar y montar las nuevas rutas

## Estructura del proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          -> conexion a la base de datos (prisma client)
│   ├── controllers/
│   │   └── producto.controller.js -> logica de negocio de productos
│   ├── routes/
│   │   ├── index.js             -> archivo central de rutas
│   │   └── producto.routes.js   -> endpoints de productos
│   ├── middlewares/
│   │   └── errorHandler.js      -> manejo centralizado de errores
│   └── server.js                -> archivo principal del servidor
├── prisma/
│   └── schema.prisma            -> definicion de modelos de la base de datos
├── .env.example                 -> ejemplo de variables de entorno
├── .gitignore
├── package.json
└── README.md
```
