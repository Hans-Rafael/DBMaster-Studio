# 📋 Guía de Administración - DBMaster Studio

## 🔐 Sistema de Contraseñas Temporales

DBMaster Studio utiliza un sistema de contraseñas temporales para controlar el acceso a la aplicación. Las contraseñas:
- ✅ **Duración**: 7 días
- ✅ **Uso**: Contraseñas de un solo uso
- ✅ **Seguridad**: Solo el administrador puede generarlas

## 🚀 Comandos de Administración

### Método 1: Comandos npm (Recomendado)

```bash
# Generar una nueva contraseña temporal
npm run admin:generate

# Listar todas las contraseñas activas
npm run admin:list

# Eliminar una contraseña específica
npm run admin:delete [id]

# Mostrar ayuda
npm run admin:help
```

### Método 2: Script directo

```bash
# Generar una nueva contraseña temporal
node admin-cli.cjs generate

# Listar todas las contraseñas activas
node admin-cli.cjs list

# Eliminar una contraseña específica
node admin-cli.cjs delete [id]

# Mostrar ayuda
node admin-cli.cjs help
```

## 📝 Ejemplos de Uso

### Generar una nueva contraseña

```bash
npm run admin:generate
```

**Resultado:**
```
🔐 Generando nueva contraseña temporal...
✅ Contraseña generada exitosamente!

📝 CONTRASEÑA:
   kowiNB16xX$I

🆔 ID:
   3o3quwokjh3

⏰ Expira:
   30/7/2026, 15:59:27

⏳ Duración: 7 días

🌐 URL:
   https://dbmaster-studio.onrender.com

💡 Esta contraseña es de un solo uso.
```

### Listar contraseñas activas

```bash
npm run admin:list
```

**Resultado:**
```
📋 Obteniendo contraseñas activas...
✅ 2 contraseña(s) activa(s):

1. Contraseña: kowiNB16xX$I
   ID: 3o3quwokjh3
   Expira: 30/7/2026, 15:59:27
   Creada: 23/7/2026, 15:59:27

2. Contraseña: Ma0XRELHRA63
   ID: 5mgml69t4rl
   Expira: 30/7/2026, 18:36:25
   Creada: 23/7/2026, 18:36:25
```

### Eliminar una contraseña

```bash
npm run admin:delete 3o3quwokjh3
```

**Resultado:**
```
🗑️  Eliminando contraseña 3o3quwokjh3...
✅ Contraseña eliminada exitosamente!
```

## 🔧 Configuración

### Variables de Entorno

El sistema de administración utiliza las siguientes configuraciones:

- **Servidor**: `https://dbmaster-studio.onrender.com`
- **Admin Key**: `852654`

### Cambiar configuración

Para cambiar el servidor o la clave de administrador, edita el archivo `admin-cli.cjs`:

```javascript
const SERVER_URL = 'https://tu-servidor.com';
const ADMIN_KEY = 'tu-clave-admin';
```

## 🌐 Acceso a la Aplicación

1. **Ve a**: https://dbmaster-studio.onrender.com
2. **Ingresa la contraseña** generada
3. **Accede** a toda la plataforma de aprendizaje

## ⚠️ Consideraciones de Seguridad

- 🔒 **Admin Key**: Mantén tu clave de administrador segura
- 🔄 **Contraseñas**: Cada contraseña es de un solo uso
- ⏰ **Vencimiento**: Las contraseñas expiran después de 7 días
- 📊 **Monitoreo**: Usa `npm run admin:list` para revisar contraseñas activas
- 🗑️ **Limpieza**: Elimina contraseñas no utilizadas regularmente

## 🛠️ Solución de Problemas

### Error: "Cannot find module"

**Solución**: Asegúrate de estar en el directorio raíz del proyecto.

### Error: "Error 404" al generar contraseñas

**Solución**: Verifica que el servidor esté activo y la URL sea correcta.

### Error: "Unauthorized"

**Solución**: Verifica que tu ADMIN_KEY sea correcta.

## 📞 Soporte

Para más información o problemas, consulta:
- Documentación del proyecto
- Logs del servidor en Render
- Configuración de variables de entorno

---

**DBMaster Studio** - Plataforma para Aprender Bases de Datos
🔗 https://dbmaster-studio.onrender.com