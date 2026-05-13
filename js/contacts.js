// Gestion de la modal Google Maps
const addressCard = document.getElementById('addressCard');
const mapModal = document.getElementById('mapModal');
const mapCloseBtn = document.querySelector('.map-modal-close');

// Ouvrir la modal au clic sur la carte adresse
addressCard.addEventListener('click', function() {
    mapModal.style.display = 'block';
});

// Fermer la modal au clic sur le X
mapCloseBtn.addEventListener('click', function() {
    mapModal.style.display = 'none';
});

// Fermer la modal au clic en dehors du contenu
window.addEventListener('click', function(event) {
    if (event.target === mapModal) {
        mapModal.style.display = 'none';
    }
});

// Gestion de la modal Horaires
const hoursCard = document.getElementById('hoursCard');
const hoursModal = document.getElementById('hoursModal');
const hoursCloseBtn = document.getElementById('hoursCloseBtn');

// Ouvrir la modal au clic sur la carte horaires
hoursCard.addEventListener('click', function() {
    hoursModal.style.display = 'block';
});

// Fermer la modal au clic sur le X
hoursCloseBtn.addEventListener('click', function() {
    hoursModal.style.display = 'none';
});

// Fermer la modal au clic en dehors du contenu
window.addEventListener('click', function(event) {
    if (event.target === hoursModal) {
        hoursModal.style.display = 'none';
    }
});
