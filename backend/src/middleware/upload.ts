import multer from 'multer';

function fileFilter(_req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files are allowed.'));
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});
