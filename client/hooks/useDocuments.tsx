"use client";

import { useState, useEffect, useCallback } from 'react';
import apiClient, { Document } from '@/lib/api';

export const useDocuments = (parentDocument?: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const docs = await apiClient.getDocuments(parentDocument);
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  }, [parentDocument]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const createDocument = async (title: string, parentDoc?: string) => {
    try {
      const newDoc = await apiClient.createDocument({
        title,
        parentDocument: parentDoc || parentDocument,
      });
      setDocuments(prev => [newDoc, ...prev]);
      return newDoc;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document');
      throw err;
    }
  };

  const updateDocument = async (documentId: string, updates: Partial<Document>) => {
    try {
      const updatedDoc = await apiClient.updateDocument(documentId, updates);
      setDocuments(prev => 
        prev.map(doc => doc._id === documentId ? updatedDoc : doc)
      );
      return updatedDoc;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
      throw err;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      await apiClient.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc._id !== documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      throw err;
    }
  };

  const archiveDocument = async (documentId: string) => {
    try {
      await apiClient.archiveDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc._id !== documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive document');
      throw err;
    }
  };

  return {
    documents,
    isLoading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    archiveDocument,
    refetch: fetchDocuments,
  };
};

export const useDocument = (documentId: string) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = useCallback(async () => {
    if (!documentId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const doc = await apiClient.getDocumentById(documentId);
      setDocument(doc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document');
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const updateDocument = async (updates: Partial<Document>) => {
    if (!documentId) return;
    
    try {
      const updatedDoc = await apiClient.updateDocument(documentId, updates);
      setDocument(updatedDoc);
      return updatedDoc;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
      throw err;
    }
  };

  return {
    document,
    isLoading,
    error,
    updateDocument,
    refetch: fetchDocument,
  };
};

export const useTrash = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrash = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const docs = await apiClient.getTrash();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trash');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const restoreDocument = async (documentId: string) => {
    try {
      await apiClient.restoreDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc._id !== documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore document');
      throw err;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      await apiClient.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc._id !== documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      throw err;
    }
  };

  return {
    documents,
    isLoading,
    error,
    restoreDocument,
    deleteDocument,
    refetch: fetchTrash,
  };
};

export const useSearch = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDocuments = async (query: string) => {
    if (!query.trim()) {
      setDocuments([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const docs = await apiClient.searchDocuments(query);
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    documents,
    isLoading,
    error,
    searchDocuments,
  };
};
