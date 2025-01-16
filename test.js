import test from 'https://esm.sh/tape@5.9.0'
import parse from './index.js'

test((t) => {
	t.equal(parse('Hello World').value, 'Hello World')
	t.equal(parse('true').value, true)
	t.equal(parse('false').value, false)
	t.equal(parse('123').value, 123)
	t.equal(parse('1.23').value, 1.23)
	t.equal(parse('null').value, null)

	t.equal(parse('1k').value, '1k')

	t.deepEqual(parse('[]').value, [])
	t.deepEqual(parse('[Hello World]').value, ['Hello World'])
	t.deepEqual(parse('[Hello,World]').value, ['Hello', 'World'])
	t.deepEqual(parse('[Hello,true,World]').value, ['Hello', true, 'World'])
	t.deepEqual(parse('[Hello,[true,World]]').value, ['Hello', [true, 'World']])
	t.deepEqual(parse('[[Hello,true],World]').value, [['Hello', true], 'World'])
	t.deepEqual(parse('[true,[true,Hello],false]').value, [
		true,
		[true, 'Hello'],
		false,
	])

	t.deepEqual(parse('{}').value, {})
	t.deepEqual(parse('{key:value}').value, {key: 'value'})
	t.deepEqual(parse('{foo:bar,baz:qux}').value, {foo: 'bar', baz: 'qux'})
	t.deepEqual(parse('{foo:bar,baz:{qux:true}}').value, {
		foo: 'bar',
		baz: {qux: true},
	})
	t.deepEqual(parse('{foo:[bar,{baz:bax}]}').value, {
		foo: ['bar', {baz: 'bax'}],
	})

	t.end()
})
