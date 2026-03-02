-- ============================================
-- VITAL STAYS - ACTUALIZACIÓN DE POLÍTICAS RLS
-- Para permitir operaciones sin autenticación de Supabase
-- ============================================

-- IMPORTANTE: Ejecuta este SQL en Supabase SQL Editor
-- Esto reemplaza las políticas anteriores que requerían autenticación

-- ============================================
-- ELIMINAR POLÍTICAS ANTIGUAS
-- ============================================

-- Eliminar políticas de apartments
DROP POLICY IF EXISTS "Admin puede insertar apartamentos" ON apartments;
DROP POLICY IF EXISTS "Admin puede actualizar apartamentos" ON apartments;
DROP POLICY IF EXISTS "Admin puede eliminar apartamentos" ON apartments;

-- Eliminar políticas de apartment_images
DROP POLICY IF EXISTS "Admin puede insertar imágenes" ON apartment_images;
DROP POLICY IF EXISTS "Admin puede actualizar imágenes" ON apartment_images;
DROP POLICY IF EXISTS "Admin puede eliminar imágenes" ON apartment_images;

-- Eliminar políticas de rental_applications
DROP POLICY IF EXISTS "Admin puede ver solicitudes" ON rental_applications;

-- ============================================
-- CREAR NUEVAS POLÍTICAS (SIN AUTENTICACIÓN)
-- ============================================

-- POLICIES: apartments
-- Permitir todas las operaciones con la clave anon
CREATE POLICY "Permitir todas las operaciones en apartments"
  ON apartments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- POLICIES: apartment_images
-- Permitir todas las operaciones con la clave anon
CREATE POLICY "Permitir todas las operaciones en apartment_images"
  ON apartment_images
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- POLICIES: rental_applications
-- Permitir todas las operaciones con la clave anon
CREATE POLICY "Permitir todas las operaciones en rental_applications"
  ON rental_applications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- NOTA IMPORTANTE
-- ============================================

/*
ADVERTENCIA DE SEGURIDAD:

Estas políticas permiten que cualquier persona con la clave anon pueda:
- Crear, editar y eliminar apartamentos
- Crear, editar y eliminar imágenes
- Ver y crear solicitudes de renta

Esto es INSEGURO para producción, pero funciona para desarrollo.

PARA PRODUCCIÓN REAL, deberías:

1. Crear un backend (API) que valide el JWT
2. El backend usa la clave SERVICE_ROLE de Supabase
3. El frontend solo usa la clave ANON para lectura
4. Todas las escrituras pasan por el backend

ALTERNATIVA (más segura sin backend):

Puedes crear una función en Supabase que valide un "admin_token"
y usar esa función en las políticas RLS:

CREATE OR REPLACE FUNCTION is_admin_token(token TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Aquí validarías el token contra una tabla de tokens válidos
  RETURN EXISTS (
    SELECT 1 FROM admin_tokens
    WHERE token_value = token AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

Luego en las políticas:
CREATE POLICY "Admin con token puede insertar"
  ON apartments FOR INSERT
  WITH CHECK (is_admin_token(current_setting('request.headers')::json->>'x-admin-token'));

Pero esto requiere modificar el código para enviar el token en los headers.
*/

