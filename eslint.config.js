import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';
import * as svelteParser from 'svelte-eslint-parser';
import * as typescriptParser from '@typescript-eslint/parser';

export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: typescriptParser,
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'],
        svelteConfig
      }
    },
    rules: {
      'arrow-spacing': 'warn',
      'arrow-body-style': ['warn', 'as-needed'
      ],
      'array-callback-return': 1,
      'block-spacing': 'warn',
      'brace-style': 'warn',
      'curly': ['warn'
      ],
      'func-call-spacing': ['error', 'never'
      ],
      'import/no-extraneous-dependencies': 0,
      'import/prefer-default-export': 0,
      'indent': ['error',
        2
      ],
      'keyword-spacing': 'warn',
      'linebreak-style': 'off',
      'newline-per-chained-call': ['warn',
        {
          'ignoreChainWithDepth': 2
        }
      ],
      'no-unused-vars': 2,
      'no-unexpected-multiline': 'warn',
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'warn',
      'no-whitespace-before-property': 'error',
      'no-multiple-empty-lines': 'warn',
      'no-extra-parens': 'error',
      'no-else-return': 'warn',
      'no-lonely-if': 'warn',
      'no-var': 'error',
      'no-useless-return': 'error',
      'object-curly-spacing': ['warn', 'always'
      ],
      'object-shorthand': 'warn',
      'prefer-arrow-callback': ['error',
        {
          allowNamedFunctions: false, allowUnboundThis: true
        }
      ],
      'rest-spread-spacing': ['warn', 'never'
      ],
      'semi': ['error', 'never'
      ],
      'space-in-parens': ['warn', 'never'
      ],
      'space-before-blocks': 'warn',
      'template-curly-spacing': 'error',
      'valid-typeof': "warn",
      'quotes': [
        1, 'single',
        {
          'avoidEscape': true, 'allowTemplateLiterals': true
        }
      ],
      'yoda': 'warn',
      // <-- begin svelte -->
      // 'svelte/no-at-html-tags': 2,
      'jsx-a11y/click-events-have-key-events': 'off'
    },
  }
];
