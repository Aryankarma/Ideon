import { Request, Response } from 'express';
import Document from '../models/Document';
import { AuthRequest } from '../utils/auth';

export const createDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, parentDocument } = req.body;
    const userId = req.user!._id;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const document = new Document({
      title,
      parentDocument: parentDocument || null,
      userId,
      isArchived: false,
      isPublished: false,
    });

    await document.save();
    await document.populate('userId', 'firstName lastName email');

    res.status(201).json({
      message: 'Document created successfully',
      document,
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { parentDocument } = req.query;
    const userId = req.user!._id;

    const query: any = {
      userId,
      isArchived: false,
    };

    if (parentDocument) {
      query.parentDocument = parentDocument;
    } else {
      query.parentDocument = null;
    }

    const documents = await Document.find(query)
      .sort({ updatedAt: -1 })
      .populate('userId', 'firstName lastName email');

    res.status(200).json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const userId = req.user!._id;

    const document = await Document.findById(documentId).populate('userId', 'firstName lastName email');

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Check if user owns the document or if it's published
    if (document.userId._id.toString() !== userId.toString() && !document.isPublished) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.status(200).json({ document });
  } catch (error) {
    console.error('Get document by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const userId = req.user!._id;
    const updateData = req.body;

    const document = await Document.findById(documentId);

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (document.userId.toString() !== userId.toString()) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email');

    res.status(200).json({
      message: 'Document updated successfully',
      document: updatedDocument,
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const userId = req.user!._id;

    const document = await Document.findById(documentId);

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (document.userId.toString() !== userId.toString()) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Document.findByIdAndDelete(documentId);

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const archiveDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const userId = req.user!._id;

    const document = await Document.findById(documentId);

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (document.userId.toString() !== userId.toString()) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Archive the document and all its children
    const archiveRecursive = async (docId: string) => {
      const doc = await Document.findById(docId);
      if (doc) {
        doc.isArchived = true;
        await doc.save();

        // Find and archive all children
        const children = await Document.find({ parentDocument: docId });
        for (const child of children) {
          await archiveRecursive(child._id.toString());
        }
      }
    };

    await archiveRecursive(documentId);

    res.status(200).json({ message: 'Document archived successfully' });
  } catch (error) {
    console.error('Archive document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const restoreDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const userId = req.user!._id;

    const document = await Document.findById(documentId);

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (document.userId.toString() !== userId.toString()) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Restore the document and all its children
    const restoreRecursive = async (docId: string) => {
      const doc = await Document.findById(docId);
      if (doc) {
        doc.isArchived = false;
        await doc.save();

        // Find and restore all children
        const children = await Document.find({ parentDocument: docId });
        for (const child of children) {
          await restoreRecursive(child._id.toString());
        }
      }
    };

    await restoreRecursive(documentId);

    res.status(200).json({ message: 'Document restored successfully' });
  } catch (error) {
    console.error('Restore document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTrash = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const documents = await Document.find({
      userId,
      isArchived: true,
    })
      .sort({ updatedAt: -1 })
      .populate('userId', 'firstName lastName email');

    res.status(200).json({ documents });
  } catch (error) {
    console.error('Get trash error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const userId = req.user!._id;

    if (!q) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const documents = await Document.find({
      userId,
      isArchived: false,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ],
    })
      .sort({ updatedAt: -1 })
      .populate('userId', 'firstName lastName email');

    res.status(200).json({ documents });
  } catch (error) {
    console.error('Search documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
