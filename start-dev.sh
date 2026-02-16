#!/bin/bash

# Script to start the development server
# This will check for prerequisites and set up the environment

set -e

echo "🚀 Starting development server setup..."

# Check for Xcode Command Line Tools
if ! xcode-select -p &>/dev/null; then
    echo "❌ Xcode Command Line Tools are not installed."
    echo ""
    echo "Please install them by running:"
    echo "  xcode-select --install"
    echo ""
    echo "After installation completes, run this script again."
    exit 1
fi

echo "✅ Xcode Command Line Tools are installed"

# Load nvm if it exists
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "Loading nvm..."
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
else
    echo "❌ nvm is not installed."
    echo ""
    echo "Please run the setup script first:"
    echo "  bash setup-node.sh"
    echo ""
    echo "Or install nvm manually:"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    exit 1
fi

# Use Node.js LTS
echo "Using Node.js LTS..."
nvm use --lts 2>/dev/null || nvm install --lts && nvm use --lts

# Verify Node.js and npm
echo ""
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo ""
echo "🚀 Starting development server on http://localhost:8080..."
echo ""
npm run dev
