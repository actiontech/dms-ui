export type DatabaseComparisonFromFields = {
  baselineInstance: string;
  comparisonInstance: string;
};

export type SelectedInstanceInfo = {
  instanceId: string;
  instanceName: string;
  schemaName?: string;
  instanceType: string;
};
