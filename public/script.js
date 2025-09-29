/* ========= Global Script ========= */
const $ = (sel, parent=document) => parent.querySelector(sel);

/* Active link handling */
(function setActiveNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if ((path === '' && href.endsWith('index.html')) || href.endsWith(path)) {
      a.classList.add('active');
    }
  });
})();

/* Mobile menu toggle */
(function mobileMenu(){
  const toggle = $('.menu-toggle');
  const links = $('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', ()=> links.classList.toggle('show'));
})();

/* Login handler (dual-mode: backend + mockup fallback) */
async function handleLogin(e){
  e.preventDefault();
  const form = e.target;
  const username = $('#username', form).value.trim();
  const password = $('#password', form).value.trim();
  const errorUser = $('#error-username', form);
  const errorPass = $('#error-password', form);

  [errorUser, errorPass].forEach(el => {
    if(el) el.parentElement.classList.remove('error');
    el.style.display='none';
  });

  let hasErr = false;
  if(!username){
    errorUser.textContent='Username wajib diisi';
    errorUser.style.display='block';
    errorUser.parentElement.classList.add('error');
    hasErr = true;
  }
  if(!password){
    errorPass.textContent='Password wajib diisi';
    errorPass.style.display='block';
    errorPass.parentElement.classList.add('error');
    hasErr = true;
  }
  if(hasErr) return;

  const forceMock = new URLSearchParams(location.search).get('mode') === 'mock';

  const tryMock = () => {
    if (username === 'admin' && password === '1234') {
      alert('Login berhasil! (mode mockup)');
      location.href = 'index.html';
    } else {
      alert('Username atau password salah (mode mockup)');
    }
  };

  if (forceMock) return tryMock();

  try {
    const res = await fetch('/api/login', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ username, password })
    });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    alert(data.message || 'Login response');
    if(data.success) location.href = 'index.html';
  } catch(err){
    // fallback to mockup
    tryMock();
  }
}

/* attach login handler if on login page */
(function attachLogin(){
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', handleLogin);
  }
})();
