# 🔐 CAMBIOS EN AUTENTICACIÓN - VITAL STAYS

## ✅ CAMBIOS REALIZADOS

Se ha modificado el sistema de autenticación del dashboard administrativo:

**ANTES**: Autenticación con proveedores sociales (Google, Apple, Facebook) usando Supabase Auth

**AHORA**: Autenticación tradicional con usuario y contraseña usando JWT

---

## 📝 ARCHIVOS MODIFICADOS

### 1. `dashboard.html`
**Cambios**:
- ❌ Eliminados botones de login social (Google, Apple, Facebook)
- ✅ Agregado formulario tradicional con campos de usuario y contraseña
- ✅ Campo de contraseña con tipo `password` (oculta caracteres)

**Código anterior**:
```html
<button id="loginGoogle">Continuar con Google</button>
<button id="loginApple">Continuar con Apple</button>
<button id="loginFacebook">Continuar con Facebook</button>
```

**Código nuevo**:
```html
<form id="loginForm" class="login-form">
    <div class="form-group">
        <label for="username">Usuario</label>
        <input type="text" id="username" required>
    </div>
    <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" required>
    </div>
    <button type="submit">Iniciar Sesión</button>
</form>
```

### 2. `js/admin.js`
**Cambios**:
- ❌ Eliminada integración con Supabase Auth
- ❌ Eliminadas funciones de OAuth social
- ✅ Agregadas credenciales de administrador
- ✅ Implementado sistema JWT (JSON Web Token)
- ✅ Validación de credenciales en frontend
- ✅ Tokens con expiración de 24 horas

**Funciones nuevas**:
- `generateJWT(username)` - Genera token JWT
- `verifyJWT(token)` - Verifica validez del token
- Validación de credenciales contra constante `ADMIN_CREDENTIALS`

**Credenciales por defecto**:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'VitalStays2024!'
};
```

### 3. `DEPLOYMENT.md`
**Cambios**:
- ❌ Eliminada sección "Configurar Autenticación Social"
- ❌ Eliminada sección "Configurar Redirect URLs"
- ❌ Eliminadas instrucciones de Google Cloud Console
- ❌ Eliminadas instrucciones de Apple Developer
- ❌ Eliminadas instrucciones de Facebook Developers
- ✅ Agregada sección "Configurar Credenciales de Administrador"
- ✅ Actualizado troubleshooting

### 4. `QUICK_START.md`
**Cambios**:
- ❌ Eliminado "Paso 4: Configurar Google OAuth (15 min)"
- ✅ Agregado "Paso 4: Configurar Credenciales de Admin (2 min)"
- ✅ Reducido tiempo total de 45-60 min a ~30 min
- ✅ Actualizado checklist de verificación

---

## 🔐 CÓMO FUNCIONA LA AUTENTICACIÓN JWT

### 1. Login
1. Usuario ingresa credenciales en el formulario
2. JavaScript valida contra `ADMIN_CREDENTIALS`
3. Si es correcto, genera un JWT con:
   - Username
   - Rol: 'admin'
   - Timestamp de creación (iat)
   - Timestamp de expiración (exp) - 24 horas
4. Guarda el JWT en `sessionStorage`
5. Muestra el dashboard

### 2. Verificación en cada carga
1. Al cargar `dashboard.html`, verifica si existe token en `sessionStorage`
2. Valida el token:
   - Estructura correcta (3 partes separadas por puntos)
   - No expirado
   - Rol correcto ('admin')
3. Si es válido, muestra dashboard
4. Si no es válido, muestra login

### 3. Logout
1. Elimina el token de `sessionStorage`
2. Recarga la página
3. Como no hay token, muestra login

---

## 🔧 CONFIGURACIÓN

### Cambiar Credenciales

Edita el archivo `js/admin.js` líneas 10-13:

```javascript
const ADMIN_CREDENTIALS = {
    username: 'tu-usuario',      // Cambia esto
    password: 'tu-contraseña'    // Cambia esto
};
```

### Cambiar Duración del Token

Edita el archivo `js/admin.js` línea 30:

```javascript
exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
```

Ejemplos:
- 1 hora: `(1 * 60 * 60)`
- 12 horas: `(12 * 60 * 60)`
- 7 días: `(7 * 24 * 60 * 60)`

---

## ⚠️ CONSIDERACIONES DE SEGURIDAD

### ⚠️ IMPORTANTE - LIMITACIONES

Esta implementación es **simplificada** y tiene las siguientes limitaciones:

1. **Credenciales en Frontend**: Las credenciales están en el código JavaScript, visible para cualquiera que inspeccione el código fuente.

2. **JWT Simplificado**: El JWT usa una firma básica con `btoa()`, no HMAC-SHA256 real.

3. **Sin Backend**: No hay validación en servidor, todo ocurre en el navegador.

4. **Sin Encriptación de Contraseña**: La contraseña se compara en texto plano.

### ✅ PARA PRODUCCIÓN REAL

Si vas a usar esto en producción, deberías:

1. **Mover credenciales a backend**:
   - Crear API en Node.js/Python/PHP
   - Validar credenciales en servidor
   - Generar JWT en servidor con librería real (jsonwebtoken)

2. **Usar hash de contraseñas**:
   - bcrypt para hashear contraseñas
   - Nunca guardar contraseñas en texto plano

3. **HTTPS obligatorio**:
   - Siempre usar HTTPS en producción
   - Nunca enviar credenciales por HTTP

4. **Variables de entorno**:
   - Guardar credenciales en variables de entorno
   - No hardcodear en el código

---

## 📋 CHECKLIST DE MIGRACIÓN

Si ya tenías el sistema anterior con OAuth:

- [ ] Eliminar configuración de Google OAuth en Supabase
- [ ] Eliminar configuración de Apple OAuth en Supabase
- [ ] Eliminar configuración de Facebook OAuth en Supabase
- [ ] Eliminar Redirect URLs en Supabase
- [ ] Cambiar credenciales en `js/admin.js`
- [ ] Probar login con nuevas credenciales
- [ ] Verificar que el dashboard funcione correctamente
- [ ] Actualizar documentación interna con nuevas credenciales

---

## 🎯 VENTAJAS DEL NUEVO SISTEMA

✅ **Más simple**: No requiere configuración de OAuth  
✅ **Más rápido**: Setup en 2 minutos vs 15 minutos  
✅ **Sin dependencias externas**: No depende de Google/Apple/Facebook  
✅ **Funciona offline**: No requiere conexión a servicios externos  
✅ **Fácil de cambiar**: Credenciales en un solo lugar  

---

## 📞 SOPORTE

**Credenciales por defecto**:
- Usuario: `admin`
- Contraseña: `VitalStays2024!`

**Ubicación del código**:
- Formulario: `dashboard.html` líneas 24-37
- Lógica: `js/admin.js` líneas 1-118
- Credenciales: `js/admin.js` líneas 10-13

**Para cambiar credenciales**:
1. Edita `js/admin.js`
2. Cambia `username` y `password`
3. Guarda el archivo
4. Recarga el dashboard

---

**Fecha de cambio**: Marzo 2026  
**Versión**: 1.1  
**Estado**: ✅ Implementado y funcionando

