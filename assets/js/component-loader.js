async function carregar(id, arquivo) {
    const div = document.getElementById(id);
    if (!div) return;
    
    const resposta = await fetch(arquivo);
    div.innerHTML = await resposta.text();
}

window.onload = function() {
    if (document.getElementById('header')) carregar('header', 'components/header.html');
    if (document.getElementById('header-logged')) carregar('header-logged', 'components/header-logged.html');
    if (document.getElementById('navbar')) carregar('navbar', 'components/navbar.html');
    if (document.getElementById('footer')) carregar('footer', 'components/footer.html');
};