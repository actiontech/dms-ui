import { IComponentType } from '../../create-dms-page';
import { Writer } from '../../utils/writer-utils';
import { IPageComponentManager } from '../page-component-manager/interface';
import { ILocaleConfig, ILocaleManager } from './interface';
import { PathUtils } from '../../utils/path-utils';
import { Template } from '../../template';
import { BabelUtils } from '../../utils/babel-utils';
import { StrUtils } from '../../utils/str-utils';

export class LocaleManager implements ILocaleManager {
  constructor(
    private readonly componentType: IComponentType,
    private readonly pageComponentManager: IPageComponentManager
  ) {}
  config!: ILocaleConfig;

  private getLocaleConfig() {
    const localeDirAtPath = PathUtils.getLocaleDirectoryAtPath(
      this.componentType
    );
    const localeIndexFileAtPath = PathUtils.getLocaleIndexFileAtPath(
      this.componentType
    );
    const localeModuleName = StrUtils.convertFirstLetterToLowerCase(
      this.pageComponentManager.config.componentName
    );
    const localeModuleFileAtPath = PathUtils.getLocaleModuleFileAtPath(
      this.componentType,
      localeModuleName
    );
    const menuI18nFileAtPath = PathUtils.getMenu18nLocaleFileAtPath();

    this.config = {
      localeDirAtPath,
      localeModuleName,
      menuI18nFileAtPath,
      localeIndexFileAtPath,
      localeModuleFileAtPath,
      menuI18nKeyPath: `dmsMenu.${localeModuleName}`
    };
  }

  private async writeMenuLocalFile() {
    await BabelUtils.addKeyToObject({
      filePath: this.config.menuI18nFileAtPath,
      isDefaultExportObject: true,
      keyPath: [this.config.localeModuleName],
      value: {
        type: 'literal',
        value: this.pageComponentManager.config.pageTitle
      }
    });
  }

  private async writeLocaleFile() {
    await Writer.formattedWriteFile(
      this.config.localeModuleFileAtPath,
      Template.localeTemplate,
      PathUtils.DMS_ROOT_CWD
    );
  }

  private async updateLocaleImportDeclare() {
    await BabelUtils.addImportDefaultDeclaration({
      filePath: this.config.localeIndexFileAtPath,
      moduleSpecifier: `./${this.config.localeModuleName}`,
      defaultImport: this.config.localeModuleName
    });
  }

  private async updateLocaleExports() {
    await BabelUtils.addKeyToObject({
      filePath: this.config.localeIndexFileAtPath,
      isDefaultExportObject: true,
      keyPath: ['translation', this.config.localeModuleName],
      value: { type: 'shorthand', name: this.config.localeModuleName }
    });
  }

  public async run(): Promise<void> {
    try {
      this.getLocaleConfig();
      await this.writeLocaleFile();
      await this.updateLocaleExports();
      await this.updateLocaleImportDeclare();
      await this.writeMenuLocalFile();
    } catch (error) {
      throw new Error(`generate page locale: ${error}`);
    }
  }
}
