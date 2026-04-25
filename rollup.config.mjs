import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-import-css';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/notes.js',
  output: [
    {
      file: 'dist/notes.bundle.js',
      format: 'umd',
      name: 'NotesMaker',
      sourcemap: true
    },
    {
      file: 'dist/notes.esm.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    // 2. Define process.env.NODE_ENV
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    css(),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs()
  ]
};