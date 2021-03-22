# Nizr

A tiny Node script for organising files into date folders

## Requirements

- Node v14.15.5
- Yarn

## Output Folder Format

```
2021/03 - March/
2021/02 - February/
2021/01 - January/
```

## Config

The JSON config is an array of objects. Each object has the following properties

| Name     | Description                                                                                       | Type    |
| -------- | ------------------------------------------------------------------------------------------------- | ------- |
| `inputs` | A list of input source directories.                                                               | array   |
| `output` | The target directory for processed input sources.                                                 | string  |
| `glob`   | Glob pattern to filter files.                                                                     | string  |
| `move`   | (Optional) By default, files that processed are _copied_. Set this to `true` to _move_ the files. | boolean |

```sh
$ cp config.sample.json config.json
```

## Running

```sh
$ yarn && yarn build
$ node dist/index.js
```
