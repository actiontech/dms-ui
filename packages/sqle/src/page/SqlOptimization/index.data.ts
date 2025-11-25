import { UploadTypeEnum } from '../SqlAudit/Create/SQLInfoForm/index.type';

export const OptimizationNameUploadTypePrefix = {
  [UploadTypeEnum.sql]: 'UI',
  [UploadTypeEnum.sqlFile]: 'SQLfile',
  [UploadTypeEnum.mybatisFile]: 'MYBATISfile',
  [UploadTypeEnum.zipFile]: 'ZIPfile',
  [UploadTypeEnum.git]: 'GIT'
};

export enum SqlOptimizationStatusEnum {
  'finish' = 'finish',
  'failed' = 'failed',
  'optimizing' = 'optimizing'
}
