import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { spawn } from 'child_process';

export interface SyncOptions {
  repoUrl: string;
  branch: string;
  targetDir: string;
}

export interface Syncer {
  sync(options: SyncOptions): Promise<void>;
}

export interface CommandRunner {
  run(cmd: string, args: string[], options?: { cwd?: string }): Promise<{ stdout: string; stderr: string }>;
}

export class SpawnCommandRunner implements CommandRunner {
  async run(cmd: string, args: string[], options?: { cwd?: string }): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(cmd, args, {
        cwd: options?.cwd,
        shell: false,
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command '${cmd} ${args.join(' ')}' exited with code ${code}. Stderr: ${stderr}`));
        }
      });

      child.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export class GitSyncer implements Syncer {
  private runner: CommandRunner;

  constructor(runner: CommandRunner = new SpawnCommandRunner()) {
    this.runner = runner;
  }

  async sync(options: SyncOptions): Promise<void> {
    const { repoUrl, branch, targetDir } = options;

    if (!repoUrl) {
      throw new Error('sync: repoUrl is required');
    }

    const absTargetDir = path.resolve(targetDir);

    // Verify target directory exists
    try {
      const stat = await fs.stat(absTargetDir);
      if (!stat.isDirectory()) {
        throw new Error(`sync: target path '${absTargetDir}' is not a directory`);
      }
    } catch (err: any) {
      throw new Error(`sync: target directory '${absTargetDir}' does not exist: ${err.message}`);
    }

    const targetAgentDir = path.join(absTargetDir, '.agent');

    // Create temp directory for sparse checkout
    const tempPrefix = path.join(os.tmpdir(), 'antigravity-sync-');
    const tempDir = await fs.mkdtemp(tempPrefix);

    try {
      // Determine URLs to try: if it matches the default SSH url, try SSH first and then HTTPS
      const urlsToTry: string[] = [repoUrl];
      if (repoUrl === 'git@github.com:ggarcia209/antigravity.git') {
        urlsToTry.push('https://github.com/ggarcia209/antigravity.git');
      }

      let cloned = false;
      let lastError: Error | null = null;

      for (const url of urlsToTry) {
        try {
          // Perform shallow clone with sparse enabled
          await this.runner.run('git', [
            'clone',
            '--depth',
            '1',
            '--branch',
            branch,
            '--filter=blob:none',
            '--sparse',
            '--quiet',
            url,
            tempDir,
          ]);
          cloned = true;
          break;
        } catch (err: any) {
          lastError = err;
        }
      }

      if (!cloned) {
        throw new Error(`sync: failed to clone repository from default origins: ${lastError?.message}`);
      }

      // Configure sparse-checkout to retrieve rules and workflows folders
      await this.runner.run('git', ['sparse-checkout', 'set', 'rules', 'workflows'], { cwd: tempDir });

      // Create target agent directory
      await fs.mkdir(targetAgentDir, { recursive: true });

      // Copy folders rules and workflows
      const folders = ['rules', 'workflows'];
      for (const folder of folders) {
        const srcPath = path.join(tempDir, folder);
        const destPath = path.join(targetAgentDir, folder);

        // Remove existing directories in target
        await fs.rm(destPath, { recursive: true, force: true });

        // Copy files
        await this.copyDir(srcPath, destPath);
      }
    } finally {
      // Clean up temp dir
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }

  private async copyDir(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}
