export const ModalFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 13 }
  }
};

export const PageFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 }
  }
};

export const PageBigFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
    // md: { span: 1 },
  }
};

export const FilterFormLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 }
};

export const FilterFormColLayout = {
  xs: 24,
  sm: 12,
  xl: 8,
  xxl: 6
};

export const PROJECT_ROUTER_PARAM = ':projectID';

export const filterFormButtonLayoutFactory = (
  smOffset = 0,
  xlOffset = 0,
  xxlOffset = 0
) => ({
  xs: 24,
  sm: {
    span: 12,
    offset: smOffset
  },
  xl: {
    span: 8,
    offset: xlOffset
  },
  xxl: {
    span: 6,
    offset: xxlOffset
  }
});

export const FilterFormRowLayout = {
  gutter: 24
};

export const ANTD_PREFIX_STR = 'antd-v5';

export const ComponentControlHeight = {
  default: 36,
  lg: 36,
  sm: 28
};

export const SQLE_BASE_URL = '/sqle/';

export const DrawerFormLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export const SystemFormLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 }
};

export const DMS_DEFAULT_WEB_TITLE = 'SQLE';

export const DEFAULT_PROJECT_ID = '700300';
export const DEFAULT_PROJECT_NAME = 'default';
export const DMS_DEFAULT_WEB_LOGO_URL = '/logo.png';

export enum ManagementPermissionsEnum {
  Create_Project = '1'
}
