import pkg from './package.json';

export default {
  input: 'rollup-plugin.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  plugins: [],
  external: Object.keys({...pkg.dependencies, ...pkg.peerDependencies})
};
