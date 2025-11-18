#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chokidar from 'chokidar';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SPEC_GLOB = path.join(ROOT, 'specs', '**', '*.json');
const BUILD_SCRIPT = path.join(__dirname, 'build-portfolio-spec.mjs');

function runBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [BUILD_SCRIPT], { stdio: 'inherit' });
    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`spec build exited with code ${code}`));
    });
  });
}

let running = false;
const queueBuild = async () => {
  if (running) {
    return;
  }
  running = true;
  try {
    await runBuild();
  } catch (error) {
    console.error(error);
  } finally {
    running = false;
  }
};

await runBuild();
const watcher = chokidar.watch(SPEC_GLOB, { ignoreInitial: true });
watcher.on('all', queueBuild);
