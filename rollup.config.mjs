import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/notes.js',
  
  // 1. Tell Rollup NOT to include Bootstrap in the bundle
  external: ['bootstrap', '@popperjs/core'], 

  output: [
    {
      file: 'dist/notes.bundle.js',
      format: 'umd',
      name: 'NotesMaker',
      sourcemap: true,
      // 2. Map the external imports to global variables for the UMD build
      globals: {
        'bootstrap': 'bootstrap',
        '@popperjs/core': 'Popper'
      }
    },
    {
      file: 'dist/notes.esm.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    postcss({
      extract: true,
      minimize: true
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs()
  ]
};