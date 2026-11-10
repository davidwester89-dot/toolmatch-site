// The links remain visible if JavaScript is disabled or this script cannot load.
(() => {
  const button = document.querySelector('.nav-toggle');
  const menu = document.getElementById(button?.getAttribute('aria-controls'));
  if (!button || !menu) return;

  const mobile = window.matchMedia('(max-width: 899px)');
  const close = (restoreFocus = false) => {
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus();
  };
  button.addEventListener('click', () => {
    button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'));
  });
  menu.addEventListener('click', (event) => {
    if (mobile.matches && event.target.closest('a')) close(true);
  });
  document.addEventListener('keydown', (event) => {
    if (mobile.matches && event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      close(true);
    }
  });
  document.addEventListener('click', (event) => {
    if (mobile.matches && !menu.contains(event.target) && !button.contains(event.target)) {
      close(menu.contains(document.activeElement));
    }
  });
  mobile.addEventListener('change', () => {
    const focusInMenu = menu.contains(document.activeElement);
    close(mobile.matches && focusInMenu);
    if (!mobile.matches && document.activeElement === button) menu.querySelector('a')?.focus();
  });
  button.hidden = false;
})();
