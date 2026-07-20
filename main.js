let carrito = JSON.parse(localStorage.getItem('axis_wear_cart')) || [];
document.addEventListener("DOMContentLoaded", () => {
    // ===== ACTIVAR CARRITO =====
    actualizarBurbujaHeader();
    inicializarSelectorTallas();
    inicializarBotonesAgregar();

    if (document.getElementById('cart-page-items-container')) {
        renderizarCarritoPagina();
        inicializarEventosCarrito();
    }

    // ===== BUSCADOR =====

    const inputSearch = document.getElementById("inputSearch");
    console.log(inputSearch) 
    const boxSearch = document.getElementById("box-search");

    if (!inputSearch || !boxSearch) return;

    inputSearch.addEventListener("keyup", function () {

        let filter = inputSearch.value.toUpperCase();

        let li = boxSearch.getElementsByTagName("li");

        let resultados = false;

        for(let i=0;i<li.length;i++){

            let texto = li[i].textContent.toUpperCase();

            if(texto.indexOf(filter)>-1){

                li[i].style.display="";

                resultados=true;

            }else{

                li[i].style.display="none";

            }

        }

        if(filter==""){

            boxSearch.style.display="none";

        }else{

            boxSearch.style.display=resultados?"block":"none";

        }
        
    }); // <- Este cierra el buscador

    // ===== ACTIVAR CARRITO =====
    actualizarBurbujaHeader();
    inicializarSelectorTallas();
    inicializarBotonesAgregar();

    if (document.getElementById('cart-page-items-container')) {
        renderizarCarritoPagina();
        inicializarEventosCarrito();
    }
}); // <- ESTE CIERRA TODO EL DOCUMENTO Y QUITA LA LÍNEA ROJA DE ERROR

// ===== FUNCIONES DEL CARRITO =====

function guardarCarrito() {
    localStorage.setItem('axis_wear_cart', JSON.stringify(carrito));
    actualizarBurbujaHeader();
}

function actualizarBurbujaHeader() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'inline-block';
        } else {
            badge.textContent = '';
            badge.style.display = 'none';
        }
    }
}

function inicializarSelectorTallas() {
    const contenedoresTallas = document.querySelectorAll('.selector-tallas');
    contenedoresTallas.forEach(contenedor => {
        const opciones = contenedor.querySelectorAll('span');
        opciones.forEach(opcion => {
            opcion.addEventListener('click', () => {
                opciones.forEach(o => o.classList.remove('activa'));
                opcion.classList.add('activa');
            });
        });
    });
}

function inicializarBotonesAgregar() {
    const botones = document.querySelectorAll('.btn-agregar-carrito');
    botones.forEach(boton => {
        // Quitamos cualquier evento previo para evitar duplicados
        boton.replaceWith(boton.cloneNode(true));
    });

    // Volvemos a capturar los botones limpios
    const botonesLimpios = document.querySelectorAll('.btn-agregar-carrito');
    botonesLimpios.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Evita que se dispare dos veces

            const card = e.target.closest('.prod-card-col');
            if (!card) return;

            const id = card.getAttribute('data-id') || card.querySelector('h3').textContent.trim().toLowerCase().replace(/\s+/g, '-');
            const titulo = card.querySelector('h3').textContent.trim();
            const precioTexto = card.querySelector('.precio').textContent.replace('S/', '').trim();
            const precio = parseFloat(precioTexto);
            const imagen = card.querySelector('.img-wrapper img').src;
            
            const tallaActiva = card.querySelector('.selector-tallas span.activa');
            if (!tallaActiva) {
                alert('Por favor, selecciona una talla antes de agregar el producto.');
                return;
            }
            const talla = tallaActiva.textContent.trim();

            agregarAlCarrito(id, titulo, precio, imagen, talla);
        });
    });
}

function agregarAlCarrito(id, titulo, precio, imagen, talla) {
    const itemExistente = carrito.find(item => item.id === id && item.talla === talla);
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ id, titulo, precio, imagen, talla, cantidad: 1 });
    }
    guardarCarrito();
}

function renderizarCarritoPagina() {
    const container = document.getElementById('cart-page-items-container');
    const subtotalSpan = document.getElementById('cart-page-subtotal');
    const totalSpan = document.getElementById('cart-page-total');
    if (!container) return;

    if (carrito.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 0; font-family: Arial, sans-serif;">
                <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; color: #ccc; margin-bottom: 15px; display: block;"></i>
                <p style="color: #666; font-size: 1.1rem; margin-bottom: 20px;">Tu carrito está vacío.</p>
                <a href="polos.html" style="display: inline-block; background: #111; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px;">Volver a la Tienda</a>
            </div>
        `;
        if (subtotalSpan) subtotalSpan.textContent = '0.00';
        if (totalSpan) totalSpan.textContent = '0.00';
        return;
    }

    let html = '';
    let subtotal = 0;

    carrito.forEach((item, index) => {
        subtotal += item.precio * item.cantidad;
        html += `
            <div class="cart-item-card" data-index="${index}">
                <img src="${item.imagen}" alt="${item.titulo}">
                <div class="cart-item-details">
                    <h4>${item.titulo}</h4>
                    <div class="cart-item-meta">
                        <span>Talla: <strong>${item.talla}</strong></span>
                        <span>Precio: <strong>S/ ${item.precio.toFixed(2)}</strong></span>
                    </div>
                    <div class="cart-qty-control">
                        <button class="cart-qty-btn decrease" data-index="${index}">-</button>
                        <span class="cart-qty-value">${item.cantidad}</span>
                        <button class="cart-qty-btn increase" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="btn-remove-item" data-index="${index}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
    if (subtotalSpan) subtotalSpan.textContent = subtotal.toFixed(2);
    if (totalSpan) totalSpan.textContent = subtotal.toFixed(2);
}

function inicializarEventosCarrito() {
    const container = document.getElementById('cart-page-items-container');
    if (container) {
        // Clonamos para limpiar eventos viejos acumulados
        const nuevoContainer = container.cloneNode(true);
        container.parentNode.replaceChild(nuevoContainer, container);

        nuevoContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            const target = e.target.closest('button');
            if (!target) return;

            const index = parseInt(target.getAttribute('data-index'));
            if (isNaN(index) || !carrito[index]) return;

            if (target.classList.contains('increase')) {
                carrito[index].cantidad += 1;
                guardarCarrito();
                renderizarCarritoPagina();
                inicializarEventosCarrito(); // Re-vincula eventos al rediseñar
            } else if (target.classList.contains('decrease')) {
                if (carrito[index].cantidad > 1) {
                    carrito[index].cantidad -= 1;
                } else {
                    // Solo elimina si el usuario confirma o si realmente es el último
                    carrito.splice(index, 1);
                }
                guardarCarrito();
                renderizarCarritoPagina();
                inicializarEventosCarrito(); // Re-vincula eventos al rediseñar
            } else if (target.classList.contains('btn-remove-item')) {
                carrito.splice(index, 1);
                guardarCarrito();
                renderizarCarritoPagina();
                inicializarEventosCarrito(); // Re-vincula eventos al rediseñar
            }
        });
    }

    const clearBtn = document.getElementById('cart-page-clear-btn');
    if (clearBtn) {
        clearBtn.replaceWith(clearBtn.cloneNode(true));
        const nuevoClearBtn = document.getElementById('cart-page-clear-btn');
        nuevoClearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Estás seguro de que quieres vaciar todo tu carrito?')) {
                carrito = [];
                guardarCarrito();
                renderizarCarritoPagina();
            }
        });
    }

    // ===== CONTROL DE LA VENTANA MODAL DE PAGO =====
    const checkoutBtn = document.getElementById('cart-page-checkout-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closePaymentModal = document.getElementById('close-payment-modal');
    const paymentForm = document.getElementById('payment-form');
    
    if (checkoutBtn && paymentModal) {
        // Al darle clic a Proceder al Pago, abre la ventana flotante
        checkoutBtn.replaceWith(checkoutBtn.cloneNode(true));
        const nuevoCheckoutBtn = document.getElementById('cart-page-checkout-btn');
        
        nuevoCheckoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (carrito.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }
            paymentModal.style.display = 'flex';
        });

        // Cerrar ventana desde la 'X'
        closePaymentModal.addEventListener('click', () => {
            paymentModal.style.display = 'none';
        });

        // Intercambiar campos según el método elegido (Tarjeta o QR)
        const radioMethods = paymentForm.querySelectorAll('input[name="method"]');
        const cardFields = document.getElementById('card-fields');
        const qrFields = document.getElementById('qr-fields');

        radioMethods.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'card') {
                    cardFields.style.display = 'block';
                    qrFields.style.display = 'none';
                    cardFields.querySelectorAll('input').forEach(i => i.required = true);
                } else {
                    cardFields.style.display = 'none';
                    qrFields.style.display = 'block';
                    cardFields.querySelectorAll('input').forEach(i => i.required = false);
                }
            });
        });

        // Envío del formulario y confirmación de pago efectuado
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            alert('¡El pago fue efectuado exitosamente!');
            
            // Vaciar carrito tras la compra exitosa
            carrito = [];
            guardarCarrito();
            renderizarCarritoPagina();
            paymentModal.style.display = 'none';
            paymentForm.reset();
        });
    }
}