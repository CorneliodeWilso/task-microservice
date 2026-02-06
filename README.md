# tTask-microservice

Backend REST API para la gestión de tareas  y autenticación de usuarios, desarrollado con Node.js, Express y Firebase (Firestore + Auth), siguiendo principios de arquitectura limpia / hexagonal para la separacion de responsabilidades y tener un codigo escalable y legible.


Tecnologías utilizadas

Node.js
Express
Firebase Admin SDK
Firestore
Authentication
JWT
TypeScript
Arquitectura limpia / Hexagonal
REST API


Arquitectura del proyecto

El proyecto está organizado siguiendo separación de responsabilidades, facilitando mantenibilidad y escalabilidad.

src
├── domain
│   ├── constants       #constantes 
│   ├── entities        #contratos
│   ├── models          #modelos de respuesta
│   ├── repositories    #repositorio 
│   └── usecases        #casos de uso del servicio 
│
├── infrastructure
│   ├── firebase        #comunicacion y persistencia de datos en firebase
│   └── http
│       ├── controllers #Controladores http
│       ├── middlewares #Middleware Auth, validaciones
│       └── routes.ts   #Aqui se definen todas los endpoints del servicio
│
├── app.ts
├── index.ts

Endpoints principales
- Autenticacion
    Método	Endpoint	    Descripción
    POST	/auth/register	Registro de usuario
    POST	/auth/login	    Login de usuario

- Tareas
    Método	Endpoint	Descripción
    GET	    /tasks	    Obtener todas las tareas
    GET	    /tasks/:id	Obtener tarea por ID
    POST	/tasks	    Crear tarea
    PUT	    /tasks/:id	Actualizar tarea
    DELETE	/tasks/:id	Eliminar tarea


Repositorio: 
https://github.com/CorneliodeWilso/task-microservice.git


Instalacion de dependencias
- Las dependencias del proyecto se instalan mediante el comando "npm install"

Build de produccion
- El comando para realizar el build es el siguiente "npm run build"

Despliegue (CI/CD)

El proyecto cuenta con despliegue automático a Firebase Functions mediante GitHub Actions.

Flujo de despliegue
1. git push
   
2. GitHub Actions
   
3. Build Typescript
   
4. Deploy a Firebase Functions

Requisitos de despliegue a firebase:
Para disparar el despliegue los cambios deben subirse a la rama "main"
El proyecto en firebase debe estar configurado previamente 
Tener listo un Secreto llamado: FIREBASE_TOKEN configurado en GitHub Actions


Autor: 
Cornelio de Wilso Leal Tut
