// --- Mobile Menu Toggle (future use) ---
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

// --- Smooth Scroll to Courses Section ---
const applyBtn = document.querySelector(".apply-btn");
const coursesSection = document.querySelector(".courses");

if (applyBtn && coursesSection) {
    applyBtn.addEventListener("click", () => {
        coursesSection.scrollIntoView({ behavior: "smooth" });
    });
}

// --- Course Cards Hover Animation (optional enhancement) ---
const courseCards = document.querySelectorAll(".course");

courseCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "scale(1.03)";
        card.style.transition = "0.25s";
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = "scale(1)";
    });
});

/* ------------------ Simple client-side auth (demo only) ------------------ */
const AUTH_KEY = 'distansia_users';
const CURR_KEY = 'distansia_currentUser';

// Helpers
function readUsers() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || []; } catch(e){ return []; }
}
function writeUsers(users){ localStorage.setItem(AUTH_KEY, JSON.stringify(users)); }
function setCurrentUser(user){ localStorage.setItem(CURR_KEY, JSON.stringify(user)); }
function getCurrentUser(){ try { return JSON.parse(localStorage.getItem(CURR_KEY)); } catch(e){ return null; } }
function clearCurrentUser(){ localStorage.removeItem(CURR_KEY); }

// UI elements
const signinLink = document.getElementById('signinLink');
const registerLink = document.getElementById('registerLink');
const authModal = document.getElementById('authModal');
const modalClose = document.getElementById('modalClose');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const authMsg = document.getElementById('authMsg');
const regMsg = document.getElementById('regMsg');
const profileArea = document.getElementById('profileArea');
const profileName = document.getElementById('profileName');
const logoutLink = document.getElementById('logoutLink');

function openModal(mode='login'){
    authMsg.textContent = '';
    regMsg.textContent = '';
    if(mode === 'login'){ loginForm.style.display='block'; registerForm.style.display='none'; }
    else { loginForm.style.display='none'; registerForm.style.display='block'; }
    authModal.classList.add('show'); authModal.setAttribute('aria-hidden','false');
}
function closeModal(){ authModal.classList.remove('show'); authModal.setAttribute('aria-hidden','true'); }

// Update header based on login state
function refreshAuthUI(){
    const user = getCurrentUser();
    // query elements at runtime (they may not exist when script is parsed)
    const signinEl = document.getElementById('signinLink');
    const profileAreaEl = document.getElementById('profileArea');
    const profileNameEl = document.getElementById('profileName');
    if(user){
        if(signinEl) signinEl.style.display='none';
        if(profileAreaEl) profileAreaEl.style.display='inline-block';
        if(profileNameEl){ profileNameEl.textContent = user.name || user.email; profileNameEl.href = 'profile.html'; }
    } else {
        if(signinEl) signinEl.style.display='inline-block';
        if(profileNameEl) profileNameEl.href = '#';
        if(profileAreaEl) profileAreaEl.style.display='none';
    }
}

// Register
registerForm && registerForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    if(!email || !password) { regMsg.textContent = 'Iltimos, email va parol kiriting.'; return; }
    const users = readUsers();
    if(users.find(u => u.email === email)){ regMsg.textContent = 'Bu email bilan ro\'yxatdan o\'tilgan.'; return; }
    const newUser = { name, email, password };
    users.push(newUser); writeUsers(users); setCurrentUser({name, email});
    regMsg.style.color = '#065f46'; regMsg.textContent = 'Muvaffaqiyatli ro\'yxatdan o\'tildingiz!';
    setTimeout(()=>{ closeModal(); refreshAuthUI(); }, 800);
});

// Login
loginForm && loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const users = readUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if(!found){ authMsg.textContent = 'Email yoki parol noto\'g\'ri.'; return; }
    setCurrentUser({ name: found.name, email: found.email });
    authMsg.style.color = '#065f46'; authMsg.textContent = 'Kirish muvaffaqiyatli.';
    setTimeout(()=>{ closeModal(); refreshAuthUI(); }, 600);
});

// Initialize on load and attach link handlers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // refresh UI
    refreshAuthUI();

    // Links
    // Open auth page when the user clicks "Kirish"
    const _signin = document.getElementById('signinLink');
    if(_signin){
        // replace any previous handler to avoid duplicates
        _signin.onclick = (e)=>{ e.preventDefault(); window.location.href = 'auth.html'; };
    }

    // The in-page modal code is kept for convenience (not used when full-page auth is preferred)
    if(showRegister) showRegister.addEventListener('click', ()=> openModal('register'));
    if(showLogin) showLogin.addEventListener('click', ()=> openModal('login'));
    if(modalClose) modalClose.addEventListener('click', closeModal);
    if(authModal) authModal.addEventListener('click', (e)=>{ if(e.target === authModal) closeModal(); });

    // attach logout handler (re-query element in case it wasn't present earlier)
    const _logoutEl = document.getElementById('logoutLink');
    if(_logoutEl) _logoutEl.addEventListener('click', (e)=>{ e.preventDefault(); clearCurrentUser(); refreshAuthUI(); /* optional: refresh the page header immediately */ });
});

// When navigating back/forward some browsers restore page from bfcache without firing DOMContentLoaded.
// Use pageshow to refresh UI and rebind critical handlers so the header reflects current auth state.
window.addEventListener('pageshow', ()=>{
    try{ refreshAuthUI(); }catch(e){}
    const _signin = document.getElementById('signinLink');
    if(_signin) _signin.onclick = (e)=>{ e.preventDefault(); window.location.href = 'auth.html'; };
    const _logout = document.getElementById('logoutLink');
    if(_logout) _logout.onclick = (e)=>{ e.preventDefault(); clearCurrentUser(); refreshAuthUI(); };
});
