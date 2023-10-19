type typeDefaultButton = 'primary' | 'default';

type BasicButtonDefaultType = {
  [key in typeDefaultButton]: {
    default: {
      background: string;
      color: string;
      boxShadow: string;
    };
    hover: {
      background: string;
    };
    active: {
      background: string;
    };
    disabled: {
      background: string;
      color: string;
    };
  };
};

export interface IBasicButtonDangerous {
  dangerous: {
    default: {
      color: string;
    };
    disabled: {
      color: string;
    };
  };
}

export interface IBasicButtonDashed {
  dashed: {
    default: {
      border: string;
    };
  };
}

export type BasicButtonTheme = BasicButtonDefaultType &
  IBasicButtonDangerous &
  IBasicButtonDashed;

export type BasicInputTheme = {
  default: {
    border: string;
    placeholder: {
      color: string;
    };
    dataCountColor: string;
  };
  hover: {
    border: string;
  };
  focus: {
    border: string;
    caretColor: string;
  };
  error: {
    border: string;
  };
  disabled: {
    border: string;
    background: string;
  };
};

export type BasicSelectTheme = {
  default: {
    border: string;
    placeholder: {
      color: string;
    };
  };
  hover: {
    border: string;
  };
  active: {
    border: string;
  };
  error: {
    border: string;
  };
  disabled: {
    border: string;
    background: string;
  };
};

export type BasicRangePickerTheme = {
  default: {
    border: string;
    placeholder: {
      color: string;
    };
  };
  hover: {
    border: string;
  };
  active: {
    border: string;
  };
  error: {
    border: string;
  };
  disabled: {
    border: string;
    background: string;
  };
};

export type BasicDrawerTheme = {
  backgroundColor: string;
  boxShadow: string;
  color: string;
};

export type BasicModalTheme = {
  content: {
    backgroundColor: string;
    border: string;

    header: {
      border: string;
      title: {
        color: string;
      };
    };
    body: {
      color: string;
    };
    footer: {
      backgroundColor: string;
    };
  };
};

export type BasicResultTheme = {
  title: {
    color: string;
  };
  subTitle: {
    color: string;
  };
};

export type PageHeaderTheme = {
  borderBottom: string;
  background: string;
  title: {
    color: string;
  };
};

export type TableTheme = {
  thead: {
    color: string;
    border: string;
  };
  row: {
    color: string;
    border: string;
    moreButtonInActions: {
      backgroundColor: string;
      color: string;
      border: string;
      boxShadow: string;
      hoverItemBackgroundColor: string;
    };
  };
  pagination: {
    backgroundColor: string;
    border: string;
    total: {
      color: string;
    };
    item: {
      color: string;
      hoverBackgroundColor: string;
      activeBackgroundColor: string;
      activeBorder: string;
      activeColor: string;
    };
    options: {
      backgroundColor: string;
      border: string;
      boxShadow: string;
      hoverBorder: string;
      itemColor: string;
    };
  };
};

export type CustomSelectTheme = {
  searchInput: {
    borderBottom: string;
    hoverBorderBottom: string;
  };
  placeholder: {
    color: string;
  };
  content: {
    prefixColor: string;
    labelColor: string;
  };

  border: string;
  iconColor: string;
  hoverBackgroundColor: string;
  focusBackGroundColor: string;
  disabled: {
    border: string;
    background: string;
  };
};

export type FilterContainerTheme = {
  border: string;
  backgroundColor: string;
};

export type SearchInputTheme = {
  searchIconColor: string;
};

export type ColumnsSettingTheme = {
  dropdown: {
    backgroundColor: string;
    boxShadow: string;
    border: string;
    title: {
      color: string;
    };
    item: {
      hoverBackgroundColor: string;
      labelColor: string;
      iconColor: string;
    };
  };
};

export type ToolbarTheme = {
  border: string;
  backgroundColor: string;
};

export type CustomFilterRangePickerTheme = {
  borderColor: string;
  placeholder: {
    color: string;
  };
  hoverBackgroundColor: string;
  focusBackgroundColor: string;
  filterLabelColor: string;
};

export type UITokenTheme = {
  colorInfo: string;
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorTextBase: string;
  colorBgBase: string;
  colorText: string;
  colorTextSecondary: string;
  colorTextTertiary: string;
  colorTextQuaternary: string;
  colorBorderSecondary: string;
  colorBorder: string;
  colorFill: string;
  colorFillSecondary: string;
  colorFillTertiary: string;
  colorFillQuaternary: string;
  colorBgLayout: string;
  colorWarningBgHover: string;
  colorErrorBgHover: string;
};

export type BasicTheme = {
  colorPrimaryActive: string;
  colorPrimaryHover: string;
  colorPrimaryBgHover: string;
  colorPrimaryBgActive: string;
  colorPrimaryDisabled: string;
  colorPrimaryShadow: string;
  colorDangerousActive: string;
  colorDefaultIcon: string;
  colorBgLayoutGray: string;
  colorFontGrayByWhite: string;
  colorShadowByWhite: string;
  colorWhite: string;
  colorGrayLine: string;
  controlHeight: number;
  controlHeightLG: number;
  controlHeightSM: number;
  paddingNumber: number;
  borderRadius4: number;
};

export type BasicSegmentedTheme = {
  color: string;
  backgroundColor: string;
  hoverBackgroundColor: string;
  noticeCountColor: string;
  active: {
    color: string;
    border: string;
    boxShadow: string;
  };
};

export type CustomMonacoEditorTheme = {
  border: string;
  marginViewOverlaysColor: string;
  marginBackgroundColor: string;
  linesContentBackgroundColor: string;
};

export type CustomDraggerUploadTheme = {
  border: string;
  color: string;
  backgroundColor: string;
};

export type ConfigItemTheme = {
  maskBg: string;
};

export type RuleComponentTheme = {
  ruleStatus: {
    enableColor: string;
    disabledColor: string;
  };
  ruleType: {
    border: string;
    backgroundColor: string;
    color: string;
    activeBackgroundColor: string;
    activeColor: string;
    countActiveBackgroundColor: string;
    countBackgroundColor: string;
  };
  ruleList: {
    border: string;
    backgroundColor: string;
    hoverBorder: string;
    hoverBackgroundColor: string;
    levelIconTextColor: string;
    endContentColor: string;
    levelContent: {
      annotationColor: string;
      paramsColor: string;
      paramsBackgroundColor: string;
    };
  };
};

export type BasicEmptyTheme = {
  title: {
    color: string;
    fontSize: string;
    fontWeight: number;
  };
  info: {
    color: string;
    fontSize: string;
    fontWeight: number;
  };
  description: string;
};

export type BasicChartTheme = {
  borderRadius: string;
  border: string;
};

export type BasicInfoListTheme = {
  borderRadius: string;
  bodyBoxShadow: string;
  title: {
    border: string;
    backgroundColor: string;
    color: string;
    fontSize: string;
    fontWeight: number;
  };
  value: {
    border: string;
    color: string;
    fontSize: string;
    fontWeight: number;
  };
};

export type BasicTagColor =
  | 'default'
  | 'red'
  | 'orange'
  | 'gold'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'geekblue'
  | 'purple'
  | 'Grape'
  | 'lilac';

export type BasicTagTheme = Record<
  BasicTagColor,
  { color?: string; backgroundColor?: string }
>;
