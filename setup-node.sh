#!/bin/bash

# Script to install Node.js via nvm and start the development server

echo "Checking for Xcode Command Line Tools..."
if ! xcode-select -p &>/dev/null; then
    echo "❌ Xcode Command Line Tools are not installed yet."
    echo "Please complete the installation dialog that appeared, then run this script again."
    exit 1
fi

echo "✅ Xcode Command Line Tools are installed!"

# Install nvm if not already installed
if [ ! -d "$HOME/.nvm" ]; then
    echo "Installing nvm (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Add to zshrc for future sessions
    if ! grep -q "NVM_DIR" ~/.zshrc 2>/dev/null; then
        echo '' >> ~/.zshrc
        echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
        echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
        echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc
    fi
else
    echo "nvm is already installed. Loading..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Install Node.js LTS
echo "Installing Node.js LTS..."
nvm install --lts
nvm use --lts
nvm alias default node

# Verify installation
echo ""
echo "✅ Node.js installation complete!"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing project dependencies..."
    npm install
fi

# Start the development server
echo ""
echo "🚀 Starting development server..."
npm run dev
