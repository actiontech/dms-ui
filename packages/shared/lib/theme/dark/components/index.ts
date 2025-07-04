import { SharedTheme } from '../../../types/theme.type';
import basicButtonTheme from './button';
import columnsSettingTheme from './columnsSetting';
import customSelectTheme from './customSelect';
import filterContainerTheme from './filterContainer';
import basicInputTheme from './input';
import pageHeaderTheme from './pageHeader';
import basicRangePickerTheme from './rangePicker';
import basicSelectTheme from './select';
import tableTheme from './table';
import toolbarTheme from './toolbar';
import { customFilterRangePickerTheme } from './customFilter';
import basicSegmentedTheme from './segmented';
import basicDrawerTheme from './drawer';
import basicModalTheme from './modal';
import customMonacoEditorTheme from './monacoEditor';
import searchInputTheme from './searchInput';
import customDraggerUploadTheme from './draggerUpload';
import basicResultTheme from './result';
import configItemTheme from './configItem';
import ruleComponentTheme from './ruleComponent';
import basicEmptyTheme from './empty';
import basicChartTheme from './chart';
import basicInfoListTheme from './infoList';
import tagTheme from './tag';
import customAvatarTheme from './avatar';

export const darkComponentsTheme: SharedTheme['components'] = {
  basicButton: basicButtonTheme,
  basicInput: basicInputTheme,
  basicSelect: basicSelectTheme,
  basicRangePicker: basicRangePickerTheme,
  pageHeader: pageHeaderTheme,
  table: tableTheme,
  customSelect: customSelectTheme,
  filterContainer: filterContainerTheme,
  searchInput: searchInputTheme,
  columnsSetting: columnsSettingTheme,
  toolbar: toolbarTheme,
  customFilter: {
    rangePicker: customFilterRangePickerTheme
  },
  basicSegmented: basicSegmentedTheme,
  basicDrawer: basicDrawerTheme,
  basicModal: basicModalTheme,
  customMonacoEditor: customMonacoEditorTheme,
  customDraggerUpload: customDraggerUploadTheme,
  basicResult: basicResultTheme,
  configItem: configItemTheme,
  ruleComponent: ruleComponentTheme,
  basicEmpty: basicEmptyTheme,
  basicChart: basicChartTheme,
  basicInfoList: basicInfoListTheme,
  basicTag: tagTheme,
  customAvatar: customAvatarTheme
};
