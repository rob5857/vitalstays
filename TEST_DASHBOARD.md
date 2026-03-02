# 🧪 PRUEBA DEL DASHBOARD - CHECKLIST

## ✅ CAMBIOS REALIZADOS

He corregido el problema del botón "Guardar Apartamento". Los cambios fueron:

1. ✅ Movido todos los event listeners a la función `initializeEventListeners()`
2. ✅ Llamada a `initializeEventListeners()` después de cargar el DOM
3. ✅ Eliminados event listeners duplicados
4. ✅ Agregados logs de debug en la consola

---

## 🔍 CÓMO PROBAR

### Paso 1: Abrir el Dashboard

1. Abre `dashboard.html` en tu navegador
2. Inicia sesión con:
   - Usuario: `admin`
   - Contraseña: `VitalStays2024!`

### Paso 2: Abrir la Consola del Navegador

1. Presiona `F12` en tu navegador
2. Ve a la pestaña **Console**
3. Deja la consola abierta para ver los logs

### Paso 3: Crear un Apartamento

1. Click en **"+ Agregar Nuevo Apartamento"**
2. Llena el formulario con estos datos de prueba:

```
Nombre: Apartamento de Prueba
Precio: 15000
Ciudad: Ciudad de México
Ubicación: Polanco, Ciudad de México
Colonia: Polanco
Tipo: Apartamento
Habitaciones: 2
Baños: 2
Tamaño: 80
Descripción: Este es un apartamento de prueba
Badge: Nuevo
Rating: 4.5
Reviews: 10
```

3. Click en **"Guardar Apartamento"**

### Paso 4: Verificar en la Consola

Deberías ver estos mensajes en la consola:

```
Formulario enviado
Datos del apartamento: {name: "Apartamento de Prueba", price: 15000, ...}
Resultado: {success: true, data: {...}}
```

### Paso 5: Verificar el Resultado

**Si funciona correctamente**:
- ✅ Verás un alert: "Apartamento guardado exitosamente"
- ✅ El modal se cerrará
- ✅ El apartamento aparecerá en la tabla
- ✅ En la consola verás `Resultado: {success: true, ...}`

**Si hay un error**:
- ❌ Verás un alert con el mensaje de error
- ❌ En la consola verás `Resultado: {success: false, error: "..."}`

---

## 🐛 SI AÚN NO FUNCIONA

### Error 1: "new row violates row-level security policy"

**Causa**: Las políticas RLS de Supabase están bloqueando la operación

**Solución**: Ejecuta el SQL de actualización:

1. Ve a Supabase → SQL Editor
2. Ejecuta el contenido de `SQL_UPDATE_RLS.sql`
3. Vuelve a intentar guardar

### Error 2: No aparece nada en la consola

**Causa**: El event listener no se está registrando

**Solución**:
1. Verifica que el archivo `js/admin.js` se esté cargando
2. Abre la consola y escribe: `document.getElementById('apartmentForm')`
3. Debería mostrar el elemento del formulario
4. Si muestra `null`, el formulario no existe en el DOM

### Error 3: "Cannot read property 'value' of null"

**Causa**: Algún campo del formulario no existe

**Solución**:
1. Verifica que todos los IDs en `dashboard.html` coincidan con los del `admin.js`
2. Campos requeridos:
   - `apartmentName`
   - `apartmentPrice`
   - `apartmentCity`
   - `apartmentLocation`
   - `apartmentNeighborhood`
   - `apartmentBedrooms`
   - `apartmentBathrooms`
   - `apartmentSize`
   - `apartmentType`
   - `apartmentDescription`
   - `apartmentBadge`
   - `apartmentRating`
   - `apartmentReviews`

### Error 4: "Invalid API key"

**Causa**: Las credenciales de Supabase son incorrectas

**Solución**:
1. Abre `js/supabaseClient.js`
2. Verifica líneas 6-7:
   ```javascript
   const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGc...';
   ```
3. Ve a Supabase → Settings → API
4. Copia el **Project URL** y **anon public** key
5. Reemplaza en el archivo

---

## 📋 CHECKLIST DE VERIFICACIÓN

Antes de probar, verifica:

- [ ] Ejecutaste el SQL original completo (creación de tablas)
- [ ] Ejecutaste el SQL de actualización de RLS (`SQL_UPDATE_RLS.sql`)
- [ ] Las credenciales de Supabase están correctas en `js/supabaseClient.js`
- [ ] El archivo `js/admin.js` se carga correctamente
- [ ] Iniciaste sesión en el dashboard
- [ ] La consola del navegador está abierta (F12)

---

## 🎯 RESULTADO ESPERADO

Después de hacer click en "Guardar Apartamento":

1. ✅ Consola muestra: `Formulario enviado`
2. ✅ Consola muestra: `Datos del apartamento: {...}`
3. ✅ Consola muestra: `Resultado: {success: true, ...}`
4. ✅ Alert: "Apartamento guardado exitosamente"
5. ✅ Modal se cierra
6. ✅ Apartamento aparece en la tabla
7. ✅ Apartamento aparece en `/listings.html`

---

## 📞 DEBUG AVANZADO

Si nada de lo anterior funciona, ejecuta esto en la consola:

```javascript
// Verificar que el formulario existe
console.log('Formulario:', document.getElementById('apartmentForm'));

// Verificar que el botón existe
console.log('Botón:', document.querySelector('button[type="submit"]'));

// Verificar que Supabase está cargado
console.log('Supabase:', typeof supabase);

// Verificar que las funciones existen
console.log('saveApartment:', typeof saveApartment);
console.log('getApartments:', typeof getApartments);

// Intentar guardar manualmente
const testData = {
    name: 'Test',
    price: 1000,
    city: 'CDMX',
    location: 'Polanco',
    neighborhood: 'Polanco',
    bedrooms: 2,
    bathrooms: 2,
    size: 80,
    type: 'Apartamento',
    description: 'Test',
    badge: null,
    rating: 0,
    reviews: 0,
    image_url: null
};

saveApartment(testData).then(result => {
    console.log('Resultado manual:', result);
});
```

Copia el resultado y compártelo para más ayuda.

---

**Archivo actualizado**: `js/admin.js`  
**Fecha**: Marzo 2026  
**Versión**: 1.2 - Fix botón guardar

