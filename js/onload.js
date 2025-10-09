const prepareLinks = () => {
  const hyperlinks = document.querySelectorAll('.hyperlink');

  hyperlinks.forEach(elem => {
    const cleanHref = elem.href
      .replace(/q/g, '')
      .replace('(at)', '@')
      .replace(/\(dot\)/g, '.');

    elem.href = cleanHref;
    elem.querySelector('span').textContent = cleanHref.replace('mailto:', '');
  });
};

const init = () => {
  prepareLinks();
};

// Modern event listener
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
