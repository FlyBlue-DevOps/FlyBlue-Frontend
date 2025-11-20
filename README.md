# FlyBlue - Frontend

Aplicación frontend en React para la plataforma FlyBlue. Esta app consume una API REST (configurable) y provee páginas para ver vuelos, crear reservas, pagar y administrar perfil/servicios.

Principales archivos y símbolos:
- Configuración de scripts y dependencias: [package.json](package.json)
- Variables de entorno: [flyblue/.env](flyblue/.env) (usa [`.env.example`](.env.example) como referencia)
- Punto de entrada: [src/index.js](src/index.js)
- Rutas y arranque de la app: [src/App.js](src/App.js)
- Autenticación / contexto: [`AuthProvider`](src/contexts/AuthContext.js) y [`useAuth`](src/contexts/AuthContext.js)
- Cliente HTTP (axios): [`api`](src/services/api/index.js)
- Servicio de autenticación: [`authService.login`](src/services/auth/authService.js)
- Dockerfile para servir build con nginx: [Dockerfile](../Dockerfile)

Requisitos
- Node.js (recomendado >= 16)
- npm (bundled con Node) o yarn
- (Opcional) Docker si quieres ejecutar la build en un contenedor

Instalación y ejecución (desarrollo)
1. Abrir terminal en la carpeta del frontend:
   cd flyblue

2. Instalar dependencias:
   npm install

3. Copiar el archivo de entorno y editar si es necesario:
   cp .env .env.example
   - Ajusta la URL de la API en [flyblue/.env](flyblue/.env) (variable REACT_APP_API_URL)

4. Ejecutar en modo desarrollo:
   npm start
   - Abre http://localhost:3000
   - El `baseURL` que usa el cliente axios viene de la variable REACT_APP_API_URL en [src/services/api/index.js](src/services/api/index.js)

Build para producción
1. Generar la build optimizada:
   npm run build

2. Servir localmente con un servidor estático (por ejemplo `serve`) o usar Docker:
   - Usando Docker:
     docker build -t flyblue-frontend -f ../Dockerfile .
     docker run -p 80:80 flyblue-frontend

Variables de entorno importantes
- REACT_APP_API_URL — URL base de la API (ej: `http://localhost:3001/api`). Edita [flyblue/.env](flyblue/.env) o crea tu `.env` en la carpeta `flyblue`.

Testing
- Ejecutar el runner de tests (si hay tests):
  npm test

Notas rápidas de desarrollo
- Verifica la lógica de autenticación en [`AuthProvider`](src/contexts/AuthContext.js) y el uso del token en [`api` axios interceptor](src/services/api/index.js).
- Para ver/ajustar rutas y componentes revisa [src/App.js](src/App.js), y las páginas en [src/pages/](src/pages/).
- Si el backend retorna 401 el interceptor en [`api`](src/services/api/index.js) limpia el token y redirige a `/login`.

Enlaces rápidos
- [package.json](package.json)
- [flyblue/.env](flyblue/.env)
- [src/index.js](src/index.js)
- [src/App.js](src/App.js)
- [src/contexts/AuthContext.js](src/contexts/AuthContext.js)
- [src/services/api/index.js](src/services/api/index.js)
- [src/services/auth/authService.js](src/services/auth/authService.js)
- [Dockerfile](../Dockerfile)

Si necesitas que adapte este README para otra carpeta (por ejemplo el README raíz) o añada instrucciones CI/CD, indícalo y lo actualizo.
```// filepath: