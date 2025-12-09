document.addEventListener('DOMContentLoaded', function() {
    const btnBuscar = document.getElementById('btnBuscar');
    const campoBusca = document.getElementById('campoBusca');
    const resultadoDiv = document.getElementById('resultadoBusca');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const initialMessage = document.getElementById('initialMessage');
    const destaques = document.getElementById('destaques');
    
    const currentPage = detectPageType();
    
    let pesquisadores = [];
    let institutos = [];
    
    init();

    function detectPageType() {
        const path = window.location.pathname;
        
        if (path.includes('abacv.html') || path.includes('pesquisadores')) {
            return 'pesquisadores';
        } else if (path.includes('abainst.html') || path.includes('institutos')) {
            return 'institutos';
        } else {
            return 'geral';
        }
    }

    async function init() {
        try {
            if (currentPage === 'geral' || currentPage === 'pesquisadores') {
                pesquisadores = await loadData('data/pesquisadores.json');
                console.log('Pesquisadores carregados:', pesquisadores.length);
            }
            
            if (currentPage === 'geral' || currentPage === 'institutos') {
                institutos = await loadData('data/institutos.json');
                console.log('Institutos carregados:', institutos.length);
            }
            
            if (currentPage === 'pesquisadores' && pesquisadores.length > 0) {
                mostrarDestaquesPesquisadores();
            } else if (currentPage === 'institutos' && institutos.length > 0) {
                mostrarDestaquesInstitutos();
            }
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            showError('Erro ao carregar os dados. Por favor, recarregue a página.');
        }
    }

    async function loadData(filename) {
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Erro ao carregar ${filename}: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function realizarBusca() {
        const termo = campoBusca.value.trim();
        
        if (termo === "") {
            resultadoDiv.innerHTML = `
                <div class="no-results">
                    <i class="bi bi-exclamation-circle"></i>
                    <h4 class="mb-3">Digite um termo para buscar</h4>
                    <p class="text-muted">${getSearchHint()}</p>
                </div>
            `;
            return;
        }

        initialMessage.style.display = 'none';
        loadingSpinner.style.display = 'block';
        if (destaques) destaques.style.display = 'none';

        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            if (pesquisadores.length === 0 && (currentPage === 'geral' || currentPage === 'pesquisadores')) {
                pesquisadores = await loadData('data/pesquisadores.json');
            }
            if (institutos.length === 0 && (currentPage === 'geral' || currentPage === 'institutos')) {
                institutos = await loadData('data/institutos.json');
            }

            loadingSpinner.style.display = 'none';

            switch(currentPage) {
                case 'pesquisadores':
                    buscarPesquisadores(termo);
                    break;
                case 'institutos':
                    buscarInstitutos(termo);
                    break;
                case 'geral':
                    buscarGeral(termo);
                    break;
            }

        } catch (error) {
            loadingSpinner.style.display = 'none';
            showError('Erro ao realizar a busca. Tente novamente.');
            console.error(error);
        }
    }

    function buscarPesquisadores(termo) {
        const resultados = pesquisadores.filter(p =>
            p.nome.toLowerCase().includes(termo.toLowerCase()) ||
            p.inst.toLowerCase().includes(termo.toLowerCase()) ||
            p.area.toLowerCase().includes(termo.toLowerCase()) ||
            (p.desc && p.desc.toLowerCase().includes(termo.toLowerCase()))
        );

        displayResultsPesquisadores(resultados, termo);
    }

    function buscarInstitutos(termo) {
        const resultados = institutos.filter(i =>
            (i.nome && i.nome.toLowerCase().includes(termo.toLowerCase())) ||
            (i.sigla && i.sigla.toLowerCase().includes(termo.toLowerCase())) ||
            (i.localizacao && i.localizacao.toLowerCase().includes(termo.toLowerCase())) ||
            (i.areas_foco && i.areas_foco.some(area => 
                area.toLowerCase().includes(termo.toLowerCase())
            )) ||
            (i.tipo && i.tipo.toLowerCase().includes(termo.toLowerCase()))
        );

        displayResultsInstitutos(resultados, termo);
    }

    function buscarGeral(termo) {
        const resultadosPesquisadores = pesquisadores.filter(p =>
            p.nome.toLowerCase().includes(termo.toLowerCase()) ||
            p.inst.toLowerCase().includes(termo.toLowerCase()) ||
            p.area.toLowerCase().includes(termo.toLowerCase()) ||
            (p.desc && p.desc.toLowerCase().includes(termo.toLowerCase()))
        );

        const resultadosInstitutos = institutos.filter(i =>
            (i.nome && i.nome.toLowerCase().includes(termo.toLowerCase())) ||
            (i.sigla && i.sigla.toLowerCase().includes(termo.toLowerCase())) ||
            (i.localizacao && i.localizacao.toLowerCase().includes(termo.toLowerCase())) ||
            (i.areas_foco && i.areas_foco.some(area => 
                area.toLowerCase().includes(termo.toLowerCase())
            ))
        );

        displayResultsGeral(resultadosPesquisadores, resultadosInstitutos, termo);
    }

    function displayResultsPesquisadores(resultados, termo) {
        if (resultados.length === 0) {
            showNoResults(termo);
            return;
        }

        let html = `
            <div class="mb-4">
                <span class="result-count">${resultados.length} pesquisador(es) encontrado(s)</span>
                <p class="text-muted">Termo buscado: <strong>"${termo}"</strong></p>
            </div>
        `;

        resultados.forEach(r => {
            html += `
                <div class="result-card mb-3">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-10">
                                <h5 class="card-title">${r.nome}</h5>
                                <p class="text-muted mb-2">
                                    <i class="bi bi-building me-1"></i>${r.inst}
                                </p>
                                <p class="mb-2">
                                    <span class="badge badge-area">${r.area.split(',')[0]}</span>
                                    ${r.area.split(',').slice(1).map(a => 
                                        `<span class="badge bg-light text-dark ms-1">${a.trim()}</span>`
                                    ).join('')}
                                </p>
                                <p class="small text-muted mb-3">${r.desc || ''}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">
                                        <i class="bi bi-card-text me-1"></i>ID: ${r.id}
                                    </small>
                                    <div>
                                        <a href="#" class="btn btn-primary btn-sm me-2" onclick="verDetalhesPesquisador('${r.id}')">
                                            <i class="bi bi-eye me-1"></i> Ver Detalhes
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        if (resultados.length > 10) {
            html += createPagination(resultados.length);
        }

        resultadoDiv.innerHTML = html;
    }

    function displayResultsInstitutos(resultados, termo) {
        if (resultados.length === 0) {
            showNoResults(termo);
            return;
        }

        let html = `
            <div class="mb-4">
                <span class="result-count">${resultados.length} instituição(ões) encontrada(s)</span>
                <p class="text-muted">Termo buscado: <strong>"${termo}"</strong></p>
            </div>
        `;

        resultados.forEach(i => {
            html += `
                <div class="result-card mb-3">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-10">
                                <h5 class="card-title">${i.nome} <span class="text-muted">(${i.sigla})</span></h5>
                                <p class="text-muted mb-2">
                                    <i class="bi bi-geo-alt me-1"></i>${i.localizacao}
                                </p>
                                <p class="mb-2">
                                    <span class="badge bg-primary">${i.tipo}</span>
                                </p>
                                <p class="mb-2">
                                    ${i.areas_foco && i.areas_foco.map(area => 
                                        `<span class="badge bg-light text-dark me-1 mb-1">${area}</span>`
                                    ).join('')}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">
                                        <i class="bi bi-link me-1"></i>
                                        <a href="#" target="_blank">${i.website}</a>
                                    </small>
                                    <a href="#" class="btn btn-outline-primary btn-sm">
                                        <i class="bi bi-primary-circle me-1"></i> Mais informações
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        if (resultados.length > 10) {
            html += createPagination(resultados.length);
        }

        resultadoDiv.innerHTML = html;
    }

    function displayResultsGeral(pesquisadoresResult, institutosResult, termo) {
        const totalResultados = pesquisadoresResult.length + institutosResult.length;
        
        if (totalResultados === 0) {
            showNoResults(termo);
            return;
        }

        let html = `
            <div class="mb-4">
                <span class="result-count">${totalResultados} resultado(s) encontrado(s)</span>
                <p class="text-muted">Termo buscado: <strong>"${termo}"</strong></p>
            </div>
        `;

        if (pesquisadoresResult.length > 0) {
            html += `
                <div class="result-section mb-4">
                    <h5 class="section-title">
                        <i class="bi bi-person-badge me-2"></i>
                        Pesquisadores (${pesquisadoresResult.length})
                    </h5>
            `;
            
            pesquisadoresResult.slice(0, 3).forEach(r => {
                html += createPesquisadorCard(r);
            });
            
            if (pesquisadoresResult.length > 3) {
                html += `
                    <div class="text-center mt-3">
                        <a href="pesquisadores.html?q=${encodeURIComponent(termo)}" class="btn btn-outline-primary">
                            Ver todos os ${pesquisadoresResult.length} pesquisadores
                        </a>
                    </div>
                `;
            }
            
            html += `</div>`;
        }

        if (institutosResult.length > 0) {
            html += `
                <div class="result-section mb-4">
                    <h5 class="section-title">
                        <i class="bi bi-building me-2"></i>
                        Instituições (${institutosResult.length})
                    </h5>
            `;
            
            institutosResult.slice(0, 3).forEach(i => {
                html += createInstitutoCard(i);
            });
            
            if (institutosResult.length > 3) {
                html += `
                    <div class="text-center mt-3">
                        <a href="institutos.html?q=${encodeURIComponent(termo)}" class="btn btn-outline-primary">
                            Ver todas as ${institutosResult.length} instituições
                        </a>
                    </div>
                `;
            }
            
            html += `</div>`;
        }

        resultadoDiv.innerHTML = html;
    }

    function createPesquisadorCard(r) {
        return `
            <div class="result-card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${r.nome}</h5>
                    <p class="text-muted mb-2">
                        <i class="bi bi-building me-1"></i>${r.inst}
                    </p>
                    <p class="mb-2">
                        <span class="badge badge-area">${r.area.split(',')[0]}</span>
                    </p>
                    <p class="small text-muted mb-3">${r.desc || ''}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">ID: ${r.id}</small>
                        <a href="pesquisador.html?id=${r.id}" class="btn btn-primary btn-sm">
                            <i class="bi bi-eye me-1"></i> Ver Detalhes
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    function createInstitutoCard(i) {
        return `
            <div class="result-card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${i.nome} (${i.sigla})</h5>
                    <p class="text-muted mb-2">
                        <i class="bi bi-geo-alt me-1"></i>${i.localizacao}
                    </p>
                    <p class="mb-2">
                        <span class="badge bg-primary">${i.tipo}</span>
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${i.website}</small>
                        <a href="instituto.html?sigla=${i.sigla}" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-primary-circle me-1"></i> Detalhes
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    function mostrarDestaquesPesquisadores() {
        if (!destaques) return;
        
        const destaquesArray = pesquisadores.slice(0, 3);
        let html = '';
        
        destaquesArray.forEach(p => {
            html += `
                <div class="col-md-4">
                    <div class="destaque-card">
                        <h6>${p.nome}</h6>
                        <p class="small text-muted">${p.inst}</p>
                        <p class="small">${p.area.split(',')[0]}</p>
                        <button class="btn btn-sm btn-outline-primary" onclick="preencherBusca('${p.nome.split(' ')[0]}')">
                            Ver similar
                        </button>
                    </div>
                </div>
            `;
        });
        
        destaques.innerHTML = html;
    }

    function mostrarDestaquesInstitutos() {
        if (!destaques) return;
        
        const destaquesArray = institutos.slice(0, 3);
        let html = '';
        
        destaquesArray.forEach(i => {
            html += `
                <div class="col-md-4">
                    <div class="destaque-card">
                        <h6>${i.sigla}</h6>
                        <p class="small text-muted">${i.nome}</p>
                        <p class="small">${i.areas_foco ? i.areas_foco[0] : ''}</p>
                        <button class="btn btn-sm btn-outline-primary" onclick="preencherBusca('${i.sigla}')">
                            Ver detalhes
                        </button>
                    </div>
                </div>
            `;
        });
        
        destaques.innerHTML = html;
    }

    function getSearchHint() {
        switch(currentPage) {
            case 'pesquisadores': return 'Busque por nome, instituição ou área de pesquisa';
            case 'institutos': return 'Busque por nome, sigla, localização ou área de foco';
            default: return 'Busque por pesquisadores, instituições ou áreas do conhecimento';
        }
    }

    function showNoResults(termo) {
        resultadoDiv.innerHTML = `
            <div class="no-results">
                <i class="bi bi-search"></i>
                <h4 class="mb-3">Nenhum resultado encontrado</h4>
                <p class="text-muted">Termo buscado: <strong>"${termo}"</strong></p>
                <p class="text-muted mb-3">Tente usar termos diferentes ou verificar a ortografia</p>
                <button class="btn btn-outline-primary mt-2" onclick="limparBusca()">
                    <i class="bi bi-arrow-clockwise me-1"></i> Nova Busca
                </button>
            </div>
        `;
    }

    function showError(message) {
        resultadoDiv.innerHTML = `
            <div class="no-results">
                <i class="bi bi-exclamation-triangle text-danger"></i>
                <h4 class="mb-3">Erro</h4>
                <p class="text-muted">${message}</p>
            </div>
        `;
    }

    function createPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / 10);
        return `
            <nav aria-label="Navegação de resultados" class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1">Anterior</a>
                    </li>
                    ${Array.from({length: Math.min(totalPages, 5)}, (_, i) => `
                        <li class="page-item ${i === 0 ? 'active' : ''}">
                            <a class="page-link" href="#">${i + 1}</a>
                        </li>
                    `).join('')}
                    <li class="page-item">
                        <a class="page-link" href="#">Próxima</a>
                    </li>
                </ul>
            </nav>
        `;
    }

    window.limparBusca = function() {
        campoBusca.value = '';
        initialMessage.style.display = 'block';
        loadingSpinner.style.display = 'none';
        if (destaques) destaques.style.display = 'flex';
        resultadoDiv.innerHTML = '';
    };


    window.preencherBusca = function(termo) {
        campoBusca.value = termo;
        realizarBusca();
    };

    if (btnBuscar) {
        btnBuscar.addEventListener('click', realizarBusca);
    }
    
    if (campoBusca) {
        campoBusca.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                realizarBusca();
            }
        });
    }

    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('q');
        
        if (searchTerm && campoBusca) {
            campoBusca.value = searchTerm;
            setTimeout(() => realizarBusca(), 500);
        }
    }

    setTimeout(checkUrlParams, 100);
});