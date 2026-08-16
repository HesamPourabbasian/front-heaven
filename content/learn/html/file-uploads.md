---
title: 'File Uploads in HTML'
description: 'Learn how to handle file uploads: type=file, accept filters, multiple uploads, multipart/form-data encoding, and upload security.'
order: 20
difficulty: 'intermediate'
category: 'Level 6 - Forms & User Input'
estimatedMinutes: 20
prerequisites:
  - /learn/html/form-validation
---

## File Upload Basics

To allow users to upload images, documents, or media files, use `<input type="file">`:

```html
<form action="/api/upload" method="POST" enctype="multipart/form-data">
  <label for="avatar-file">Upload Profile Picture:</label>
  <input type="file" id="avatar-file" name="avatar" accept="image/png, image/jpeg, image/webp" />

  <button type="submit">Upload Image</button>
</form>
```

---

## The Mandatory `enctype="multipart/form-data"`

> **Critical Rule**: If you forget `enctype="multipart/form-data"` on your `<form>`, the browser will only send the **filename** as plain text to the server instead of the actual binary file data!

---

## Key Attributes for File Inputs

### 1. The `accept` Attribute
Restricts which file formats the user's OS file picker displays:

```html
<!-- Accept only images -->
<input type="file" accept="image/*" />

<!-- Accept PDF documents only -->
<input type="file" accept=".pdf,application/pdf" />

<!-- Accept audio recordings -->
<input type="file" accept="audio/*" />
```

### 2. The `multiple` Attribute
Allows the user to select more than one file simultaneously using Ctrl/Cmd or Shift:

```html
<label for="gallery-files">Upload Portfolio Images (multiple):</label>
<input type="file" id="gallery-files" name="photos[]" accept="image/*" multiple />
```

---

## Summary & Key Takeaways

- File upload forms **must** use `method="POST"` and `enctype="multipart/form-data"`.
- Use the `accept` attribute to filter file extensions or MIME types in the OS picker.
- Add `multiple` when batch file uploads are needed.

---

## Practice Challenge

Build a job applicant resume uploader with:
1. A single file input accepting `.pdf` and `.docx` files.
2. A multiple file input for supporting work sample images (`image/*`).
3. Proper form encoding configured for server uploads.
