#!/bin/bash

# SmartBiz ERP Lite - Development Scripts

set -e

echo "SmartBiz ERP Lite - Development Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install && cd ..

# Generate Prisma client
echo "Generating Prisma client..."
cd backend && npx prisma generate && cd ..

# Copy environment files
if [ ! -f frontend/.env ]; then
    echo "Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
fi

if [ ! -f backend/.env ]; then
    echo "Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

echo ""
echo "Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To start database:"
echo "  docker-compose up -d postgres"
echo ""
echo "To run migrations:"
echo "  npm run db:migrate"
echo ""
echo "To seed database:"
echo "  npm run db:seed"
