const copy = require('rollup-plugin-copy');
const cleanup = require('rollup-plugin-cleanup');
const del = require('rollup-plugin-delete');
const resolve = require('rollup-plugin-node-resolve');

export default {
    external: ['fs', 'http', 'https', 'node-fetch'],
    input: './src/index.js',
    output: {
        file: `./dist/index.bundle.js`,
        format: 'cjs',
        name: 'lng',
    },
    plugins: [
        del({targets: `./dist`}),
        resolve(),
        cleanup({comments: 'none', sourcemap: false}),
        copy({targets: [{src: './static', dest: `./dist/`}]}),
    ],
};
