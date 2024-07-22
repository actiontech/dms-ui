import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DetailComStyleWrapper } from './style';
import { SyncOutlined } from '@ant-design/icons';
import { ColumnType, TableProps } from 'antd/es/table';
import { BasicTable, SQLRenderer } from '@actiontech/shared';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { PlanDetailUrlParams } from '../index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { IAuditPlanSQLHeadV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditPlanSQLHeadV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { useTableRequestParams } from '@actiontech/shared/lib/components/ActiontechTable';
import { BookMarkTagFilled } from '@actiontech/icons';

const DetailCom = () => {
  const { t } = useTranslation();

  const urlParams = useParams<PlanDetailUrlParams>();
  const { projectName } = useCurrentProject();

  const {
    data: auditTask,
    run: getTaskInfo,
    loading: taskLoading
  } = useRequest(() => {
    return audit_plan
      .getAuditPlanV1({
        audit_plan_name: urlParams.auditPlanName ?? '',
        project_name: projectName
      })
      .then((res) => res.data);
  });

  const { pagination, tableChange } = useTableRequestParams();
  const [columns, setColumns] = useState<ColumnType<any>[]>([]);

  const {
    loading,
    data: sqlList,
    refresh
  } = useRequest(
    () =>
      audit_plan
        .getAuditPlanSQLsV1({
          project_name: projectName,
          audit_plan_name: urlParams.auditPlanName ?? '',
          page_index: pagination.page_index,
          page_size: pagination.page_size
        })
        .then((res) => {
          return {
            head: res.data.data?.head,
            list: res.data.data?.rows,
            total: res.data.total_nums
          };
        }),
    {
      ready: !!urlParams.auditPlanName,
      refreshDeps: [urlParams.auditPlanName, pagination],

      onSuccess: (res) => {
        const { head = [] } = res;
        setColumns(
          (head as IAuditPlanSQLHeadV1[]).map((item) => ({
            title: item.desc,
            dataIndex: item.field_name,
            width: item.type === AuditPlanSQLHeadV1TypeEnum.sql ? 500 : 'auto',
            render: (text) => {
              if (item.type === AuditPlanSQLHeadV1TypeEnum.sql) {
                return (
                  <div className="sql-cont-width" style={{ width: 500 }}>
                    <SQLRenderer.Snippet showCopyIcon sql={text} />
                  </div>
                );
              }
              if (item.field_name === 'last_receive_timestamp') {
                return formatTime(text);
              }
              return text;
            }
          }))
        );
      }
    }
  );

  const onRefreshPage = () => {
    getTaskInfo();
    refresh();
  };

  return (
    <DetailComStyleWrapper>
      <section className="header-wrapper">
        <section className="header">
          <h3 className="header-cont-text">{urlParams.auditPlanName}</h3>
          <SyncOutlined
            onClick={onRefreshPage}
            spin={taskLoading}
            className="refresh-icon"
          />
        </section>
        <section className="tag-wrapper">
          <div className="custom-tag-item">
            <span className="custom-icon custom-tag-icon bookmark-icon">
              <BookMarkTagFilled />
            </span>
            <div>
              {t('auditPlan.detailPage.auditTaskType', {
                type:
                  auditTask?.data?.audit_plan_meta?.audit_plan_type_desc ?? '--'
              })}
            </div>
          </div>
        </section>
      </section>
      <section className="detail-table-wrapper">
        <BasicTable
          loading={loading}
          columns={columns}
          onChange={tableChange as TableProps<any>['onChange']}
          pagination={{
            total: sqlList?.total ?? 0
          }}
          rowKey={(record) => {
            return record?.sql;
          }}
          dataSource={sqlList?.list ?? []}
        />
      </section>
    </DetailComStyleWrapper>
  );
};

export default DetailCom;
