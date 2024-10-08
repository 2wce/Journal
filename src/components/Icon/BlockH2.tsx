import React from 'react';
import { theme } from '@/themes';

export function BlockH2({ tintColor, ...props }: any) {
  return (
    <svg width={32} height={32} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        opacity={0.15}
        d='M27 22H5a1 1 0 100 2h22a1 1 0 100-2zM22 26H5a1 1 0 100 2h17a1 1 0 100-2z'
        fill={tintColor || theme('color.primary.main')}
      />
      <path
        d='M5.002 16V7.273h1.845v3.6h3.746v-3.6h1.84V16h-1.84v-3.605H6.847V16H5.002zM13.904 16v-1.33l3.107-2.876c.264-.256.485-.486.664-.69.182-.205.32-.405.414-.601a1.49 1.49 0 00.14-.644c0-.255-.058-.476-.174-.66a1.147 1.147 0 00-.478-.43 1.496 1.496 0 00-.686-.154c-.267 0-.5.054-.699.162a1.115 1.115 0 00-.46.464 1.505 1.505 0 00-.162.72H13.82c0-.57.129-1.066.387-1.487a2.59 2.59 0 011.087-.976c.466-.23 1.003-.345 1.61-.345.626 0 1.17.111 1.633.333a2.59 2.59 0 011.087.912c.258.389.387.835.387 1.338 0 .33-.065.654-.196.976-.127.32-.356.677-.686 1.07-.33.388-.794.856-1.393 1.401l-1.274 1.249v.06h3.665V16h-6.222z'
        fill={tintColor || theme('color.primary.main')}
      />
    </svg>
  );
}
