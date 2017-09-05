import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default [
  {
    entry: 'index.js',
    format: 'iife',
    plugins: [resolve(), commonjs(), babel()],
    globals: { react: 'React' },
    external: ['react'],
    moduleName: 'ReactNativePortal',
    sourceMap: 'true',
    dest: 'dist/es5.js',
  },
  {
    entry: 'index.js',
    format: 'iife',
    plugins: [resolve(), commonjs(), babel(), uglify()],
    globals: { react: 'React' },
    external: ['react'],
    moduleName: 'ReactNativePortal',
    sourceMap: 'true',
    dest: 'dist/min.js',
  },
  {
    entry: 'index.js',
    format: 'cjs',
    plugins: [resolve(), babel()],
    external: ['react', 'mitt', 'prop-types'],
    moduleName: 'ReactNativePortal',
    sourceMap: 'true',
    dest: 'dist/commonjs.js',
  },
  {
    entry: 'index.js',
    format: 'umd',
    plugins: [resolve(), commonjs(), babel(), uglify()],
    globals: { react: 'React' },
    external: ['react'],
    moduleName: 'ReactNativePortal',
    sourceMap: 'true',
    dest: 'dist/umd.js',
  },
];
