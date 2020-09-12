# tdast-util-to-hast-table

[**tdast**][tdast] utility to transform to a [hast][] table node.

---

## Install

```sh
npm install tdast-util-to-hast-table
```

## Use

Given a tdast table node,

```js
const tdast = {
  type: 'table',
  children: [
    {
      type: 'row',
      index: 0,
      children: [
        {
          type: 'column',
          index: 0,
          value: 'col0',
        },
        {
          type: 'column',
          index: 1,
          value: 'col1',
        },
        {
          type: 'column',
          index: 2,
          value: 'col2',
        },
      ],
    },
    {
      type: 'row',
      index: 1,
      children: [
        {
          type: 'cell',
          columnIndex: 0,
          rowIndex: 1,
          value: 'row1col0',
        },
        {
          type: 'cell',
          columnIndex: 1,
          rowIndex: 1,
          value: 'row1col1',
        },
        {
          type: 'cell',
          columnIndex: 2,
          rowIndex: 1,
          value: 'row1col2',
        },
      ],
    },
    {
      type: 'row',
      index: 2,
      children: [
        {
          type: 'cell',
          columnIndex: 0,
          rowIndex: 2,
          value: 'row2col0',
        },
        {
          type: 'cell',
          columnIndex: 1,
          rowIndex: 2,
          value: 'row2col1',
        },
        {
          type: 'cell',
          columnIndex: 2,
          rowIndex: 2,
          value: 'row2col2',
        },
      ],
    },
  ],
};
```

transform into a compatible [hast][] table node:

```js
import toHastTable from 'tdast-util-to-hast-table';

expect(toHastTable(tdast)).toEqual({
  type: 'element',
  tagName: 'table',
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
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'th',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'col0',
                },
              ],
            },
            {
              type: 'element',
              tagName: 'th',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'col1',
                },
              ],
            },
            {
              type: 'element',
              tagName: 'th',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'col2',
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
      children: [
        {
          type: 'element',
          tagName: 'tr',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row1col0',
                },
              ],
            },
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row1col1',
                },
              ],
            },
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row1col2',
                },
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'tr',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row2col0',
                },
              ],
            },
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row2col1',
                },
              ],
            },
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row2col2',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
```

## API

### `toHastTable(tdast[, options])`

#### Interface
```ts
function toHastTable(
  /** a valid tdast Table node */
  tdast: Table,
  /** configurable options */
  options?: Options,
): Hast;
```

Transforms a tdast `Table` node into a [hast][] table node.  A summary of transformation behaviors is listed below:
- `hast.table` from `tdast.Table`
- `hast.tr` from `tdast.Row`
- `hast.th` from `tdast.Column`
- `hast.td` from `tdast.Cell`
- `hast.thead` from infering if `tdast.Row` has column nodes, and assigns the first `hast.tr` node in `hast.thead`.
- `hast.tbody` from rendering all `tdast.Row` that do not have column nodes as `hast.tr` nodes in `hast.tbody`.

Unist properties such as `data` and [`position`][dfn-unist-position] is copied over during the transformation, which allows for useful manipulation in hast.

It is convenient to use [tdastscript][] to create tdast trees, and `tdast-util-to-hast-table` will transform them into compatible hast trees created through [hastscript][], as shown in the example below:

#### Example
```js
import h from 'hastscript';
import td from 'tdastscript';
import toHastTable from 'tdast-util-to-hast-table';

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
```

#### Related interfaces
```ts
interface Options {
  /** use the `label` property of a tdast `Column` node for the text value of a hast thead node. */
  useColumnLabel?: boolean;
}
```

<!-- Definitions -->
[dfn-unist-position]: https://github.com/syntax-tree/unist#position
[hast]: https://github.com/syntax-tree/hast
[hastscript]: https://github.com/syntax-tree/hastscript
[tdast]: https://github.com/tdast/tdast
[tdastscript]: https://github.com/tdast/tdastscript
