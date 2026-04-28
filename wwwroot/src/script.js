function openModal(modal) {
  if (!modal) return

  modal.classList.add('active')
  modal.setAttribute('aria-hidden', 'false')
}

function closeModal(modal) {
  if (!modal) return

  modal.classList.remove('active')
  modal.setAttribute('aria-hidden', 'true')
}

// Função auxiliar para obter os itens do carrinho de forma robusta
function getItemsFromCart(cart) {
  if (!cart || !cart.items) {
    return [];
  }
  // Se a API retornar com a sintaxe de preservação de referência ($values)
  if (cart.items.$values) {
    return cart.items.$values;
  }
  // Caso contrário, retorna o array de itens diretamente
  return cart.items;
}

document.addEventListener('DOMContentLoaded', async () => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel)
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel))

  const menuToggle = $('#menu-toggle')
  const navMenu = $('#nav-menu')
  const navLinks = $$('.nav-link')

  const imageModal = $('#image-modal')
  const imageModalImg = $('#modal-image')
  const imageModalClose = imageModal ? $('.modal-close', imageModal) : null

  const sizeGuideModal = $('#size-guide-modal')
  const sizeGuideClose = sizeGuideModal ? $('.size-guide-close', sizeGuideModal) : null

  const purchaseModal = $('#purchase-modal')
  const purchaseProductName = $('#purchase-product-name')
  const purchaseWhatsapp = $('#purchase-whatsapp')
  const purchaseInstagram = $('#purchase-instagram')
  const purchaseClose = purchaseModal ? $('.purchase-close', purchaseModal) : null

  const productGrid = $('.product-grid')
  const cartCounter = $('#cart-counter')
  const PAGE_SIZE = 8

  const setMenuIcons = open => {
    if (!menuToggle) return

    menuToggle.classList.toggle('fa-times', open)
    menuToggle.classList.toggle('fa-bars', !open)
  }

  const closeMobileMenu = () => {
    if (!navMenu) return

    navMenu.classList.remove('active')

    setMenuIcons(false)
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const opening = !navMenu.classList.contains('active')

      navMenu.classList.toggle('active')

      setMenuIcons(opening)
    })
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) closeMobileMenu()
    })
  })

  const closeAllModals = () => {
    closeModal(imageModal)
    closeModal(sizeGuideModal)
    closeModal(purchaseModal)

    if (imageModalImg) imageModalImg.classList.remove('zoomed')
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals()
  })

  function formatPrice(value) {
    if (typeof value === 'number') return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  
    if (typeof value === 'string' && value.trim().length > 0) return value

    return ''
  }

  // Função que busca os dados do carrinho e atualiza o contador na UI
  async function updateCartCounter() {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
        if(cartCounter) cartCounter.textContent = '0';
        return;
    }
    try {
        const response = await fetch(`/api/cart/${cartId}`);
        if (response.ok) {
            const cart = await response.json();
            // Usa a função auxiliar para garantir que os itens sejam lidos corretamente
            const items = getItemsFromCart(cart); 
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            if (cartCounter) cartCounter.textContent = totalItems;
        } else {
            if (cartCounter) cartCounter.textContent = '0';
        }
    } catch (error) {
        if (cartCounter) cartCounter.textContent = '0';
    }
  }

  // Função que lida com a adição de um item ao carrinho
  async function handleAddToCart(shoeId, button) {
    if (!shoeId) return;

    const originalText = button.textContent;
    button.textContent = 'Adicionando...';
    button.disabled = true;

    let cartId = localStorage.getItem('cartId');

    try {
        const response = await fetch(`/api/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                shoeId: parseInt(shoeId),
                cartId: cartId ? parseInt(cartId) : null 
            }),
        });

        if (response.ok) {
            const cart = await response.json();
            localStorage.setItem('cartId', cart.id);
            
            // *** AQUI ESTÁ A CORREÇÃO REAL ***
            // A função `updateCartCounter` é chamada, e ela agora sabe como ler a resposta.
            await updateCartCounter();

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Adicionado ao carrinho!',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            });

            button.textContent = 'Adicionado!';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        } else {
            throw new Error('Failed to add to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        button.textContent = 'Erro!';
         setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
    }
  }

  function renderProductCards(items = []) {
    return items.map(p => `
      <article class="product-card" data-category="${p.category}">
        <div class="product-image-wrapper" aria-hidden="true">
          <img src="${p.image}" loading="lazy" alt="${p.name}" class="product-image">
        </div>
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-category">${(p.category || '').charAt(0).toUpperCase() + (p.category || '').slice(1)}</p>
          <p class="product-price">${formatPrice(p.price)}</p>
          <a href="#" class="size-guide-link">Guia de Medidas</a>
          <div class="product-buttons">
            <button class="button add-to-cart-btn" data-shoe-id="${p.id}">Adicionar ao Carrinho</button>
            <button class="button-secondary purchase-btn">Comprar agora</button>
          </div>
        </div>
      </article>
    `).join('')
  }

  let currentPage = 1
  let allProducts = []
  let selectedCategory = 'all'
  let currentFiltered = []

  function renderProductsPage(page = 1, append = false) {
    if (!productGrid) return

    if (!allProducts.length) {
      productGrid.innerHTML = '<p class="no-products" style="text-align:center;">Nenhum produto disponível.</p>'
      currentFiltered = []
      updateLoadMoreButton()
      
      return
    }

    currentFiltered = selectedCategory === 'all'
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory)

    const start = (page - 1) * PAGE_SIZE
    const slice = currentFiltered.slice(start, start + PAGE_SIZE)

    if (!slice.length && page === 1) {
      productGrid.innerHTML = '<p class="no-products" style="text-align:center;">Nenhum produto encontrado nessa categoria.</p>'
    } else if (append) {
      productGrid.insertAdjacentHTML('beforeend', renderProductCards(slice))
    } else {
      productGrid.innerHTML = renderProductCards(slice)
    }

    updateLoadMoreButton()
  }

  function updateLoadMoreButton() {
    if (!productGrid) return

    const existingBtn = document.getElementById('load-more-btn')
    const total = Array.isArray(currentFiltered) ? currentFiltered.length : (allProducts.length || 0)
    const loaded = currentPage * PAGE_SIZE
    const hasMore = loaded < total

    if (hasMore) {
      if (!existingBtn) {
        const btn = document.createElement('button')

        btn.id = 'load-more-btn'
        btn.className = 'button'
        btn.textContent = 'Ver mais'
        btn.style.display = 'block'
        btn.style.margin = '30px auto 0'
        btn.addEventListener('click', () => {
          currentPage++

          renderProductsPage(currentPage, true)
        })
        productGrid.parentNode.appendChild(btn)
      }
    } else {
      if (existingBtn) existingBtn.remove()
    }
  }

  function attachProductDelegation() {
    const categoryCards = $$('.category-card')

    if (categoryCards.length) {
      const clearActive = () => categoryCards.forEach(c => c.classList.remove('active-category'))

      categoryCards.forEach(card => {
        card.addEventListener('click', e => {
          e.preventDefault()

          clearActive()
          card.classList.add('active-category')

          selectedCategory = card.dataset.category || 'all'
          currentPage = 1
          renderProductsPage(currentPage, false)

          if (navMenu && navMenu.classList.contains('active')) closeMobileMenu()
        })
      })
    }

    if (!productGrid) return

    productGrid.addEventListener('click', e => {
      const productCard = e.target.closest('.product-card');
      if (!productCard) return;

      const addToCartBtn = e.target.closest('.add-to-cart-btn');
      if (addToCartBtn) {
        e.preventDefault();
        const shoeId = addToCartBtn.dataset.shoeId;
        handleAddToCart(shoeId, addToCartBtn);
        return;
      }

      const purchaseBtn = e.target.closest('.purchase-btn');
      if (purchaseBtn) {
        e.preventDefault();
        const name = $('.product-name', productCard)?.textContent.trim() || 'produto';
        const price = $('.product-price', productCard)?.textContent.trim() || '';
        if (purchaseProductName) purchaseProductName.textContent = `${name} ${price}`;
        const whatsappText = encodeURIComponent(`Olá, gostaria de comprar: ${name} ${price}`);
        if (purchaseWhatsapp) purchaseWhatsapp.href = `https://wa.me/5511910076475?text=${whatsappText}`;
        if (purchaseInstagram) purchaseInstagram.href = 'https://www.instagram.com/texshoes_/';
        openModal(purchaseModal);
        return;
      }

      const sizeLink = e.target.closest('.size-guide-link');
      if (sizeLink) {
        e.preventDefault();
        openModal(sizeGuideModal);
        return;
      }

      const imgWrap = e.target.closest('.product-image-wrapper');
      if (imgWrap && imageModal && imageModalImg) {
        const img = $('.product-image', imgWrap);
        if (!img || !img.src) return;
        imageModalImg.src = img.src;
        imageModalImg.alt = img.alt || '';
        imageModalImg.classList.remove('zoomed');
        openModal(imageModal);
        return;
      }
    });
  }

  function setupModalControls() {
    if (imageModal && imageModalImg) {
      if (imageModalClose) imageModalClose.addEventListener('click', () => {
        imageModalImg.classList.remove('zoomed')

        closeModal(imageModal)
      })

      imageModalImg.addEventListener('click', e => {
        e.stopPropagation()

        imageModalImg.classList.toggle('zoomed')
      })

      imageModal.addEventListener('click', e => {
        if (e.target === imageModal) {
          imageModalImg.classList.remove('zoomed')

          closeModal(imageModal)
        }
      })
    }

    if (sizeGuideModal) {
      if (sizeGuideClose) sizeGuideClose.addEventListener('click', () => closeModal(sizeGuideModal))

      sizeGuideModal.addEventListener('click', e => {
        if (e.target === sizeGuideModal) closeModal(sizeGuideModal)
      })
    }

    if (purchaseModal) {
      if (purchaseClose) purchaseClose.addEventListener('click', () => closeModal(purchaseModal))

      purchaseModal.addEventListener('click', e => {
        if (e.target === purchaseModal) closeModal(purchaseModal)
      })
    }
  }

  // Carrega o contador inicial na abertura da página
  updateCartCounter();

    try {
        const resp = await fetch('api/Shoes');

        if (!resp.ok) {
            console.error('Verifique se o arquivo stock.json existe e está preenchido corretamente.');
            return;
        }

        const data = await resp.json();
        const products = getItemsFromCart({ items: data }) || data; // Usa a função auxiliar para os produtos também

        if (!products || !products.length) {
            throw new Error('Nenhum produto encontrado no estoque.');
        }

        allProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            image: p.image,
        }));

        currentPage = 1;
        selectedCategory = 'all';

        renderProductsPage(currentPage);
        attachProductDelegation();
        setupModalControls();
    } catch (err) {
        console.error('Erro carregando produtos:', err);
        productGrid.innerHTML = '<p class="no-products" style="text-align:center;">Erro ao carregar os produtos. Tente novamente mais tarde.</p>'
    }
});
