import fs from 'fs/promises';

import parseStreams from '../parser';

describe('Parser', () => {
  it('should print streams', async () => {
    const d = await fs.readFile('src/__tests__/sample2.txt');
    expect(parseStreams(d)).toMatchObject({
      duration: '02:23:58.30',
      bitrate: '27982',
      bitrate_unit: 'kb/s',
      streams: [
        {
          type: 'Video',
          index: '0:0',
          lang: 'eng',
          stream_index: 0,
          defaults: true,
          forced: false,
          codec: 'hevc',
        },
        {
          type: 'Audio',
          index: '0:1',
          lang: 'eng',
          stream_index: 0,
          defaults: true,
          forced: false,
          codec: 'truehd',
        },
        {
          type: 'Audio',
          index: '0:2',
          lang: 'eng',
          stream_index: 1,
          defaults: false,
          forced: false,
          codec: 'ac3',
        },
        {
          type: 'Audio',
          index: '0:3',
          lang: 'chi',
          stream_index: 2,
          defaults: false,
          forced: false,
          codec: 'truehd',
        },
        {
          type: 'Audio',
          index: '0:4',
          lang: 'chi',
          stream_index: 3,
          defaults: false,
          forced: false,
          codec: 'ac3',
        },
        {
          type: 'Audio',
          index: '0:5',
          lang: 'eng',
          stream_index: 4,
          defaults: false,
          forced: false,
          codec: 'ac3',
        },
        {
          type: 'Audio',
          index: '0:6',
          lang: 'eng',
          stream_index: 5,
          defaults: false,
          forced: false,
          codec: 'ac3',
        },
        {
          type: 'Subtitle',
          index: '0:7',
          lang: 'eng',
          stream_index: 0,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:8',
          lang: 'chi',
          stream_index: 1,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:9',
          lang: 'chi',
          stream_index: 2,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:10',
          lang: 'chi',
          stream_index: 3,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:11',
          lang: 'chi',
          stream_index: 4,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:12',
          lang: 'chi',
          stream_index: 5,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:13',
          lang: 'chi',
          stream_index: 6,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:14',
          lang: 'chi',
          stream_index: 7,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:15',
          lang: 'chi',
          stream_index: 8,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:16',
          lang: 'chi',
          stream_index: 9,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:17',
          lang: 'chi',
          stream_index: 10,
          defaults: true,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:18',
          lang: 'chi',
          stream_index: 11,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:19',
          lang: 'eng',
          stream_index: 12,
          defaults: false,
          forced: false,
          codec: 'hdmv_pgs_subtitle',
        },
        {
          type: 'Subtitle',
          index: '0:20',
          lang: 'vie',
          stream_index: 13,
          defaults: true,
          forced: true,
          codec: 'subrip',
        },
        {
          type: 'Video',
          index: '0:21',
          stream_index: 1,
          defaults: false,
          forced: false,
          codec: 'mjpeg',
        },
      ],
    });
  });
});
