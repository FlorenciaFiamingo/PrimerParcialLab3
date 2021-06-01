import { Anuncio_Auto } from "./datos.js";

//let boton = null;
const data =JSON.parse(localStorage.getItem("lista")) || [];

window.addEventListener("DOMContentLoaded", ()=>{

    document.forms[0].addEventListener("submit", handlerSubmit);

    //boton = document.getElementById("btnLista");
   // boton.addEventListener("click", handlerLoadList);
    document.addEventListener("click", handlerClick);
    if(data.length>0){
        handlerLoadList(data);
    }

});

/*
console.log(data);

const texto = JSON.stringify(data);
console.log(texto);

const obj = JSON.parse(texto);
console.log(obj);

*/
function handlerOcultarMostrarDiv(){
    const divForm = document.getElementById("divForm");
    if(divForm.classList.contains("ocultoDiv")){
       mostrarDiv(); 
       console.log(document.getElementsByClassName("ocultoDiv"));
    }else{
        ocultarDiv();
        console.log("entró");
    }
}

function ocultarDiv(){
    document.getElementById('divForm').setAttribute("class", "ocultoDiv");

}
function mostrarDiv(){
    document.getElementById('divForm').setAttribute("class", "visible");
}


function limpiarFormulario(frm){
    frm.reset();
    document.getElementById("btnEliminar").setAttribute("class","oculto");
    document.getElementById("btnSubmit").value = "Alta";
    document.forms[0].id.value = "";
}

function handlerSubmit(e){
    e.preventDefault();
    const frm = e.target;
    
    if(frm.id.value){
        const editDato = new Anuncio_Auto(parseInt(frm.id.value), frm.titulo.value, frm.transaccion.value, frm.descripcion.value, frm.precio.value, frm.puertas.value, frm.kilometros.value, frm.potencia.value);
        console.log(editDato);
        if(confirm("Confirmar modificación?")){

            agregarSpinner();
            setTimeout(()=>{
                modificarDato(editDato);
                eliminarSpinner();    
            }, 3000);
    
        }

    }else{
        const nuevoDato = new Anuncio_Auto(Date.now(), frm.titulo.value, frm.transaccion.value, frm.descripcion.value, frm.precio.value, frm.puertas.value, frm.kilometros.value, frm.potencia.value);
        console.log(nuevoDato);
        
        agregarSpinner();
        setTimeout(()=>{
            altaDato(nuevoDato);
            eliminarSpinner();    
        }, 3000);
    }
    
    limpiarFormulario(frm);
}

function agregarSpinner(){
    let spinner = document.createElement("img");
    spinner.setAttribute("src", "./assets/spinner.gif");
    spinner.setAttribute("alt", "imagen spinner");

    document.getElementById("spinner-container").appendChild(spinner);
}

function eliminarSpinner(){
    document.getElementById("spinner-container").innerHTML= "";
}

function almacenarDatos(d){
    localStorage.setItem("lista", JSON.stringify(d));
    handlerLoadList();
}

function modificarDato(p){
    let index = data.findIndex((d)=>{
        return d.id == p.id;
    });

    data.splice(index, 1, p );
    almacenarDatos(data);
}

function altaDato(p){
    data.push(p);
    almacenarDatos(data);
}

function handlerLoadList(e){
    renderizarLista(crearTabla(data),document.getElementById("divLista"));
   // console.log(e.target);
   /*const emisor = e.target;
   emisor.textContent = 'Eliminar Lista';
   emisor.removeEventListener("click", handlerLoadList);
   emisor.addEventListener("click", handlerDeleteList);*/
}

/*
function handlerDeleteList(e){
    renderizarLista(null, document.getElementById("divLista"));
    const emisor =  e.target;
    emisor.textContent = 'Crear Lista';
    emisor.removeEventListener("click", handlerDeleteList);
    emisor.addEventListener("click", handlerLoadList);

}
*/

function renderizarLista(lista, contenedor){
    //contenedor.innerHTML = "";
    // Vacío a contenedor
    //Se podría hacer alguna funcion que sirva para cualquier elemento
    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }
    if(lista){
    contenedor.appendChild(lista);
    }
}

function crearTabla(items){
    const tabla = document.createElement("table");
    tabla.appendChild(crearThead(items[0]));
    tabla.appendChild(crearTbody(items));

    //tabla.setAttribute("style", "border:1px solid black");
    return tabla;
}

function crearThead(item){
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    for (const key in item){
        if(key !== "id"){
            const th = document.createElement("th");
            const texto = document.createTextNode(key);
            th.appendChild(texto);
            tr.appendChild(th);
         }

        }
        thead.appendChild(tr);
    return thead;
}

function crearTbody(item){
    const tbody = document.createElement("tbody");
    
    item.forEach(item=>{
        const tr = document.createElement("tr");
        //tr.addEventListener("click", handlerClickTr, true);

        for(const key in item){
            if(key === "id"){
                tr.setAttribute("data-id", item[key]);
            }else{
                const td = document.createElement("td");
                //td.style.setProperty("border", "1px solid black");
                // td.style.border = "1px solid black";
               // td.addEventListener("click", handlerClickTd);
                td.textContent = item[key];
                tr.appendChild(td); 
                               
            }
        }
        tbody.appendChild(tr);
    });
    
    return tbody;
}

function handlerClick(e){
   // console.log(e.target.parentNode.firstElementChild);
   // console.log(e.target.parentNode);
    // if (!e.target.matches("td"))return;
   
   if(e.target.matches("td")){

       let id = e.target.parentNode.dataset.id;
       console.log(id);
       cargarFormulario(id);
       document.getElementById("divForm").setAttribute("class","visible");
   }else if(e.target.matches("#btnEliminar")){
       
        handlerDelete();
   }
}

function handlerDelete(){
    let id = parseInt(document.forms[0].id.value);

    if(confirm("Confirma eliminación?")){
        let index = data.findIndex((d)=>d.id === id);
        agregarSpinner();
        setTimeout(()=>{
            data.splice(index,1);
            almacenarDatos(data);
            eliminarSpinner();    
        }, 3000);
    }

    limpiarFormulario(document.forms[0]);

}

function cargarFormulario(id){
    let dato = null;
   /* data.forEach((item)=>{
        if(item.id === parseInt(id)){
            dato = item;
        }
    });
    console.log(dato);*/

    dato = data.filter(d=> d.id === parseInt(id))[0];
    //console.log(dato);

    const {titulo, transaccion, descripcion, precio, puertas, kilometros, potencia} = dato;

    const frm = document.forms[0];
    frm.titulo.value = titulo;
    frm.transaccion.value = transaccion;
    frm.descripcion.value = descripcion;
    frm.precio.value = precio;
    frm.id.value = id;
    frm.puertas.value = puertas;
    frm.kilometros.value = kilometros;
    frm.potencia.value = potencia;

    document.getElementById("btnSubmit").value  = 'Modificar';
    document.getElementById("btnEliminar").setAttribute("class", "visible");
}