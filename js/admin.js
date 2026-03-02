// ============================================
// VITAL STAYS - ADMIN DASHBOARD
// Autenticación con JWT + CRUD completo
// ============================================

let currentApartmentId = null;
let currentApartmentImages = [];

// Credenciales admin (en producción, esto debería estar en backend)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'VitalStays2024!' // Cambiar en producción
};

// ============================================
// JWT HELPER FUNCTIONS
// ============================================

function generateJWT(username) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const payload = {
        username: username,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };

    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));

    // En producción, usar una clave secreta real y HMAC
    const signature = btoa(base64Header + '.' + base64Payload + '.VitalStaysSecret');

    return `${base64Header}.${base64Payload}.${signature}`;
}

function verifyJWT(token) {
    try {
        if (!token) return false;

        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const payload = JSON.parse(atob(parts[1]));

        // Verificar expiración
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            return false;
        }

        // Verificar rol
        if (payload.role !== 'admin') {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verificando JWT:', error);
        return false;
    }
}

// ============================================
// AUTENTICACIÓN
// ============================================

// Check auth on load
document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('adminToken');

    if (token && verifyJWT(token)) {
        showDashboard();
    } else {
        showLogin();
    }

    // Inicializar event listeners
    initializeEventListeners();
});

function initializeEventListeners() {
    // Nuevo apartamento
    const newApartmentBtn = document.getElementById('newApartmentBtn');
    if (newApartmentBtn) {
        newApartmentBtn.addEventListener('click', function () {
            currentApartmentId = null;
            currentApartmentImages = [];
            document.getElementById('apartmentForm').reset();
            document.getElementById('formTitle').textContent = 'Nuevo Apartamento';
            document.getElementById('apartmentModal').style.display = 'block';
            renderImageGallery();
        });
    }

    // Guardar apartamento
    const apartmentForm = document.getElementById('apartmentForm');
    if (apartmentForm) {
        apartmentForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log('Formulario enviado'); // Debug

            const apartmentData = {
                name: document.getElementById('apartmentName').value,
                price: parseInt(document.getElementById('apartmentPrice').value),
                city: document.getElementById('apartmentCity').value,
                location: document.getElementById('apartmentLocation').value,
                neighborhood: document.getElementById('apartmentNeighborhood').value,
                bedrooms: parseInt(document.getElementById('apartmentBedrooms').value),
                bathrooms: parseInt(document.getElementById('apartmentBathrooms').value),
                size: parseInt(document.getElementById('apartmentSize').value),
                type: document.getElementById('apartmentType').value,
                description: document.getElementById('apartmentDescription').value,
                badge: document.getElementById('apartmentBadge').value || null,
                rating: parseFloat(document.getElementById('apartmentRating').value) || 0,
                reviews: parseInt(document.getElementById('apartmentReviews').value) || 0,
                image_url: currentApartmentImages.length > 0 ? currentApartmentImages[0].url : null
            };

            console.log('Datos del apartamento:', apartmentData); // Debug

            if (currentApartmentId) {
                apartmentData.id = currentApartmentId;
            }

            const result = await saveApartment(apartmentData);
            console.log('Resultado:', result); // Debug

            if (result.success) {
                alert('Apartamento guardado exitosamente');
                document.getElementById('apartmentModal').style.display = 'none';
                loadApartments();
            } else {
                alert('Error al guardar apartamento: ' + result.error);
            }
        });
    }

    // Cerrar modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            document.getElementById('apartmentModal').style.display = 'none';
        });
    }

    // Upload imagen
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    if (uploadImageBtn) {
        uploadImageBtn.addEventListener('click', function () {
            document.getElementById('imageUpload').click();
        });
    }

    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', async function (e) {
            const file = e.target.files[0];
            if (!file) return;

            if (!currentApartmentId) {
                alert('Primero guarda el apartamento antes de subir imágenes');
                return;
            }

            // Subir a Supabase Storage
            const uploadResult = await uploadImage(file, currentApartmentId);

            if (uploadResult.success) {
                // Guardar referencia en DB
                const sortOrder = currentApartmentImages.length;
                const saveResult = await saveApartmentImage(currentApartmentId, uploadResult.url, sortOrder);

                if (saveResult.success) {
                    currentApartmentImages.push(saveResult.data);
                    renderImageGallery();

                    // Actualizar image_url principal si es la primera
                    if (currentApartmentImages.length === 1) {
                        await saveApartment({
                            id: currentApartmentId,
                            image_url: uploadResult.url
                        });
                    }
                } else {
                    alert('Error al guardar imagen: ' + saveResult.error);
                }
            } else {
                alert('Error al subir imagen: ' + uploadResult.error);
            }

            e.target.value = '';
        });
    }
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';

    // Inicializar event listener del login cuando se muestra
    const loginForm = document.getElementById('loginForm');
    if (loginForm && !loginForm.hasAttribute('data-listener')) {
        loginForm.setAttribute('data-listener', 'true');
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                // Generar JWT
                const token = generateJWT(username);
                sessionStorage.setItem('adminToken', token);

                document.getElementById('loginError').style.display = 'none';
                showDashboard();
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        });
    }
}

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
            e.preventDefault();
            sessionStorage.removeItem('adminToken');
            window.location.reload();
        });
    }
}

// ============================================
// APARTAMENTOS - CRUD
// ============================================

async function loadApartments() {
    const result = await getApartments();

    if (result.success) {
        renderApartmentsList(result.data);
    } else {
        console.error('Error cargando apartamentos:', result.error);
    }
}

function renderApartmentsList(apartments) {
    const tbody = document.getElementById('apartmentsTableBody');
    tbody.innerHTML = '';

    apartments.forEach(apt => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${apt.name}</td>
            <td>${apt.city}</td>
            <td>$${apt.price.toLocaleString()}</td>
            <td>${apt.bedrooms}</td>
            <td>${apt.bathrooms}</td>
            <td>
                <button class="btn btn-small" onclick="editApartment('${apt.id}')">Editar</button>
                <button class="btn btn-small btn-danger" onclick="deleteApartmentConfirm('${apt.id}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Editar apartamento
async function editApartment(id) {
    currentApartmentId = id;
    const result = await getApartmentById(id);

    if (result.success) {
        const apt = result.data;
        currentApartmentImages = apt.apartment_images || [];

        // Llenar formulario
        document.getElementById('apartmentName').value = apt.name;
        document.getElementById('apartmentPrice').value = apt.price;
        document.getElementById('apartmentCity').value = apt.city;
        document.getElementById('apartmentLocation').value = apt.location;
        document.getElementById('apartmentNeighborhood').value = apt.neighborhood || '';
        document.getElementById('apartmentBedrooms').value = apt.bedrooms;
        document.getElementById('apartmentBathrooms').value = apt.bathrooms;
        document.getElementById('apartmentSize').value = apt.size;
        document.getElementById('apartmentType').value = apt.type;
        document.getElementById('apartmentDescription').value = apt.description || '';
        document.getElementById('apartmentBadge').value = apt.badge || '';
        document.getElementById('apartmentRating').value = apt.rating || 0;
        document.getElementById('apartmentReviews').value = apt.reviews || 0;

        document.getElementById('formTitle').textContent = 'Editar Apartamento';
        document.getElementById('apartmentModal').style.display = 'block';
        renderImageGallery();
    }
}

// Eliminar apartamento
async function deleteApartmentConfirm(id) {
    if (confirm('¿Estás seguro de eliminar este apartamento?')) {
        const result = await deleteApartment(id);

        if (result.success) {
            alert('Apartamento eliminado');
            loadApartments();
        } else {
            alert('Error al eliminar: ' + result.error);
        }
    }
}

// ============================================
// GALERÍA DE IMÁGENES
// ============================================

function renderImageGallery() {
    const gallery = document.getElementById('imageGallery');
    gallery.innerHTML = '';

    currentApartmentImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'image-item';
        div.innerHTML = `
            <img src="${img.url}" alt="Imagen ${index + 1}">
            <button type="button" class="btn btn-small btn-danger" onclick="removeImage(${index})">Eliminar</button>
        `;
        gallery.appendChild(div);
    });
}

// Eliminar imagen
async function removeImage(index) {
    const image = currentApartmentImages[index];

    if (confirm('¿Eliminar esta imagen?')) {
        const result = await deleteApartmentImage(image.id);

        if (result.success) {
            currentApartmentImages.splice(index, 1);
            renderImageGallery();
        } else {
            alert('Error al eliminar imagen: ' + result.error);
        }
    }
}

// ============================================
// SOLICITUDES DE RENTA
// ============================================

async function loadApplications() {
    const result = await getRentalApplications();

    if (result.success) {
        renderApplicationsList(result.data);
    } else {
        console.error('Error cargando solicitudes:', result.error);
    }
}

function renderApplicationsList(applications) {
    const tbody = document.getElementById('applicationsTableBody');
    tbody.innerHTML = '';

    applications.forEach(app => {
        const row = document.createElement('tr');
        const date = new Date(app.submitted_at).toLocaleDateString('es-ES');
        row.innerHTML = `
            <td>${app.full_name}</td>
            <td>${app.email}</td>
            <td>${app.phone}</td>
            <td>${app.apartment_name || 'N/A'}</td>
            <td>${date}</td>
            <td>
                <button class="btn btn-small" onclick="viewApplication('${app.id}')">Ver Detalles</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function viewApplication(id) {
    const result = await getRentalApplications();

    if (result.success) {
        const app = result.data.find(a => a.id === id);
        if (app) {
            alert(`
Solicitud de: ${app.full_name}
Email: ${app.email}
Teléfono: ${app.phone}
Apartamento: ${app.apartment_name || 'N/A'}
Área: ${app.apartment_area || 'N/A'}
Fecha de mudanza: ${app.move_in_date || 'N/A'}
Duración: ${app.duration || 'N/A'}

Mensaje:
${app.message || 'Sin mensaje'}

Comentarios adicionales:
${app.additional_comments || 'Sin comentarios'}
            `);
        }
    }
}

