document.addEventListener('DOMContentLoaded', function() {
    const btnBuscar = document.getElementById('btnBuscar');
    const campoBusca = document.getElementById('campoBusca');
    const resultadoDiv = document.getElementById('resultadoBusca');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const initialMessage = document.getElementById('initialMessage');
    const destaques = document.getElementById('destaques');

    const dadosSimulados = [
      {
        id: "L1234567",
        nome: "Prof. Dr. Carlos Alberto Silva",
        inst: "USP - Universidade de São Paulo",
        area: "Ciência da Computação, Inteligência Artificial",
        desc: "Professor Titular do Departamento de Ciência da Computação. Pesquisador em Machine Learning com mais de 150 artigos publicados em periódicos internacionais. Coordenador do Laboratório de Inteligência Computacional.",
        foto: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        id: "L2345678",
        nome: "Dra. Maria Fernanda Santos",
        inst: "Unicamp - Universidade Estadual de Campinas",
        area: "Biomedicina, Genética Molecular",
        desc: "Pesquisadora em genética molecular e terapia celular. Desenvolve pesquisas com células-tronco para tratamento de doenças degenerativas. Possui 5 patentes registradas.",
        foto: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        id: "L3456789",
        nome: "Prof. Dr. Roberto Lima Alves",
        inst: "UFMG - Universidade Federal de Minas Gerais",
        area: "Engenharia Civil, Materiais de Construção",
        desc: "Especialista em materiais de construção sustentáveis. Desenvolveu novos compostos cimentícios com redução de 40% na emissão de CO2. Coordena projeto internacional com 8 países.",
        foto: "https://randomuser.me/api/portraits/men/65.jpg"
      }
    ];

    function realizarBusca() {
      const termo = campoBusca.value.trim();
      
      if (termo === "") {
        resultadoDiv.innerHTML = `
          <div class="no-results">
            <i class="bi bi-exclamation-circle"></i>
            <h4 class="mb-3">Digite um termo para buscar</h4>
            <p class="text-muted">Por favor, insira um nome, instituição ou área do conhecimento</p>
          </div>
        `;
        return;
      }

      initialMessage.style.display = 'none';
      loadingSpinner.style.display = 'block';
      destaques.style.display = 'none';

      setTimeout(() => {
        const resultados = dadosSimulados.filter(r =>
          r.nome.toLowerCase().includes(termo.toLowerCase()) ||
          r.inst.toLowerCase().includes(termo.toLowerCase()) ||
          r.area.toLowerCase().includes(termo.toLowerCase())
        );

        loadingSpinner.style.display = 'none';

        if (resultados.length === 0) {
          resultadoDiv.innerHTML = `
            <div class="no-results">
              <i class="bi bi-search"></i>
              <h4 class="mb-3">Nenhum resultado encontrado</h4>
              <p class="text-muted">Tente usar termos diferentes ou verificar a ortografia</p>
              <button class="btn btn-outline-primary mt-3" onclick="limparBusca()">Nova Busca</button>
            </div>
          `;
          return;
        }

        let html = `
          <div class="mb-4">
            <span class="result-count">${resultados.length} resultado(s) encontrado(s)</span>
            <p class="text-muted">Termo buscado: <strong>"${termo}"</strong></p>
          </div>
        `;

        resultados.forEach((r, index) => {
          html += `
            <div class="result-card">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-2 text-center">
                    <img src="${r.foto}" class="profile-img mb-3">
                  </div>
                  <div class="col-md-8">
                    <h5 class="card-title">${r.nome}</h5>
                    <p class="text-muted mb-2">
                      <i class="bi bi-building me-1"></i>${r.inst}
                    </p>
                    <p class="mb-2">
                      <span class="badge badge-area">${r.area.split(',')[0]}</span>
                      ${r.area.split(',').slice(1).map(a => `<span class="badge bg-light text-dark">${a.trim()}</span>`).join(' ')}
                    </p>
                    <p class="small text-muted mb-3">${r.desc}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted">
                        <i class="bi bi-card-text me-1"></i>ID Lattes: ${r.id}
                      </small>
                      <div>
                        <a href="#" class="btn btn-primary btn-sm me-2">
                          <i class="bi bi-eye me-1"></i> Ver Currículo
                        </a>
                        <a href="#" class="btn btn-outline-primary btn-sm">
                          <i class="bi bi-download me-1"></i> PDF
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2 text-md-end">
                    <button class="btn btn-link text-muted" onclick="adicionarFavorito('${r.id}')">
                      <i class="bi bi-star"></i> Favoritar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });

        if (resultados.length > 3) {
          html += `
            <nav aria-label="Navegação de resultados" class="mt-4">
              <ul class="pagination justify-content-center">
                <li class="page-item disabled">
                  <a class="page-link" href="#" tabindex="-1">Anterior</a>
                </li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item">
                  <a class="page-link" href="#">Próxima</a>
                </li>
              </ul>
            </nav>
          `;
        }

        resultadoDiv.innerHTML = html;
      }, 800);
    }

    btnBuscar.addEventListener('click', realizarBusca);
    campoBusca.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        realizarBusca();
      }
    });

    window.limparBusca = function() {
      campoBusca.value = '';
      initialMessage.style.display = 'block';
      loadingSpinner.style.display = 'none';
      destaques.style.display = 'flex';
      resultadoDiv.innerHTML = '';
    };

    window.adicionarFavorito = function(id) {
      alert(`Currículo ${id} adicionado aos favoritos!`);
    };

  });