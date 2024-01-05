import { BasicButton, PageHeader } from '@actiontech/shared';
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
import monitor from '../../../../api/monitor';
import { IV1ListMonitorRoutineParams } from '../../../../api/monitor/index.d';
import { IViewMonitorConfigReply } from '../../../../api/common';
import { useRequest } from 'ahooks';
import { IconTagBookMark } from '@actiontech/shared/lib/Icon/common';
import {
  MonitorConfigActions,
  MonitorConfigColumns,
  monitorSourceDictionary
} from './column';
import { MonitorSourceConfigTypeEnum } from '../../index.type';
import { useCallback, useMemo } from 'react';
import { ModalName } from '../../../../data/ModalName';
import MonitorConfigModal from './components/Modal';
import useMonitorSourceConfigRedux from '../../hooks/useMonitorSourceConfigRedux';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import { AdminRolePermission } from '../../../../data/enum';

const MonitorConfig = () => {
  const { t } = useTranslation();

  const { hasActionPermission } = useCurrentUser();

  const { setModalStatus, setMonitorConfigSelectData } =
    useMonitorSourceConfigRedux();

  const urlParams = useParams<MonitorConfigUrlParams>();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IViewMonitorConfigReply,
    IV1ListMonitorRoutineParams
  >();

  const {
    loading,
    data: monitorItemList,
    refresh
  } = useRequest(
    () => {
      return handleTableRequestError(
        monitor.V1ListMonitorRoutine({
          ...pagination,
          source_id: urlParams.id ?? ''
        })
      );
    },
    {
      ready: !!urlParams.id,
      refreshDeps: [urlParams.id, pagination]
    }
  );

  const onCheckMonitorConfig = useCallback(
    (record: IViewMonitorConfigReply | undefined) => {
      if (record) {
        setMonitorConfigSelectData(record);
        setModalStatus(ModalName.Check_Monitor_Config, true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const actions = useMemo(() => {
    const hasCheckMetricsPermission = hasActionPermission(
      AdminRolePermission.ListMetrics
    );
    return MonitorConfigActions(
      onCheckMonitorConfig,
      hasCheckMetricsPermission
    );
  }, [onCheckMonitorConfig, hasActionPermission]);

  return (
    <>
      <MonitorConfigStyleWrapper>
        <PageHeader
          title={
            <Link to={`/monitorSourceConfig`} key="go-back">
              <BasicButton icon={<ArrowLeftOutlined />}>
                {t('monitorSourceConfig.monitorConfig.returnMonitorSource')}
              </BasicButton>
            </Link>
          }
        />
        <section className="header-wrapper">
          <section className="header">
            <h3 className="header-cont-text">{urlParams.name}</h3>
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
              total: monitorItemList?.total ?? 0,
              current: pagination.page_index
            }}
            rowKey="monitor_name"
            dataSource={monitorItemList?.list ?? []}
            errorMessage={requestErrorMessage}
            actions={actions}
          />
        </section>
      </MonitorConfigStyleWrapper>
      <MonitorConfigModal />
    </>
  );
};

export default MonitorConfig;
