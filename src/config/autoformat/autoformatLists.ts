import {
  AutoformatRule,
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_UL,
} from '@udecode/plate';
import { clearBlockFormat, formatList } from './autoformatUtils';

export const autoformatLists: AutoformatRule[] = [
  {
    mode: 'block',
    type: ELEMENT_LI,
    match: ['* ', '- '],
    preFormat: clearBlockFormat,
    format: (editor) => formatList(editor, ELEMENT_UL),
  },
  {
    mode: 'block',
    type: ELEMENT_LI,
    match: ['1. ', '1) '],
    preFormat: clearBlockFormat,
    format: (editor) => formatList(editor, ELEMENT_OL),
  },
  // {
  //   mode: 'block',
  //   type: ELEMENT_TODO_LI,
  //   match: '[] ',
  // },
  // {
  //   mode: 'block',
  //   type: ELEMENT_TODO_LI,
  //   match: '[x] ',
  //   format: (editor) =>
  //     setNodes<TElement<TTodoListItemElement>>(
  //       editor,
  //       { type: ELEMENT_TODO_LI, checked: true },
  //       {
  //         match: (n) => Editor.isBlock(editor, n),
  //       }
  //     ),
  // },
];
