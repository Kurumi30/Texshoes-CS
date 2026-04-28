document.addEventListener('DOMContentLoaded', async () => {
    const cartContainer = document.getElementById('cart-container');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartCounter = document.getElementById('cart-counter');
    const cartHeader = document.getElementById('cart-header'); // Pega o novo cabeçalho

    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');

    // Função central para atualizar toda a visualização do carrinho
    function updateCartView(cart) {
        const items = cart?.items?.$values || cart?.items || [];
        
        if (!items || items.length === 0) {
            cartContainer.innerHTML = '';
            showEmptyCartMessage();
            if (cartCounter) cartCounter.textContent = '0';
        } else {
            renderCartItems(items);
            updateCartSummary(items);
            if (cartCounter) {
                const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
                cartCounter.textContent = totalItems;
            }
            cartHeader.style.display = 'grid'; // Mostra o cabeçalho
            cartSummary.style.display = 'block';
            emptyCartMessage.style.display = 'none';
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    }

    function renderCartItems(items) {
        cartContainer.innerHTML = items.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.shoe.image}" alt="${item.shoe.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="item-info">
                        <h3 class="item-name">${item.shoe.name}</h3>
                        <p class="item-category">${item.shoe.category}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-increase">+</button>
                    </div>
                    <p class="item-price">${formatPrice(item.shoe.price)}</p>
                    <p class="item-total-price">${formatPrice(item.shoe.price * item.quantity)}</p>
                     <div class="item-remove">
                        <button class="remove-btn"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function updateCartSummary(items) {
        const subtotal = items.reduce((sum, item) => sum + (item.shoe.price * item.quantity), 0);
        summarySubtotal.textContent = formatPrice(subtotal);
        summaryTotal.textContent = formatPrice(subtotal); // Total ainda é igual ao subtotal
    }
    
    // Atualizada para esconder o cabeçalho
    function showEmptyCartMessage() {
        if (cartHeader) cartHeader.style.display = 'none';
        cartSummary.style.display = 'none';
        emptyCartMessage.style.display = 'block';
    }

    async function loadCart() {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) {
             showEmptyCartMessage();
             if (cartCounter) cartCounter.textContent = '0';
            return;
        }
        try {
            const response = await fetch(`/api/cart/${cartId}`);
            if (response.ok) {
                const cart = await response.json();
                updateCartView(cart);
            } else {
                throw new Error('Cart not found');
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            showEmptyCartMessage();
        }
    }

    cartContainer.addEventListener('click', async (e) => {
        const itemElement = e.target.closest('.cart-item');
        if (!itemElement) return;

        const itemId = itemElement.dataset.itemId;
        let url;
        let method = 'POST';

        if (e.target.closest('.quantity-increase')) {
            url = `/api/cart/item/${itemId}/increase`;
        } else if (e.target.closest('.quantity-decrease')) {
            url = `/api/cart/item/${itemId}/decrease`;
        } else if (e.target.closest('.remove-btn')) {
            url = `/api/cart/item/${itemId}`;
            method = 'DELETE';
        } else {
            return;
        }

        itemElement.querySelectorAll('button').forEach(btn => btn.disabled = true);

        try {
            const response = await fetch(url, { method });
            if (response.ok) {
                const updatedCart = await response.json();
                updateCartView(updatedCart);
            } else {
                itemElement.querySelectorAll('button').forEach(btn => btn.disabled = false);
                console.error('Failed to update item:', await response.text());
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
            itemElement.querySelectorAll('button').forEach(btn => btn.disabled = false);
        }
    });

    loadCart();
});
