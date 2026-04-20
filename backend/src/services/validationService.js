import path from 'path';

const allowedMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const allowedExtensions = new Set(['.pdf', '.jpg', '.jpeg', '.png']);

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export function buildDocumentChecklist(catalog, filesByField = {}, existing = []) {
  const checklist = [];

  for (const group of catalog) {
    for (const document of group.documents) {
      const existingDocument = existing.find((item) => item.id === document.id);
      const file = filesByField[document.id];
      let status = existingDocument?.status || 'missing';
      let flagReasons = existingDocument?.flagReasons || [];

      if (existingDocument?.status === 'mismatch') {
        status = 'mismatch';
      } else if (file) {
        status = 'uploaded';
      }

      if (file) {
        const extension = path.extname(file.originalname).toLowerCase();
        const expectedSlug = slugify(document.label);
        const actualSlug = slugify(path.basename(file.originalname, extension));

        if (!allowedMimeTypes.has(file.mimetype)) {
          status = 'flagged';
          flagReasons = [...flagReasons, 'Unsupported file type'];
        }

        if (file.size > document.maxSizeMb * 1024 * 1024) {
          status = 'flagged';
          flagReasons = [...flagReasons, `File exceeds ${document.maxSizeMb}MB limit`];
        }

        if (!allowedExtensions.has(extension)) {
          status = 'flagged';
          flagReasons = [...flagReasons, 'File extension must be PDF, JPG, JPEG, or PNG'];
        }

        if (!actualSlug.includes(expectedSlug) && !expectedSlug.includes(actualSlug)) {
          status = 'flagged';
          flagReasons = [...flagReasons, `Filename must match document type: ${document.id}`];
        }
      }

      if (document.required && !file && !existingDocument) {
        status = 'missing';
      }

      checklist.push({
        id: document.id,
        groupTitle: group.title,
        label: document.label,
        required: document.required,
        optional: document.optional,
        instructions: document.instructions,
        filenameHint: document.filenameHint,
        allowedFormats: document.allowedFormats,
        maxSizeMb: document.maxSizeMb,
        status,
        flagReasons: Array.from(new Set(flagReasons)),
        uploadedAt: file ? new Date().toISOString() : existingDocument?.uploadedAt || null
      });
    }
  }

  return checklist;
}

export function summarizeChecklist(checklist) {
  return checklist.reduce(
    (summary, document) => {
      summary.total += 1;
      if (document.required) summary.required += 1;
      if (document.status === 'uploaded') summary.uploaded += 1;
      if (document.status === 'missing') summary.missing += 1;
      if (document.status === 'flagged') summary.flagged += 1;
      return summary;
    },
    { total: 0, required: 0, uploaded: 0, missing: 0, flagged: 0 }
  );
}
