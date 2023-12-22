export type EnterpriseFeatureDisplayProps = {
  children: React.ReactNode;
  eeFeatureDescription: React.ReactNode;
  featureName: string;
  isConfigPage?: boolean;
};

export type VersionComparisonItem = {
  key: string;
  title: string;
  applyLink: string;
  contactLink: string;
  contentDesc: string;
};
