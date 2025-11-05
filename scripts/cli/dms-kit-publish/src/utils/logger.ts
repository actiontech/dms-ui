import chalk from 'chalk';

// 日志工具函数
export const stepLog = (msg: string) => console.log(chalk.magenta(`>> ${msg}`));
export const successLog = (msg: string) => console.log(chalk.green(msg));
export const errorLog = (msg: string) => console.log(chalk.red(msg));
export const warnLog = (msg: string) => console.log(chalk.yellow(msg));
export const infoLog = (msg: string) => console.log(chalk.cyan(msg));
