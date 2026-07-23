# Sistema de Autenticación con Contraseñas Temporales

## Descripción

DBMaster Studio ahora incluye un sistema de autenticación con contraseñas temporales que expiran después de 7 días. Esto permite compartir la aplicación de forma segura con usuarios específicos por un tiempo limitado.

## Características

- ✅ Contraseñas temporales de 12 caracteres
- ✅ Expiración automática después de 7 días
- ✅ Contraseñas de un solo uso (por seguridad)
- ✅ Panel de administración para generar contraseñas
- ✅ Interfaz de login moderna y segura
- ✅ Token JWT con cookie httpOnly
- ✅ Compatible con despliegue en Render

## Configuración

### Variables de Entorno

Asegúrate de configurar estas variables en tu archivo `.env`:

```env
JWT_SECRET=your-secret-key-change-in-production
ADMIN_KEY=admin-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here (opcional)
NODE_ENV=production (para despliegue)
PORT=3000
```

## Uso

### Generar Contraseñas Temporales

Para generar una nueva contraseña temporal:

```bash
node admin/generate-passwords.cjs generate
```

Esto generará una contraseña como:
```
📝 Contraseña: VnulzNCf0lt3
🆔 ID: eejks09k0es
⏰ Expira: 30/07/2026, 14:08:24
⏳ Duración: 7 días
```

### Listar Contraseñas Activas

Para ver todas las contraseñas activas:

```bash
node admin/generate-passwords.cjs list
```

### Eliminar una Contraseña

Para eliminar una contraseña específica:

```bash
node admin/generate-passwords.cjs delete [password-id]
```

## Flujo de Usuario

1. **Admin**: Genera una contraseña temporal usando el script de admin
2. **Usuario**: Accede a la URL de la aplicación
3. **Usuario**: Ve la pantalla de login
4. **Usuario**: Ingresa la contraseña temporal proporcionada
5. **Sistema**: Verifica la contraseña y crea una sesión JWT
6. **Usuario**: Accede a toda la funcionalidad de la aplicación
7. **Sesión**: Expira automáticamente después de 7 días

## Despliegue en Render

### Pasos para Desplegar

1. **Push al repositorio**:
   ```bash
   git add .
   git commit -m "Add authentication system"
   git push
   ```

2. **Crear cuenta en Render**: [render.com](https://render.com)

3. **Conectar repositorio**:
   - Ve a Render Dashboard
   - Click "New +"
   - Select "Web Service"
   - Conecta tu repositorio de GitHub

4. **Configurar el servicio**:
   - Name: `dbmaster-studio`
   - Runtime: `Node`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Instance Type: `Free`

5. **Configurar variables de entorno**:
   - `JWT_SECRET`: (generar uno seguro)
   - `ADMIN_KEY`: (generar uno seguro)
   - `GEMINI_API_KEY`: (opcional, si quieres funcionalidad IA)
   - `NODE_ENV`: `production`

6. **Desplegar**: Click "Create Web Service"

### Generar Contraseñas en Producción

Una vez desplegado, puedes generar contraseñas de dos formas:

#### Opción 1: Usando curl contra el servidor de producción

```bash
curl -X POST https://tu-app.onrender.com/api/admin/passwords \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: tu-admin-key" \
  -d "{}"
```

#### Opción 2: Modificar el script admin para producción

Edita `admin/generate-passwords.cjs` y cambia:

```javascript
const SERVER_URL = 'http://localhost:3000';
```

Por:

```javascript
const SERVER_URL = 'https://tu-app.onrender.com';
```

Luego usa:

```bash
node admin/generate-passwords.cjs generate tu-admin-key
```

## Seguridad

- Las contraseñas temporales se almacenan hasheadas con bcrypt
- Los tokens JWT se almacenan en cookies httpOnly
- Las contraseñas expiran automáticamente después de 7 días
- Cada contraseña solo se puede usar una vez
- El endpoint de admin requiere una clave secreta adicional

## Notas Importantes

- ⚠️ Cambia `JWT_SECRET` y `ADMIN_KEY` en producción
- ⚠️ Las contraseñas temporales son de un solo uso
- ⚠️ El almacenamiento de contraseñas es en memoria (se reinicia al reiniciar el servidor)
- 📝 Para producción considera usar una base de datos real en lugar de Map
- 🔒 En producción usa HTTPS obligatoriamente

## Troubleshooting

### Error: "No autorizado como admin"

Verifica que estás usando la `ADMIN_KEY` correcta en el header `X-Admin-Key`.

### Error: "Contraseña inválida o expirada"

La contraseña puede haber expirado (7 días) o ya fue usada anteriormente. Genera una nueva.

### Las contraseñas se pierden al reiniciar el servidor

Esto es normal ya que el almacenamiento es en memoria. Para producción, implementa persistencia en base de datos.