import path from 'path';

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
  const seeks = [];
  if (start) {
    seeks.push('-ss', start);
  }
  if (to) {
    seeks.push('-to', to);
  }
  const si = input.streams.find((s) => s.type === 'Subtitle' && (s.lang === 'vi' || s.lang === 'vie'));
  const app = [
    'ffmpeg',
    '-hide_banner',
    '-copyts',
    ...seeks,
    '-i',
    sourceFile,
    '-vf',
    `subtitles=${sourceFile}:si=${si?.stream_index}:force_style="'Fontsize=24,PrimaryColour=&H0001FBFE&'"`,
    '-c:v',
    'hevc_videotoolbox',
    '-q:v',
    '65',
    '-tag:v',
    'hvc1',
    '-b:v',
    `${input.bitrate}k`,
    `${path.parse(sourceFile).name}-cut.mp4`,
    '-y',
  ];

  console.error(chalk.yellowBright(app.join(' ')));
  await execa('ffmpeg', app.slice(1), { stderr: 'inherit' });
}
