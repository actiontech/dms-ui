import { promises as fs, existsSync, readFileSync } from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import type { RequiredOptions } from 'prettier';
import { logger } from './logger';

export class Writer {
  private static options: Partial<RequiredOptions>;

  public static async writeFile(src: string, content: string) {
    try {
      await this.makeDir(path.dirname(src));
      await fs.writeFile(src, content);
    } catch (error) {
      logger.error(`Write file:: ${src}`);
      logger.error(error);
    }
  }

  public static async formattedWriteFile(
    src: string,
    content: string,
    cwd: string
  ) {
    try {
      this.getPrettierOption(cwd);
      await this.makeDir(path.dirname(src));
      const formattedCode = await prettier.format(content, this.options);
      await fs.writeFile(src, formattedCode);
    } catch (error) {
      logger.error(`Formatted write file:: ${src}`);
      logger.error(error);
    }
  }

  private static getPrettierOption(cwd: string) {
    if (this.options) {
      return;
    }

    ['.prettierrc', '.prettierrc.json'].forEach((v) => {
      const configPath = path.resolve(cwd, v);
      if (existsSync(configPath)) {
        this.options = {
          parser: 'typescript',
          ...JSON.parse(readFileSync(configPath, 'utf-8'))
        };
      }
    });

    if (this.options) {
      return;
    }

    ['.prettierrc.js', 'prettier.config.js', '.prettierrc.cjs'].forEach((v) => {
      const configPath = path.resolve(cwd, v);
      if (existsSync(configPath)) {
        this.options = {
          parser: 'typescript',
          ...require(configPath)
        };
      }
    });

    if (this.options) {
      return;
    }

    this.options = {
      parser: 'typescript',
      tabWidth: 2,
      semi: true,
      printWidth: 80,
      trailingComma: 'none',
      arrowParens: 'avoid',
      proseWrap: 'preserve',
      useTabs: false,
      singleQuote: true,
      bracketSpacing: true,
      jsxBracketSameLine: false
    };
  }

  private static async makeDir(dirname: string) {
    if (!existsSync(dirname)) {
      await fs.mkdir(dirname, { recursive: true });
    }
  }
}
