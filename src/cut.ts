import path from 'path';
import fs from 'fs/promises';

import execa from 'execa';
import chalk from 'chalk';

import { FFMpegInfo } from './parser';

interface CutArgs {
  input: FFMpegInfo;
  selector: string;
  start?: string;
  to?: string;
  sourceFile: string;
}

export default async function cut({ input, sourceFile, start, to }: CutArgs) {
  let seeks = [];
  if (start) {
    seeks.push('-ss', start);
  }
  if (to) {
    seeks.push('-to', to);
  }

  let child: execa.ExecaChildProcess;
  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    child.on('close', () => process.exit(1));
  });

  function exec(args: string[]) {
    // Keep reference for SIGTERM
    child = execa('ffmpeg', args, { stderr: 'inherit' });
    return child;
  }

  const file = path.parse(sourceFile);
  const tempFile = `${file.name}-temp${file.ext}`;
  const isRemote = sourceFile.startsWith('http');
  if (isRemote) {
    console.error(chalk.yellowBright(`Cutting file ...: ${tempFile}`));

    // we have to cut it to a local file
    await exec([
      '-hide_banner',
      ...seeks,
      '-i',
      sourceFile,
      '-map',
      '0',
      '-map_chapters',
      '-1',
      '-c',
      'copy',
      '-stats',
      '-loglevel',
      'error',
      '-y',
      tempFile,
    ]);
    // as file already cut, no further seeking
    seeks = [];
  }

  sourceFile = isRemote ? tempFile : sourceFile;
  const subStream = input.streams.find((s) => s.type === 'Subtitle' && (s.lang === 'vi' || s.lang === 'vie'));
  const si = subStream ? `:si=${subStream.stream_index}` : '';
  const app = [
    'ffmpeg',
    '-hide_banner',
    '-copyts',
    ...seeks,
    '-i',
    sourceFile,
    '-map',
    '0',
    '-map',
    '-0:s',
    '-vf',
    `subtitles=${sourceFile}${si}:force_style='Fontsize=22,PrimaryColour=&H0001FBFE&'`,
    '-c:v',
    'hevc_videotoolbox',
    '-q:v',
    '65',
    '-tag:v',
    'hvc1',
    '-b:v',
    `${input.bitrate}k`,
    '-c:a',
    'aac',
    '-stats',
    '-loglevel',
    'error',
    `${file.name}-cut${file.ext}`,
    '-y',
  ];

  console.error(chalk.yellowBright(printCommand(app)));
  try {
    await exec(app.slice(1));
  } catch (error) {
    const err = error as execa.ExecaError;
    console.error(err.stderr);
    throw new Error(`ffmpeg error code: ${err.exitCode}`);
  } finally {
    isRemote && fs.unlink(tempFile);
  }
}

function printCommand(app: string[]): string {
  const rs: string[] = [];
  for (let i = 0; i < app.length; ) {
    const next = app[i + 1];
    // support negative map: -map -0:s
    if (next && (app[i] === '-map' || !next.startsWith('-'))) {
      rs.push(`${app[i]} ${app[i + 1]}`);
      i += 2;
    } else {
      rs.push(app[i]);
      i++;
    }
  }

  return rs.join(' \\\n  ');
}
