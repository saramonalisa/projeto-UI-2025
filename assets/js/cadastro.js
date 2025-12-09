document.addEventListener("DOMContentLoaded", () => {
    const paisSelect = document.getElementById('paisNacionalidade');
    let countriesData = [];
    if (paisSelect) {
      fetch('data/paises.json')
        .then(res => res.json())
        .then(json => {
          countriesData = Array.isArray(json.countries) ? json.countries : [];
          const defaultCode = json.default || 'BR';
          countriesData.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.code;
            opt.textContent = c.name;
            paisSelect.appendChild(opt);
          });

          const defaultOption = Array.from(paisSelect.options).find(o => o.value === defaultCode);
          if (defaultOption) defaultOption.selected = true;

          try {
            new TomSelect('#paisNacionalidade', {
              create: false,
              sortField: { field: 'text', direction: 'asc' },
              placeholder: 'Selecione ou pesquise...'
            });
          } catch (e) {
            console.warn('Tom Select não pôde ser inicializado:', e);
          }
        })
        .catch(err => {
          console.error('Erro ao carregar data/paises.json', err);
          const opt = document.createElement('option');
          opt.value = 'BR';
          opt.textContent = 'Brasil';
          paisSelect.appendChild(opt);
          opt.selected = true;
          });
      }
  
      const estadoSelect = document.getElementById('estado');
      let estadosData = [];
      if (estadoSelect) {
        fetch('data/estados.json')
          .then(res => res.json())
          .then(json => {
            estadosData = Array.isArray(json.estados) ? json.estados : [];
            const defaultCode = json.default || 'SP';
            estadosData.forEach(c => {
              const opt = document.createElement('option');
              opt.value = c.code;
              opt.textContent = c.name;
              estadoSelect.appendChild(opt);
            });
  
            const defaultOption = Array.from(estadoSelect.options).find(o => o.value === defaultCode);
            if (defaultOption) defaultOption.selected = true;
  
            try {
              new TomSelect('#estado', {
                create: false,
                sortField: { field: 'text', direction: 'asc' },
                placeholder: 'Selecione seu estado...'
              });
            } catch (e) {
              console.warn('Tom Select não pôde ser inicializado:', e);
            }
          })
          .catch(err => {
            console.error('Erro ao carregar data/estados.json', err);
          });
      }
  
      let currentStep = 0;
      const steps = document.querySelectorAll('.form-section');
      const boxes = document.querySelectorAll('.step-box');
      const totalSteps = steps.length;
  
      function updateSteps() {
        steps.forEach((el, i) => {
          el.style.display = (i === currentStep) ? 'block' : 'none';
        });
        boxes.forEach((b, i) => {
          b.classList.toggle('step-active', i < currentStep);
          b.classList.toggle('current-step', i === currentStep);
        });
      }
  
      document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (currentStep < totalSteps - 1) currentStep++;
          updateSteps();
        });
      });
  
      document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (currentStep > 0) currentStep--;
          updateSteps();
        });
      });
  
      updateSteps();
  });