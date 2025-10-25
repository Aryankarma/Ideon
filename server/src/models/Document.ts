import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isArchived: boolean;
  isPublished: boolean;
  parentDocument?: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  parentDocument: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    default: null,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
DocumentSchema.index({ userId: 1, parentDocument: 1 });
DocumentSchema.index({ userId: 1, isArchived: 1 });
DocumentSchema.index({ userId: 1, isPublished: 1 });

export default mongoose.model<IDocument>('Document', DocumentSchema);
