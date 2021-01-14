//VARIABLES
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets');
const btnVaciar = document.createElement('a');
let tweets = [];


//EVENT LISTENERS
eventListeners();
function eventListeners() {
    //Cuando se agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    //Cuando el documento está listo
    document.addEventListener('DOMContentLoaded', () => {
        /* Si el arreglo está vacío, devuelve un null y no se puede crear el HTML porque da error 
        en el foreach (No se puede aplicar un foreach a un null) */

        //Lo que hace el operador OR es: si el elemento de la izq es Null, asignarlo como un arreglo vacío
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];

        crearHTML();
    });

    //Vaciar toda la lista
    btnVaciar.addEventListener('click', vaciarTweets);
}


//FUNCIONES
function agregarTweet(e) {
    e.preventDefault();

    //Text area donde escribe el usuario
    const tweet = document.querySelector('#tweet').value;

    //Validación
    if (tweet === '') {
        mostrarError('Un mensaje no puede estar vacío');
        return;//evita que se ejecute el resto del código
    }

    const tweetObj = {
        id: Date.now(),//Simula el ID
        tweet,
        //Cuando la llave y valor tienen el mismo nombre como (tweet: tweet), se puede dejar una sola palabra
    }

    //Añadir al arreglo de tweets
    tweets = [...tweets, tweetObj];

    crearHTML();

    //Reiniciar el formulario
    formulario.reset();
}

//Mostrar mensaje de error
function mostrarError(msjError) {
    const mensajeError = document.createElement('p');
    mensajeError.textContent = msjError;
    mensajeError.classList.add('error');

    //Insertar en el HTML
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError);

    //Elimina la alerta luego de 3 segundos
    setTimeout(() => {
        mensajeError.remove();
    }, 3000);

}

//Mostrar listado de los tweets
function crearHTML() {
    limpiarHTML();

    if (tweets.length > 0) {
        tweets.forEach(twt => {
            //Crear un btn para eliminar
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            btnEliminar.innerText = 'X';

            //Crear btn para vaciar la lista
            btnVaciar.classList.add('borrar-tweet');
            btnVaciar.innerText = 'VACIAR LISTA';

            //Añadir la función de eliminar
            //Cuando hay que pasarle parámetros, tiene que hacerse de esta forma
            btnEliminar.onclick = () => {
                borrarTweet(twt.id);
            }

            //Crear el HTML
            const li = document.createElement('li');

            //Añadir el texto
            li.innerText = twt.tweet;
            //Añadir el botón
            li.appendChild(btnEliminar);

            //Insertarlo en el HTML
            listaTweets.appendChild(li);
            //Añadir btn para vaciar
            listaTweets.appendChild(btnVaciar);
        });
    } else {//AGREGADO EXTRA
        const msjeSimple = document.createElement('p');
        msjeSimple.textContent = "¡Agrega unos tweets aquí!";
        msjeSimple.style.color = 'blue';
        msjeSimple.style.paddingLeft = '130px';
        listaTweets.appendChild(msjeSimple);
    }

    sincronizarStorage();
}

//Limpiar el HTML
function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}

//Agrega los tweets actuales a localStorage
function sincronizarStorage() {
    //Si está vacío, se guarda un arreglo vacío en localStorage
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

//Eliminar tweet
function borrarTweet(id) {
    //Me devuelve el arreglo con todos los tweets, excepto el que le pasamos
    tweets = tweets.filter(twt => twt.id !== id);
    crearHTML();
}

//AGREGADO EXTRA
//Vaciar lista
function vaciarTweets() {
    tweets = [];
    crearHTML();
}