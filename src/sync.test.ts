import { describe, it, expect } from 'vitest';
import { GitSyncer, CommandRunner } from './sync.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

class MockCommandRunner implements CommandRunner {
  commandsRun: { cmd: string; args: string[]; options?: { cwd?: string } }[] = [];

  async run(cmd: string, args: string[], options?: { cwd?: string }): Promise<{ stdout: string; stderr: string }> {
    this.commandsRun.push({ cmd, args, options });

    // When clone is executed, mock the presence of the rules/ and workflows/ directories
    if (cmd === 'git' && args[0] === 'clone') {
      const tempDir = args[args.length - 1];
      await fs.mkdir(path.join(tempDir, 'rules'), { recursive: true });
      await fs.mkdir(path.join(tempDir, 'workflows'), { recursive: true });
      await fs.writeFile(path.join(tempDir, 'rules', 'test-rule.md'), '# Test Rule');
      await fs.writeFile(path.join(tempDir, 'workflows', 'test-workflow.md'), '# Test Workflow');
    }

    return { stdout: '', stderr: '' };
  }
}

describe('GitSyncer', () => {
  it('should throw an error if repoUrl is missing', async () => {
    const runner = new MockCommandRunner();
    const syncer = new GitSyncer(runner);

    await expect(
      syncer.sync({
        repoUrl: '',
        branch: 'main',
        targetDir: '.',
      })
    ).rejects.toThrow('sync: repoUrl is required');
  });

  it('should throw an error if targetDir does not exist', async () => {
    const runner = new MockCommandRunner();
    const syncer = new GitSyncer(runner);

    await expect(
      syncer.sync({
        repoUrl: 'git@github.com:ggarcia209/antigravity.git',
        branch: 'main',
        targetDir: '/nonexistent-directory-xyz',
      })
    ).rejects.toThrow('does not exist');
  });

  it('should clone the repository and copy rules and workflows into the target .agent folder', async () => {
    const runner = new MockCommandRunner();
    const syncer = new GitSyncer(runner);

    // Create a real temp directory to act as the target repository
    const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'target-repo-'));

    try {
      await syncer.sync({
        repoUrl: 'git@github.com:ggarcia209/antigravity.git',
        branch: 'main',
        targetDir: targetDir,
      });

      // Assert commands were run in sequence
      expect(runner.commandsRun).toHaveLength(2);
      expect(runner.commandsRun[0].cmd).toBe('git');
      expect(runner.commandsRun[0].args).toContain('clone');
      expect(runner.commandsRun[0].args).toContain('git@github.com:ggarcia209/antigravity.git');
      expect(runner.commandsRun[0].args).toContain('main');

      expect(runner.commandsRun[1].cmd).toBe('git');
      expect(runner.commandsRun[1].args).toEqual(['sparse-checkout', 'set', 'rules', 'workflows']);

      // Assert rules/workflows folders exist in target's .agent directory
      const rulesFile = await fs.readFile(path.join(targetDir, '.agent', 'rules', 'test-rule.md'), 'utf8');
      const workflowsFile = await fs.readFile(path.join(targetDir, '.agent', 'workflows', 'test-workflow.md'), 'utf8');

      expect(rulesFile).toBe('# Test Rule');
      expect(workflowsFile).toBe('# Test Workflow');
    } finally {
      // Clean up target dir
      await fs.rm(targetDir, { recursive: true, force: true });
    }
  });
});
