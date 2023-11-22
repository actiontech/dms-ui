import { useTranslation } from 'react-i18next';
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useBack } from '@actiontech/shared/lib/hooks';

import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, PageHeader } from '@actiontech/shared';
import {
  IconArrowRight,
  IconDownload,
  IconLeftArrow,
  IconTagBookMark
} from '@actiontech/shared/lib/Icon/common';
import { DetailReportStyleWrapper } from './style';
import {
  useTableRequestError,
  ActiontechTable,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';

import { useNavigate, useParams } from 'react-router-dom';
import { useBoolean, useRequest } from 'ahooks';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import { useDispatch } from 'react-redux';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import {
  IAuditPlanReportResV1,
  IAuditPlanReportSQLResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditPlanReportUrlParams } from './index.type';
import { AuditPlanReportResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';

import { IGetAuditPlanReportsSQLsParams } from '@actiontech/shared/lib/api/sqle/service/audit_plan/index.d';
import {
  DetailReportListParamType,
  DetailReportListColumn,
  DetailReportListAction
} from './columns';
import { ModalName } from '../../../../data/ModalName';
import {
  initAuditPlanModalStatus,
  updateSelectAuditReport,
  updateAuditPlanModalStatus
} from '../../../../store/auditPlan';
import DetailReportDrawer from './Drawer';
import { RuleUrlParamKey } from '../../../../page/Rule/useRuleFilterForm';
import { Spin, message } from 'antd5';
import { ResponseCode } from '@actiontech/shared/lib/enum';

type typeIAuditPlanReportResV1 = keyof IAuditPlanReportResV1;

const DetailReport = () => {
  const { t } = useTranslation();
  const [messageApi, contextMessageHolder] = message.useMessage();

  const { goBack } = useBack();

  const urlParams = useParams<AuditPlanReportUrlParams>();
  const { projectID, projectName } = useCurrentProject();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: auditTask,
    // run: getTaskInfo,
    loading: taskLoading
  } = useRequest(() => {
    return audit_plan
      .getAuditPlanV1({
        audit_plan_name: urlParams.auditPlanName ?? '',
        project_name: projectName
      })
      .then((res) => res.data);
  });

  const { data: reportInfo, loading: reportInfoLoading } = useRequest(() =>
    audit_plan
      .getAuditPlanReportV1({
        audit_plan_report_id: urlParams.reportId ?? '',
        audit_plan_name: urlParams.auditPlanName ?? '',
        project_name: projectName
      })
      .then((res) => res.data?.data ?? {})
  );

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const { tableChange, pagination } = useTableRequestParams<
    IAuditPlanReportSQLResV2,
    DetailReportListParamType
  >();

  const { data: tableData, loading: tableLoading } = useRequest(
    () => {
      const params: IGetAuditPlanReportsSQLsParams = {
        project_name: projectName,
        audit_plan_name: urlParams.auditPlanName ?? '',
        audit_plan_report_id: urlParams.reportId ?? '',
        ...pagination
      };
      return handleTableRequestError(
        audit_plan.getAuditPlanReportsSQLs(params)
      );
    },
    {
      ready: !!urlParams.auditPlanName && !!urlParams.reportId,
      refreshDeps: [pagination, urlParams.auditPlanName, urlParams.reportId]
    }
  );

  const AuditItemData = useMemo(() => {
    return {
      [AuditPlanReportResV1AuditLevelEnum.normal]: {
        class: 'status-success'
      },
      [AuditPlanReportResV1AuditLevelEnum.notice]: {
        class: 'status-tip'
      },
      [AuditPlanReportResV1AuditLevelEnum.warn]: {
        class: 'status-warning'
      },
      [AuditPlanReportResV1AuditLevelEnum.error]: {
        class: 'status-error'
      }
    };
  }, []);

  const renderScoreItem = (
    data: IAuditPlanReportResV1 & { pass_rate_remote?: string }
  ) => {
    const dataSource = cloneDeep(data);
    const classNameStr =
      dataSource.audit_level &&
      Object.keys(AuditItemData).includes(dataSource.audit_level)
        ? AuditItemData[dataSource.audit_level as keyof typeof AuditItemData]
        : AuditItemData[AuditPlanReportResV1AuditLevelEnum.normal];
    dataSource.pass_rate_remote = dataSource?.pass_rate
      ? floatToPercent(dataSource?.pass_rate) + '%'
      : typeof dataSource?.pass_rate === 'undefined'
      ? '--'
      : dataSource?.pass_rate + '' ?? '';
    return [
      {
        localKey: 'sourceLabel',
        sourceKey: 'score'
      },
      {
        localKey: 'passRageLabel',
        sourceKey: 'pass_rate_remote'
      }
    ].map((item: { localKey: string; sourceKey: string }, index: number) => {
      return (
        <React.Fragment key={item.sourceKey}>
          <div
            className={classNames('score-item', [classNameStr?.class ?? ''])}
          >
            <div className="score-text">
              {typeof dataSource?.[
                item.sourceKey as typeIAuditPlanReportResV1
              ] === 'undefined'
                ? '--'
                : dataSource?.[item.sourceKey as typeIAuditPlanReportResV1]}
            </div>
            <div className="score-desc">
              {t(`auditPlan.report.${item.localKey}`)}
            </div>
          </div>
          {!index ? <div className="line" /> : undefined}
        </React.Fragment>
      );
    });
  };

  useEffect(() => {
    dispatch(
      initAuditPlanModalStatus({
        modalStatus: {
          [ModalName.Report_Record]: false
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(
      updateAuditPlanModalStatus({
        modalName: ModalName.Report_Record,
        status: false
      })
    );
  }, [dispatch]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string>('');

  const openModal = useCallback(
    (row?: IAuditPlanReportSQLResV2) => {
      if (row) {
        dispatch(updateSelectAuditReport(row));
        setSelectedRowKeys(row.audit_plan_report_sql ?? '');
      }

      dispatch(
        updateAuditPlanModalStatus({
          modalName: ModalName.Report_Record,
          status: true
        })
      );
    },
    [dispatch]
  );

  const onClickAnalyze = useCallback(
    (data: IAuditPlanReportSQLResV2) => {
      const sqlNumber = data.number ?? undefined;
      if (typeof sqlNumber === 'undefined') return;
      window.open(
        `/sqle/project/${projectID}/auditPlan/${urlParams.reportId}/${sqlNumber}/${urlParams.auditPlanName}/analyze`,
        '_blank'
      );
    },
    [projectID, urlParams]
  );

  const actions = useMemo(() => {
    return DetailReportListAction(onClickAnalyze);
  }, [onClickAnalyze]);
  const columns = useMemo(() => DetailReportListColumn(), []);

  const onSkipRule = () => {
    if (!auditTask?.data?.rule_template_name) return;
    navigate(
      `/sqle/rule?${RuleUrlParamKey.ruleTemplateName}=${auditTask?.data?.rule_template_name}&${RuleUrlParamKey.projectID}=${projectID}`
    );
  };

  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);
  const exportReport = () => {
    startExport();
    const hideLoading = messageApi.loading(
      t('auditPlan.report.export.exporting')
    );
    audit_plan
      .exportAuditPlanReportV1(
        {
          project_name: projectName,
          audit_plan_name: urlParams.auditPlanName ?? '',
          audit_plan_report_id: urlParams.reportId ?? ''
        },
        { responseType: 'blob' }
      )
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('auditPlan.report.export.exportSuccessTips'));
        }
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  };

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      {contextMessageHolder}
      <PageHeader
        fixed
        title={
          <BasicButton onClick={goBack} icon={<IconLeftArrow />}>
            {t('auditPlan.action.backDetail')}
          </BasicButton>
        }
        extra={
          <BasicButton
            htmlType="submit"
            onClick={exportReport}
            icon={<IconDownload />}
            loading={exportButtonDisabled}
          >
            {t('auditPlan.report.exportBtnText')}
          </BasicButton>
        }
      />
      <DetailReportStyleWrapper>
        <Spin spinning={taskLoading || reportInfoLoading}>
          <div className="header-wrapper">
            <div className="left-header">
              <h3 className="header-cont-text">
                {t('auditPlan.report.time', {
                  time: formatTime(
                    reportInfo?.audit_plan_report_timestamp,
                    '--'
                  )
                })}
              </h3>
              <section className="tag-wrapper">
                <div className="custom-tag-item">
                  <IconTagBookMark className="custom-tag-icon bookmark-icon" />
                  <div>
                    {t('auditPlan.detailPage.auditTaskType', {
                      type:
                        auditTask?.data?.audit_plan_meta
                          ?.audit_plan_type_desc ?? '--'
                    })}
                  </div>
                </div>
                <div
                  className={classNames('custom-tag-item', {
                    'custom-tag-primary': !!auditTask?.data?.rule_template_name
                  })}
                  onClick={onSkipRule}
                >
                  <div>
                    {t('auditPlan.report.rule_template', {
                      name: auditTask?.data?.rule_template_name ?? '--'
                    })}
                  </div>
                  <IconArrowRight className="custom-tag-right-icon" />
                </div>
              </section>
            </div>
            <div className="right-header">
              {renderScoreItem(reportInfo ?? {})}
            </div>
          </div>
        </Spin>
        <ActiontechTable
          loading={tableLoading}
          rowClassName={(record: IAuditPlanReportSQLResV2, index: number) => {
            return record.audit_plan_report_sql === selectedRowKeys
              ? 'table-row-cursor'
              : '';
          }}
          dataSource={tableData?.list ?? []}
          rowKey={(record: IAuditPlanReportSQLResV2) => {
            return `${record?.audit_plan_report_sql}`;
          }}
          pagination={{
            total: tableData?.total ?? 0
          }}
          columns={columns}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
          // #if [prod_version=ee]
          actions={actions}
          // #endif
          onRow={(record) => {
            return {
              onClick: (event) => {
                openModal(record);
              }
            };
          }}
        />
      </DetailReportStyleWrapper>
      <DetailReportDrawer actionMethod={onClickAnalyze} />
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default DetailReport;
