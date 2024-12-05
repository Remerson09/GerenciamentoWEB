function pegaDocXML() {
    let livraria = localStorage.dados;
    if (livraria == undefined)
        livraria = "<livraria></livraria>";
    const parser = new DOMParser();
    return parser.parseFromString(livraria, "text/xml");
}

function salvar(xmldoc) {
    let serealizador = new XMLSerializer();
    let textoXML = serealizador.serializeToString(xmldoc);
    localStorage.dados = textoXML;
}

function preencherTabela(xmlDoc) {
    const raiz = xmlDoc.documentElement;
    const livros = raiz.getElementsByTagName("livro");
    let texto = "";
    for (let livro of livros)
        texto += livroParaTr(livro);
    const corpo = document.querySelector("tbody");
    corpo.innerHTML = texto;
}

function livroParaTr(livro) {
    const titulo = pegaDadoDoLivro("titulo", livro);
    const autor = pegaDadoDoLivro("autor", livro);
    const ano = pegaDadoDoLivro("ano", livro);
    const preco = pegaDadoDoLivro("preco", livro);
    return `
        <tr>
            <td>${titulo}</td>
            <td>${autor}</td>
            <td>${ano}</td>
            <td>${preco}</td>
        </tr>
    `;
}

function pegaDadoDoLivro(tag, livro) {
    let tags = livro.getElementsByTagName(tag);
    if (tags.length === 0) {
        return "N/A"; // Caso o dado não exista, retornamos "N/A"
    }
    if (tag === "autor" && tags.length > 1) {
        let texto = "<ul>";
        for (let tag of tags)
            texto += `<li>${tag.firstChild.nodeValue}</li>`;
        return texto + "</ul>";
    } else {
        return tags[0].firstChild ? tags[0].firstChild.nodeValue : "N/A"; // Verificamos se o nó tem um valor
    }
}

function criaElementoDoLivro(tag, texto, livro, xmlDoc) {
    let elemento = xmlDoc.createElement(tag);
    let noTexto = xmlDoc.createTextNode(texto);
    elemento.appendChild(noTexto);
    livro.appendChild(elemento);
}

function inserir() {
    let titulo = document.getElementById("titulo").value;
    let autores = document.getElementById("autor").value.split(","); // Split autores separados por vírgula
    let ano = document.getElementById("ano").value;
    let preco = document.getElementById("preco").value;

    let xmlDoc = pegaDocXML();

    let livro = xmlDoc.createElement("livro");

    criaElementoDoLivro("titulo", titulo, livro, xmlDoc);
    autores.forEach(autor => {
        criaElementoDoLivro("autor", autor.trim(), livro, xmlDoc); // Adiciona cada autor separadamente
    });
    criaElementoDoLivro("ano", ano, livro, xmlDoc);
    criaElementoDoLivro("preco", preco, livro, xmlDoc);

    xmlDoc.documentElement.appendChild(livro);

    salvar(xmlDoc);
    preencherTabela(xmlDoc);
}

onload = function () {
    let aux = pegaDocXML();
    preencherTabela(aux);
    document.getElementById("botao").onclick = inserir;
};
