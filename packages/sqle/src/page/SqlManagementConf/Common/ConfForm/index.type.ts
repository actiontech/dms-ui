export type ScanTypeParams = {
  ruleTemplateName: string;
  [key: string]: string | boolean;
};

export type SqlManagementConfFormFields = {
  needConnectDataSource: boolean;
  businessScope: string;
  instanceName: string;
  instanceType: string;
  scanTypes: string[];
  [key: string]: string | boolean | string[] | ScanTypeParams;
};
