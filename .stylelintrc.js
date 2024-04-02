const { transpileModule } = require('typescript');

module.exports = {
  processors: ['stylelint-processor-styled-components'],
  extends: [
    'stylelint-config-standard-less',
    'stylelint-config-prettier',
    'stylelint-config-recommended',
    'stylelint-config-styled-components'
  ],
  plugins: ['stylelint-prettier'],
  overrides: [
    {
      files: 'packages/*/{src,lib}/**/*.less',
      customSyntax: 'postcss-less'
    },
    {
      files: 'packages/*/{src,lib}/**/{style.ts,element.ts}',
      customSyntax: 'postcss-styled-syntax'
    }
  ],
  rules: {
    // 关闭规则 null
    'comment-empty-line-before': null,
    'selector-descendant-combinator-no-non-space': null,
    'no-descending-specificity': null,
    'function-comma-newline-after': null,
    'no-missing-end-of-source-newline': null,
    'font-family-no-missing-generic-family-keyword': null,
    'property-no-unknown': [
      // 不允许未知的样式属性
      null,
      {
        ignoreProperties: ['composes', ':global']
      }
    ],
    'selector-pseudo-class-no-unknown': [
      // 不允许未知的选择器
      null,
      {
        ignorePseudoClasses: [':global', ':horizontal', ':vertical']
      }
    ],
    'selector-class-pattern': [
      '.*',
      {
        resolveNestedSelectors: true
      }
    ],
    'at-rule-no-unknown': null,
    'import-notation': null,
    'color-hex-length': null,
    'alpha-value-notation': null,
    'color-function-notation': 'legacy',
    'selector-not-notation': ['simple', 'complex']
  }
};
