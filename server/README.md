# Ideon Server Setup

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/ideon

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000

# AWS S3 Configuration (Optional - for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name

# Redis Configuration (Optional - for caching)
REDIS_URL=redis://localhost:6379
```

## Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Start MongoDB (if running locally):
```bash
mongod
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Documents
- `POST /api/documents` - Create a new document
- `GET /api/documents` - Get user's documents
- `GET /api/documents/:id` - Get document by ID
- `PATCH /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `PATCH /api/documents/:id/archive` - Archive document
- `PATCH /api/documents/:id/restore` - Restore document
- `GET /api/documents/trash` - Get archived documents
- `GET /api/documents/search?q=query` - Search documents

### Files
- `POST /api/files/upload` - Upload a file
- `POST /api/files/upload-local` - Upload file locally (fallback)
- `DELETE /api/files/delete` - Delete a file

## Features

- JWT-based authentication
- MongoDB with Mongoose ODM
- File upload with AWS S3 support
- Real-time collaboration with Socket.IO
- Scalable architecture with proper error handling
- TypeScript support
