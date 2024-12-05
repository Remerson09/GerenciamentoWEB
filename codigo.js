function pegaDocXML() {
    let contatosData = localStorage.contatos;
    if (contatosData == undefined)
        contatosData = "<contatos></contatos>"; // Cria um XML vazio se não houver dados.
    const parser = new DOMParser();
    return parser.parseFromString(contatosData, "text/xml");
}

function salvar(xmlDoc) {
    let serializer = new XMLSerializer();
    let textoXML = serializer.serializeToString(xmlDoc);
    localStorage.contatos = textoXML;
}

function preencherTabela(xmlDoc) {
    const raiz = xmlDoc.documentElement;
    const contatos = raiz.getElementsByTagName("contato");
    let texto = "";
    for (let contato of contatos)
        texto += contatoParaTr(contato);
    const corpo = document.querySelector("tbody");
    corpo.innerHTML = texto;
}

function contatoParaTr(contato) {
    const nome = pegaDadoDoContato("nome", contato);
    const sobrenome = pegaDadoDoContato("sobrenome", contato); // Corrigido para pegar o sobrenome
    const emails = pegaDadoDoContato("email", contato);
    const telefones = pegaDadoDoContato("telefone", contato);
    return `
        <tr>
            <td>${nome} ${sobrenome}</td> <!-- Nome e sobrenome juntos -->
            <td>${emails}</td> <!-- Exibe os emails -->
            <td>${telefones}</td> <!-- Exibe os telefones -->
        </tr>
    `;
}


function pegaDadoDoContato(tag, contato) {
    const tags = contato.getElementsByTagName(tag);
    let resultado = "";
    if (tags.length > 0) {
        // Para cada email ou telefone, cria uma nova linha no resultado
        if (tag === "email" || tag === "telefone") {
            for (let tagItem of tags) {
                resultado += tagItem.firstChild.nodeValue + "<br>"; // Cria uma linha separada para cada valor
            }
        } else {
            resultado = tags[0].firstChild.nodeValue || "N/A";
        }
    }
    return resultado;
}

function criarElementoDoContato(tag, texto, contato, xmlDoc) {
    let elemento = xmlDoc.createElement(tag);
    let textoNo = xmlDoc.createTextNode(texto);
    elemento.appendChild(textoNo);
    contato.appendChild(elemento);
}

function adicionarContato() {
    let nome = document.getElementById("nome").value;
    let sobrenome = document.getElementById("sobrenome").value;
    let email = document.getElementById("email").value;
    let telefone = document.getElementById("telefone").value;

    let xmlDoc = pegaDocXML();
    let contatos = xmlDoc.documentElement.getElementsByTagName("contato");
    let contatoExistente = false;

    // Verifica se já existe o contato com o mesmo nome e sobrenome
    for (let contato of contatos) {
        const nomeExistente = pegaDadoDoContato("nome", contato);
        const sobrenomeExistente = pegaDadoDoContato("sobrenome", contato);
        if (nomeExistente === nome && sobrenomeExistente === sobrenome) {
            // Adiciona novo email ou telefone ao contato existente
            adicionarEmailOuTelefone(contato, "email", email, xmlDoc);
            adicionarEmailOuTelefone(contato, "telefone", telefone, xmlDoc);
            contatoExistente = true;
            break;
        }
    }

    // Se não encontrar o contato, cria um novo
    if (!contatoExistente) {
        let contato = xmlDoc.createElement("contato");

        criarElementoDoContato("nome", nome, contato, xmlDoc);
        criarElementoDoContato("sobrenome", sobrenome, contato, xmlDoc);
        let emails = xmlDoc.createElement("emails");
        criarElementoDoContato("email", email, emails, xmlDoc);
        contato.appendChild(emails);
        let telefones = xmlDoc.createElement("telefones");
        criarElementoDoContato("telefone", telefone, telefones, xmlDoc);
        contato.appendChild(telefones);

        xmlDoc.documentElement.appendChild(contato);
    }

    salvar(xmlDoc);
    preencherTabela(xmlDoc);
}

function adicionarEmailOuTelefone(contato, tipo, dado, xmlDoc) {
    let elemento = contato.getElementsByTagName(tipo + "s")[0]; // Corrigido para acessar "emails" ou "telefones"
    if (!elemento) {
        elemento = xmlDoc.createElement(tipo + "s");
        contato.appendChild(elemento);
    }
    criarElementoDoContato(tipo, dado, elemento, xmlDoc);
}

onload = function () {
    let aux = pegaDocXML();
    preencherTabela(aux);
    document.getElementById("botao").onclick = adicionarContato;
};
