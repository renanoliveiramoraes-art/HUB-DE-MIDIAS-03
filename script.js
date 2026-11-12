let colecaoMidia = [];

async function carregarCatalogo() {
    const container_card = document.getElementById('catalogo-grid');
    container_card.innerHTML = "<p>Carregando itens, aguarde...</p>";

    try {
        const resposta = await fetch('dados.json');
        if (!resposta.ok) throw new Error('Erro ao buscar dados');

        colecaoMidia = await resposta.json();
        renderizarGrid(colecaoMidia);
    } catch (erro) {
        container_card.innerHTML = `<p style="color:#ef4444;">Erro ao carregar catálogo: ${erro.message}</p>`;
    }
}

function renderizarGrid(lista) {
    const container = document.getElementById('catalogo-grid');
    container.innerHTML = "";

    if (!lista || lista.length === 0) {
        container.innerHTML = `<p class="info">Nenhum item cadastrado nesta categoria.</p>`;
        return;
    }

    lista.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const notaFormatada = Number(item.nota).toFixed(1);
        const imagemCapa = item.capa ? item.capa : 'https://via.placeholder.com/300x400?text=Sem+Imagem';

        card.innerHTML = `
            <img src="${imagemCapa}" alt="${item.titulo}" class="capa-midia">
            <div>
                <span class="tag-categoria">${item.categoria}</span>
                <h3 class="titulo-midia" onclick="abrirDescricao(${item.id})">${item.titulo}</h3>
                <p class="info">Plataforma: ${item.plataforma}</p>
                <p class="info">Nota: <span class="nota">${notaFormatada}</span></p>
                <p class="info">Status: <strong>${item.status || 'Pendente'}</strong></p>
            </div>
            <div class="card-acoes">
                <button class="btn-deletar" onclick="deletarItem(${item.id})">Deletar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function abrirDescricao(id) {
    const item = colecaoMidia.find(i => i.id === id);
    if (!item) return;

    const modal = document.getElementById('modal-descricao');
    document.getElementById('modal-titulo').textContent = item.titulo;
    document.getElementById('modal-texto').textContent = item.descricao || "Sem descrição disponível.";
    
    modal.classList.remove('hidden');
}

document.getElementById('btn-fechar-modal').addEventListener('click', () => {
    document.getElementById('modal-descricao').classList.add('hidden');
});

document.getElementById('form-midia').addEventListener('submit', function (e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const categoria = document.getElementById('categoria').value;
    const plataforma = document.getElementById('plataforma').value;
    const nota = parseFloat(document.getElementById('nota').value);
    const capa = document.getElementById('capa').value;
    const descricao = document.getElementById('descricao').value;

    if (categoria === 'Categoria') {
        alert('Por favor, selecione uma categoria válida.');
        return;
    }

    const novoItem = {
        id: Date.now(),
        titulo: titulo,
        categoria: categoria,
        plataforma: plataforma,
        nota: nota,
        status: 'Adicionado recentemente',
        capa: capa,
        descricao: descricao
    };

    colecaoMidia.unshift(novoItem);
    renderizarGrid(colecaoMidia);
    this.reset();
});

document.querySelectorAll('.filtros button').forEach(botao => {
    botao.addEventListener('click', (e) => {
        const categoriaFiltro = e.target.textContent.trim();

        if (categoriaFiltro === 'Todos') {
            renderizarGrid(colecaoMidia);
        } else {
            const filtrados = colecaoMidia.filter(item => 
                item.categoria.toLowerCase().startsWith(categoriaFiltro.toLowerCase().slice(0, -1)) ||
                item.categoria.toLowerCase() === categoriaFiltro.toLowerCase()
            );
            renderizarGrid(filtrados);
        }
    });
});

document.addEventListener('DOMContentLoaded', carregarCatalogo);

async function deletarItem(id) {
    try {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                const itemExiste = colecaoMidia.some(item => item.id === id);
                if (itemExiste) {
                    resolve();
                } else {
                    reject(new Error("Item não encontrado no catálogo."));
                }
            }, 300);
        });

        colecaoMidia = colecaoMidia.filter(item => item.id !== id);
        renderizarGrid(colecaoMidia);

    } catch (erro) {
        console.error("Erro ao deletar item:", erro.message);
        alert(`Não foi possível deletar o item: ${erro.message}`);
    }
}
