import { Space } from 'antd';
import { t } from '../../locale';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { BasicTag } from '@actiontech/shared';
import { IListMaskingRulesData } from '@actiontech/shared/lib/api/base/service/common';

export const dataMaskRuleOverviewTableColumns =
  (): ActiontechTableColumn<IListMaskingRulesData> => {
    return [
      {
        dataIndex: 'id',
        title: () => t('dataMaskRuleOverview.columns.number'),
        width: 100
      },
      {
        dataIndex: 'masking_type',
        title: () => <>{t('dataMaskRuleOverview.columns.dataMaskType')}</>
      },
      {
        dataIndex: 'reference_fields',
        title: () => (
          <>{t('dataMaskRuleOverview.columns.namedFieldReference')}</>
        ),
        width: 240,
        render: (field?: string[]) => (
          <Space size={[0, 8]} wrap>
            {field?.map((item: string) => (
              <BasicTag key={item}>{item}</BasicTag>
            ))}
          </Space>
        )
      },
      {
        dataIndex: 'effect',
        title: () => <>{t('dataMaskRuleOverview.columns.dataMaskEffect')}</>
      }
    ];
  };
