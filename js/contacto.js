// Contact Form JavaScript

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Load apartment data from URL or Supabase
async function loadApartmentData() {
    const apartmentId = getUrlParameter('id');
    const apartmentName = getUrlParameter('name');
    const apartmentArea = getUrlParameter('area');

    if (apartmentId) {
        // Try to get from Supabase
        const result = await getApartmentById(apartmentId);

        if (result.success && result.data) {
            document.getElementById('apartmentName').value = result.data.name;
            document.getElementById('apartmentArea').value = result.data.location;
        } else if (apartmentName && apartmentArea) {
            // Use URL parameters as fallback
            document.getElementById('apartmentName').value = apartmentName;
            document.getElementById('apartmentArea').value = apartmentArea;
        }
    } else if (apartmentName && apartmentArea) {
        document.getElementById('apartmentName').value = apartmentName;
        document.getElementById('apartmentArea').value = apartmentArea;
    }
}

// Show/hide pets details
document.getElementById('hasPets').addEventListener('change', function () {
    const petsDetailsGroup = document.getElementById('petsDetailsGroup');
    if (this.value === 'si') {
        petsDetailsGroup.style.display = 'block';
        document.getElementById('petsDetails').required = true;
    } else {
        petsDetailsGroup.style.display = 'none';
        document.getElementById('petsDetails').required = false;
    }
});

// Form submission
document.getElementById('rentalForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Obtener apartment_id si está en URL
    const apartmentId = getUrlParameter('id') || null;

    // Collect form data para Supabase
    const applicationData = {
        apartment_id: apartmentId,
        apartment_name: document.getElementById('apartmentName').value,
        apartment_area: document.getElementById('apartmentArea').value,
        full_name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        move_in_date: document.getElementById('moveInDate').value,
        duration: document.getElementById('rentalPeriod').value,
        message: `
DNI: ${document.getElementById('dni').value}
Fecha de Nacimiento: ${document.getElementById('birthDate').value}
Nacionalidad: ${document.getElementById('nationality').value}
Ocupación: ${document.getElementById('occupation').value}
Lugar de Trabajo: ${document.getElementById('workplace').value}
Ingresos Mensuales: ${document.getElementById('monthlyIncome').value}
Tipo de Empleo: ${document.getElementById('employmentType').value}
Número de Ocupantes: ${document.getElementById('numOccupants').value}
Mascotas: ${document.getElementById('hasPets').value}
Detalles de Mascotas: ${document.getElementById('petsDetails').value}
Contacto de Emergencia: ${document.getElementById('emergencyContact').value}
Referencias: ${document.getElementById('references').value}
        `.trim(),
        additional_comments: document.getElementById('additionalComments').value
    };

    // Guardar en Supabase
    const result = await createRentalApplication(applicationData);

    if (result.success) {
        // Show success message
        document.querySelector('.rental-form').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        console.log('Solicitud enviada exitosamente:', result.data);
    } else {
        // Mostrar error
        alert('Error al enviar la solicitud. Por favor, intenta nuevamente.');
        console.error('Error:', result.error);
    }
});

// Set minimum date for move-in date (today)
const today = new Date().toISOString().split('T')[0];
document.getElementById('moveInDate').setAttribute('min', today);

// Set maximum date for birth date (18 years ago)
const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
document.getElementById('birthDate').setAttribute('max', eighteenYearsAgo.toISOString().split('T')[0]);

// Initialize
loadApartmentData();

