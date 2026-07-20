document.addEventListener("DOMContentLoaded", () => {

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
        
    });

});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contador = document.getElementById("contador-carrito");
const lista = document.getElementById("lista-carrito");
const total = document.getElementById("total-carrito");

actualizarCarrito();

document.querySelectorAll(".btn-agregar-carrito").forEach(boton => {

    boton.addEventListener("click", () => {

        const producto = {

            nombre: boton.dataset.nombre,
            precio: parseFloat(boton.dataset.precio),
            imagen: boton.dataset.imagen,
            cantidad: 1

        };

        const existe = carrito.find(p => p.nombre === producto.nombre);

        if (existe) {

            existe.cantidad++;

        } else {

            carrito.push(producto);

        }

        guardarCarrito();

    });

});

function guardarCarrito() {

    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarCarrito();

}

function actualizarCarrito() {

    if (!contador || !lista || !total) return;

    lista.innerHTML = "";

    let totalCompra = 0;
    let cantidad = 0;

    carrito.forEach((producto, index) => {

        cantidad += producto.cantidad;

        totalCompra += producto.precio * producto.cantidad;

        lista.innerHTML += `

        <div class="item-carrito">

            <img src="${producto.imagen}" width="55">

            <div>

                <strong>${producto.nombre}</strong><br>

                S/ ${producto.precio}<br>

                Cantidad: ${producto.cantidad}

            </div>

            <button onclick="eliminarProducto(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

        `;

    });

    contador.textContent = cantidad;
    total.textContent = "S/ " + totalCompra.toFixed(2);

}

function eliminarProducto(i) {

    carrito.splice(i, 1);

    guardarCarrito();

}

const vaciar = document.getElementById("vaciar-carrito");

if (vaciar) {

    vaciar.addEventListener("click", () => {

        carrito = [];

        guardarCarrito();

    });

}

/* =====================================================
   ABRIR Y CERRAR EL CARRITO (AGREGAR ESTA PARTE)
===================================================== */

const iconCart = document.getElementById("icon-cart");
const cart = document.getElementById("cart");

if (iconCart && cart) {

    // El carrito inicia oculto
    cart.classList.remove("active");

    iconCart.addEventListener("click", function(e) {

        e.preventDefault();

        cart.classList.toggle("active");

    });

}