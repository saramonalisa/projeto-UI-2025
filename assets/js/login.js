const cpfLogin = document.getElementById('cpfLogin');
    const emailLogin = document.getElementById('emailLogin');
    const cpfField = document.getElementById('cpfField');
    const emailField = document.getElementById('emailField');
    const togglePassword = document.getElementById('togglePassword');
    const senhaInput = document.getElementById('senha');
    const submitBtn = document.getElementById('loginSubmitBtn');

    cpfLogin.addEventListener('click', () => {
      cpfField.classList.remove('d-none');
      emailField.classList.add('d-none');
      cpfLogin.classList.add('active');
      emailLogin.classList.remove('active');
      cpfLogin.classList.remove('btn-outline-primary');
      cpfLogin.classList.add('btn-primary');
      emailLogin.classList.remove('btn-primary');
      emailLogin.classList.add('btn-outline-primary');
    });

    emailLogin.addEventListener('click', () => {
      emailField.classList.remove('d-none');
      cpfField.classList.add('d-none');
      emailLogin.classList.add('active');
      cpfLogin.classList.remove('active');
      emailLogin.classList.remove('btn-outline-primary');
      emailLogin.classList.add('btn-primary');
      cpfLogin.classList.remove('btn-primary');
      cpfLogin.classList.add('btn-outline-primary');
    });

    togglePassword.addEventListener('click', () => {
      const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
      senhaInput.setAttribute('type', type);
      togglePassword.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

    submitBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
      
      if (value.length > 9) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{1,3})/, '$1.$2');
      }
      
      e.target.value = value;
    });

    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      window.location.href = 'index.html';
    });