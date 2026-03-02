// ============================================
// VITAL STAYS - LISTINGS PAGE
// Carga apartamentos desde Supabase
// ============================================

let apartmentsData = [];

// ===== FILTER AND RENDER FUNCTIONS =====

let currentFilters = {
    location: '',
    maxPrice: '',
    city: ''
};

// Initialize page on load
document.addEventListener('DOMContentLoaded', async function () {
    // Cargar apartamentos desde Supabase
    await loadApartmentsFromSupabase();

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const locationParam = urlParams.get('location');
    const maxPriceParam = urlParams.get('maxPrice');

    // Set filters from URL parameters
    if (locationParam) {
        document.getElementById('search').value = locationParam;
        currentFilters.location = locationParam.toLowerCase();
    }

    if (maxPriceParam) {
        document.getElementById('price-filter').value = maxPriceParam;
        currentFilters.maxPrice = maxPriceParam;
    }

    // Add event listeners to filters
    document.getElementById('search').addEventListener('input', applyFilters);
    document.getElementById('price-filter').addEventListener('change', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearAllFilters);

    // Initial render
    renderApartments(filterApartments());
});

// Cargar apartamentos desde Supabase
async function loadApartmentsFromSupabase() {
    const result = await getApartments();

    if (result.success) {
        apartmentsData = result.data;
    } else {
        console.error('Error cargando apartamentos:', result.error);
        // Mostrar mensaje de error al usuario
        const container = document.getElementById('apartments-list');
        const noResults = document.getElementById('no-results');
        container.style.display = 'none';
        noResults.style.display = 'flex';
        noResults.innerHTML = `
            <div style="text-align: center;">
                <h3>Error al cargar apartamentos</h3>
                <p>Por favor, intenta recargar la página.</p>
            </div>
        `;
    }
}

// Filter apartments based on current filters
function filterApartments() {
    return apartmentsData.filter(apartment => {
        // Location filter (searches in name, city, neighborhood, and location)
        if (currentFilters.location) {
            const searchTerm = currentFilters.location.toLowerCase();
            const matchesLocation =
                (apartment.name || '').toLowerCase().includes(searchTerm) ||
                (apartment.city || '').toLowerCase().includes(searchTerm) ||
                (apartment.neighborhood || '').toLowerCase().includes(searchTerm) ||
                (apartment.location || '').toLowerCase().includes(searchTerm);

            if (!matchesLocation) return false;
        }

        // Price filter
        if (currentFilters.maxPrice) {
            const maxPrice = parseInt(currentFilters.maxPrice);
            if (apartment.price > maxPrice) return false;
        }

        // City filter
        if (currentFilters.city) {
            if (apartment.city !== currentFilters.city) return false;
        }

        return true;
    });
}

// Apply filters when user changes inputs
function applyFilters() {
    currentFilters.location = document.getElementById('search').value.toLowerCase();
    currentFilters.maxPrice = document.getElementById('price-filter').value;
    currentFilters.city = '';

    const filteredApartments = filterApartments();
    renderApartments(filteredApartments);
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('search').value = '';
    document.getElementById('price-filter').value = '';

    currentFilters = {
        location: '',
        maxPrice: '',
        city: ''
    };

    // Update URL to remove parameters
    window.history.pushState({}, '', 'listings.html');

    renderApartments(apartmentsData);
}

// Render apartments to the page
function renderApartments(apartments) {
    const container = document.getElementById('apartments-list');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');

    // Clear container
    container.innerHTML = '';

    // Update results count
    if (apartments.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'flex';
        resultsCount.textContent = 'No se encontraron apartamentos';
    } else {
        container.style.display = 'grid';
        noResults.style.display = 'none';
        resultsCount.textContent = `Mostrando ${apartments.length} apartamento${apartments.length !== 1 ? 's' : ''}`;

        // Render each apartment
        apartments.forEach(apartment => {
            const card = createApartmentCard(apartment);
            container.appendChild(card);
        });
    }
}

// Create apartment card HTML element
function createApartmentCard(apartment) {
    const card = document.createElement('div');
    card.className = 'apartment-card';

    // Rating: puede no existir en apartamentos creados desde el dashboard
    const rating = apartment.rating || null;
    const reviews = apartment.reviews || null;
    let starsHTML = '';
    let ratingHTML = '';

    if (rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < fullStars; i++) starsHTML += '<span class="star filled">★</span>';
        if (hasHalfStar) starsHTML += '<span class="star half">★</span>';
        for (let i = 0; i < emptyStars; i++) starsHTML += '<span class="star">★</span>';
        ratingHTML = `<div class="card-rating">
                    <div class="stars">${starsHTML}</div>
                    <span class="rating-text">${rating.toFixed(1)}${reviews ? ' (' + reviews + ' reseñas)' : ''}</span>
                </div>`;
    }

    // Badge (del dashboard) o ninguno
    const badgeHTML = apartment.badge
        ? `<div class="card-badge${apartment.badge === 'Nuevo' ? ' new' : ''}">${apartment.badge}</div>`
        : '';

    // Imagen: usar image_url de Supabase o la primera de apartment_images
    let imageUrl = apartment.image_url || '';
    if (!imageUrl && apartment.apartment_images && apartment.apartment_images.length > 0) {
        imageUrl = apartment.apartment_images[0].url;
    }
    const fallback = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop';

    card.innerHTML = `
        ${badgeHTML}
        <img src="${imageUrl || fallback}" alt="${apartment.name}" onerror="this.src='${fallback}'">
        <div class="card-content">
            <div class="card-header">
                <h3>${apartment.name}</h3>
                <div class="card-location">📍 ${apartment.location}</div>
                ${ratingHTML}
            </div>
            <div class="card-features">
                <span>🛏️ ${apartment.bedrooms} Habitación${apartment.bedrooms !== 1 ? 'es' : ''}</span>
                <span>🚿 ${apartment.bathrooms} Baño${apartment.bathrooms !== 1 ? 's' : ''}</span>
                <span>📐 ${apartment.size} m²</span>
            </div>
            <div class="card-footer">
                <div class="price">$${apartment.price.toLocaleString()}<span>/mes</span></div>
                <a href="apartment-detail.html?id=${apartment.id}" class="btn btn-small">Ver Detalles</a>
            </div>
        </div>
    `;

    return card;
}

