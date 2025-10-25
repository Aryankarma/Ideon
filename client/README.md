# Client Environment Variables

Create a `.env.local` file in the client directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: For production
# NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Setup Instructions

1. Install dependencies:
```bash
cd client
npm install
```

2. Create the environment file:
```bash
cp .env.example .env.local
```

3. Update the API URL if your server is running on a different port or domain.

4. Start the development server:
```bash
npm run dev
```

## Features

- Custom authentication system
- File upload with progress tracking
- Real-time document collaboration
- Responsive design
- Dark/light theme support
- Search functionality
- Document management (create, edit, archive, delete)
