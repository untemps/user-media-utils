import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import filesize from "rollup-plugin-filesize"
import { terser } from 'rollup-plugin-terser'

const production = process.env.NODE_ENV === 'production'
const target = process.env.BABEL_ENV

export default {
	input: 'src/index.js',
	output: {
		name: 'user-media-utils',
		file: {
			cjs: 'dist/index.js',
			es: 'dist/index.es.js',
			umd: 'dist/index.umd.js'
		}[target],
		format: target
	},
	plugins: [
		babel({
			exclude: 'node_modules/**',
			runtimeHelpers: true
		}),
		resolve(),
		commonjs(),
		filesize(),
		production && terser(),
	],
}
