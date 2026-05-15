import { input } from '@inquirer/prompts';
import { IPageComponentManager, IComponentConfig } from './interface';
import { IComponentType } from '../../create-dms-page';
import path from 'path';
import { PathUtils } from '../../utils/path-utils';
import { Writer } from '../../utils/writer-utils';
import { Template } from '../../template';
import { readdir } from 'fs/promises';

export class PageComponentManager implements IPageComponentManager {
  constructor(private readonly componentType: IComponentType) {}

  private readonly pageNamePattern = /^[A-Z][a-z]*([A-Z][a-z]*)*$/;

  config!: IComponentConfig;

  private async getPageConfig() {
    const componentName = await input({
      message: '请输入页面组件名称。（格式：/^[A-Z][a-z]*([A-Z][a-z]*)*$/）',
      required: true,
      validate: this.validatePageName.bind(this)
    });

    const componentPath = PathUtils.getComponentIndexFileAtPath(
      this.componentType,
      componentName
    );

    const pageTitle = await input({
      message: '请输入页面中文标题',
      required: true,
      validate: this.validatePageTile.bind(this)
    });

    this.config = {
      componentName,
      componentPath,
      pageTitle
    };
  }

  private validatePageTile(pageTitle: string): string | boolean {
    for (let i = 0; i < pageTitle.length; i++) {
      const charCode = pageTitle.charCodeAt(i);
      if (charCode < 0x4e00 || charCode > 0x9fff) {
        return 'The string contains non-Chinese characters';
      }
    }

    return true;
  }

  private async validatePageName(pageName: string): Promise<string | boolean> {
    if (!this.pageNamePattern.test(pageName)) {
      return `Invalid page component naming: "${pageName}"\n. 
        The string must start with an uppercase letter and be followed by lowercase letters or numbers, with subsequent words starting with an uppercase letter.\n
        Example: DataSourceManagement, SqlExecWorkflow`;
    }

    const componentDirAtPath = PathUtils.getComponentDirectoryAtPath(
      this.componentType
    );
    const componentDirs = await readdir(componentDirAtPath);

    if (componentDirs.includes(pageName)) {
      return `Component ${pageName} already exists in ${componentDirAtPath}`;
    }

    return true;
  }

  private async createPageComponent(): Promise<void> {
    await Writer.formattedWriteFile(
      path.join(this.config.componentPath),
      Template.pageComponentTemplate(this.config.componentName),
      PathUtils.DMS_ROOT_CWD
    );
  }

  async run(): Promise<void> {
    try {
      await this.getPageConfig();
      await this.createPageComponent();
    } catch (error) {
      throw new Error(`generate page component: ${error}`);
    }
  }
}
