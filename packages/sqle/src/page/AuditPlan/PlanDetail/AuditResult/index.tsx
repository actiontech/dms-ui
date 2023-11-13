import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';

import { Empty, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { BasicToolTips, EmptyBox } from '@actiontech/shared';
import {
  IconStatusSuccess,
  IconStatusWarning,
  IconStatusTip,
  IconStatusError
} from '../../../../icon/AuditPlan';
import {
  AuditResultStyleWrapper,
  AuditItemStyleWrapper,
  PaginationStyleWrapper
} from './style';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { PlanDetailUrlParams } from '../index.type';
import { IAuditPlanReportResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditPlanReportResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

const AuditResult = () => {
  const { t } = useTranslation();

  const navigater = useNavigate();
  const { projectName, projectID } = useCurrentProject();
  const urlParams = useParams<PlanDetailUrlParams>();
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 20 });

  const {
    data: auditResultData,
    loading,
    refresh
  } = useRequest(
    () =>
      audit_plan
        .getAuditPlanReportsV1({
          project_name: projectName,
          audit_plan_name: urlParams.auditPlanName ?? '',
          page_index: pagination.pageIndex,
          page_size: pagination.pageSize
        })
        .then((res) => {
          return {
            list: res.data?.data ?? [],
            total: res.data.total_nums ?? 0
          };
        }),
    {
      ready: !!urlParams.auditPlanName,
      refreshDeps: [
        urlParams.auditPlanName,
        pagination.pageIndex,
        pagination.pageSize
      ]
    }
  );

  const onPageChange = (pageIndex: number, pageSize: number) => {
    setPagination({
      pageIndex: pageIndex,
      pageSize: pageSize
    });
  };

  const AuditItemData = useMemo(() => {
    return {
      [AuditPlanReportResV1AuditLevelEnum.normal]: {
        class: 'status-success',
        icon: <IconStatusSuccess />
      },
      [AuditPlanReportResV1AuditLevelEnum.notice]: {
        class: 'status-tip',
        icon: <IconStatusTip />
      },
      [AuditPlanReportResV1AuditLevelEnum.warn]: {
        class: 'status-warning',
        icon: <IconStatusWarning />
      },
      [AuditPlanReportResV1AuditLevelEnum.error]: {
        class: 'status-error',
        icon: <IconStatusError />
      }
    };
  }, []);

  const renderAuditItem = (data: IAuditPlanReportResV1) => {
    const itemData =
      data.audit_level && Object.keys(AuditItemData).includes(data.audit_level)
        ? AuditItemData[data.audit_level as keyof typeof AuditItemData]
        : AuditItemData[AuditPlanReportResV1AuditLevelEnum.normal];
    return (
      <AuditItemStyleWrapper
        hoverable
        bordered={false}
        className={itemData.class}
        key={`${projectID}${data.audit_plan_report_id}`}
        onClick={() => {
          navigater(
            `/sqle/project/${projectID}/auditPlan/detail/${
              urlParams.auditPlanName ?? ''
            }/report/${data.audit_plan_report_id}`
          );
        }}
      >
        <div className="item-wrapper">
          <div className="item-left">
            <div className="icon-status">{itemData.icon}</div>
            <div className="audit-cont-text">
              <p className="time-text">
                {formatTime(data.audit_plan_report_timestamp, '--')}
              </p>
              <p className="audit-desc">
                {t('auditPlan.planTaskRecord.passRage')}
                {floatToPercent(data.pass_rate ?? 0)}%
              </p>
            </div>
          </div>
          <div className="item-right">
            <BasicToolTips title={t('auditPlan.detail.tip.rate')}>
              <div className="audit-rate">{data.score ?? '--'}</div>
            </BasicToolTips>
          </div>
        </div>
      </AuditItemStyleWrapper>
    );
  };

  useEffect(() => {
    const refreshEvent = () => {
      refresh();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_Audit_Plan_Record, refreshEvent);
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_Audit_Plan_Record,
        refreshEvent
      );
    };
  }, [refresh]);

  return (
    <AuditResultStyleWrapper>
      <div className="header-wrapper">
        <h3 className="header-cont-text">
          {t('auditPlan.planTaskRecord.title')}
        </h3>
        <SyncOutlined
          onClick={refresh}
          spin={loading}
          className="refresh-icon"
        />
      </div>
      <Spin spinning={loading} className={classNames('audit-wrapper')}>
        <EmptyBox
          if={!!(auditResultData && auditResultData?.list?.length)}
          defaultNode={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        >
          <section className="audit-cont">
            {(auditResultData?.list ?? []).map((item) => renderAuditItem(item))}
          </section>
          <section className="audit-pagination">
            <PaginationStyleWrapper
              size="small"
              total={auditResultData?.total ?? 0}
              defaultCurrent={pagination.pageIndex}
              defaultPageSize={pagination.pageSize}
              showSizeChanger={false}
              showQuickJumper={false}
              responsive={true}
              onChange={onPageChange}
            />
          </section>
        </EmptyBox>
      </Spin>
    </AuditResultStyleWrapper>
  );
};

export default AuditResult;
