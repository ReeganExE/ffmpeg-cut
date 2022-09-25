# ffmpeg-cut - Cut online video made easy

An npm package which supports parsing `ffmpeg`'s streams output and generates `ffmpeg` config for cutting video.

Useful for those who want to cut a part of online video (auto hardsub by stream selector) without downloading the whole one.

> Note: This is in development. See TODO below.

## Install

```sh
npm install ffmpeg-cut
```

## Usage

### Parse and print streams info

> Required ffmpeg on your PATH

```sh
# online url
ffmpeg-cut http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4

# pipe from ffmpeg's output
ffmpeg -i 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' 2>&1 | ffmpeg-cut

# local file
ffmpeg-cut './X-Men.Apocalypse.2016.UHD.BluRay.2160p.10bit.HDR.2Audio.DTS-HD.MA.7.1.x265-beAst.mkv'
```

#### Print as JSON format
By default, `ffmpeg-cut` will print output as a JSON-like format.
If you want to get output as a real JSON, speicify `--format json` argument.

```sh
ffmpeg-cut --format json http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```
##### Pipe to jq
```
ffmpeg-cut --format json http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4 | jq .
```
Output
```yaml
# Executing: ffmpeg -i "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
{
  "streams": [
    {
      "type": "Audio",
      "index": "0:0",
      "raw": "Stream #0:0[0x1](und): Audio: aac (LC) (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 125 kb/s (default)",
      "stream_index": 0,
      "defaults": true,
      "forced": false,
      "codec": "aac"
    },
    {
      "type": "Video",
      "index": "0:1",
      "raw": "Stream #0:1[0x2](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(progressive), 1280x720 [SAR 1:1 DAR 16:9], 1991 kb/s, 24 fps, 24 tbr, 24k tbn (default)",
      "stream_index": 0,
      "defaults": true,
      "forced": false,
      "codec": "h264"
    }
  ],
  "duration": "00:09:56.47",
  "bitrate": "2119",
  "bitrate_unit": "kb/s"
}
```

### Sample output

```yaml
{
  "streams": [
    {
      "type": "Video",
      "index": "0:0",
      "lang": "eng",
      "raw": "Stream #0:0(eng): Video: hevc (Main 10), yuv420p10le(tv, bt2020nc/bt2020/smpte2084), 3840x1600, SAR 1:1 DAR 12:5, 23.98 fps, 23.98 tbr, 1k tbn (default)",
      "stream_index": 0,
      "defaults": true,
      "forced": false,
      "codec": "hevc"
    },
    {
      "type": "Audio",
      "index": "0:1",
      "lang": "eng",
      "raw": "Stream #0:1(eng): Audio: truehd, 48000 Hz, 7.1, s32 (24 bit) (default)",
      "stream_index": 0,
      "defaults": true,
      "forced": false,
      "codec": "truehd"
    },
    {
      "type": "Audio",
      "index": "0:2",
      "lang": "eng",
      "raw": "Stream #0:2(eng): Audio: ac3, 48000 Hz, 5.1(side), fltp, 640 kb/s",
      "stream_index": 1,
      "defaults": false,
      "forced": false,
      "codec": "ac3"
    },
    {
      "type": "Audio",
      "index": "0:3",
      "lang": "chi",
      "raw": "Stream #0:3(chi): Audio: truehd, 48000 Hz, 7.1, s32 (24 bit)",
      "stream_index": 2,
      "defaults": false,
      "forced": false,
      "codec": "truehd"
    },
    {
      "type": "Audio",
      "index": "0:4",
      "lang": "chi",
      "raw": "Stream #0:4(chi): Audio: ac3, 48000 Hz, 5.1(side), fltp, 448 kb/s",
      "stream_index": 3,
      "defaults": false,
      "forced": false,
      "codec": "ac3"
    },
    {
      "type": "Audio",
      "index": "0:5",
      "lang": "eng",
      "raw": "Stream #0:5(eng): Audio: ac3, 48000 Hz, stereo, fltp, 224 kb/s",
      "stream_index": 4,
      "defaults": false,
      "forced": false,
      "codec": "ac3"
    },
    {
      "type": "Audio",
      "index": "0:6",
      "lang": "eng",
      "raw": "Stream #0:6(eng): Audio: ac3, 48000 Hz, 5.1(side), fltp, 448 kb/s",
      "stream_index": 5,
      "defaults": false,
      "forced": false,
      "codec": "ac3"
    },
    {
      "type": "Subtitle",
      "index": "0:7",
      "lang": "eng",
      "raw": "Stream #0:7(eng): Subtitle: hdmv_pgs_subtitle",
      "stream_index": 0,
      "defaults": false,
      "forced": false,
      "codec": "hdmv_pgs_subtitle"
    },
    # ......
    # ......
    {
      "type": "Subtitle",
      "index": "0:20",
      "lang": "vie",
      "raw": "Stream #0:20(vie): Subtitle: subrip (default) (forced)",
      "stream_index": 13,
      "defaults": true,
      "forced": true,
      "codec": "subrip"
    },
    {
      "type": "Video",
      "index": "0:21",
      "raw": "Stream #0:21: Video: mjpeg (Progressive), yuvj420p(pc, bt470bg/unknown/unknown), 1594x2362 [SAR 1:1 DAR 797:1181], 90k tbr, 90k tbn (attached pic)",
      "stream_index": 1,
      "defaults": false,
      "forced": false,
      "codec": "mjpeg" # Cover image
    }
  ],
  "duration": "02:23:58.30",
  "bitrate": "27982",
  "bitrate_unit": "kb/s"
}
```

## TODO
- [x] Parse `ffmpeg` output to JSON.
- [ ] Parse more info like audio channel, audio bitrate, ...
- [ ] Generate `cut` configuration from user's selector.
- [ ] Handle errors.
- [ ] Support youtube links with `youtube-dl/yt-dlp`.

# LICENSE
New BSD License

© Ninh Pham