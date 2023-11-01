import { SharedTheme } from './theme.type';
import { RuleObject } from 'antd/es/form';
import { ColumnGroupType, ColumnType, TableProps } from 'antd/es/table';

export type Dictionary = {
  [key: string]: string | number | boolean | Dictionary | string[] | undefined;
};

export type StringDictionary = {
  [key: string]: string;
};

export type ModalStatus = {
  [key: string]: boolean;
};

export type TableColumn<RecordType = unknown, OtherColumnKes = ''> = Array<
  (ColumnGroupType<RecordType> | ColumnType<RecordType>) & {
    dataIndex: keyof RecordType | OtherColumnKes;
  }
>;

export type TableChange<RecordType = unknown> = Required<
  TableProps<RecordType>
>['onChange'];

export type TablePaginationProps = {
  current: number;
  pageSize: number;
};

export type FormValidatorRule = RuleObject['validator'];

export type TemplateKeyPath<T> = {
  [key in keyof T]: key extends string
    ? T[key] extends Record<string, any>
      ? `${key}.${TemplateKeyPath<T[key]>}`
      : key
    : never;
}[keyof T];

export interface IStore {
  [key: string]: any;
}

//todo: sqle后端已删除这个定义，dms暂时还需要保留，所以在此暂存，之后再改
export interface IManagementPermissionResV1 {
  code?: number;

  desc?: string;
}
interface ThemeCustom {
  // provision 重构完后移除
  common: {
    padding: number;
    color: {
      warning: string;
      disabledFont: string;
    };
  };
  header: {
    background: string;
    color: string;
  };
  editor: {
    border: string;
  };
  projectLayoutSider: {
    border: string;
  };
  optionsHover: {
    background: string;
  };
  layout: {
    padding: string;
  };
  slide: {
    title: {
      color: string;
    };
  };
  guide: {
    stepBox: {
      titleBorderBottom: string;
      innerBoxBgColor: string;
      innerBoxBorderRight: string;
    };
  };
  color: {
    link: string;
    success: string;
    warn: string;
    danger: string;
    secondary: string;
    disabled: string;
  };
  auditResultLevelNormalBox: {
    border: string;
    color: string;
  };
  // antd v5
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
