import { Router } from 'express';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  archiveDocument,
  restoreDocument,
  getTrash,
  searchDocuments,
} from '../controllers/documentController';
import { authenticateToken } from '../utils/auth';

const router = Router();

// All document routes require authentication
router.use(authenticateToken);

// Document CRUD operations
router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/search', searchDocuments);
router.get('/trash', getTrash);
router.get('/:documentId', getDocumentById);
router.patch('/:documentId', updateDocument);
router.delete('/:documentId', deleteDocument);

// Document management
router.patch('/:documentId/archive', archiveDocument);
router.patch('/:documentId/restore', restoreDocument);

export default router;
