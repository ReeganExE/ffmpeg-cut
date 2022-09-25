#!/usr/bin/env node

import execa from 'execa';
import { parserConfiguration } from 'yargs';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import parseStreams from './parser';

parserConfiguration({
  'parse-numbers': false,
});

const argv = yargs(hideBin(process.argv))
  .help(true)
  .options({
    verbose: { type: 'boolean' },
    format: { type: 'string' },
  })
  .alias('help', 'h')
  .check((argv) => {
    if (!argv._.length && process.stdin.isTTY) {
      throw new Error('Link required');
    }
    return true;
  })
  .parseSync();

const run = (input: Buffer) => {
  if (!input.length) {
    throw new Error('Empty input. Do you forget "2>&1"?\nExample: ffmpeg -i "file" 2>&1 | ffmpeg-cut');
  }
  parse(input);
};

async function read(t: NodeJS.ReadStream) {
  const n = [];
  for await (const o of t) n.push(o);
  return Buffer.concat(n);
}

if (process.stdin.isTTY) {
  const file = argv._[0] as string;

  console.error(`Executing: ffmpeg -i "${file}"`);
  execa('ffmpeg', ['-hide_banner', '-i', file])
    .then((r) => {
      throw new Error(`Something went wrong: ${r.escapedCommand}`);
    })
    .catch((r) => {
      if (r.exitCode === undefined) {
        // binary not found
        throw new Error(r.message);
      }
      const ffOutput = r.stderr;
      parse(ffOutput);
    });
} else {
  read(process.stdin).then(run);
}

function parse(ffOutput: string | Buffer) {
  const streams = parseStreams(ffOutput);
  if (argv.verbose) {
    console.error(ffOutput);
  }

  if (argv.format === 'json') {
    process.stdout.write(JSON.stringify(streams, null, 2));
  } else {
    console.log(streams);
  }
}
