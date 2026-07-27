# 📋 Guía de Administración - DBMaster Studio

## 🔐 Sistema de Administración Web

DBMaster Studio ahora cuenta con un **panel de administración web completo** que permite gestionar usuarios, contraseñas temporales y permisos desde una interfaz gráfica amigable.

### 🌟 Características del Panel Web

- ✅ **Login de administrador** con credenciales dedicadas
- ✅ **Gestión de usuarios** (CRUD completo)
- ✅ **Extensión de sesiones** de usuarios específicos
- ✅ **Control de permisos** (estudiante, restringido, bloqueado)
- ✅ **Generación de contraseñas temporales** asociadas a usuarios
- ✅ **Interfaz moderna** y responsiva

---

## 🚀 Configuración Inicial

### 1. Configurar Supabase

El sistema de administración web utiliza **Supabase** como base de datos.

1. **Crear cuenta en Supabase**: https://supabase.com
2. **Crear un nuevo proyecto**:
   - Nombre: `dbmaster-studio-admin`
   - Contraseña de base de datos: elige una segura
   - Región: la más cercana a ti
3. **Obtener credenciales**:
   - Ve a Settings → API
   - Copia: `Project URL` y `service_role key`

### 2. Configurar Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu-service-role-key
```

### 3. Ejecutar el Schema de Base de Datos

Ejecuta el script SQL en el SQL Editor de Supabase:

```bash
# El archivo se encuentra en: supabase-schema.sql
# Copia y pega el contenido en el SQL Editor de Supabase
```

### 4. Crear el Primer Administrador

Usa el script proporcionado para crear el primer administrador:

```bash
node create-admin.cjs admin@dbmaster.studio tuContraseñaSegura123
```

**Resultado:**
```
🔐 Creando administrador...
✅ Administrador creado exitosamente!
📧 Email: admin@dbmaster.studio
🆔 ID: xxx-xxx-xxx
📅 Creado: 2026-07-27T...
```

---

## 🌐 Acceso al Panel de Administración

### Método Web (Recomendado)

1. **Ve a**: https://dbmaster-studio.onrender.com
2. **Haz clic en**: "¿Eres administrador? Ingresa aquí"
3. **Ingresa tus credenciales** de administrador
4. **Accede** al panel de control completo

### Desde la Aplicación Principal

Si ya estás logueado como estudiante:
1. **Haz clic** en el botón "Admin" (🛡️) en el header
2. **Serás redirigido** al panel de administración

---

## 📋 Funcionalidades del Panel

### Gestión de Usuarios

#### Crear Nuevo Usuario
1. Ve a la pestaña "Usuarios"
2. Haz clic en "Nuevo Usuario"
3. Completa el formulario:
   - **Usuario**: nombre de usuario único
   - **Contraseña**: contraseña de acceso
   - **Email** (opcional): correo electrónico
4. Haz clic en "Crear Usuario"

#### Extender Tiempo de Sesión
1. En la lista de usuarios, locate el usuario deseado
2. Haz clic en el icono de reloj (⏰)
3. La sesión se extenderá automáticamente 7 días

#### Restringir Permisos
1. En la lista de usuarios, usa el selector de rol
2. Selecciona el rol deseado:
   - **Estudiante**: acceso completo
   - **Restringido**: acceso limitado
   - **Bloqueado**: sin acceso

#### Eliminar Usuario
1. En la lista de usuarios, locate el usuario
2. Haz clic en el icono de papelera (🗑️)
3. Confirma la eliminación

### Gestión de Contraseñas Temporales

#### Generar Contraseña Temporal
1. Ve a la pestaña "Contraseñas Temporales"
2. Haz clic en "Generar Contraseña"
3. La contraseña se mostrará en pantalla
4. **Copia la contraseña** inmediatamente (solo se muestra una vez)

#### Generar Contraseña para Usuario Específico
1. Ve a la pestaña "Usuarios"
2. Locate el usuario deseado
3. Haz clic en el icono de llave (🔑)
4. La contraseña se generará y asociará a ese usuario

#### Eliminar Contraseña Temporal
1. Ve a la pestaña "Contraseñas Temporales"
2. Locate la contraseña deseada
3. Haz clic en el icono de papelera (🗑️)

---

## 🔧 Sistema Antiguo (Comandos npm)

El sistema de administración por comandos **sigue funcionando** por compatibilidad.

### Comandos Disponibles

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

### Cuándo Usar el Sistema Antiguo

- Cuando no tienes acceso a la interfaz web
- Para automatización con scripts
- Para solución de problemas

---

## 🔒 Seguridad

### Contraseñas de Administrador

- 🔒 **Usa contraseñas fuertes** para administradores
- 🔄 **Cambia contraseñas** regularmente
- 👥 **Limita el número** de administradores
- 📝 **Registra actividad** de administradores

### Contraseñas Temporales

- ⏰ **Duración**: 7 días por defecto
- 🔄 **Uso único**: Cada contraseña solo puede usarse una vez
- 🗑️ **Limpieza**: Elimina contraseñas no utilizadas regularmente
- 👀 **Monitoreo**: Revisa contraseñas activas frecuentemente

### Base de Datos (Supabase)

- 🔐 **Service Role Key**: Nunca compartas esta clave
- 🌐 **RLS Habilitado**: Las políticas de seguridad están activas
- 💾 **Backups**: Supabase realiza backups automáticos
- 📊 **Monitoreo**: Usa el dashboard de Supabase para monitorear

---

## 🛠️ Solución de Problemas

### Error: "Supabase no está configurado"

**Solución**: Verifica que `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` estén configurados en `.env`

### Error: "Credenciales inválidas" en login admin

**Solución**: 
1. Verifica que el administrador exista en la base de datos
2. Verifica que la contraseña sea correcta
3. Si olvidaste la contraseña, crea un nuevo administrador

### Error: "Error al conectar con Supabase"

**Solución**:
1. Verifica que las credenciales de Supabase sean correctas
2. Verifica que el proyecto de Supabase esté activo
3. Revisa la conexión a internet

### Error: "Tabla no existe"

**Solución**: Ejecuta el script `supabase-schema.sql` en el SQL Editor de Supabase

---

## 📞 Soporte

Para más información o problemas:
- 📖 **Documentación del proyecto**: README.md
- 🌐 **Dashboard de Supabase**: https://supabase.com/dashboard
- 🐛 **Reportar bugs**: Issues en GitHub
- 💬 **Ayuda**: Contacta al equipo de desarrollo

---

## 🔄 Migración del Sistema Antiguo

Si tienes contraseñas temporales del sistema antiguo (en memoria):

1. **El sistema antiguo sigue funcionando** para compatibilidad
2. **Las contraseñas nuevas** se almacenarán en Supabase
3. **Migra gradualmente** usuarios al nuevo sistema
4. **Monitorea ambos sistemas** durante el periodo de transición

---

**DBMaster Studio** - Plataforma para Aprender Bases de Datos
🔗 https://dbmaster-studio.onrender.com
🗄️ **Powered by Supabase**