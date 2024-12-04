import { spawn } from 'node:child_process';

export const spawnWrapper = (
  command: string,
  args: string[]
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        });
        return;
      }
      resolve();
    });
  });
};
