import { input } from '@inquirer/prompts';
import { IIconConfig, IIconManager } from './interface';
import clipboard from 'node-clipboardy';
import { PathUtils } from '../../utils/path-utils';
import path from 'path';
import { Writer } from '../../utils/writer-utils';
import { spawnWrapper } from '../../utils/spawn-util';
import { Template } from '../../template';
import { StrUtils } from '../../utils/str-utils';
import { readdir } from 'fs/promises';
import { isWindows } from '../../utils/platform';

export class IconManager implements IIconManager {
  private readonly iconNamePattern = /^[A-Z][a-zA-Z]*(Filled|Outlined)$/;
  public config!: IIconConfig;

  private async getIconConfig(): Promise<void> {
    const clipboardData = await clipboard.read();

    const iconSvgContent = StrUtils.isSvgContent(clipboardData)
      ? clipboardData
      : Template.iconSvgTemplate;

    const iconName = await input({
      message:
        '请输入菜单 icon 名称。（格式：/^[A-Z][a-zA-Z]*(Filled|Outlined)$/）',
      required: true,
      validate: this.validateIconName.bind(this)
    });

    const match = iconName.match(this.iconNamePattern);
    if (!match || !match[1]) {
      throw new Error(`Unable to extract icon type from: ${iconName}`);
    }

    const iconPath = PathUtils.getIconDirectoryAtPath(
      match[1].toLocaleLowerCase(),
      'Common'
    );

    this.config = {
      iconSvgContent,
      iconName,
      iconPath,
      iconLibName: '@actiontech/icons'
    };
  }

  private generateIconFileName(iconName: string): string {
    return `${iconName}.svg`;
  }

  private async validateIconName(iconName: string): Promise<string | boolean> {
    const match = iconName.match(this.iconNamePattern);

    if (!match || !match[1]) {
      return (
        `Invalid icon name format: ${iconName}\n` +
        'Icon name must:\n' +
        '1. Start with an uppercase letter\n' +
        '2. Use camelCase\n' +
        '3. End with either "Filled" or "Outlined"\n' +
        'Example: BookMarkFilled, UserOutlined'
      );
    }

    const style = match[1].toLowerCase();

    try {
      const styleDirectories = await readdir(
        PathUtils.getIconDirectoryAtPath(style)
      );

      for (const dir of styleDirectories) {
        const typeDirectoryName = PathUtils.getIconDirectoryAtPath(style, dir);
        const icons = await readdir(typeDirectoryName);
        if (icons.includes(this.generateIconFileName(iconName))) {
          return `Icon file ${iconName} already exists in ${typeDirectoryName}`;
        }
      }
    } catch (error) {
      throw new Error(`Failed to validate icon name: ${iconName}`);
    }

    return true;
  }

  private async createIconSvgFile(): Promise<void> {
    await Writer.writeFile(
      path.join(
        this.config.iconPath,
        this.generateIconFileName(this.config.iconName)
      ),
      this.config.iconSvgContent
    );
  }
  async run(): Promise<void> {
    try {
      await this.getIconConfig();
      await this.createIconSvgFile();
      const command = isWindows ? 'pnpm.cmd' : 'pnpm';
      await spawnWrapper(command, ['icon:g']);
    } catch (error) {
      throw new Error(`generate menu icon: ${error}`);
    }
  }
}
