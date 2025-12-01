#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const [, , ...args] = process.argv;

const ssoPath = path.resolve(__dirname, '../apps/sso');
const phpPath = process.platform === 'win32' ? 'php.exe' : 'php';

try {
    const ssoComposerPath = path.join(ssoPath, 'composer.json');
    const ssoComposerJson = JSON.parse(fs.readFileSync(ssoComposerPath, 'utf-8'));

    const ssoPhpPath = path.join(ssoPath, ssoComposerJson.config.platform.php);
    const fullPhpPath = path.join(ssoPhpPath, phpPath);

    const ssoArtisan = execSync(
        `"${fullPhpPath}" artisan ${args.join(' ')}`,
        { cwd: ssoPath, stdio: 'inherit' }
    );

    process.exit(ssoArtisan.status);
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
