#!/bin/bash

echo "🚀 Setting up Kuties Backend (os-api-core)..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v22.0.0 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "❌ Node.js version 22 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your database credentials before running the application."
else
    echo "✅ .env file already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "🎉 Backend setup completed!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your database credentials"
echo "2. Set up your MySQL database"
echo "3. Run database migrations: npm run migrate"
echo "4. Start the development server: npm run dev"
echo ""
echo "📚 API Documentation will be available at: http://localhost:3000/api-docs"
echo "🏥 Health check endpoint: http://localhost:3000/health" 