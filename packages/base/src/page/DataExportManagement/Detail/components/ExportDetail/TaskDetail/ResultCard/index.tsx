import { BasicButton, Copy } from '@actiontech/shared';
import { Divider, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ExportResultCardProp } from './index.type';
import HighlightCode from 'sqle/src/utils/HighlightCode';
import AuditResultTree from './AuditResultTree';
import {
  ExportContentStyleWrapper,
  ExportResultCardStyleWrapper
} from '../../style';
import AuditResultTag from './AuditResultTag';

const ExportResultCard: React.FC<ExportResultCardProp> = (props) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const onCopyExecSql = () => {
    Copy.copyTextByTextarea(props.sql ?? '');
    messageApi.success(t('common.copied'));
  };

  return (
    <ExportResultCardStyleWrapper>
      {contextHolder}
      <div className="result-card-header">
        <Space>
          <span className="number">#{props.uid}</span>
          <div className="result-card-status-wrap">
            <Divider type="vertical" className="result-card-status-divider" />
            <AuditResultTag auditResult={props.audit_sql_result} />
          </div>
        </Space>
        <Space>
          <BasicButton size="small" onClick={onCopyExecSql}>
            {t('dmsDataExport.detail.exportResult.taskDetail.copy')}
          </BasicButton>
        </Space>
      </div>
      <div className="result-card-content">
        <div className="result-card-content-options">
          <ExportContentStyleWrapper active>
            {t('dmsDataExport.detail.exportResult.taskDetail.exportContent')}
          </ExportContentStyleWrapper>
        </div>
        <div className="result-card-sql-wrap">
          <pre>
            <code
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(props.sql || '')
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
        <AuditResultTree auditResult={props.audit_sql_result} />
        {/* 后端暂时给不到数据，先隐藏 */}
        {/* <DataSourceAuditResultTreeStyleWrapper
          treeData={[
            {
              title: t(
                'dmsDataExport.detail.exportResult.taskDetail.exportResult'
              ),
              key: 'exec_result_wrap',
              children: [
                {
                  title: props.export_status || '-',
                  key: 'export_status'
                }
              ]
            }
          ]}
          switcherIcon={
            <IconArrowDown width={16} height={16} color="#C3C6CD" />
          }
        /> */}
      </div>
    </ExportResultCardStyleWrapper>
  );
};

export default ExportResultCard;
