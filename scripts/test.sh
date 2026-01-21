#!/bin/bash
set -e

echo "🧪 Running n8n-nodes-square tests..."

# Run linting
echo "📝 Running ESLint..."
npm run lint

# Run TypeScript type check
echo "🔍 Running TypeScript type check..."
npm run typecheck

# Run unit tests
echo "🔬 Running unit tests..."
npm test

# Run build to verify compilation
echo "🏗️ Verifying build..."
npm run build

echo "✅ All tests passed!"
