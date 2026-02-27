#!/usr/bin/env node

/**
 * StudioD - Setup Script
 * Guides through initial configuration
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           STUDIOD - Setup Wizard                     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

This script will help you configure your StudioD website.
`);

async function setup() {
  // Check if .env exists
  const envExists = existsSync('.env');
  
  if (envExists) {
    const overwrite = await question('.env file exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled. Your existing .env file is preserved.');
      rl.close();
      return;
    }
  }

  console.log('\n📸 ImageKit Configuration');
  console.log('Get your credentials from: https://imagekit.io/dashboard\n');
  
  const imagekitUrl = await question('ImageKit URL Endpoint: ');
  const imagekitPublicKey = await question('ImageKit Public Key: ');
  const imagekitPrivateKey = await question('ImageKit Private Key: ');

  console.log('\n📧 Contact Form Configuration');
  const contactEmail = await question('Contact Email (default: hello@studiod.com): ') || 'hello@studiod.com';
  
  console.log('\n📊 Analytics (Optional)');
  const gaId = await question('Google Analytics Measurement ID (optional): ');

  // Build .env content
  const envContent = `# StudioD - Environment Configuration
# Generated on ${new Date().toISOString()}

# ImageKit Configuration
VITE_IMAGEKIT_URL_ENDPOINT=${imagekitUrl}
VITE_IMAGEKIT_PUBLIC_KEY=${imagekitPublicKey}
IMAGEKIT_PRIVATE_KEY=${imagekitPrivateKey}

# Contact Form
CONTACT_EMAIL=${contactEmail}

# Analytics${gaId ? `\nVITE_GA_MEASUREMENT_ID=${gaId}` : ''}
`;

  writeFileSync('.env', envContent);
  console.log('\n✅ .env file created successfully!');

  // Create .env.local for development
  const envLocalContent = `# Development overrides
# These values are used in local development only
`;
  
  if (!existsSync('.env.local')) {
    writeFileSync('.env.local', envLocalContent);
    console.log('✅ .env.local file created!');
  }

  console.log(`
═══════════════════════════════════════════════════════════

🎉 Setup complete! Next steps:

1. Install dependencies:
   npm install

2. Start development server:
   npm run dev

3. Deploy to Netlify:
   npm run netlify:deploy

📖 Documentation: See BACKEND.md for detailed setup instructions

═══════════════════════════════════════════════════════════
`);

  rl.close();
}

setup().catch(err => {
  console.error('Setup error:', err);
  rl.close();
  process.exit(1);
});
