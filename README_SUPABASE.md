# 🏠 VITAL STAYS - Plataforma de Apartamentos

> **Estancias verificadas para profesionales de la salud**

Aplicación web completa con Supabase (PostgreSQL + Auth + Storage) y despliegue en Vercel.

---

## 🚀 INICIO RÁPIDO

### Prerrequisitos
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Editor de código (VS Code recomendado)

### Configuración en 3 Pasos

#### 1. Configurar Supabase
```bash
# 1. Crea un proyecto en Supabase
# 2. Ejecuta el SQL completo (ver DEPLOYMENT.md)
# 3. Crea el bucket 'apartments' en Storage
# 4. Configura OAuth providers (Google, Apple, Facebook)
```

#### 2. Configurar Credenciales
```javascript
// Edita js/supabaseClient.js líneas 6-7
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';
```

#### 3. Desplegar en Vercel
```bash
# Opción A: Desde GitHub
# 1. Sube el código a GitHub
# 2. Importa en Vercel
# 3. Deploy automático

# Opción B: Desde CLI
npm i -g vercel
vercel
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
Sara-main/
├── index.html              # Landing page
├── listings.html           # Catálogo de apartamentos
├── apartment-detail.html   # Detalle de apartamento
├── contacto.html           # Formulario de solicitud
├── dashboard.html          # Panel de administración
├── styles.css              # Estilos globales
├── js/
│   ├── supabaseClient.js   # Cliente Supabase + funciones
│   ├── admin.js            # Lógica del dashboard
│   ├── listings.js         # Lógica del catálogo
│   ├── script.js           # Funciones generales
│   └── contacto.js         # Lógica del formulario
├── vercel.json             # Configuración de Vercel
├── DEPLOYMENT.md           # Guía completa de configuración
└── EXECUTIVE_SUMMARY.md    # Resumen ejecutivo
```

---

## 🗄️ MODELO DE DATOS

### Tablas Principales

#### `apartments`
```sql
- id (uuid, PK)
- name (text)
- price (integer)
- city (text)
- location (text)
- neighborhood (text)
- bedrooms (integer)
- bathrooms (integer)
- size (integer)
- description (text)
- type (text)
- badge (text: 'Destacado', 'Nuevo', NULL)
- rating (numeric)
- reviews (integer)
- image_url (text)
- created_at, updated_at (timestamptz)
```

#### `apartment_images`
```sql
- id (uuid, PK)
- apartment_id (uuid, FK)
- url (text)
- sort_order (integer)
- created_at (timestamptz)
```

#### `rental_applications`
```sql
- id (uuid, PK)
- apartment_id (uuid, FK, nullable)
- apartment_name (text)
- apartment_area (text)
- full_name (text)
- email (text)
- phone (text)
- move_in_date (date)
- duration (text)
- message (text)
- additional_comments (text)
- submitted_at (timestamptz)
```

#### `admin_allowlist`
```sql
- id (uuid, PK)
- email (text, UNIQUE)
- created_at (timestamptz)
```

---

## 🔐 SEGURIDAD (RLS)

### Políticas Implementadas

**Apartamentos**:
- ✅ Público: SELECT
- ✅ Admin: INSERT, UPDATE, DELETE

**Imágenes**:
- ✅ Público: SELECT
- ✅ Admin: INSERT, UPDATE, DELETE

**Solicitudes**:
- ✅ Público: INSERT
- ✅ Admin: SELECT

**Storage (bucket apartments)**:
- ✅ Público: SELECT
- ✅ Authenticated: INSERT, DELETE

---

## 🎨 FUNCIONALIDADES

### Frontend Público
- ✅ Catálogo de apartamentos con filtros
- ✅ Búsqueda por ciudad, precio, habitaciones
- ✅ Vista detallada con galería de imágenes
- ✅ Formulario de solicitud de renta
- ✅ Diseño responsive (mobile-first)

### Panel de Administración
- ✅ Login con Google, Apple, Facebook
- ✅ CRUD completo de apartamentos
- ✅ Upload de imágenes a Supabase Storage
- ✅ Gestión de galería (ordenar, eliminar)
- ✅ Visualización de solicitudes recibidas
- ✅ Control de acceso por email allowlist

---

## 🛠️ DESARROLLO LOCAL

### Opción 1: Live Server (VS Code)
```bash
# 1. Instala extensión "Live Server"
# 2. Click derecho en index.html
# 3. "Open with Live Server"
```

### Opción 2: Python
```bash
python -m http.server 8000
# Abre http://localhost:8000
```

### Opción 3: Node.js
```bash
npx serve
# Abre http://localhost:3000
```

---

## 📝 CONFIGURACIÓN DE AUTH PROVIDERS

### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto > APIs & Services > Credentials
3. OAuth 2.0 Client ID (Web application)
4. Redirect URI: `https://tu-proyecto.supabase.co/auth/v1/callback`

### Apple OAuth
1. [Apple Developer](https://developer.apple.com)
2. Certificates, Identifiers & Profiles
3. Services ID > Sign in with Apple
4. Return URL: `https://tu-proyecto.supabase.co/auth/v1/callback`

### Facebook OAuth
1. [Facebook Developers](https://developers.facebook.com)
2. Create App > Facebook Login
3. Valid OAuth Redirect URIs: `https://tu-proyecto.supabase.co/auth/v1/callback`

---

## 🧪 TESTING

### Checklist de Pruebas

**Frontend Público**:
- [ ] Cargar apartamentos desde Supabase
- [ ] Filtros funcionan correctamente
- [ ] Vista detallada muestra galería
- [ ] Formulario de contacto inserta en DB

**Dashboard**:
- [ ] Login con Google funciona
- [ ] Solo admin puede acceder
- [ ] Crear apartamento funciona
- [ ] Subir imágenes funciona
- [ ] Eliminar apartamento funciona
- [ ] Ver solicitudes funciona

---

## 🐛 TROUBLESHOOTING

### Error: "Invalid API key"
```javascript
// Verifica que usas la clave ANON, no SERVICE_ROLE
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // Debe empezar con eyJ
```

### Error: "No tienes permisos de administrador"
```sql
-- Verifica que tu email esté en la allowlist
SELECT * FROM admin_allowlist WHERE email = 'tu-email@gmail.com';

-- Si no está, agrégalo:
INSERT INTO admin_allowlist (email) VALUES ('tu-email@gmail.com');
```

### Las imágenes no se suben
```sql
-- Verifica que el bucket sea público
-- En Supabase: Storage > apartments > Settings > Public bucket: ON

-- Verifica las políticas de storage
SELECT * FROM storage.policies WHERE bucket_id = 'apartments';
```

---

## 📚 DOCUMENTACIÓN ADICIONAL

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía completa paso a paso
- [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) - Resumen ejecutivo
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 📄 LICENCIA

MIT License - Uso libre para proyectos personales y comerciales.

---

## 👥 SOPORTE

¿Problemas? Revisa:
1. Consola del navegador (F12)
2. Network tab para ver requests fallidos
3. Supabase Logs (Logs > Postgres Logs)
4. DEPLOYMENT.md sección Troubleshooting

---

**Hecho con ❤️ para profesionales de la salud**

