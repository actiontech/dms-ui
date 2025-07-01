import { t } from '../../../../locale';
import { MockProgressStatusEnum, IProcessingStage } from './index.type';

export const MOCK_PROCESSING_STAGES: IProcessingStage[] = [
  {
    status: MockProgressStatusEnum.waiting,
    label: t('sqlRewrite.ruleProcessingWaiting'),
    duration: [4000, 10000]
  },
  {
    status: MockProgressStatusEnum.applyingRule,
    label: t('sqlRewrite.ruleProcessingApplyingRule'),
    duration: [10000, 20000]
  },
  {
    status: MockProgressStatusEnum.modelEvaluating,
    label: t('sqlRewrite.ruleProcessingModelEvaluating'),
    duration: [10000, 20000]
  },
  {
    status: MockProgressStatusEnum.analyzing,
    label: t('sqlRewrite.ruleProcessingAnalyzing'),
    duration: [10000, 20000]
  },
  {
    status: MockProgressStatusEnum.applyRewrite,
    label: t('sqlRewrite.ruleProcessingApplyRewrite'),
    duration: [10000, 20000]
  },
  {
    status: MockProgressStatusEnum.verifying,
    label: t('sqlRewrite.ruleProcessingVerifying'),
    duration: [10000, 20000]
  }
];
