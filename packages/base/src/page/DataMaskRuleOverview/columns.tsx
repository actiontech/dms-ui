import { Space } from 'antd';
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
        dataIndex: 'reference_fields',
        title: () => (
          <>{t('dataMaskRuleOverview.columns.namedFieldReference')}</>
        ),
        width: 400,
        render: (fields?: string[]) => {
          // return (
          //   <Space size={[0, 8]} wrap>
          //     {field?.map((item: string) => (
          //       <BasicTag key={item}>{item}</BasicTag>
          //     ))}
          //   </Space>
          // );
          const fieldData = fields ?? [];
          if (!fieldData.length) {
            return '-';
          }
          return (
            <BasicToolTips
              title={
                fieldData.length > 1 ? (
                  <Space wrap>
                    {fieldData.map((v) => (
                      <BasicTag key={v}>{v}</BasicTag>
                    ))}
                  </Space>
                ) : null
              }
            >
              <BasicTag style={{ marginRight: 0 }}>{fieldData[0]}</BasicTag>
              {fieldData.length > 1 ? '...' : null}
            </BasicToolTips>
          );
        }
      },
      {
        dataIndex: 'effect',
        title: () => <>{t('dataMaskRuleOverview.columns.dataMaskEffect')}</>
      }
    ];
  };
