document.addEventListener('DOMContentLoaded', function() {
      const urlParams = new URLSearchParams(window.location.search);
      const pesquisadorId = urlParams.get('id');
      
      if (!pesquisadorId) {
        mostrarErro('ID do pesquisador não especificado na URL');
        return;
      }

      async function carregarPesquisador() {
        try {
          const response = await fetch('data/pesquisadores.json');
          const todosPesquisadores = await response.json();
          
          const pesquisador = todosPesquisadores.find(p => p.id === pesquisadorId);
          
          if (!pesquisador) {
            mostrarErro(`Pesquisador com ID ${pesquisadorId} não encontrado`);
            return;
          }

          preencherDadosPesquisador(pesquisador);
          preencherInformacoesGeradas(pesquisador);
          
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
          mostrarErro('Erro ao carregar informações do pesquisador');
        }
      }

      function preencherDadosPesquisador(p) {
        document.getElementById('curriculoNome').textContent = p.nome;
        document.getElementById('curriculoId').textContent = p.id;
        document.getElementById('curriculoInstituicao').innerHTML = p.inst;
        document.getElementById('curriculoAreas').textContent = p.area;
        document.getElementById('curriculoResumo').textContent = p.desc;
        
        const email = gerarEmail(p.nome, p.inst);
        document.getElementById('curriculoEmail').textContent = email;
        
        const orcid = `${p.id.substr(0, 4)}-${p.id.substr(4, 4)}-${p.id.substr(8, 4)}-${p.id.substr(12, 4) || '0000'}`;
        document.getElementById('curriculoOrcid').textContent = orcid;
        
        const localizacao = extrairLocalizacao(p.inst);
        document.getElementById('curriculoLocalizacao').textContent = localizacao;
        
        document.title = `Currículo Lattes - ${p.nome}`;
      }

      function preencherInformacoesGeradas(p) {
        const formacaoContainer = document.getElementById('curriculoFormacao');
        formacaoContainer.innerHTML = '';
        
        const niveis = ['Graduação', 'Mestrado', 'Doutorado', 'Pós-doutorado'];
        const areas = p.area.split(',').map(a => a.trim());
        const anoAtual = new Date().getFullYear();
        
        niveis.forEach((nivel, index) => {
          const anos = 4 + index * 2;
          const anoInicio = anoAtual - anos - (index * 2);
          const anoFim = anoInicio + anos;
          
          const item = document.createElement('div');
          item.className = 'list-group-item';
          item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
              <h6 class="mb-1">${nivel} em ${areas[0] || p.area}</h6>
              <small class="text-muted">${anoInicio} — ${anoFim}</small>
            </div>
            <p class="mb-1">${extrairInstituicao(p.inst)}</p>
          `;
          formacaoContainer.appendChild(item);
        });

        const experienciaContainer = document.getElementById('curriculoExperiencia');
        experienciaContainer.innerHTML = `
          <div class="mb-3">
            <h6>${p.inst.split('—')[1]?.trim() || 'Pesquisador'} — ${extrairInstituicao(p.inst)}</h6>
            <div class="text-muted small">2015 — presente</div>
            <p class="mb-0 mt-2 small">Atividades relacionadas a ${p.area.split(',')[0] || p.area}.</p>
          </div>
        `;

        const producaoContainer = document.getElementById('curriculoProducao');
        producaoContainer.innerHTML = `
          <div class="mb-3">
            <h6 class="mb-2">Publicações principais</h6>
            <ul class="small mb-0">
              <li class="mb-2">"Aplicações de ${p.area.split(',')[0] || p.area}" — Revista Científica, 2023</li>
              <li class="mb-2">"Estudo sobre ${p.area.split(',')[1] || p.area.split(',')[0]}" — Conferência Internacional, 2022</li>
              <li>"Metodologia em ${p.area.split(',')[0] || p.area}" — Periódico Especializado, 2021</li>
            </ul>
          </div>
          <div>
            <h6 class="mb-2">${p.desc || 'Atividades de pesquisa relacionadas'}</h6>
            <p class="small text-muted mb-0">Produção acadêmica focada em ${p.area.toLowerCase()}.</p>
          </div>
        `;

        const orientacoesContainer = document.getElementById('curriculoOrientacoes');
        orientacoesContainer.innerHTML = `
          <div class="small">
            <p><strong>Em andamento:</strong></p>
            <ul>
              <li>Orientação de IC: "Tema relacionado a ${p.area.split(',')[0] || p.area}"</li>
              <li>Orientação de mestrado: "Desenvolvimento em ${p.area.split(',')[0] || p.area}"</li>
            </ul>
            <p class="mt-3"><strong>Concluídas:</strong></p>
            <ul>
              <li>5 orientações de graduação</li>
              <li>2 orientações de mestrado</li>
            </ul>
          </div>
        `;

        const projetosContainer = document.getElementById('curriculoProjetos');
        projetosContainer.innerHTML = `
          <div class="small">
            <div class="mb-3">
              <strong>Projeto Principal em ${p.area.split(',')[0] || p.area}</strong> — CNPq (2022-2025)
              <div class="text-muted">Coordenação: ${p.nome.split(' ')[0]}</div>
              <p class="mt-1 mb-0">Descrição: Desenvolvimento de pesquisas em ${p.area.toLowerCase()}.</p>
            </div>
            <div>
              <strong>${p.desc || 'Projeto Colaborativo'}</strong> — FAPESP (2020-2023)
              <div class="text-muted">Participação como pesquisador</div>
            </div>
          </div>
        `;
      }

      function gerarEmail(nome, instituicao) {
        const partesNome = nome.toLowerCase().split(' ');
        const primeiroNome = partesNome[0];
        const ultimoNome = partesNome[partesNome.length - 1];
        const dominio = extrairDominioEmail(instituicao);
        
        return `${primeiroNome}.${ultimoNome}@${dominio}`;
      }

      function extrairDominioEmail(instituicao) {
        if (instituicao.includes('USP')) return 'usp.br';
        if (instituicao.includes('UF')) return 'uf.edu.br';
        if (instituicao.includes('UNICAMP')) return 'unicamp.br';
        if (instituicao.includes('IFRN')) return 'ifrn.edu.br';
        return 'instituicao.edu.br';
      }

      function extrairLocalizacao(instituicao) {
        if (instituicao.includes('SP') || instituicao.includes('São Paulo')) return 'São Paulo, SP';
        if (instituicao.includes('RJ') || instituicao.includes('Rio')) return 'Rio de Janeiro, RJ';
        if (instituicao.includes('MG')) return 'Minas Gerais, MG';
        if (instituicao.includes('RN')) return 'Natal, RN';
        if (instituicao.includes('SC')) return 'Santa Catarina, SC';
        if (instituicao.includes('RS')) return 'Rio Grande do Sul, RS';
        return 'Brasil';
      }

      function extrairInstituicao(inst) {
        return inst.split('—')[0]?.trim() || inst;
      }

      function mostrarErro(mensagem) {
        document.getElementById('curriculoNome').textContent = 'Erro';
        document.getElementById('curriculoResumo').textContent = mensagem;
        document.getElementById('curriculoResumo').className = 'small text-danger';
      }

      carregarPesquisador();
    });