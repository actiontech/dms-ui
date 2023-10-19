import { Monaco } from '@monaco-editor/react';

export const regexMonarch: Parameters<
  Monaco['languages']['setMonarchTokensProvider']
>[1] = {
  ignoreCase: false,

  tokenizer: {
    root: [
      [
        /\/(?=(?:\\.|[^\\/\\\n\r])+?\/[gimuy]{0,5}(?=\W|$))(?:\\.|[^\\/\\\n\r])+?\/[gimuy]{0,5}/,
        'regexp'
      ], // match regular expression literals
      [/\$[\w$]+/, 'variable'], // match variables
      [/\b[A-Z]\w*\b/, 'type'], // match types
      [/\b(?:\d+\.?\d*|\.\d+)\b/, 'number'], // match numbers
      [/[{}[\]()?,.:;]/, 'delimiter'] // match delimiters
    ]
  },
  defaultToken: 'invalid'
};

export const regexLanguage: Parameters<Monaco['languages']['register']>[0] = {
  id: 'regexp',
  aliases: ['Regexp', 'regexp'],
  mimetypes: ['text/regexp']
};
