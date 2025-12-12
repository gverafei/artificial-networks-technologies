const anio = new Date().getFullYear();

// Usando document.createElement();
const pintaMenu = () => {
    const menu = document.createElement("div");
    menu.classList.add('header', 'bg-light', 'border-bottom', 'shadow', 'mb-3');

    const linkUV = document.createElement("a");
    linkUV.classList.add('text-bg-success', 'position-absolute', 'top-0', 'end-0', 'btn', 'btn-link', 'btn-sm', 'px-3', 'py-0', 'rounded-0', 'text-decoration-none');
    linkUV.setAttribute('title', 'Universidad Veracruzana');
    linkUV.textContent = 'Universidad Veracruzana';

    const titulo = document.createElement("h1");
    titulo.classList.add("h5", "text-center", "mt-5", "mt-sm-4");
    titulo.innerText = `Tecnologías para Redes Neuronales ${anio}`;

    menu.appendChild(linkUV);
    menu.appendChild(titulo);

    document.body.insertAdjacentElement('afterbegin', menu);
};

document.addEventListener('DOMContentLoaded', pintaMenu);