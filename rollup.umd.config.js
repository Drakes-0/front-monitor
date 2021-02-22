import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
    input: 'build/index.js',
    output: {
        file: 'index.js',
        format: 'umd',
        name: '_FEEMonitor'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        uglify()
    ]
}