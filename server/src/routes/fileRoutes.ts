import { Router } from 'express';
import {
  uploadMiddleware,
  uploadFile,
  deleteFile,
  uploadLocal,
  uploadFileLocal,
} from '../controllers/fileController';
import { authenticateToken } from '../utils/auth';

const router = Router();

// All file routes require authentication
router.use(authenticateToken);

// File upload routes
router.post('/upload', uploadMiddleware, uploadFile);
router.post('/upload-local', uploadLocal.single('file'), uploadFileLocal);
router.delete('/delete', deleteFile);

export default router;
