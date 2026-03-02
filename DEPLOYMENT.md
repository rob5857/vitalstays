# VITAL STAYS - GUÍA DE CONFIGURACIÓN Y DESPLIEGUE

## 📋 CHECKLIST COMPLETO DE CONFIGURACIÓN

### 1️⃣ CREAR PROYECTO EN SUPABASE

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Completa:
   - **Name**: `vital-stays` (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: Selecciona la más cercana a tus usuarios
5. Click "Create new project" y espera 2-3 minutos

### 2️⃣ EJECUTAR SQL EN SUPABASE

1. En tu proyecto de Supabase, ve a **SQL Editor** (menú lateral)
2. Click en "New query"
3. Copia y pega **TODO** el contenido del archivo SQL que se proporcionó arriba
4. **IMPORTANTE**: En la línea que dice `INSERT INTO admin_allowlist (email) VALUES ('tu-email@ejemplo.com');`
   - Reemplaza `'tu-email@ejemplo.com'` con tu email real (el que usarás para login con Google/Apple/Facebook)
5. Click "Run" (o presiona Ctrl+Enter)
6. Verifica que aparezca "Success. No rows returned"

### 3️⃣ CREAR BUCKET DE STORAGE

1. Ve a **Storage** en el menú lateral de Supabase
2. Click "Create a new bucket"
3. Nombre: `apartments`
4. **Public bucket**: ✅ ACTIVADO (importante para que las imágenes sean públicas)
5. Click "Create bucket"

#### Configurar Políticas de Storage

1. Click en el bucket `apartments`
2. Ve a la pestaña "Policies"
3. Click "New Policy"
4. Selecciona "For full customization"
5. Crea las siguientes políticas:

**Política 1: Lectura pública**
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'apartments');
```

**Política 2: Admin puede subir**
```sql
CREATE POLICY "Admin can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'apartments' AND
  auth.role() = 'authenticated'
);
```

**Política 3: Admin puede eliminar**
```sql
CREATE POLICY "Admin can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'apartments' AND
  auth.role() = 'authenticated'
);
```

### 4️⃣ CONFIGURAR CREDENCIALES DE ADMINISTRADOR

**IMPORTANTE**: Las credenciales de administrador están en el archivo `js/admin.js`

1. Abre el archivo `js/admin.js`
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

**⚠️ IMPORTANTE**: En producción, estas credenciales deberían estar en un backend seguro, no en el frontend. Esta es una implementación simplificada para desarrollo.

### 5️⃣ OBTENER CREDENCIALES DE SUPABASE

1. Ve a **Settings > API** en Supabase
2. Copia:
   - **Project URL** (ejemplo: `https://abcdefgh.supabase.co`)
   - **anon public** key (la clave que dice "anon" "public")

### 6️⃣ CONFIGURAR CREDENCIALES EN EL CÓDIGO

1. Abre el archivo `js/supabaseClient.js`
2. Reemplaza las líneas 6 y 7:
   ```javascript
   const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
   const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';
   ```
   Con tus credenciales reales de Supabase

### 7️⃣ DESPLEGAR EN VERCEL

1. Ve a [https://vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Click "Add New" > "Project"
4. Importa tu repositorio de GitHub (o sube los archivos)
5. Configuración:
   - **Framework Preset**: Other
   - **Build Command**: (dejar vacío)
   - **Output Directory**: (dejar vacío o poner `.`)
6. Click "Deploy"
7. Espera 1-2 minutos
8. ¡Listo! Tu sitio estará en `https://tu-proyecto.vercel.app`

### 8️⃣ VERIFICAR QUE TODO FUNCIONE

1. Abre tu sitio en Vercel
2. Ve a `/listings.html` - deberías ver apartamentos cargados desde Supabase
3. Ve a `/dashboard.html` - deberías ver el formulario de login
4. Inicia sesión con las credenciales configuradas (usuario: `admin`, contraseña: `VitalStays2024!`)
5. Deberías ver el dashboard de administración
6. Prueba crear un apartamento
7. Prueba subir imágenes
8. Ve a `/contacto.html` y envía una solicitud
9. Verifica que la solicitud aparezca en el dashboard

---

## 🚨 TROUBLESHOOTING

### Error: "Invalid API key"
- Verifica que copiaste correctamente el SUPABASE_URL y SUPABASE_ANON_KEY
- Asegúrate de usar la clave "anon public", NO la "service_role"

### Error: "Usuario o contraseña incorrectos"
- Verifica que estés usando las credenciales correctas configuradas en `js/admin.js`
- Por defecto: usuario `admin`, contraseña `VitalStays2024!`

### Las imágenes no se suben
- Verifica que el bucket `apartments` sea público
- Verifica que las políticas de storage estén configuradas correctamente

### El token JWT expira
- Los tokens JWT tienen una duración de 24 horas
- Después de 24 horas, deberás volver a iniciar sesión
- Para cambiar la duración, modifica la línea 30 en `js/admin.js`

---

## 📞 SOPORTE

Si tienes problemas, verifica:
1. La consola del navegador (F12) para ver errores de JavaScript
2. La pestaña Network para ver si las llamadas a Supabase fallan
3. Los logs de Supabase en **Logs > Postgres Logs**

