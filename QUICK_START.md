# ⚡ VITAL STAYS - INICIO RÁPIDO (5 PASOS)

## 🚀 De 0 a Producción en 1 Hora

---

## PASO 1: CREAR PROYECTO SUPABASE (5 min)

1. Ve a [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Crea cuenta (o login con GitHub)
4. Click "New Project"
5. Completa:
   - Name: `vital-stays`
   - Database Password: (guárdala)
   - Region: (la más cercana)
6. Click "Create new project"
7. ⏳ Espera 2-3 minutos

---

## PASO 2: EJECUTAR SQL (3 min)

1. En Supabase, ve a **SQL Editor** (menú lateral)
2. Click "New query"
3. Abre el archivo que contiene el SQL completo (ver abajo)
4. Copia TODO el SQL
5. Pega en el editor
6. **IMPORTANTE**: Busca esta línea:
   ```sql
   INSERT INTO admin_allowlist (email) VALUES ('tu-email@ejemplo.com');
   ```
   Reemplaza `'tu-email@ejemplo.com'` con tu email real
7. Click "Run" (o Ctrl+Enter)
8. Verifica: "Success. No rows returned"

---

## PASO 3: CONFIGURAR STORAGE (3 min)

1. Ve a **Storage** (menú lateral)
2. Click "Create a new bucket"
3. Name: `apartments`
4. ✅ **Public bucket**: ACTIVADO
5. Click "Create bucket"
6. Click en el bucket `apartments`
7. Ve a "Policies"
8. Click "New Policy" > "For full customization"
9. Pega estas 3 políticas (una por una):

```sql
-- Política 1: Lectura pública
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'apartments');

-- Política 2: Upload para autenticados
CREATE POLICY "Admin can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'apartments' AND auth.role() = 'authenticated');

-- Política 3: Delete para autenticados
CREATE POLICY "Admin can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'apartments' AND auth.role() = 'authenticated');
```

---

## PASO 4: CONFIGURAR CREDENCIALES DE ADMIN (2 min)

1. Abre el archivo `js/admin.js` en tu editor de código
2. Busca las líneas 10-13:
   ```javascript
   const ADMIN_CREDENTIALS = {
       username: 'admin',
       password: 'VitalStays2024!' // Cambiar en producción
   };
   ```
3. **Cambia el usuario y contraseña** por tus credenciales seguras
4. Guarda el archivo

**Credenciales por defecto**:
- Usuario: `admin`
- Contraseña: `VitalStays2024!`

**⚠️ IMPORTANTE**: Estas credenciales están en el código frontend. En producción, deberías usar un backend real con autenticación segura.

---

## PASO 5: ACTUALIZAR CÓDIGO Y DEPLOY (10 min)

### Actualizar Credenciales:

1. Ve a **Settings** > **API** en Supabase
2. Copia:
   - **Project URL** (ej: `https://abcdefgh.supabase.co`)
   - **anon public** key (la clave larga que dice "anon")
3. Abre `js/supabaseClient.js` en tu editor
4. Reemplaza líneas 6-7:
   ```javascript
   const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
   const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';
   ```
   Con tus credenciales reales
5. Guarda el archivo

### Deploy en Vercel:

1. Ve a [https://vercel.com](https://vercel.com)
2. Login con GitHub
3. Click "Add New" > "Project"
4. Importa tu repositorio (o arrastra la carpeta)
5. Configuración:
   - Framework Preset: **Other**
   - Build Command: (dejar vacío)
   - Output Directory: `.`
6. Click "Deploy"
7. ⏳ Espera 1-2 minutos
8. ¡Listo! Copia tu URL (ej: `https://vital-stays.vercel.app`)

### Actualizar Redirect URL en Supabase:

1. Vuelve a Supabase > Authentication > URL Configuration
2. Agrega tu URL de Vercel:
   ```
   https://tu-proyecto.vercel.app/dashboard.html
   ```
3. Click "Save"

---

## ✅ VERIFICAR QUE TODO FUNCIONE

1. Abre tu sitio en Vercel: `https://tu-proyecto.vercel.app`
2. Ve a `/listings.html` - ¿Ves apartamentos? ✅
3. Ve a `/dashboard.html` - ¿Ves el formulario de login? ✅
4. Inicia sesión con las credenciales (usuario: `admin`, contraseña: `VitalStays2024!`)
5. ¿Ves el dashboard? ✅
6. Click "Agregar Nuevo Apartamento"
7. Llena el formulario y guarda
8. ¿Aparece en la tabla? ✅
9. Ve a `/listings.html` - ¿Aparece tu apartamento? ✅

---

## 🎉 ¡FELICIDADES!

Tu aplicación está en producción y funcionando.

---

## 🚨 SI ALGO NO FUNCIONA

### Error: "Invalid API key"
- Verifica que copiaste bien SUPABASE_URL y SUPABASE_ANON_KEY
- Usa la clave "anon public", NO "service_role"

### Error: "Usuario o contraseña incorrectos"
- Verifica que estés usando las credenciales correctas
- Por defecto: usuario `admin`, contraseña `VitalStays2024!`
- Revisa el archivo `js/admin.js` líneas 10-13

### No veo apartamentos en listings
- Ve a Supabase > SQL Editor
- Ejecuta: `SELECT * FROM apartments;`
- Si está vacío, inserta datos de ejemplo (ver SQL completo)

### El token JWT expira después de 24 horas
- Esto es normal, vuelve a iniciar sesión
- Para cambiar la duración, edita `js/admin.js` línea 30

---

## 📚 DOCUMENTACIÓN COMPLETA

- **DEPLOYMENT.md** - Guía detallada paso a paso
- **EXECUTIVE_SUMMARY.md** - Resumen ejecutivo
- **README_SUPABASE.md** - Documentación técnica

---

## ⏱️ TIEMPO TOTAL: ~30 MINUTOS

- Paso 1: 5 min
- Paso 2: 3 min
- Paso 3: 3 min
- Paso 4: 2 min
- Paso 5: 10 min
- Testing: 7 min

---

**¡Éxito! 🚀**

