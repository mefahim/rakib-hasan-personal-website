(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-navigation');

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectRows = [...document.querySelectorAll('.project-row[data-category]')];
  const status = document.querySelector('.filter-status');
  const emptyState = document.querySelector('.empty-state');

  if (filterButtons.length && projectRows.length) {
    const updateFilter = (filter) => {
      let visible = 0;
      projectRows.forEach((row) => {
        const matches = filter === 'all' || row.dataset.category === filter;
        row.hidden = !matches;
        if (matches) visible += 1;
      });
      filterButtons.forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      if (status) status.textContent = `Showing ${visible} ${visible === 1 ? 'project' : 'projects'}`;
      if (emptyState) emptyState.hidden = visible !== 0;
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => updateFilter(button.dataset.filter));
    });
  }
})();
