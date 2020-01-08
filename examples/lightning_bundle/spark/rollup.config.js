const resolve = require('rollup-plugin-node-resolve');

export default {
    input: 'start.mjs',
    plugins: [resolve({
        only: [ 'wpe-lightning-spark', 'wpe-lightning' ]
    })],
    output: {
        file: './lightning-demo-spark.js',
        format: 'cjs',
        name: 'lng'
    }
};