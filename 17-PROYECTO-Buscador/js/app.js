//VARIABLES
const marca = document.querySelector('#marca');
const year = document.querySelector('#year');
const precioMinimo = document.querySelector('#minimo');
const precioMaximo = document.querySelector('#maximo');
const puertas = document.querySelector('#puertas');
const transmision = document.querySelector('#transmision');
const color = document.querySelector('#color');

//Contenedor de los resultados
const resultado = document.querySelector('#resultado');
const maxYear = new Date().getFullYear();//Toma el año actual y no es necesario cambiarlo manualmente
const minYear = maxYear - 10;

//Generar un objeto con la búsqueda
const datosBusqueda = {
    marca: '',
    year: '',
    precioMin: '',
    precioMax: '',
    puertas: '',
    transmision: '',
    color: '',

}

//Event Listener para los select de búsqueda
//"Change" se ejecuta cuando se cambia el valor del Select
marca.addEventListener('change', e => {
    datosBusqueda.marca = e.target.value;
    filtrarAutos();
});

year.addEventListener('change', e => {
    datosBusqueda.year = e.target.value;
    filtrarAutos();
});

precioMinimo.addEventListener('change', e => {
    datosBusqueda.precioMin = e.target.value;
    filtrarAutos();
});

precioMaximo.addEventListener('change', e => {
    datosBusqueda.precioMax = e.target.value;
    filtrarAutos();
});

puertas.addEventListener('change', e => {
    datosBusqueda.puertas = e.target.value;
    filtrarAutos();
});

transmision.addEventListener('change', e => {
    datosBusqueda.transmision = e.target.value;
    filtrarAutos();
});

color.addEventListener('change', e => {
    datosBusqueda.color = e.target.value;
    filtrarAutos();
});



//EVENTOS
//Muestra los autos al cargar
document.addEventListener('DOMContentLoaded', mostrarAutos(autos));

//Llena las opciones de "años"
llenarSelect();

function mostrarAutos(autos) {

    //Creo una tabla para mostrar los resultados
    const tabla = document.createElement('table');
    tabla.innerHTML = `
        <thead> 
            <tr>
                <th> Marca </th>
                <th> Año </th>
                <th> Modelo </th>
                <th> Precio </th>
                <th> Puertas </th>
                <th> Transmisión </th>
                <th> Color </th>
            </tr>     
        </thead>
        
        <tbody> 
        
        </tbody>        
        `;

    limpiarHTML();
    autos.forEach(auto => {

        //Destructuring del auto
        const { marca, modelo, year, precio, puertas, color, transmision } = auto;

        /* const autoHTML = document.createElement('p');        
        autoHTML.textContent = `
        ${marca} ${modelo} - ${year} - ${puertas} Puertas -
        Precio: $${precio} - Transmisión: ${transmision} - Color: ${color} 
        `;
        resultado.appendChild(autoHTML) */


        const row = document.createElement('tr');
        row.innerHTML = `
        <td> ${marca} </td>
        <td> ${modelo} </td>
        <td> ${year} </td>
        <td> ${precio} </td>
        <td> ${puertas} </td>
        <td> ${color} </td>
        <td> ${transmision} </td>
        `;

        //Insertar en el HTML
        tabla.appendChild(row);
        resultado.appendChild(tabla)

    });
}

//Limpiar HTML
function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

//Llenar los años
function llenarSelect() {

    for (let i = maxYear; i >= minYear; i--) {
        const opcion = document.createElement('option');//Etiqueta de "Select"
        opcion.value = i;
        opcion.textContent = i;
        year.appendChild(opcion)//Agrega las opciones de año al select

    }

}

//Función que filtra en base a la búsqueda
function filtrarAutos() {
    //Normalmente sería un arrow function pero le pasamos funciones como parámetros en este caso
    //Función de orden superior
    const resultado = autos.filter(filtrarMarca).filter(filtrarYear).filter(filtrarMinimo).filter(filtrarMaximo)
        .filter(filtrarPuertas).filter(filtrarTransmision).filter(filtrarColor);

    console.log(resultado)
    if (resultado.length) {
        mostrarAutos(resultado);
    } else {
        noResultado();
    }
}

function noResultado() {
    limpiarHTML();

    const noResultado = document.createElement('div');
    noResultado.classList.add('alerta', 'error');
    noResultado.textContent = 'No hay resultados, intenta con otras características';
    resultado.appendChild(noResultado);
}


function filtrarMarca(auto) {
    const { marca } = datosBusqueda;
    //Si esta parte NO está vacía, se ejecuta el filtrado
    if (marca) {
        return auto.marca === marca;
    }
    return auto;
}

function filtrarYear(auto) {
    const { year } = datosBusqueda;
    //Si esta parte NO está vacía, se ejecuta el filtrado
    if (year) {
        return auto.year === parseInt(year);
    }
    return auto;
}

function filtrarMinimo(auto) {
    const { precioMin } = datosBusqueda;
    //Si esta parte NO está vacía, se ejecuta el filtrado
    if (precioMin) {
        return auto.precio >= precioMin;
    }
    return auto;
}

function filtrarMaximo(auto) {
    const { precioMax } = datosBusqueda;
    //Si esta parte NO está vacía, se ejecuta el filtrado
    if (precioMax) {
        return auto.precio <= precioMax;
    }
    return auto;
}

function filtrarPuertas(auto) {
    const { puertas } = datosBusqueda;
    //Si esta parte NO está vacía, se ejecuta el filtrado
    if (puertas) {
        return auto.puertas === parseInt(puertas);
    }
    return auto;
}

function filtrarTransmision(auto) {
    const { transmision } = datosBusqueda;
    //Si esta parte NO está vacía, se ejecuta el filtrado
    if (transmision) {
        return auto.transmision === transmision;
    }
    return auto;

}

function filtrarColor(auto) {
    const { color } = datosBusqueda;
    //Si esta parte NO está vacía, se ejecuta el filtrado
    if (color) {
        return auto.color === color;
    }
    return auto;
}