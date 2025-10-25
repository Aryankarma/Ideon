#!/bin/bash

# Ideon Client Setup Script

echo "🚀 Setting up Ideon Client..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "⚙️  Creating .env.local file..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
    echo "✅ Created .env.local file."
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure the server is running on port 5000"
echo "2. Run: npm run dev"
echo ""
echo "The client will be available at http://localhost:3000"
