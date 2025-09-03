#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting PR Management System Development Server...');
console.log('Port: 8080');
console.log('Host: 0.0.0.0');
console.log('URL: http://localhost:8080');
console.log('-----------------------------------');

const viteProcess = spawn('npx', ['vite', '--port', '8080', '--host', '0.0.0.0'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (error) => {
  console.error('Failed to start development server:', error);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down development server...');
  viteProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down development server...');
  viteProcess.kill('SIGTERM');
});
