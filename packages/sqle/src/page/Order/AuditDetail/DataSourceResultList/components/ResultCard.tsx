import {
  DataSourceResultCardStyleWrapper,
  DataSourceResultSqlOptionsStyleWrapper,
  DataSourceAuditResultTreeStyleWrapper
} from '../../style';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { useTranslation } from 'react-i18next';
import { Space, message, Divider, Spin } from 'antd';
import { BasicButton, Copy } from '@actiontech/shared';
import { useBoolean } from 'ahooks';
import HighlightCode from '../../../../../utils/HighlightCode';
import AuditResultTag from './AuditResultTag';
import AuditResultTree from './AuditResultTree';
import { IconArrowDown } from '@actiontech/shared/lib/Icon';
import ExecStatusTag from './ExecStatusTag';
import ResultDescribe from './ResultDescribe';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';

export type ResultCardProps = IAuditTaskSQLResV2 & {
  projectName: string;
  taskId: string;
  onUpdateDescription?: () => void;
};

const ResultCard: React.FC<ResultCardProps> = ({
  projectName,
  taskId,
  onUpdateDescription,
  ...props
}) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [showExecSql, { setTrue, setFalse }] = useBoolean(true);

  const [loading, { set }] = useBoolean();

  const onCopyExecSql = () => {
    Copy.copyTextByTextarea(props.exec_sql ?? '');
    messageApi.success(t('common.copied'));
  };

  const onClickAnalyze = () => {
    window.open(
      `/sqle/project/${projectName}/order/${taskId}/${props.number}/analyze`
    );
  };

  const updateSqlDescribe = (sqlDescribe: string) => {
    set(true);
    task
      .updateAuditTaskSQLsV1({
        number: `${props.number}`,
        description: sqlDescribe,
        task_id: `${taskId}`
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onUpdateDescription && onUpdateDescription();
        }
      })
      .finally(() => {
        set(false);
      });
  };

  return (
    <DataSourceResultCardStyleWrapper>
      {contextHolder}
      <div className="result-card-header">
        <Space>
          <span className="number">#{props.number}</span>
          <div className="result-card-status-wrap">
            <ExecStatusTag
              status={
                props.exec_status as getAuditTaskSQLsV2FilterExecStatusEnum
              }
            />
            <Divider
              type="vertical"
              className="result-card-status-divider"
            ></Divider>
            <AuditResultTag auditResult={props.audit_result}></AuditResultTag>
          </div>
        </Space>
        <Space>
          <BasicButton size="small" onClick={onCopyExecSql}>
            {t('audit.copyExecSql')}
          </BasicButton>
          {/* #if [ee] */}
          <BasicButton size="small" onClick={onClickAnalyze}>
            {t('audit.table.analyze')}
          </BasicButton>
          {/* #endif */}
        </Space>
      </div>
      <div className="result-card-content">
        <div className="result-card-content-options">
          <DataSourceResultSqlOptionsStyleWrapper
            active={showExecSql}
            onClick={setTrue}
          >
            {t('audit.table.execSql')}
          </DataSourceResultSqlOptionsStyleWrapper>
          <DataSourceResultSqlOptionsStyleWrapper
            active={!showExecSql}
            onClick={setFalse}
          >
            {t('audit.table.rollback')}
          </DataSourceResultSqlOptionsStyleWrapper>
        </div>
        <div className="result-card-sql-wrap">
          <pre>
            <code
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(
                  showExecSql ? props.exec_sql || '' : props.rollback_sql || ''
                )
                  .split('\n')
                  .map(
                    (w, i) =>
                      `<div class="code-line"><span class="code-line-number">${
                        i + 1
                      }</span>${w}</div>`
                  )
                  .join('')
              }}
            ></code>
          </pre>
        </div>
        <AuditResultTree auditResult={props.audit_result} />
        <DataSourceAuditResultTreeStyleWrapper
          treeData={[
            {
              title: t('audit.table.execResult'),
              key: 'exec_result_wrap',
              children: [
                {
                  title: props.exec_result || '-',
                  key: 'exec_result'
                }
              ]
            }
          ]}
          switcherIcon={
            <IconArrowDown width={16} height={16} color="#C3C6CD" />
          }
        />
      </div>
      <div className="result-card-footer">
        <Spin spinning={loading}>
          <ResultDescribe
            value={props.description || ''}
            onSubmit={updateSqlDescribe}
          />
        </Spin>
      </div>
    </DataSourceResultCardStyleWrapper>
  );
};

export default ResultCard;
