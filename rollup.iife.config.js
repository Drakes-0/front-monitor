import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
    input: 'src/monitor.js',
    output: {
        file: 'dist/monitor.min.js',
        format: 'iife',
        name: 'ExceptionMonitor'
    },
    plugins: [
        babel(),
        uglify()
    ]
}