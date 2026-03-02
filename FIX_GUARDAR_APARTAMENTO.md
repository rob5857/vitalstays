# 🔧 SOLUCIÓN: No guarda apartamentos

## 🔍 DIAGNÓSTICO DEL PROBLEMA

El problema es que las **políticas RLS (Row Level Security)** de Supabase están bloqueando las operaciones de INSERT/UPDATE/DELETE porque:

1. Las políticas originales requerían autenticación con Supabase Auth
2. Ahora usamos JWT local (no Supabase Auth)
3. Supabase no reconoce al usuario como autenticado
4. Las políticas RLS bloquean las operaciones

## ✅ SOLUCIÓN RÁPIDA (2 minutos)

### Paso 1: Ir a Supabase SQL Editor

1. Abre tu proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** (menú lateral)
3. Click en **"New query"**

### Paso 2: Ejecutar SQL de actualización

Copia y pega este SQL completo:

```sql
-- Eliminar políticas antiguas que requieren autenticación
DROP POLICY IF EXISTS "Admin puede insertar apartamentos" ON apartments;
DROP POLICY IF EXISTS "Admin puede actualizar apartamentos" ON apartments;
DROP POLICY IF EXISTS "Admin puede eliminar apartamentos" ON apartments;
DROP POLICY IF EXISTS "Admin puede insertar imágenes" ON apartment_images;
DROP POLICY IF EXISTS "Admin puede actualizar imágenes" ON apartment_images;
DROP POLICY IF EXISTS "Admin puede eliminar imágenes" ON apartment_images;
DROP POLICY IF EXISTS "Admin puede ver solicitudes" ON rental_applications;

-- Crear nuevas políticas que permiten operaciones con clave anon
CREATE POLICY "Permitir todas las operaciones en apartments"
  ON apartments FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Permitir todas las operaciones en apartment_images"
  ON apartment_images FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Permitir todas las operaciones en rental_applications"
  ON rental_applications FOR ALL
  USING (true) WITH CHECK (true);
```

### Paso 3: Ejecutar

1. Click en **"Run"** (o presiona `Ctrl + Enter`)
2. Deberías ver: **"Success. No rows returned"**

### Paso 4: Probar

1. Vuelve a tu dashboard
2. Intenta crear un apartamento
3. ¡Debería funcionar! ✅

---

## 🔍 VERIFICAR SI FUNCIONÓ

### Opción 1: Desde el Dashboard
1. Abre `dashboard.html`
2. Login con tus credenciales
3. Click "Agregar Nuevo Apartamento"
4. Llena el formulario
5. Click "Guardar Apartamento"
6. Si ves "Apartamento guardado exitosamente" → ✅ Funciona

### Opción 2: Desde Supabase
1. Ve a Supabase > **Table Editor**
2. Selecciona la tabla `apartments`
3. Deberías ver el apartamento que creaste

---

## 🐛 SI AÚN NO FUNCIONA

### Debug paso a paso:

#### 1. Abrir la consola del navegador
1. Presiona `F12` en tu navegador
2. Ve a la pestaña **Console**
3. Intenta guardar un apartamento
4. Busca errores en rojo

#### 2. Errores comunes:

**Error: "new row violates row-level security policy"**
- Solución: Las políticas RLS no se actualizaron correctamente
- Vuelve a ejecutar el SQL del Paso 2

**Error: "Invalid API key"**
- Solución: Verifica que `js/supabaseClient.js` tenga las credenciales correctas
- Líneas 6-7 deben tener tu SUPABASE_URL y SUPABASE_ANON_KEY

**Error: "relation 'apartments' does not exist"**
- Solución: La tabla no existe
- Ejecuta el SQL completo original (el que crea las tablas)

**Error: "null value in column 'name' violates not-null constraint"**
- Solución: Algún campo requerido está vacío
- Verifica que todos los campos del formulario estén llenos

#### 3. Verificar credenciales de Supabase

Abre `js/supabaseClient.js` y verifica:

```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; // ¿Es correcto?
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // ¿Es la clave anon?
```

Para obtener las credenciales correctas:
1. Ve a Supabase > **Settings** > **API**
2. Copia **Project URL**
3. Copia **anon public** key (NO service_role)

---

## ⚠️ NOTA DE SEGURIDAD

Las nuevas políticas RLS permiten que **cualquier persona con la clave anon** pueda crear/editar/eliminar apartamentos.

**Esto es INSEGURO para producción**, pero funciona para desarrollo/testing.

### Para producción real:

**Opción 1: Backend con validación JWT**
1. Crear API en Node.js/Python/PHP
2. El backend valida el JWT que generamos en `admin.js`
3. El backend usa la clave SERVICE_ROLE de Supabase
4. El frontend solo usa la clave ANON para lectura

**Opción 2: Proteger la clave anon**
1. No publicar la clave anon en GitHub
2. Usar variables de entorno en Vercel
3. Regenerar la clave anon periódicamente en Supabase

**Opción 3: Usar Supabase Auth (volver al sistema anterior)**
1. Volver a usar Google/Apple/Facebook OAuth
2. Las políticas RLS verifican autenticación real
3. Más seguro pero más complejo de configurar

---

## 📋 CHECKLIST DE SOLUCIÓN

- [ ] Ejecuté el SQL de actualización en Supabase
- [ ] Vi "Success. No rows returned"
- [ ] Verifiqué las credenciales en `js/supabaseClient.js`
- [ ] Probé crear un apartamento desde el dashboard
- [ ] Vi "Apartamento guardado exitosamente"
- [ ] Verifiqué que aparece en la tabla de apartamentos
- [ ] Verifiqué que aparece en `/listings.html`

---

## 🎯 RESULTADO ESPERADO

Después de ejecutar el SQL de actualización:

✅ Puedes crear apartamentos  
✅ Puedes editar apartamentos  
✅ Puedes eliminar apartamentos  
✅ Puedes subir imágenes  
✅ Puedes ver solicitudes de renta  

Todo desde el dashboard sin errores.

---

## 📞 SOPORTE ADICIONAL

Si después de seguir estos pasos aún no funciona:

1. Copia el error completo de la consola (F12)
2. Verifica que ejecutaste el SQL original completo
3. Verifica que el bucket `apartments` existe en Storage
4. Verifica que las credenciales de Supabase son correctas

---

**Archivo SQL completo**: `SQL_UPDATE_RLS.sql`  
**Fecha**: Marzo 2026  
**Versión**: 1.1

