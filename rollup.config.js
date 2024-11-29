import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/video-player.ts',
  output: [
    {
      file: 'dist/video-player.js',
      format: 'umd',
      name: 'VideoPlayer',
      sourcemap: true,
      exports: 'default'
    },
    {
      file: 'dist/video-player.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    typescript()
  ]
}