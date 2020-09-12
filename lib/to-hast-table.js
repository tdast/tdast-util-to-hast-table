import h from 'hastscript';

function copy(hast, tdast, properties) {
  properties.forEach((property) => {
    if (tdast[property]) {
      // note: this is not performant, but is satifies the serializability of unist trees and does not require external dependencies
      hast[property] = JSON.parse(JSON.stringify(tdast[property]));
    }
  });
}

function hasColumnCell(row) {
  const [firstCell] = row && row.children;
  return firstCell && firstCell.type === 'column';
}

function createTr(tdastRow, cellTagName, getCellValue) {
  const children = tdastRow.children.map((cell) => {
    const tcell = h(cellTagName, getCellValue(cell));
    const text = tcell.children[0];
    copy(tcell, cell, ['data', 'position']);
    copy(text, cell, ['position']);
    return tcell;
  });
  const tr = h('tr', children);
  copy(tr, tdastRow, ['data', 'position']);
  return tr;
}

export default function toHastTable(tdast, options = {}) {
  if (tdast.type !== 'table') {
    return h('table');
  }

  const table = h('table');
  const thead = h('thead');
  const tbody = h('tbody');
  const rows = tdast.children;
  copy(table, tdast, ['position', 'data']);

  if (rows.length === 0) {
    return table;
  }

  function getCellValue(cell) {
    const { label, type, value } = cell;
    return type === 'column' && options.useColumnLabel ? label || value : value;
  }

  const [headRow, ...restRows] = rows;
  let bodyRows = rows;
  if (hasColumnCell(headRow)) {
    bodyRows = restRows;
    thead.children.push(createTr(headRow, 'th', getCellValue));
    table.children.push(thead);
  }

  tbody.children = bodyRows.map((row) => createTr(row, 'td', getCellValue));
  table.children.push(tbody);

  return table;
}
