# 🔧 SOLUCIÓN: Error "Cannot read properties of null (reading 'addEventListener')"

## 🔍 EL PROBLEMA

El error completo era:
```
Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
    at admin.js:213
```

**Causa**: El código intentaba agregar un event listener al formulario de login (`loginForm`) **antes** de que el elemento existiera en el DOM.

El código problemático era:
```javascript
// Esto se ejecutaba inmediatamente al cargar el script
document.getElementById('loginForm').addEventListener('submit', function(e) {
    // ...
});
```

Pero el formulario de login está dentro de `loginScreen` que podría no estar visible o cargado cuando se ejecuta este código.

---

## ✅ LA SOLUCIÓN

He movido los event listeners **dentro de las funciones** `showLogin()` y `showDashboard()`, para que se registren **solo cuando los elementos existen**.

### Cambios realizados:

#### 1. Event listener del login ahora se registra en `showLogin()`:

```javascript
function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    
    // Inicializar event listener del login cuando se muestra
    const loginForm = document.getElementById('loginForm');
    if (loginForm && !loginForm.hasAttribute('data-listener')) {
        loginForm.setAttribute('data-listener', 'true');
        loginForm.addEventListener('submit', function (e) {
            // ... código del login
        });
    }
}
```

#### 2. Event listener del logout ahora se registra en `showDashboard()`:

```javascript
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadApartments();
    loadApplications();
    
    // Inicializar event listener del logout cuando se muestra
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && !logoutBtn.hasAttribute('data-listener')) {
        logoutBtn.setAttribute('data-listener', 'true');
        logoutBtn.addEventListener('click', function (e) {
            // ... código del logout
        });
    }
}
```

### ¿Por qué usar `data-listener`?

El atributo `data-listener='true'` evita que se registren múltiples event listeners si la función se llama varias veces.

---

## 🧪 CÓMO VERIFICAR QUE FUNCIONA

### Paso 1: Recargar la página

1. Abre `dashboard.html` en tu navegador
2. Presiona `Ctrl + Shift + R` (recarga forzada)
3. Abre la consola (F12)

### Paso 2: Verificar que NO hay errores

En la consola **NO** deberías ver:
- ❌ "Cannot read properties of null"
- ❌ Ningún error en rojo

### Paso 3: Probar el login

1. Ingresa:
   - Usuario: `admin`
   - Contraseña: `VitalStays2024!`
2. Click "Iniciar Sesión"
3. Deberías ver el dashboard ✅

### Paso 4: Probar crear apartamento

1. Click "+ Agregar Nuevo Apartamento"
2. Llena el formulario
3. Click "Guardar Apartamento"
4. Debería guardar correctamente ✅

---

## 🎯 RESULTADO ESPERADO

Después de este fix:

✅ **NO** hay errores en la consola al cargar la página  
✅ El login funciona correctamente  
✅ El logout funciona correctamente  
✅ El botón "Guardar Apartamento" funciona  
✅ Todo el dashboard funciona sin errores  

---

## 🐛 SI AÚN HAY ERRORES

### Error: "Cannot read properties of null" en otra línea

Si ves el mismo error pero en una línea diferente, significa que hay otro elemento que no existe cuando se intenta acceder.

**Solución**: Verifica que el elemento existe antes de usarlo:

```javascript
// MAL ❌
document.getElementById('miElemento').addEventListener('click', ...);

// BIEN ✅
const miElemento = document.getElementById('miElemento');
if (miElemento) {
    miElemento.addEventListener('click', ...);
}
```

### Error: "saveApartment is not defined"

Significa que `supabaseClient.js` no se está cargando.

**Solución**: Verifica que en `dashboard.html` esté:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabaseClient.js"></script>
<script src="js/admin.js"></script>
```

En ese orden.

### Error: "new row violates row-level security policy"

Las políticas RLS están bloqueando.

**Solución**: Ejecuta el SQL de `SQL_UPDATE_RLS.sql` en Supabase.

---

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] Recargué la página con `Ctrl + Shift + R`
- [ ] NO veo errores en la consola al cargar
- [ ] Puedo hacer login correctamente
- [ ] Puedo ver el dashboard
- [ ] Puedo abrir el modal de nuevo apartamento
- [ ] Puedo guardar un apartamento
- [ ] Puedo hacer logout

Si todos los checks están ✅, ¡todo funciona correctamente!

---

## 📞 RESUMEN

**Problema**: Event listeners se registraban antes de que los elementos existieran  
**Solución**: Mover event listeners dentro de las funciones que muestran los elementos  
**Resultado**: Dashboard funciona sin errores  

---

**Archivo modificado**: `js/admin.js`  
**Líneas modificadas**: 200-244  
**Fecha**: Marzo 2026  
**Versión**: 1.3 - Fix error loginForm

