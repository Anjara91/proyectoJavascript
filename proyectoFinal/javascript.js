document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productos');
    const listaCarrito = document.getElementById("lista-carrito");
    const totalSpan = document.getElementById("total");
    const carrito = [];

    // Inicializar la web
    const init = () => {
        mostrarProductos();
        configurarEventos();
    };

    // Mostrar los productos en la página
    const mostrarProductos = () => {
        productos.forEach(producto => {   
            const divProducto = crearProductoElemento(producto);
            productosContainer.appendChild(divProducto);
        });
    };

    // Crear un elemento para cada producto
    const crearProductoElemento = (producto) => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');
        divProducto.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>Precio: ${(producto.precio).toFixed(2)} €</p>
            <p>Stock: ${producto.stock}</p>
            <button id="agregar-${producto.id}" data-id="${producto.id}">Agregar al Carrito</button>
        `;

        const botonAgregar = divProducto.querySelector(`button[id="agregar-${producto.id}"]`);
        botonAgregar.addEventListener("click", () => agregarAlCarrito(producto));
        return divProducto;
    };

    // Agregar producto al carrito
    const agregarAlCarrito = (producto) => {
        if (producto.stock === 0) {  
            alert('No hay unidades disponibles para ' + producto.nombre);
            return;
        }

        const productoEnCarrito = carrito.find(item => item.id === producto.id);
        if (productoEnCarrito) {
            if (productoEnCarrito.cantidad < producto.stock) {   
                productoEnCarrito.cantidad++;
            } else {
                alert('No hay suficiente stock');
                return;
            }
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        actualizarCarrito();
    };

    // Actualizar la vista del carrito
    const actualizarCarrito = () => {
        listaCarrito.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {   
            const fila = crearFilaCarrito(item);  
            listaCarrito.appendChild(fila);
            total += item.precio * item.cantidad;
        });

        totalSpan.textContent = total.toFixed(2);
        actualizarContadorCarrito();
    };

    // Crear una fila en el carrito para un producto
    const crearFilaCarrito = (item) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>
                <button class="btn-restar" data-id="${item.id}">-</button>
                ${item.cantidad}
                <button class="btn-sumar" data-id="${item.id}">+</button>
            </td>
            <td>${(item.precio).toFixed(2)} €</td>
            <td>${(item.precio * item.cantidad).toFixed(2)} €</td>
            <td><button class="btn-eliminar" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button></td>
        `;

        agregarEventosFila(fila, item);
        return fila;
    };

    // Agregar eventos a los botones de la fila del carrito
    const agregarEventosFila = (fila, item) => {
        fila.querySelector('.btn-sumar').addEventListener('click', (event) => {
            event.stopPropagation();
            agregarCantidad(item);
        });
        fila.querySelector('.btn-restar').addEventListener('click', (event) => {
            event.stopPropagation();
            restarCantidad(item);
        });
        fila.querySelector('.btn-eliminar').addEventListener('click', (event) => {
            event.stopPropagation();
            eliminarProducto(item);
        });
    };

    // Eliminar un producto del carrito
    const eliminarProducto = (item) => {
        carrito.splice(carrito.indexOf(item), 1);
        actualizarCarrito();
    };

    // Aumentar la cantidad de un producto en el carrito
    const agregarCantidad = (item) => {
        const producto = productos.find(prod => prod.id === item.id);
        if (item.cantidad < producto.stock) {
            item.cantidad++;
            actualizarCarrito();
        } else {
            alert('No hay suficiente stock para sumar.');
        }
    };

    // Disminuir la cantidad de un producto en el carrito
    const restarCantidad = (item) => {
        if (item.cantidad > 1) {
            item.cantidad--;
            actualizarCarrito();
        } else {
            eliminarProducto(item);
        }
    };

    // Actualizar el contador de productos en el carrito
    const actualizarContadorCarrito = () => {
        const contador = document.getElementById('contador-carrito');
        const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalProductos;
    };

    // Configuración de eventos para el carrito
    const configurarEventos = () => {
        document.getElementById('toggle-carrito').addEventListener('click', (event) => {
            event.stopPropagation();
            document.getElementById('carrito').classList.toggle('oculto');
        });

        document.addEventListener('click', (event) => {
            const carritoElement = document.getElementById('carrito');
            const toggleCarritoBtn = document.getElementById('toggle-carrito');
            if (!carritoElement.contains(event.target) && !toggleCarritoBtn.contains(event.target)) {
                carritoElement.classList.add('oculto');
            }
        });

        document.getElementById('comprar').addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('El carrito está vacío');
            } else {
                alert('Compra realizada con éxito');
                carrito.length = 0; 
                totalSpan.textContent = '0.00';
                listaCarrito.innerHTML = '';
                productos.forEach(prod => prod.stock = 15); 
                actualizarContadorCarrito();
            }
        });
    };

    init();
});
