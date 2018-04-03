import babel from 'rollup-plugin-babel'

export default {
    input: 'src/monitor.js',
    output: {
        file: 'index.js',
        format: 'es'
    },
    plugins: [
        babel()
    ]
}