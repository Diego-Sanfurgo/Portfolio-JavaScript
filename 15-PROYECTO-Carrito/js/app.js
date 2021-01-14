//Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];


//Función donde registro/cargo todos los eventListeners
cargarEventListeners();
function cargarEventListeners() {
    //Cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];//reseteamos el arreglo

        limpiarHTML();//Eliminamos todo el HTML
    });

}

//Funciones
function agregarCurso(e) {

    e.preventDefault();
    /* Sin el preventDefault, al hacer click en el btn de agregar al carrito, hay un salto hacia arriba. 
    Esto pasa porque el enlace, en un ejemplo real, tiene un link al que te redirecciona, pero como 
    no tenemos ninguno, nos lleva hacia el principio de la página */

    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;

        leerDatosCurso(cursoSeleccionado);
    }
}

function eliminarCurso(e) {

    console.log(e.target.classList)
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        //Eliminar del arreglo articulosCarrito por el data-id
        //Nos trae todos excepto aquel que elejimos eliminar
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        carritoHTML(); //Iterar sobre el carrito y mostrar su HTML
    }

}

//Lee el contenido del HTML al que le damos click y extraer la información del curso
function leerDatosCurso(curso) {

    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1,

    }

    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        //Actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++
                return curso;//Retorna el objeto actualizado
            } else {
                return curso;//Retorna los objetos que no son duplicados
            }
        });
        articulosCarrito = [...cursos];

    } else {
        //Agrega elementos al areglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];

    }
    carritoHTML();
}


//Muestra el carrito de compras en el HTML
function carritoHTML() {
    //Limpiar el HTML
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso => {

        //Aplicamos destructuring
        const { imagen, titulo, precio, cantidad, id } = curso;

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>
            <img src = "${imagen}" width="100" >
        </td>
        <td> ${titulo} </td>
        <td> ${precio} </td>
        <td> ${cantidad} </td>
        <td> 
            <a href="#" class="borrar-curso" data-id="${id}"> X </a>
        </td>
        `;

        //Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });
}

//Elimina los cursos del tbody
function limpiarHTML() {
    //Forma lenta
    // contenedorCarrito.innerHTML = '';

    //Forma rápida/ de mejor performance
    //Se revisa que mientras el contenedor tenga elementos se ejecute el código para limpiar el HTML
    while (contenedorCarrito.firstChild) {
        //Elimino por referencia
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);

    }

}