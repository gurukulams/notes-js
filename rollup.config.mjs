import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs()
  ]
};