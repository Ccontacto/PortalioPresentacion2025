import fs from 'fs';
import path from 'path';

const tokensPath = path.join(process.cwd(), 'tokens', 'pos_tokens.json');
const outputPath = path.join(process.cwd(), 'src', 'pos', 'pos.css');

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

const cssVars = [];

function traverse(obj, prefix = '') {
  for (const key in obj) {
    if (key.startsWith('$')) {
      continue;
    }
    const newPrefix = prefix ? `${prefix}-${key}` : key;
    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      if (value.$value) {
        if (Array.isArray(value.$value)) {
          cssVars.push(`  --${newPrefix}: ${value.$value.join(', ')};`);
        } else {
          cssVars.push(`  --${newPrefix}: ${value.$value};`);
        }
      } else {
        traverse(value, newPrefix);
      }
    }
  }
}

traverse(tokens);

const css = `:root {
${cssVars.join('\n')}
}`;

fs.writeFileSync(outputPath, css);

console.log('Successfully built pos.css from pos_tokens.json');