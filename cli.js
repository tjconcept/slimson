#!/usr/bin/env -S deno run
import parse from './index.js'

const parsed = parse(Deno.args.at(0))
console.log(JSON.stringify(parsed.value))
