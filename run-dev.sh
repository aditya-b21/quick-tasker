#!/bin/bash
cd "$(dirname "$0")"

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js
nvm use --lts 2>/dev/null || nvm use node 2>/dev/null || nvm use default 2>/dev/null

# Run npm run dev
npm run dev
