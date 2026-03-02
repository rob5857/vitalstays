// ============================================
// SUPABASE CLIENT - VITAL STAYS
// ============================================

// CONFIGURACIÓN: Reemplaza con tus credenciales de Supabase
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

/**
 * Login con proveedor social (Google, Apple, Facebook)
 */
async function signInWithProvider(provider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + '/dashboard.html'
      }
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error(`Error login con ${provider}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Logout
 */
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener sesión actual
 */
async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    return null;
  }
}

/**
 * Verificar si el usuario actual es admin
 */
async function isAdmin() {
  try {
    const { data, error } = await supabase.rpc('is_admin');
    if (error) throw error;
    return data === true;
  } catch (error) {
    console.error('Error verificando admin:', error);
    return false;
  }
}

// ============================================
// FUNCIONES DE APARTAMENTOS
// ============================================

/**
 * Obtener todos los apartamentos con sus imágenes
 */
async function getApartments(filters = {}) {
  try {
    let query = supabase
      .from('apartments')
      .select(`
        *,
        apartment_images (
          id,
          url,
          sort_order
        )
      `)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters.city) {
      query = query.eq('city', filters.city);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Ordenar imágenes por sort_order
    data.forEach(apt => {
      if (apt.apartment_images) {
        apt.apartment_images.sort((a, b) => a.sort_order - b.sort_order);
      }
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Error obteniendo apartamentos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener un apartamento por ID
 */
async function getApartmentById(id) {
  try {
    const { data, error } = await supabase
      .from('apartments')
      .select(`
        *,
        apartment_images (
          id,
          url,
          sort_order
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Ordenar imágenes
    if (data.apartment_images) {
      data.apartment_images.sort((a, b) => a.sort_order - b.sort_order);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error obteniendo apartamento:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Crear o actualizar apartamento (solo admin)
 */
async function saveApartment(apartmentData) {
  try {
    const { data, error } = await supabase
      .from('apartments')
      .upsert(apartmentData)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error guardando apartamento:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar apartamento (solo admin)
 */
async function deleteApartment(id) {
  try {
    const { error } = await supabase
      .from('apartments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error eliminando apartamento:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// FUNCIONES DE IMÁGENES
// ============================================

/**
 * Subir imagen a Supabase Storage
 */
async function uploadImage(file, apartmentId) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${apartmentId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('apartments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('apartments')
      .getPublicUrl(fileName);
    
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Guardar referencia de imagen en DB
 */
async function saveApartmentImage(apartmentId, url, sortOrder = 0) {
  try {
    const { data, error } = await supabase
      .from('apartment_images')
      .insert({
        apartment_id: apartmentId,
        url: url,
        sort_order: sortOrder
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error guardando imagen:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar imagen
 */
async function deleteApartmentImage(imageId) {
  try {
    const { error } = await supabase
      .from('apartment_images')
      .delete()
      .eq('id', imageId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// FUNCIONES DE SOLICITUDES
// ============================================

/**
 * Crear solicitud de renta
 */
async function createRentalApplication(applicationData) {
  try {
    const { data, error } = await supabase
      .from('rental_applications')
      .insert(applicationData)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creando solicitud:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener todas las solicitudes (solo admin)
 */
async function getRentalApplications() {
  try {
    const { data, error } = await supabase
      .from('rental_applications')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    return { success: false, error: error.message };
  }
}

