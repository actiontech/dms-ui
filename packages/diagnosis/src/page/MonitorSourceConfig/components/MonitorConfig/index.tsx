import { BasicButton, PageHeader } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ArrowLeftOutlined, SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { MonitorConfigStyleWrapper } from './style';
import { MonitorConfigUrlParams } from './index.type';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import monitor from '@actiontech/shared/lib/api/diagnosis/service/monitor';
import { IV1ListMonitorRoutineParams } from '@actiontech/shared/lib/api/diagnosis/service/monitor/index.d';
import { IViewMonitorConfigReply } from '@actiontech/shared/lib/api/diagnosis/service/common';
import { useRequest } from 'ahooks';
import { IconTagBookMark } from '@actiontech/shared/lib/Icon/common';
import { MonitorConfigColumns, monitorSourceDictionary } from './column';
import { MonitorSourceConfigTypeEnum } from '../../index.type';

const MonitorConfig = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const urlParams = useParams<MonitorConfigUrlParams>();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IViewMonitorConfigReply,
    IV1ListMonitorRoutineParams
  >();

  const {
    loading,
    data: monitorConfigList,
    refresh
  } = useRequest(
    () => {
      return handleTableRequestError(
        monitor.V1ListMonitorRoutine({
          ...pagination,
          source_id: Number(urlParams.id),
          project_uid: projectID
        })
      );
    },
    {
      ready: !!urlParams.id,
      refreshDeps: [urlParams.id, pagination]
    }
  );
  console.log(urlParams.sourceName);
  return (
    <>
      <MonitorConfigStyleWrapper>
        <PageHeader
          title={
            <Link
              to={`/diagnosis/project/${projectID}/monitorSourceConfig`}
              key="go-back"
            >
              <BasicButton icon={<ArrowLeftOutlined />}>
                {t('monitorSourceConfig.monitorConfig.returnMonitorSource')}
              </BasicButton>
            </Link>
          }
        />
        <section className="header-wrapper">
          <section className="header">
            <h3 className="header-cont-text">{urlParams.sourceName}</h3>
            <SyncOutlined
              onClick={refresh}
              spin={loading}
              className="refresh-icon"
            />
          </section>
          <section className="tag-wrapper">
            <div className="custom-tag-item">
              <IconTagBookMark className="custom-tag-icon bookmark-icon" />
              <div>
                {t('monitorSourceConfig.sourceType.typeLabel', {
                  type: monitorSourceDictionary[
                    urlParams.type ?? MonitorSourceConfigTypeEnum.server_monitor
                  ]
                })}
              </div>
            </div>
          </section>
        </section>
        <section className="detail-table-wrapper">
          <ActiontechTable
            loading={loading}
            columns={MonitorConfigColumns()}
            onChange={tableChange}
            pagination={{
              total: monitorConfigList?.total ?? 0
            }}
            rowKey="routine_name"
            dataSource={monitorConfigList?.list ?? []}
            errorMessage={requestErrorMessage}
          />
        </section>
      </MonitorConfigStyleWrapper>
    </>
  );
};

export default MonitorConfig;
