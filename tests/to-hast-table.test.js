import h from 'hastscript';
import td from 'tdastscript';

import toHastTable from '../lib/to-hast-table';

describe(toHastTable, () => {
  it('should return empty table for empty table or invalid nodes', () => {
    expect(toHastTable(td('table'))).toEqual(h('table'));
    expect(toHastTable(h('invalidNode'))).toEqual(h('table'));
  });

  it('should return empty table with attached properties', () => {
    const tdast = td('table', {
      data: { nodeType: 'table' },
      position: 'mockTablePosition',
    });
    expect(toHastTable(tdast)).toEqual({
      type: 'element',
      tagName: 'table',
      data: { nodeType: 'table' },
      position: 'mockTablePosition',
      properties: {},
      children: [],
    });
  });

  it('should return table with rows of cells', () => {
    const tdast = td('table', [
      td('row', ['row0col0', 'row0col1', 'row0col2']),
      td('row', ['row1col0', 'row1col1', 'row1col2']),
      td('row', ['row2col0', 'row2col1', 'row2col2']),
    ]);
    expect(toHastTable(tdast)).toEqual(
      h('table', [
        h('tbody', [
          h('tr', [
            h('td', 'row0col0'),
            h('td', 'row0col1'),
            h('td', 'row0col2'),
          ]),
          h('tr', [
            h('td', 'row1col0'),
            h('td', 'row1col1'),
            h('td', 'row1col2'),
          ]),
          h('tr', [
            h('td', 'row2col0'),
            h('td', 'row2col1'),
            h('td', 'row2col2'),
          ]),
        ]),
      ]),
    );
  });

  it('should return table with thead and tbody with rows table cells', () => {
    const tdast = td('table', [
      td('row', [
        td('column', 'col0'),
        td('column', 'col1'),
        td('column', 'col2'),
      ]),
      td('row', ['row1col0', 'row1col1', 'row1col2']),
      td('row', ['row2col0', 'row2col1', 'row2col2']),
    ]);
    expect(toHastTable(tdast)).toEqual(
      h('table', [
        h('thead', [
          h('tr', [h('th', 'col0'), h('th', 'col1'), h('th', 'col2')]),
        ]),
        h('tbody', [
          h('tr', [
            h('td', 'row1col0'),
            h('td', 'row1col1'),
            h('td', 'row1col2'),
          ]),
          h('tr', [
            h('td', 'row2col0'),
            h('td', 'row2col1'),
            h('td', 'row2col2'),
          ]),
        ]),
      ]),
    );
  });

  it('should return table with thead and tbody even if there is only one header row', () => {
    const tdast = td('table', [
      td('row', [
        td('column', 'col0'),
        td('column', 'col1'),
        td('column', 'col2'),
      ]),
    ]);
    expect(toHastTable(tdast)).toEqual(
      h('table', [
        h('thead', [
          h('tr', [h('th', 'col0'), h('th', 'col1'), h('th', 'col2')]),
        ]),
        h('tbody'),
      ]),
    );
  });

  it('should pass on unist position and data properties', () => {
    const tdast = td(
      'table',
      {
        data: { nodeType: 'table' },
        position: 'mockTablePosition',
      },
      [
        td(
          'row',
          {
            data: { nodeType: 'row' },
            position: 'mockRow0Position',
          },
          [
            td('column', {
              data: { nodeType: 'column' },
              position: 'mockCol0Position',
              value: 'col0',
            }),
            td('column', {
              data: { nodeType: 'column' },
              position: 'mockCol1Position',
              value: 'col1',
            }),
            td('column', {
              data: { nodeType: 'column' },
              position: 'mockCol2Position',
              value: 'col2',
            }),
          ],
        ),
      ],
    );

    expect(toHastTable(tdast)).toEqual({
      type: 'element',
      tagName: 'table',
      data: {
        nodeType: 'table',
      },
      position: 'mockTablePosition',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'thead',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'tr',
              data: {
                nodeType: 'row',
              },
              position: 'mockRow0Position',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'th',
                  data: { nodeType: 'column' },
                  position: 'mockCol0Position',
                  properties: {},
                  children: [
                    {
                      type: 'text',
                      value: 'col0',
                      position: 'mockCol0Position',
                    },
                  ],
                },
                {
                  type: 'element',
                  tagName: 'th',
                  data: { nodeType: 'column' },
                  position: 'mockCol1Position',
                  properties: {},
                  children: [
                    {
                      type: 'text',
                      value: 'col1',
                      position: 'mockCol1Position',
                    },
                  ],
                },
                {
                  type: 'element',
                  tagName: 'th',
                  data: { nodeType: 'column' },
                  position: 'mockCol2Position',
                  properties: {},
                  children: [
                    {
                      type: 'text',
                      value: 'col2',
                      position: 'mockCol2Position',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'tbody',
          properties: {},
          children: [],
        },
      ],
    });
  });

  it('should apply options.useColumnLabel to use column.label as display value if possible', () => {
    const tdast = td('table', [
      td('row', [
        td('column', { label: 'Column 0 Label', value: 'col0' }),
        td('column', { label: 'Column 1 Label', value: 'col1' }),
        td('column', 'col2'),
      ]),
    ]);
    expect(toHastTable(tdast)).toEqual(
      h('table', [
        h('thead', [
          h('tr', [h('th', 'col0'), h('th', 'col1'), h('th', 'col2')]),
        ]),
        h('tbody'),
      ]),
    );
    expect(toHastTable(tdast, { useColumnLabel: true })).toEqual(
      h('table', [
        h('thead', [
          h('tr', [
            h('th', 'Column 0 Label'),
            h('th', 'Column 1 Label'),
            h('th', 'col2'),
          ]),
        ]),
        h('tbody'),
      ]),
    );
  });
});
