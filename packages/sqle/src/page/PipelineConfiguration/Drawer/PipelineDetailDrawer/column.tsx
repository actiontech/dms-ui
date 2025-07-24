import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { IPipelineNodeDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../locale/index';
import { PipelineNodeTypeDictionary } from '../../Common/ConfigurationForm/index.data';
import { BasicToolTip } from '@actiontech/shared';
import { Typography } from 'antd';
import { PipelineDetailModalIntegrationInfoStyleWrapper } from './style';

export const PipelineNodeTableColumn =
  (): ActiontechTableColumn<IPipelineNodeDetail> => {
    return [
      {
        title: () => <>{t('pipelineConfiguration.form.node.name')}</>,
        dataIndex: 'name'
      },
      {
        title: () => <>{t('pipelineConfiguration.form.node.type')}</>,
        dataIndex: 'type',
        render: (value: IPipelineNodeDetail['type']) => {
          return value ? PipelineNodeTypeDictionary[value] : '-';
        }
      },
      {
        title: () => <>{t('pipelineConfiguration.form.node.template')}</>,
        dataIndex: 'rule_template_name'
      },
      {
        title: () => <>{t('pipelineConfiguration.modal.integrationInfo')}</>,
        dataIndex: 'integration_info',
        render: (value) => {
          return (
            <BasicToolTip
              trigger="click"
              placement="topLeft"
              titleWidth={360}
              title={
                <PipelineDetailModalIntegrationInfoStyleWrapper
                  copyable={{ text: value?.split('#启动命令#\n')?.[1] }}
                >
                  {value}
                </PipelineDetailModalIntegrationInfoStyleWrapper>
              }
            >
              <Typography.Link>
                {t('pipelineConfiguration.modal.view')}
              </Typography.Link>
            </BasicToolTip>
          );
        }
      }
    ];
  };
