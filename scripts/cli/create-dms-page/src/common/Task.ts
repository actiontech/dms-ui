import { Command } from 'commander';

export interface Task {
  register(program: Command): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run(...arg: any[]): void;
}
