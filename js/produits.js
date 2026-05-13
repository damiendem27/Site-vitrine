// Gestion du panier et des produits
(function(){
    // PANIER
    let cart = [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartCheckoutBtn = document.getElementById('cartCheckout');

    // Prix des différents types d'huile
    const oilPrices = {
        '5w30': 24.99,
        '5w40': 35.99,
        '10w40': 27.99,
        '15w40': 28.50,
        '0w20': 35.99
    };

    // Prix des différents types de filtres
    const filterPrices = {
        'air': 7.99,
        'huile': 9.99
    };
    // Images des différents types de filtres
    const filterImages = {
        'air': '../assets/images/filtreair.jpg',
        'huile': '../assets/images/filtrehuile.jpg'
    };
    // Prix des différents types de pneus
    const tirePrices = {
        '4saisons': 89.99,
        'ete': 84.99,
        'hiver': 94.99
    };

    // Images des différents types de pneus
    const tireImages = {
        '4saisons': '../assets/images/4saisons.jpg',
        'ete': '../assets/images/pneuete.jpg',
        'hiver': '../assets/images/pneushiver.png'
    };

    // Images des différents types de plaquettes
    const plaquetteImages = {
        'avant': '../assets/images/plaquettesavant.jpg',
        'arriere': '../assets/images/plaquettesar.jpg'
    };

    // Prix des pneus par type et taille
    const tirePricesBySize = {
        '4saisons': {
            '13': 65.99,
            '14': 69.99,
            '15': 75.99,
            '16': 82.99,
            '17': 89.99,
            '18': 98.99,
            '19': 108.99,
            '20': 119.99
        },
        'ete': {
            '13': 59.99,
            '14': 64.99,
            '15': 69.99,
            '16': 76.99,
            '17': 84.99,
            '18': 92.99,
            '19': 101.99,
            '20': 112.99
        },
        'hiver': {
            '13': 72.99,
            '14': 77.99,
            '15': 84.99,
            '16': 91.99,
            '17': 99.99,
            '18': 109.99,
            '19': 119.99,
            '20': 131.99
        }
    };

    function formatPrice(price) {
        return price.toLocaleString('fr-FR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        }) + '€';
    }

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Votre panier est vide</div>';
            cartCheckoutBtn.disabled = true;
        } else {
            cartCheckoutBtn.disabled = false;
            cart.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                
                let detailText = `Qté: ${item.quantity}`;
                if (item.oilType) {
                    detailText += ` • ${item.oilType}`;
                }
                if (item.filterType) {
                    detailText += ` • ${item.filterType}`;
                }
                if (item.tireType) {
                    detailText += ` • ${item.tireType}`;
                }
                if (item.tireSize) {
                    detailText += ` • ${item.tireSize}`;
                }
                if (item.plaquetteType) {
                    detailText += ` • ${item.plaquetteType}`;
                }
                
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-details">${detailText}</div>
                    </div>
                    <div class="cart-item-price">${formatPrice(item.totalPrice)}</div>
                    <button class="cart-item-remove" data-index="${index}">✕</button>
                `;
                
                cartItemsContainer.appendChild(itemEl);
            });
            
            // Ajouter les écouteurs de suppression
            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    cart.splice(index, 1);
                    updateCartDisplay();
                });
            });
        }
        
        // Mettre à jour le total
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        cartTotalElement.textContent = formatPrice(total);
    }

    function addToCart(productName, basePrice, quantity, oilType = null, filterType = null, tireType = null, tireSize = null, plaquetteType = null) {
        let finalPrice = basePrice;
        
        if (oilType) {
            finalPrice = oilPrices[oilType] || basePrice;
        } else if (filterType) {
            finalPrice = filterPrices[filterType] || basePrice;
        } else if (tireType && tireSize) {
            finalPrice = tirePricesBySize[tireType][tireSize] || basePrice;
        }
        
        const cartItem = {
            name: productName,
            quantity: quantity,
            unitPrice: finalPrice,
            totalPrice: finalPrice * quantity,
            oilType: oilType ? oilType.toUpperCase() : null,
            filterType: filterType ? (filterType === 'air' ? 'Filtre à air' : 'Filtre à huile') : null,
            tireType: tireType ? (tireType === '4saisons' ? '4 Saisons' : tireType.charAt(0).toUpperCase() + tireType.slice(1)) : null,
            tireSize: tireSize ? tireSize + '"' : null,
            plaquetteType: plaquetteType ? (plaquetteType === 'avant' ? 'Avant' : 'Arrière') : null
        };
        
        // Vérifier si le produit existe déjà
        const existingItem = cart.find(item => 
            item.name === productName && 
            item.oilType === cartItem.oilType &&
            item.filterType === cartItem.filterType &&
            item.tireType === cartItem.tireType &&
            item.tireSize === cartItem.tireSize &&
            item.plaquetteType === cartItem.plaquetteType
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
        } else {
            cart.push(cartItem);
        }
        
        updateCartDisplay();
    }

    // MODAL
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalClose = document.getElementById('modalClose');
    const quantityInput = document.getElementById('quantity');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const oilTypeSection = document.getElementById('oilTypeSection');
    const oilTypeSelect = document.getElementById('oilType');
    const filterTypeSection = document.getElementById('filterTypeSection');
    const filterTypeSelect = document.getElementById('filterType');
    const tireTypeSection = document.getElementById('tireTypeSection');
    const tireTypeSelect = document.getElementById('tireType');
    const tireSizeSection = document.getElementById('tireSizeSection');
    const tireSizeSelect = document.getElementById('tireSize');
    const plaquetteTypeSection = document.getElementById('plaquetteTypeSection');
    const plaquetteTypeSelect = document.getElementById('plaquetteType');
    const modalBuyBtn = document.getElementById('modalBuy');
    
    let currentPrice = 0;
    let currentPriceText = '';
    let isOilProduct = false;
    let isFilterProduct = false;
    let isTireProduct = false;
    let isPlaquetteProduct = false;
    
    function updateFilterImage(){
        if(isFilterProduct){
            const selectedFilter = filterTypeSelect.value;
            const newImageSrc = filterImages[selectedFilter] || '../assets/images/filtres.jpeg';
            modalImage.src = newImageSrc;
        }
    }
    
    function updateTireImage(){
        if(isTireProduct){
            const selectedTire = tireTypeSelect.value;
            const newImageSrc = tireImages[selectedTire] || '../assets/images/pneus.jpg';
            modalImage.src = newImageSrc;
        }
    }
    
    function updatePlaquetteImage(){
        if(isPlaquetteProduct){
            const selectedPlaquette = plaquetteTypeSelect.value;
            const newImageSrc = plaquetteImages[selectedPlaquette] || '../assets/images/plaquettes.jpg';
            modalImage.src = newImageSrc;
        }
    }
    
    function updatePrice(){
        const quantity = parseInt(quantityInput.value) || 1;
        let basePrice;
        
        if(isOilProduct){
            const selectedOil = oilTypeSelect.value;
            basePrice = oilPrices[selectedOil] || 24.99;
        } else if(isFilterProduct){
            const selectedFilter = filterTypeSelect.value;
            basePrice = filterPrices[selectedFilter] || 8.99;
        } else if(isTireProduct){
            const selectedTire = tireTypeSelect.value;
            const selectedSize = tireSizeSelect.value;
            basePrice = tirePricesBySize[selectedTire][selectedSize] || 89.99;
        } else {
            const priceMatch = currentPriceText.match(/[\d.,]+/);
            if(priceMatch){
                basePrice = parseFloat(priceMatch[0].replace(',', '.'));
            } else {
                basePrice = 0;
            }
        }
        
        const totalPrice = (basePrice * quantity).toFixed(2);
        const formattedPrice = formatPrice(totalPrice);
        modalPrice.textContent = formattedPrice;
    }

    function openModal(card){
        const img = card.querySelector('.produit-image img');
        const title = card.querySelector('.produit-info h3');
        const desc = card.querySelector('.produit-info p');
        const price = card.querySelector('.prix');
        
        modalImage.src = img ? img.src : '';
        modalImage.alt = title ? title.textContent : 'Produit';
        modalTitle.textContent = title ? title.textContent : '';
        modalDesc.textContent = (desc && desc.textContent) ? desc.textContent : '';
        currentPriceText = price ? price.textContent : '0€';
        quantityInput.value = 1;
        
        isOilProduct = (title && title.textContent === 'Huile Moteur');
        oilTypeSection.style.display = isOilProduct ? 'block' : 'none';
        oilTypeSelect.value = '5w30';
        
        isFilterProduct = (title && title.textContent === 'Filtres');
        filterTypeSection.style.display = isFilterProduct ? 'block' : 'none';
        filterTypeSelect.value = 'air';
        
        if(isFilterProduct) {
            updateFilterImage();
        }
        
        isTireProduct = (title && title.textContent === 'Pneus');
        tireTypeSection.style.display = isTireProduct ? 'block' : 'none';
        tireTypeSelect.value = '4saisons';
        tireSizeSection.style.display = isTireProduct ? 'block' : 'none';
        tireSizeSelect.value = '15';
        
        if(isTireProduct) {
            updateTireImage();
        }
        
        isPlaquetteProduct = (title && title.textContent === 'Plaquettes');
        plaquetteTypeSection.style.display = isPlaquetteProduct ? 'block' : 'none';
        plaquetteTypeSelect.value = 'avant';
        
        if(isPlaquetteProduct) {
            updatePlaquetteImage();
        }
        
        updatePrice();
        
        modal.classList.add('show');
        modal.setAttribute('aria-hidden','false');
    }

    function closeModal(){
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden','true');
    }

    document.querySelectorAll('.produit-card').forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    qtyMinus.addEventListener('click', () => {
        const val = parseInt(quantityInput.value) || 1;
        if(val > 1) quantityInput.value = val - 1;
        updatePrice();
    });

    qtyPlus.addEventListener('click', () => {
        const val = parseInt(quantityInput.value) || 1;
        if(val < 99) quantityInput.value = val + 1;
        updatePrice();
    });

    quantityInput.addEventListener('input', () => {
        let val = parseInt(quantityInput.value) || 1;
        if(val < 1) {
            quantityInput.value = 1;
        }
        if(val > 99) {
            quantityInput.value = 99;
        }
    });

    quantityInput.addEventListener('change', () => {
        let val = parseInt(quantityInput.value) || 1;
        if(val < 1) {
            quantityInput.value = 1;
        }
        if(val > 99) {
            quantityInput.value = 99;
        }
        updatePrice();
    });

    oilTypeSelect.addEventListener('change', updatePrice);
    filterTypeSelect.addEventListener('change', () => {
        updateFilterImage();
        updatePrice();
    });
    tireTypeSelect.addEventListener('change', () => {
        updateTireImage();
        updatePrice();
    });
    tireSizeSelect.addEventListener('change', updatePrice);
    plaquetteTypeSelect.addEventListener('change', () => {
        updatePlaquetteImage();
        updatePrice();
    });
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

    // Bouton Ajouter au panier (remplace l'ancien bouton Acheter)
    modalBuyBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value) || 1;
        const productName = modalTitle.textContent;
        
        let oilType = null;
        let filterType = null;
        let tireType = null;
        let tireSize = null;
        let plaquetteType = null;
        
        if (isOilProduct) {
            oilType = oilTypeSelect.value;
        } else if (isFilterProduct) {
            filterType = filterTypeSelect.value;
        } else if (isTireProduct) {
            tireType = tireTypeSelect.value;
            tireSize = tireSizeSelect.value;
        } else if (isPlaquetteProduct) {
            plaquetteType = plaquetteTypeSelect.value;
        }
        
        const priceMatch = currentPriceText.match(/[\d.,]+/);
        const basePrice = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : 0;
        
        addToCart(productName, basePrice, quantity, oilType, filterType, tireType, tireSize, plaquetteType);
        
        closeModal();
    });
    
    // Changer le texte du bouton
    modalBuyBtn.textContent = 'Ajouter au panier';

    // Gestion du checkout
    cartCheckoutBtn.addEventListener('click', () => {
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        let message = `COMMANDE - Montant total: ${formatPrice(total)}\n\nArticles commandés:\n`;
        
        cart.forEach((item, index) => {
            message += `\n${index + 1}. ${item.name}`;
            if (item.oilType) message += ` (${item.oilType})`;
            if (item.filterType) message += ` (${item.filterType})`;
            if (item.tireType) message += ` (${item.tireType}`;
            if (item.tireSize) message += ` - ${item.tireSize}`;
            if (item.tireType) message += ')';
            if (item.plaquetteType) message += ` (${item.plaquetteType})`;
            message += ` - Qté: ${item.quantity} - ${formatPrice(item.totalPrice)}`;
        });
        
        message += `\n\n--- Redirection vers paiement ---`;
        alert(message);
    });
})();

