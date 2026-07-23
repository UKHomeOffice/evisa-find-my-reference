/**
 * Shared file upload configuration used by both frontend and backend.
 */

module.exports = {
  maxFileSizeInBytes: 20 * 1024 * 1024, // 20MiB in bytes
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf'
  ],
  documentCategories: {
    'identity-documents': {
      limit: 1,
      limitValidationError: 'maxIdDocsUploads'
    }
  }
};


