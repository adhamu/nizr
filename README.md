# Nizr

A tiny Node script for organising photos and videos into date folders

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

There are two objects in the JSON config file. One for `images` and one for `photos`. You can pass an array of paths to `input` and specify one `output` path which is the target directory after running script.

```sh
$ cp config.sample.json config.json
```

## Running

```sh
$ yarn && yarn build
$ node dist/index.js
```

_Note_: Running this script _does not_ copy the files, it _moves_ them to the target directory.
