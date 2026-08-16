---
title: 'Accessible Images & Media'
description: 'Learn alternative text decision trees, complex image descriptions, accessible audio transcripts, and video captions.'
order: 26
difficulty: 'intermediate'
category: 'Level 8 - Accessibility'
estimatedMinutes: 20
prerequisites:
  - /learn/html/accessible-forms
---

## The Alternative Text Decision Tree

How do you decide what `alt` text to write for an image?

1. **Does the image contain text?**
   - Include the exact text verbatim in the `alt` attribute.
2. **Is the image a link or button?**
   - Describe the destination or action (`alt="View user profile"`), not the picture appearance.
3. **Is the image a complex chart or graph?**
   - Provide a short summary in `alt` and link to a full tabular breakdown in HTML.
4. **Is the image purely decorative background styling?**
   - Set `alt=""` and `aria-hidden="true"`.

---

## Accessible Video Captions

Always provide synchronized captions using WebVTT (`<track kind="captions">`):

```html
<video controls width="640" height="360">
  <source src="presentation.mp4" type="video/mp4" />
  <track kind="captions" src="captions-en.vtt" srclang="en" label="English" default />
  <p>Download <a href="presentation-transcript.pdf">Full Video Transcript (PDF)</a>.</p>
</video>
```

---

## Summary & Key Takeaways

- Write concise, meaningful `alt` text reflecting image purpose.
- Use empty `alt=""` for decorative elements.
- Always include captions and text transcripts for audio/video media.

---

## Practice Challenge

Create an accessible case study page with:
1. An infographic image with a detailed `<figcaption>` data summary.
2. A decorative divider with `alt=""`.
3. An embedded audio player with a link to a full text transcript.
