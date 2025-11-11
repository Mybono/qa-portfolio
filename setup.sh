#!/bin/bash
# setup.sh - Setup script for Unix/Mac

echo "🚀 QA Portfolio - Setup Script"
echo "================================"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION detected"
echo ""

# Check Docker
echo "🐋 Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    exit 1
fi
DOCKER_VERSION=$(docker -v)
echo "✅ Docker detected: $DOCKER_VERSION"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi
echo "✅ Root dependencies installed"
echo ""

# Create necessary files
echo "📝 Creating configuration files..."

# Create .eslintrc.json if not exists
if [ ! -f ".eslintrc.json" ]; then
    echo "Creating .eslintrc.json..."
    cat > .eslintrc.json << 'EOF'
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": ["./playwright_ts/tsconfig.json"]
  },
  "plugins": ["@typescript-eslint", "playwright"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:playwright/recommended"
  ],
  "env": {
    "node": true,
    "es2020": true
  },
  "rules": {
    "no-console": "warn",
    "no-debugger": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  },
  "ignorePatterns": [
    "node_modules/",
    "**/node_modules/",
    "dist/",
    "playwright-report/",
    "test-results/",
    "playwright_py/**/*"
  ]
}
EOF
fi

# Create .eslintignore if not exists
if [ ! -f ".eslintignore" ]; then
    echo "Creating .eslintignore..."
    cat > .eslintignore << 'EOF'
node_modules/
**/node_modules/
dist/
**/dist/
playwright-report/
test-results/
playwright_py/**/*
*.py
mongo/**/*
*.config.js
EOF
fi

echo "✅ Configuration files created"
echo ""

# Install TypeScript dependencies
echo "📦 Installing TypeScript project dependencies..."
cd playwright_ts
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install TypeScript dependencies"
    exit 1
fi
cd ..
echo "✅ TypeScript dependencies installed"
echo ""

# Check Python (optional)
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python detected: $PYTHON_VERSION"
    
    echo "📦 Installing Python dependencies (if available)..."
    if [ -f "playwright_py/requirements.txt" ]; then
        cd playwright_py
        pip3 install -r requirements.txt
        pip3 install flake8 black pylint
        cd ..
        echo "✅ Python dependencies installed"
    fi
else
    echo "⚠️  Python not found. Skipping Python setup."
fi
echo ""

# Validate installation
echo "🔍 Validating installation..."
npm run lint -- --max-warnings 100
if [ $? -ne 0 ]; then
    echo "⚠️  ESLint found issues. Run 'npm run lint:fix' to auto-fix."
else
    echo "✅ ESLint validation passed"
fi
echo ""

# Summary
echo "================================"
echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start services:  npm run docker:up"
echo "2. Run tests:       npm run test:ts"
echo "3. Validate code:   npm run validate"
echo ""
echo "📚 Available commands:"
echo "  npm run lint          - Lint TypeScript code"
echo "  npm run format        - Format all code"
echo "  npm run type-check    - Check TypeScript types"
echo "  npm run test:ts       - Run TypeScript tests"
echo "  npm run test:py       - Run Python tests"
echo "  npm run docker:up     - Start Docker services"
echo ""
echo "Happy testing! 🚀"

# ============================================
# setup.ps1 - PowerShell script for Windows
# ============================================

<#
.SYNOPSIS
Setup script for QA Portfolio on Windows

.DESCRIPTION
Installs dependencies and configures the project

.EXAMPLE
.\setup.ps1
#>

Write-Host "🚀 QA Portfolio - Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20+ first." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check Docker
Write-Host "🐋 Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker -v
    Write-Host "✅ Docker detected: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Root dependencies installed" -ForegroundColor Green
Write-Host ""

# Create necessary files
Write-Host "📝 Creating configuration files..." -ForegroundColor Yellow

# Create .eslintrc.json if not exists
if (-not (Test-Path ".eslintrc.json")) {
    Write-Host "Creating .eslintrc.json..." -ForegroundColor Cyan
    @'
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": ["./playwright_ts/tsconfig.json"]
  },
  "plugins": ["@typescript-eslint", "playwright"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:playwright/recommended"
  ],
  "env": {
    "node": true,
    "es2020": true
  },
  "rules": {
    "no-console": "warn",
    "no-debugger": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  },
  "ignorePatterns": [
    "node_modules/",
    "**/node_modules/",
    "dist/",
    "playwright-report/",
    "test-results/",
    "playwright_py/**/*"
  ]
}
'@ | Out-File -FilePath ".eslintrc.json" -Encoding utf8
}

Write-Host "✅ Configuration files created" -ForegroundColor Green
Write-Host ""

# Install TypeScript dependencies
Write-Host "📦 Installing TypeScript project dependencies..." -ForegroundColor Yellow
Set-Location playwright_ts
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install TypeScript dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "✅ TypeScript dependencies installed" -ForegroundColor Green
Write-Host ""

# Check Python (optional)
Write-Host "🐍 Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✅ Python detected: $pythonVersion" -ForegroundColor Green
    
    if (Test-Path "playwright_py/requirements.txt") {
        Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
        Set-Location playwright_py
        pip install -r requirements.txt
        pip install flake8 black pylint
        Set-Location ..
        Write-Host "✅ Python dependencies installed" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Python not found. Skipping Python setup." -ForegroundColor Yellow
}
Write-Host ""

# Validate installation
Write-Host "🔍 Validating installation..." -ForegroundColor Yellow
npm run lint -- --max-warnings 100
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  ESLint found issues. Run 'npm run lint:fix' to auto-fix." -ForegroundColor Yellow
} else {
    Write-Host "✅ ESLint validation passed" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start services:  npm run docker:up"
Write-Host "2. Run tests:       npm run test:ts"
Write-Host "3. Validate code:   npm run validate"
Write-Host ""
Write-Host "📚 Available commands:" -ForegroundColor Cyan
Write-Host "  npm run lint          - Lint TypeScript code"
Write-Host "  npm run format        - Format all code"
Write-Host "  npm run type-check    - Check TypeScript types"
Write-Host "  npm run test:ts       - Run TypeScript tests"
Write-Host "  npm run test:py       - Run Python tests"
Write-Host "  npm run docker:up     - Start Docker services"
Write-Host ""
Write-Host "Happy testing! 🚀" -ForegroundColor Cyan