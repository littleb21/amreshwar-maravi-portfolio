/**
 * AMRESHWAR MARAVI - ULTRA-LUXURY GLASSMORPHIC PORTFOLIO
 * Interactive JavaScript Engine
 */

// Project Data Registry
const PROJECTS = {
  flowstate: {
    title: "Flowstate",
    subtitle: "Web Application & Mobile Experience",
    image: "flowstate.jpg",
    about: "Redesigned the online shopping experience for a mid-sized fashion brand. Focused on creating an elegant, mobile-first design with seamless navigation and interactive product displays. Integrated a robust filtering system for faster product discovery.",
    achievements: "Improved conversion rates by 20% within three months post-launch, reduced checkout abandonment by 14%, and elevated mobile session duration to an average of 4.2 minutes."
  },
  aetheria: {
    title: "Aetheria AI",
    subtitle: "Generative AI Workflow & Creative Suite",
    image: "aetheria.jpg",
    about: "A next-generation browser studio enabling visual artists to chain generative image models, refine latent noise seeds, and orchestrate complex prompt pipelines visually on an infinite nodal canvas.",
    achievements: "Adopted by 15,000+ digital designers in private beta; reduced visual generation pipeline latency by 35% with specialized WebGL shader nodes."
  }
};

// State
let currentActiveTab = 'tab-home';
let toastTimeout = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initCursorLighting();
  initTiltEffect();
  initCopyButtons();
  initKeyboardNav();
});

/**
 * Tab Navigation Switcher
 */
function switchTab(tabId) {
  if (currentActiveTab === tabId) return;

  const currentPanel = document.getElementById(currentActiveTab);
  const targetPanel = document.getElementById(tabId);
  const dockButtons = document.querySelectorAll('.dock-item-btn');

  if (!targetPanel) return;

  // Deactivate current panel
  if (currentPanel) {
    currentPanel.classList.remove('active');
  }

  // Activate target panel
  targetPanel.classList.add('active');
  currentActiveTab = tabId;

  // Update Dock active state
  dockButtons.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Animate skill progress bars if skills tab is opened
  if (tabId === 'tab-skills') {
    animateSkillBars();
  }

  // Smooth scroll back to top of card on mobile
  if (window.innerWidth < 1024) {
    const card = document.getElementById('portfolioCard');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/**
 * Animate Language Proficiency Progress Bars
 */
function animateSkillBars() {
  const bars = document.querySelectorAll('.language-bar-fill');
  bars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 150);
  });
}

/**
 * Interactive 3D Tilt Effect on Desktop
 */
function initTiltEffect() {
  const card = document.getElementById('portfolioCard');
  if (!card || window.matchMedia('(pointer: coarse)').matches) return;

  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - cardCenterX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - cardCenterY) / (window.innerHeight / 2);

      const rotateX = -deltaY * 3.5; // subtle tilt max 3.5 deg
      const rotateY = deltaX * 3.5;

      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });
  });

  window.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  });
}

/**
 * Ambient Cursor Glow
 */
function initCursorLighting() {
  const cursorOrb = document.getElementById('orbCursor');
  if (!cursorOrb || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    cursorOrb.style.left = `${currentX}px`;
    cursorOrb.style.top = `${currentY}px`;

    requestAnimationFrame(renderCursor);
  }
  renderCursor();
}

/**
 * Copy to Clipboard for Contact Pills
 */
function initCopyButtons() {
  const copyElements = document.querySelectorAll('[data-copy]');
  copyElements.forEach(el => {
    el.addEventListener('click', () => {
      const textToCopy = el.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => showToast(`Copied "${textToCopy}" to clipboard!`))
          .catch(() => fallbackCopy(textToCopy));
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast(`Copied "${text}" to clipboard!`);
  } catch (err) {
    showToast(`Unable to copy automatically`);
  }
  document.body.removeChild(textarea);
}

/**
 * Toast Notifications
 */
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const msgEl = document.getElementById('toastMessage');

  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Project Detail Modal Management
 */
function openProjectModal(projectId) {
  const data = PROJECTS[projectId] || PROJECTS.flowstate;
  const modal = document.getElementById('projectModal');

  document.getElementById('modalProjectTitle').textContent = data.title;
  document.getElementById('modalProjectSub').textContent = data.subtitle;
  document.getElementById('modalProjectImg').src = data.image;
  document.getElementById('modalProjectAbout').textContent = data.about;
  document.getElementById('modalProjectAchievements').textContent = data.achievements;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleModalOverlayClick(e) {
  if (e.target.id === 'projectModal') {
    closeProjectModal();
  }
}

/**
 * CV Modal Management
 */
const btnDownloadCV = document.getElementById('btnDownloadCV');
if (btnDownloadCV) {
  btnDownloadCV.addEventListener('click', (e) => {
    e.preventDefault();
    openCVModal();
  });
}

function openCVModal() {
  const modal = document.getElementById('cvModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCVModal() {
  const modal = document.getElementById('cvModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleCVModalOverlayClick(e) {
  if (e.target.id === 'cvModal') {
    closeCVModal();
  }
}

/**
 * Direct Contact Form Submit Handler
 */
function handleFormSubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const msgInput = document.getElementById('senderMessage');

  const senderName = nameInput ? nameInput.value.trim() : 'Guest';

  showToast(`Thank you, ${senderName}! Your message was sent successfully.`);
  
  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  if (msgInput) msgInput.value = '';
}

/**
 * Keyboard Shortcuts
 */
function initKeyboardNav() {
  window.addEventListener('keydown', (e) => {
    // ESC closes modals
    if (e.key === 'Escape') {
      closeProjectModal();
      closeCVModal();
      return;
    }

    // Number keys 1-5 switch tabs when no form input is focused
    if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }

    const tabs = ['tab-home', 'tab-summary', 'tab-experience', 'tab-skills', 'tab-links'];
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 5) {
      switchTab(tabs[num - 1]);
    }
  });
}
