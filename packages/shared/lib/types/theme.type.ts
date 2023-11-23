import {
  BasicButtonTheme,
  BasicInputTheme,
  BasicRangePickerTheme,
  BasicSelectTheme,
  BasicTheme,
  PageHeaderTheme,
  TableTheme,
  UITokenTheme,
  CustomSelectTheme,
  ColumnsSettingTheme,
  SearchInputTheme,
  FilterContainerTheme,
  ToolbarTheme,
  CustomFilterRangePickerTheme,
  BasicSegmentedTheme,
  BasicDrawerTheme,
  BasicModalTheme,
  CustomMonacoEditorTheme,
  CustomDraggerUploadTheme,
  BasicResultTheme,
  ConfigItemTheme,
  RuleComponentTheme,
  BasicEmptyTheme,
  BasicChartTheme,
  BasicInfoListTheme,
  BasicTagTheme,
  NavTheme
} from '../theme/theme.type';

export interface SharedTheme {
  uiToken: UITokenTheme;
  basic: BasicTheme;
  nav: NavTheme;
  components: {
    basicButton: BasicButtonTheme;
    basicInput: BasicInputTheme;
    basicSelect: BasicSelectTheme;
    basicRangePicker: BasicRangePickerTheme;
    pageHeader: PageHeaderTheme;
    table: TableTheme;
    customSelect: CustomSelectTheme;
    filterContainer: FilterContainerTheme;
    searchInput: SearchInputTheme;
    columnsSetting: ColumnsSettingTheme;
    toolbar: ToolbarTheme;
    customFilter: {
      rangePicker: CustomFilterRangePickerTheme;
    };
    basicSegmented: BasicSegmentedTheme;
    basicDrawer: BasicDrawerTheme;
    basicModal: BasicModalTheme;
    customMonacoEditor: CustomMonacoEditorTheme;
    customDraggerUpload: CustomDraggerUploadTheme;
    basicResult: BasicResultTheme;
    configItem: ConfigItemTheme;
    ruleComponent: RuleComponentTheme;
    basicEmpty: BasicEmptyTheme;
    basicChart: BasicChartTheme;
    basicInfoList: BasicInfoListTheme;
    basicTag: BasicTagTheme;
  };
}

interface ThemeCustom {
  sharedTheme: SharedTheme;
}
declare module '@mui/system' {
  interface Theme extends ThemeCustom {
    noUse: string;
  }
  // 允许配置文件使用 `createTheme`
  interface ThemeOptions extends Partial<ThemeCustom> {
    noUse?: string;
  }
}

declare module '@mui/material/styles' {
  interface Theme extends ThemeCustom {
    noUse: string;
  }
  // 允许配置文件使用 `createTheme`
  interface ThemeOptions extends Partial<ThemeCustom> {
    noUse?: string;
  }
}
