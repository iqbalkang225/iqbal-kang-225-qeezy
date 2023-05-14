import domEl from './domElements.js';

domEl.headerContainer.addEventListener('mousemove', (e) => {
  domEl.cursor.style.display = 'block';
  domEl.cursor.style.left = e.pageX + 'px';
  domEl.cursor.style.top = e.pageY + 'px';
  domEl.cursor.classList.remove('cursor-grow');
  domEl.headerLogo.classList.remove('text-black');

  if (e.target.classList.contains('header__logo')) {
    domEl.cursor.classList.add('cursor-grow');
    domEl.headerLogo.classList.add('text-black');
  }
});

domEl.headerContainer.addEventListener('mouseleave', (e) => {
  domEl.cursor.style.display = 'none';
  domEl.headerLogo.classList.remove('text-black');
});
