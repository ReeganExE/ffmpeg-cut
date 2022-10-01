type StreamType = 'Audio' | 'Video' | 'Subtitle';

interface StreamItem {
  index: string;
  type: StreamType;
  lang?: string;
  stream_index?: number;
  raw: string;
  defaults?: boolean;
  forced?: boolean;
  codec?: string;
}

export interface FFMpegInfo {
  streams: StreamItem[];
  duration: string;
  bitrate: string;
  bitrate_unit: string;
}

export default function parseStreams(ffOutput: Buffer | string): FFMpegInfo | null {
  const str = typeof ffOutput === 'string' ? ffOutput : ffOutput.toString('utf8');
  const rawStreams = str.match(/^\s+Stream #.*/gm);
  if (!rawStreams) {
    return null;
  }

  const streams = rawStreams.map((line) => {
    const [sindex, stype] = line.split(': ');
    const [, idx, lang] = sindex.match(/Stream #(\d+:\d+)(\(\w+\))?/) || [];
    const langCode = lang ? lang.match(/\((\w+)\)/) : null;
    const stream: StreamItem = {
      type: stype as StreamType,
      index: idx,
      lang: langCode ? langCode[1] : undefined,
      raw: line.trim(),
    };
    return stream;
  });

  fillIndex(streams);

  return { streams, ...parseDuration(str) };
}

function fillIndex(streams: StreamItem[]) {
  const tracking: { [k in StreamType]: number } = {
    Audio: 0,
    Video: 0,
    Subtitle: 0,
  };
  streams.forEach((stream) => {
    if (tracking[stream.type] !== undefined) {
      stream.stream_index = tracking[stream.type]++;
    }

    stream.defaults = stream.raw.includes('(default)');
    stream.forced = stream.raw.includes('(forced)');
    const reg = new RegExp(`${stream.type}: ([^ ,]+)`);
    const codecMatched = stream.raw.match(reg);
    stream.codec = codecMatched ? codecMatched[1] : undefined;
  });
}

function parseDuration(rawFfmpegOutput: string): { duration: string; bitrate: string; bitrate_unit: string } {
  const [[, duration, bitrate, unit]] = [
    ...rawFfmpegOutput.matchAll(/^\s+Duration: ([^,]+),.* bitrate: (\d+) (\w+\/\w).*/gm),
  ];
  return {
    duration,
    bitrate,
    bitrate_unit: unit,
  };
}
