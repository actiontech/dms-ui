import { Popover, Space } from 'antd';
import { t } from '../../locale';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { BasicTag, BasicToolTips } from '@actiontech/shared';
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
        dataIndex: 'description',
        title: () => <>{t('dataMaskRuleOverview.columns.description')}</>
      },
      {
        dataIndex: 'reference_fields',
        title: () => {
          return (
            <BasicToolTips
              suffixIcon
              titleWidth={280}
              title={t('dataMaskRuleOverview.columns.namedFieldReferenceTips')}
            >
              {t('dataMaskRuleOverview.columns.namedFieldReference')}
            </BasicToolTips>
          );
        },
        width: 240,
        render: (fields?: string[]) => {
          const fieldData = fields ?? [];
          if (!fieldData.length) {
            return 'All';
          }
          return (
            <Popover
              content={
                fieldData.length > 1 ? (
                  <Space wrap>
                    {fieldData.map((v) => (
                      <BasicTag key={v}>{v}</BasicTag>
                    ))}
                  </Space>
                ) : null
              }
              overlayStyle={{
                maxWidth: '480px',
                paddingTop: 0
              }}
            >
              <Space>
                <BasicTag style={{ marginRight: 0 }}>{fieldData[0]}</BasicTag>
                {fieldData.length > 1 ? '...' : null}
              </Space>
            </Popover>
          );
        }
      },
      {
        dataIndex: 'effect',
        title: () => <>{t('dataMaskRuleOverview.columns.dataMaskEffect')}</>
      }
    ];
  };
