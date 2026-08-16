---
title: 'Audio & Video'
description: 'Embed native multimedia with audio, video, source, and track elements. Configure controls, autoplay, loop, poster, and subtitles.'
order: 12
difficulty: 'beginner'
category: 'Level 4 - Images & Media'
estimatedMinutes: 25
prerequisites:
  - /learn/html/figures-and-captions
---

## Native Multimedia in HTML5

Before HTML5, web video required bulky third-party plugins (Flash, Silverlight). Today, browsers provide native `<video>` and `<audio>` engines.

---

## The `<video>` Element

```html
<video controls width="800" height="450" poster="poster.jpg" preload="metadata">
  <source src="video.webm" type="video/webm" />
  <source src="video.mp4" type="video/mp4" />
  <track src="captions-en.vtt" kind="captions" srclang="en" label="English" default />
  <p>Your browser does not support HTML5 video. <a href="video.mp4">Download video</a>.</p>
</video>
```

### Key Video Attributes:
- `controls`: Displays play/pause, volume, fullscreen, and timeline scrub controls.
- `poster`: Image displayed before the user clicks play.
- `preload="metadata"`: Loads duration and first frame without downloading the entire video file.
- `muted`: Mutes sound by default (required for `autoplay` in most browsers).
- `loop`: Automatically restarts video upon completion.

---

## The `<audio>` Element

```html
<audio controls preload="none">
  <source src="podcast-ep1.mp3" type="audio/mpeg" />
  <source src="podcast-ep1.ogg" type="audio/ogg" />
  <p>Your browser does not support the audio player.</p>
</audio>
```

---

## Accessibility with Subtitles & Captions (`<track>`)

The void `<track>` element links WebVTT (`.vtt`) caption files:

```html
<track kind="captions" src="subtitles-en.vtt" srclang="en" label="English" default />
<track kind="subtitles" src="subtitles-es.vtt" srclang="es" label="Español" />
```

---

## Summary & Key Takeaways

- Use `<video>` and `<audio>` with `controls` to deliver native playback.
- Provide multiple `<source>` formats (`webm` and `mp4`) for universal browser support.
- Always include `<track kind="captions">` for accessibility and deaf/hard-of-hearing users.

---

## Practice Challenge

Build a multimedia podcast episode player containing:
1. An `<audio>` player with `controls` and fallback message.
2. A `<video>` teaser clip with a `poster` image and English captions track.
