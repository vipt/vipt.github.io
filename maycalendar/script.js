const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab, focus = false) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  if (focus) tab.focus();
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    const direction = document.documentElement.dir === 'rtl' ? -1 : 1;
    if (event.key === 'ArrowRight') next = (index + direction + tabs.length) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - direction + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
  });
}
const languageMenu = document.querySelector('.language-menu');
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && languageMenu?.open) {
    languageMenu.open = false;
    languageMenu.querySelector('summary').focus();
  }
});
document.addEventListener('click', event => {
  if (languageMenu?.open && !languageMenu.contains(event.target)) languageMenu.open = false;
});
