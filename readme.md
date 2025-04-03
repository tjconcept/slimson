# Slimson

Typing JSON by hand is tedious. Slimson is an approximate JSON language that
compiles to JSON focused on speed of writing and ease of parsing.

Unlike other JSON alternatives such as JSON5, HJSON, YAML and TOML, neither
readability nor aesthetics is a priority. The goal is minimizing typing effort,
making it faster and easier to write, especially in constrained environments
like command lines.

## Example

```
{name:John,retired:true,pets:[cat,dog]}
```

Compiles to:

```JSON
{"name":"John","retired":true,"pets":["cat","dog"]}
```

## CLI

```sh
deno install --reload --global --name slimson https://raw.githubusercontent.com/tjconcept/slimson/refs/heads/main/cli.js
slimson '{name:John,age:22,pets:[cat,dog]}'
# {"name":"John","age":22,"pets":["cat","dog"]}
```

## Test

```sh
deno --allow-env --allow-read ./test.js
```
