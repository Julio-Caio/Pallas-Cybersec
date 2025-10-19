import express from 'express';

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

const router = express.Router();

// 404 handler
router.use((req, res, next) => {
  return res.status(404).json({ message: 'Content not found!' });
});
 
// Error handler
router.use((err, req, res, next) => {
  // console.error(err.message);
  console.error(err.stack);
 
  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }
 
  // next(err);
  return res.status(500).json({ message: 'Something broke!' });
});
 
export default router;