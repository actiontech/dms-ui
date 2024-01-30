import { I18nKey } from '../../locale';
import { BasicTagColor } from '../../theme/theme.type';

export type EnterpriseFeatureDisplayProps = {
  children: React.ReactNode;
  eeFeatureDescription: React.ReactNode;
  featureName: string;
  isConfigPage?: boolean;
};

export type VersionComparisonItem = {
  key: string;
  color: BasicTagColor;
  type: I18nKey;
  title: I18nKey;
  subtitle: I18nKey;
  buttonText: I18nKey;
  termText?: I18nKey;
  applyLink: string;
  contentDesc: I18nKey;
};
