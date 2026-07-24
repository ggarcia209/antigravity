#!/usr/bin/env node

import { Command } from 'commander';
import { GitSyncer } from './sync.js';

const program = new Command();

program
  .name('antigravity-sync')
  .description('CLI to copy rules and workflows from the ggarcia209/antigravity remote origin to any local repository')
  .version('1.0.0')
  .argument('[target_path]', 'Path to the target local repository (defaults to current working directory)', '.')
  .option('-b, --branch <name>', 'Branch, tag or commit to sync from', 'main')
  .option('-r, --repo <url>', 'Git remote origin URL', 'git@github.com:ggarcia209/antigravity.git')
  .action(async (targetPath, options) => {
    console.log(`Target repository path: ${targetPath}`);
    console.log(`Fetching rules and workflows from: ${options.repo} (${options.branch})...`);

    const syncer = new GitSyncer();

    try {
      await syncer.sync({
        repoUrl: options.repo,
        branch: options.branch,
        targetDir: targetPath,
      });
      console.log('Successfully synchronized rules and workflows from ggarcia209/antigravity!');
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
