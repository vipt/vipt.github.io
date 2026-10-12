'use strict';
// Illustrative data only; the native Android app provides the full CSV workflow.
const sample = [
  ['Avocados', 'Produce', 24], ['Blueberries', 'Produce', 18],
  ['Sourdough', 'Bakery', 12], ['Olive oil', 'Pantry', 8],
  ['Cherry tomatoes', 'Produce', 32], ['Wildflower honey', 'Pantry', 16],
  ['Fresh basil', 'Produce', 10], ['Oat milk', 'Pantry', 20],
  ['Croissants', 'Bakery', 15], ['Lemons', 'Produce', 28],
  ['Granola', 'Pantry', 14], ['Peaches', 'Produce', 22]
];
let category = 'all';
let sortDirection = 0;
const search = document.getElementById('search');
const sortButton = document.getElementById('sort');
const rows = document.getElementById('sample-rows');
function render() {
  const query = search.value.trim().toLowerCase();
  const visible = sample.filter(row => (category === 'all' || row[1] === category) && row.some(value => String(value).toLowerCase().includes(query)));
  if (sortDirection) visible.sort((a, b) => a[0].localeCompare(b[0], 'en') * sortDirection);
  rows.replaceChildren(...visible.map((row, index) => {
    const tr = document.createElement('tr');
    [index + 1, ...row].forEach(value => { const td = document.createElement('td'); td.textContent = value; tr.append(td); });
    return tr;
  }));
  document.getElementById('row-count').textContent = `${visible.length} ${visible.length === 1 ? 'row' : 'rows'} × 3 columns`;
  document.getElementById('no-results').hidden = visible.length > 0;
  document.getElementById('sort-indicator').textContent = sortDirection === 1 ? '↑' : sortDirection === -1 ? '↓' : '↕';
  rows.closest('table').querySelectorAll('th')[1].setAttribute('aria-sort', sortDirection === 1 ? 'ascending' : sortDirection === -1 ? 'descending' : 'none');
}
search.addEventListener('input', render);
sortButton.addEventListener('click', () => {
  sortDirection = sortDirection === 1 ? -1 : 1;
  sortButton.setAttribute('aria-label', sortDirection === 1 ? 'Sort sample items Z to A' : 'Sort sample items A to Z');
  render();
});
document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => {
  category = button.dataset.category;
  document.querySelectorAll('.filter-chip').forEach(chip => {
    const active = chip === button;
    chip.classList.toggle('active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
  render();
}));
render();
