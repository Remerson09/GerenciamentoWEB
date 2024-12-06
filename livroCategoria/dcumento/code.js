document.getElementById("btAdicionarAutor").addEventListener("click", adicionaInputAutor);
document.getElementById("inserir").addEventListener("click", inserir);

function adicionaInputAutor() {
    const pai = document.getElementById("containerAutores");
    const novoInput = document.createElement("input");
    novoInput.setAttribute("placeholder", "Autor");

    // Insere o novo input antes do primeiro filho, se existir
    const primeiroFilho = pai.firstChild;
    if (primeiroFilho) {
        pai.insertBefore(novoInput, primeiroFilho);
    } else {
        pai.appendChild(novoInput); 
    }
}

function inserir() {
    const titulo = document.getElementById("titulo").value;
    const ano = document.getElementById("ano").value;
    const preco = document.getElementById("preco").value;
    const autores = coletarAutores();

    const artigo = criarArtigo(titulo, autores, ano, preco);

    const listaLivros = document.getElementById("listaLivros");
    listaLivros.insertBefore(artigo, listaLivros.firstChild);

    document.getElementById("livrosForm").reset();
    removerExcessoDeInputsAutor();
}

function coletarAutores() {
    const autoresInputs = document.querySelectorAll("#containerAutores input[placeholder=Autor]");
    const autores = [];
    for (let i = 0; i < autoresInputs.length; i++) {
        autores.push(autoresInputs[i].value);
    }
    return autores;
}

function criarArtigo(titulo, autores, ano, preco) {
    const artigo = document.createElement("div");
    artigo.appendChild(criarTitulo(titulo));
    artigo.appendChild(criarListaAutores(autores));
    artigo.appendChild(criarParagrafo("Ano", ano));
    artigo.appendChild(criarParagrafo("Preço", preco));
    artigo.appendChild(criarBotaoDeletar(artigo));
    return artigo;
}

function criarTitulo(titulo) {
    const h2 = document.createElement("h2");
    h2.textContent = `Título: ${titulo}`;
    return h2;
}

function criarListaAutores(autores) {
    const ul = document.createElement("ul");
    autores.forEach(autor => {
        const li = document.createElement("li");
        li.textContent = `Autor: ${autor}`;
        ul.appendChild(li);
    });
    return ul;
}

function criarParagrafo(label, valor) {
    const p = document.createElement("p");
    p.textContent = `${label}: ${valor}`;
    return p;
}

function criarBotaoDeletar(artigo) {
    const btnDeletar = document.createElement("button");
    btnDeletar.textContent = "Deletar";

    // Define o evento de clique com uma função nomeada
    btnDeletar.addEventListener("click", function () {
        artigo.remove();
    });

    return btnDeletar;
}

function removerExcessoDeInputsAutor() {
    const pai = document.getElementById("containerAutores");
    const inputs = document.querySelectorAll("#containerAutores input[placeholder=Autor]");


    for (let i = 1; i < inputs.length; i++) {
        pai.removeChild(inputs[i]);
    }
}