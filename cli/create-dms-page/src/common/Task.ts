import { Command } from 'commander';

export interface Task {
  register(program: Command): void;
  run(...arg: any[]): void;
}
