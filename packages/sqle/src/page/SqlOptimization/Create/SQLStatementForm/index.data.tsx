// import { SettingOutlined } from '@ant-design/icons';
import { t } from '../../../../locale/index';
import { UploadTypeEnum } from '../../index.type';
import { FileUploadFilled, PanelCardOutlined } from '@actiontech/icons';
import { ModeSwitcherOptionsType } from '@actiontech/shared';

export const uploadTypeOptions: ModeSwitcherOptionsType = [
  {
    icon: <PanelCardOutlined width={18} height={18} />,
    label: t('sqlOptimization.create.sqlInfo.uploadTypeEnum.sql'),
    value: UploadTypeEnum.sql,
    colProps: {
      span: 8
    }
  },
  // {
  //   icon: <FileUploadFilled width={18} height={18} />,
  //   label: t('sqlOptimization.create.sqlInfo.uploadTypeEnum.sqlFile'),
  //   value: UploadTypeEnum.sqlFile,
  //   colProps: {
  //     span: 8
  //   }
  // },
  {
    icon: <FileUploadFilled width={18} height={18} />,
    label: t('sqlOptimization.create.sqlInfo.uploadTypeEnum.mybatisFile'),
    value: UploadTypeEnum.mybatisFile,
    colProps: {
      span: 8
    }
  }
  // {
  //   icon: <FileUploadFilled width={18} height={18} />,
  //   label: t('sqlOptimization.create.sqlInfo.uploadTypeEnum.zipFile'),
  //   value: UploadTypeEnum.zipFile,
  //   colProps: {
  //     span: 8
  //   }
  // },
  // {
  //   icon: <SettingOutlined />,
  //   label: t('sqlOptimization.create.sqlInfo.uploadTypeEnum.git'),
  //   value: UploadTypeEnum.git,
  //   colProps: {
  //     span: 8
  //   }
  // }
];
