let producaoCount = 2;
let producoesData = {};

const tipoNomes = {
    'artigo_periodico': 'Artigo em Periódico',
    'artigo_evento': 'Artigo em Evento',
    'livro': 'Livro',
    'capitulo_livro': 'Capítulo de Livro',
    'tese_dissertacao': 'Tese/Dissertação',
    'patente': 'Patente',
    'software': 'Software',
    'outro': 'Outro'
};

document.addEventListener('DOMContentLoaded', function() {
    const toggleSenha = document.getElementById('toggleSenha');
    if (toggleSenha) {
        toggleSenha.addEventListener('click', function() {
            const senhaInput = document.querySelector('input[name="senha"]');
            const icon = this.querySelector('i');
            if (senhaInput.type === 'password') {
                senhaInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                senhaInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }

    const confirmDelete = document.getElementById('confirmDelete');
    if (confirmDelete) {
        confirmDelete.addEventListener('change', function() {
            document.getElementById('deleteButton').disabled = !this.checked;
        });
    }

    const addButton = document.querySelector('#addProducaoModal .btn-primary');
    if (addButton) {
        addButton.onclick = adicionarProducao;
    }

    inicializarProducoesDoHTML();
    
    const cancelBtn = document.querySelector('button[onclick*="history.back"]');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            if (confirm('Tem certeza que deseja cancelar? As alterações não salvas serão perdidas.')) {
                window.history.back();
            }
        });
    }
});

function inicializarProducoesDoHTML() {
    const producoesItems = document.querySelectorAll('.producoes-item');
    
    producoesItems.forEach((item, index) => {
        const id = index + 1;
        producaoCount = Math.max(producaoCount, id);
        
        const titulo = item.querySelector('h6')?.textContent || `Produção ${id}`;
        const texto = item.querySelectorAll('p.small');
        
        let tipo = 'artigo_periodico';
        let ano = '2023';
        let autores = 'Autor desconhecido';
        let detalhes = '';
        let doi = '';
        let palavrasChave = '';
        
        if (texto.length > 0) {
            const primeiroParagrafo = texto[0].textContent;
            const anoMatch = primeiroParagrafo.match(/Ano:.*?(\d{4})/);
            if (anoMatch) ano = anoMatch[1];
            
            const autoresMatch = primeiroParagrafo.match(/Autores: (.*?)(?:\s•|$)/);
            if (autoresMatch) autores = autoresMatch[1];
            
            const tipoMatch = primeiroParagrafo.match(/Tipo: (.*?)(?:\s•|$)/);
            if (tipoMatch) {
                const tipoTexto = tipoMatch[1].toLowerCase();
                for (const [key, value] of Object.entries(tipoNomes)) {
                    if (tipoTexto.includes(value.toLowerCase())) {
                        tipo = key;
                        break;
                    }
                }
            }
        }
        
        if (texto.length > 1) {
            detalhes = texto[1].textContent || '';
            
            if (detalhes.includes('DOI:')) {
                const doiMatch = detalhes.match(/DOI: (.*?)(?:\s|$)/);
                if (doiMatch) doi = doiMatch[1];
            }
        }
        
        producoesData[id] = {
            tipo,
            titulo,
            ano,
            autores,
            detalhes,
            doi,
            url: '',
            palavrasChave
        };
        
        item.id = 'producao-' + id;
        
        const btnGroup = item.querySelector('.btn-group');
        if (btnGroup) {
            btnGroup.innerHTML = `
                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="abrirModalEditar(${id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removerProducao(${id})">
                    <i class="bi bi-trash"></i>
                </button>
            `;
        }
    });
}

function criarElementoProducao(id, dados) {
    const autoresPreview = dados.autores.split(';').slice(0, 2).join('; ');
    const temMaisAutores = dados.autores.split(';').length > 2;
    
    return `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${dados.titulo}</h6>
                    <p class="small text-muted mb-1">
                        <strong>Tipo:</strong> ${tipoNomes[dados.tipo] || 'Outro'} • 
                        <strong>Ano:</strong> ${dados.ano} • 
                        <strong>Autores:</strong> ${autoresPreview}${temMaisAutores ? '...' : ''}
                    </p>
                    <p class="small mb-0">${dados.detalhes || 'Sem detalhes adicionais'}</p>
                    ${dados.doi ? `<p class="small mb-0"><strong>DOI:</strong> ${dados.doi}</p>` : ''}
                    ${dados.palavrasChave ? `<p class="small mb-0 mt-1"><strong>Palavras-chave:</strong> ${dados.palavrasChave}</p>` : ''}
                </div>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="abrirModalEditar(${id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removerProducao(${id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function adicionarProducao() {
    const tipo = document.getElementById('tipoProducao').value || 'outro';
    const titulo = document.getElementById('tituloProducao').value || 'Nova produção';
    const ano = document.getElementById('anoProducao').value || new Date().getFullYear().toString();
    const autores = document.getElementById('autoresProducao').value || 'Autor não informado';
    const detalhes = document.getElementById('detalhesProducao').value || '';
    const doi = document.getElementById('doiProducao').value || '';
    const url = document.getElementById('urlProducao').value || '';
    const palavrasChave = document.getElementById('palavrasChave').value || '';
    
    producaoCount++;
    producoesData[producaoCount] = {
        tipo,
        titulo,
        ano,
        autores,
        detalhes,
        doi,
        url,
        palavrasChave
    };
    
    const novaProducao = document.createElement('div');
    novaProducao.className = 'producoes-item card mb-3';
    novaProducao.id = 'producao-' + producaoCount;
    novaProducao.innerHTML = criarElementoProducao(producaoCount, producoesData[producaoCount]);
    
    const lista = document.getElementById('listaProducoes');
    const addCard = document.querySelector('.adicionar-producao');
    if (lista && addCard) {
        lista.insertBefore(novaProducao, addCard);
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProducaoModal'));
    if (modal) {
        modal.hide();
    }
    
    alert('Produção adicionada com sucesso!');
}

function removerProducao(id) {
    if (confirm('Tem certeza que deseja remover esta produção?')) {
        const item = document.getElementById('producao-' + id);
        if (item) {
            item.remove();
            delete producoesData[id];
        }
    }
}

function abrirModalEditar(id) {
    const dados = producoesData[id];
    if (!dados) {
        alert('Produção não encontrada!');
        return;
    }
    
    const modalBody = document.querySelector('#editProducaoModal .modal-body');
    if (!modalBody) {
        alert('Modal de edição não encontrado!');
        return;
    }
    
    modalBody.innerHTML = `
        <form id="formEditarProducao">
            <input type="hidden" id="editId" value="${id}">
            <div class="mb-3">
                <label class="form-label">Tipo de Produção</label>
                <select class="form-select" id="editTipoProducao">
                    <option value="">Selecione...</option>
                    <option value="artigo_periodico" ${dados.tipo === 'artigo_periodico' ? 'selected' : ''}>Artigo em Periódico</option>
                    <option value="artigo_evento" ${dados.tipo === 'artigo_evento' ? 'selected' : ''}>Artigo em Evento</option>
                    <option value="livro" ${dados.tipo === 'livro' ? 'selected' : ''}>Livro</option>
                    <option value="capitulo_livro" ${dados.tipo === 'capitulo_livro' ? 'selected' : ''}>Capítulo de Livro</option>
                    <option value="tese_dissertacao" ${dados.tipo === 'tese_dissertacao' ? 'selected' : ''}>Tese/Dissertação</option>
                    <option value="patente" ${dados.tipo === 'patente' ? 'selected' : ''}>Patente</option>
                    <option value="software" ${dados.tipo === 'software' ? 'selected' : ''}>Software</option>
                    <option value="outro" ${dados.tipo === 'outro' ? 'selected' : ''}>Outro</option>
                </select>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Título</label>
                <input type="text" class="form-control" id="editTituloProducao" value="${dados.titulo}">
            </div>
            
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Ano</label>
                    <input type="number" class="form-control" id="editAnoProducao" value="${dados.ano}" min="1900" max="2030">
                </div>
                <div class="col-md-6">
                    <label class="form-label">DOI (opcional)</label>
                    <input type="text" class="form-control" id="editDoiProducao" value="${dados.doi}" placeholder="10.xxxx/xxxx">
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Autores</label>
                <textarea class="form-control" id="editAutoresProducao" rows="2">${dados.autores}</textarea>
                <small class="text-muted">Separe os nomes dos autores com ponto e vírgula (;)</small>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Detalhes da Publicação</label>
                <textarea class="form-control" id="editDetalhesProducao" rows="3">${dados.detalhes || ''}</textarea>
            </div>
            
            <div class="mb-3">
                <label class="form-label">URL (opcional)</label>
                <input type="url" class="form-control" id="editUrlProducao" value="${dados.url || ''}" placeholder="https://...">
            </div>
            
            <div class="mb-3">
                <label class="form-label">Palavras-chave</label>
                <input type="text" class="form-control" id="editPalavrasChave" value="${dados.palavrasChave || ''}" placeholder="Separe por vírgula">
            </div>
        </form>
    `;
    
    const saveButton = document.querySelector('#editProducaoModal .btn-primary');
    if (saveButton) {
        saveButton.onclick = () => salvarEdicaoProducao(id);
    }
    
    const modalElement = document.getElementById('editProducaoModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

function salvarEdicaoProducao(id) {
    const tipo = document.getElementById('editTipoProducao').value || 'outro';
    const titulo = document.getElementById('editTituloProducao').value || 'Produção sem título';
    const ano = document.getElementById('editAnoProducao').value || new Date().getFullYear().toString();
    const autores = document.getElementById('editAutoresProducao').value || 'Autor não informado';
    const detalhes = document.getElementById('editDetalhesProducao').value || '';
    const doi = document.getElementById('editDoiProducao').value || '';
    const url = document.getElementById('editUrlProducao').value || '';
    const palavrasChave = document.getElementById('editPalavrasChave').value || '';
    
    producoesData[id] = {
        tipo,
        titulo,
        ano,
        autores,
        detalhes,
        doi,
        url,
        palavrasChave
    };
    
    const elemento = document.getElementById('producao-' + id);
    if (elemento) {
        elemento.innerHTML = criarElementoProducao(id, producoesData[id]);
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProducaoModal'));
    if (modal) {
        modal.hide();
    }
    
    alert('Produção atualizada com sucesso!');
}

function redirecionarParaCurriculo() {
    event.preventDefault();
    
    window.location.href = 'curriculo.html';
    
    return false;
}
