import { I18nKey } from '../../locale';

export type EnterpriseFeatureDisplayProps = {
  children: React.ReactNode;
  eeFeatureDescription: React.ReactNode;
  featureName: string;
  isConfigPage?: boolean;
};

export type VersionComparisonItem = {
  key: string;
  title: I18nKey;
  applyLink: string;
  contactLink: string;
  contentDesc: I18nKey;
};
