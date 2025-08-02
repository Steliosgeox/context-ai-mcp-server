#!/usr/bin/env node

/**
 * Quick test script to verify the MCP server is working correctly
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Context AI MCP Server...\n');

// Test 1: Check if dist directory exists
console.log('1. Checking build output...');
try {
  const distPath = path.join(__dirname, '..', 'dist', 'index.js');
  const fs = await import('fs');
  if (fs.existsSync(distPath)) {
    console.log('   ✅ Build output found at dist/index.js');
  } else {
    console.log('   ❌ Build output not found. Run "npm run build" first.');
    process.exit(1);
  }
} catch (error) {
  console.log('   ❌ Error checking build output:', error.message);
  process.exit(1);
}

// Test 2: Test server startup
console.log('\n2. Testing server startup...');
const serverPath = path.join(__dirname, '..', 'dist', 'index.js');
const serverProcess = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, WORKSPACE_PATH: path.join(__dirname, '..') }
});

let startupSuccess = false;
let startupError = '';

serverProcess.stderr.on('data', (data) => {
  const message = data.toString();
  if (message.includes('Context AI MCP Server running')) {
    startupSuccess = true;
    console.log('   ✅ Server started successfully');
    serverProcess.kill();
  } else if (message.includes('Error')) {
    startupError = message;
  }
});

serverProcess.on('error', (error) => {
  console.log('   ❌ Server startup failed:', error.message);
  process.exit(1);
});

// Give the server 5 seconds to start
setTimeout(() => {
  if (!startupSuccess) {
    console.log('   ❌ Server startup timeout or failed');
    if (startupError) {
      console.log('   Error details:', startupError);
    }
    serverProcess.kill();
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! Your MCP server is ready to use.');
    console.log('\n📋 Next steps:');
    console.log('   1. Configure Claude Desktop using claude-desktop-config.md');
    console.log('   2. Restart Claude Desktop');
    console.log('   3. Test with: "Can you analyze my workspace?"');
    console.log('   4. Create GitHub repository using GITHUB_SETUP.md');
    process.exit(0);
  }
}, 5000);
