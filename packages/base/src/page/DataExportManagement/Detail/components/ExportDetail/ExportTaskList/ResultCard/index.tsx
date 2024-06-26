import { BasicButton, Copy, HighlightCode } from '@actiontech/shared';
import { Divider, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ExportResultCardProp } from './index.type';
import AuditResultTree from './AuditResultTree';
import {
  ExportContentStyleWrapper,
  ExportResultCardStyleWrapper,
  ExportResultTreeStyleWrapper
} from '../../style';
import AuditResultTag from './AuditResultTag';
import { DownOutlined } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/Icon/style';

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
        <ExportResultTreeStyleWrapper
          treeData={[
            {
              title: t(
                'dmsDataExport.detail.exportResult.taskDetail.exportResult'
              ),
              key: 'export_result_wrap',
              children: [
                {
                  title: props.export_result || '-',
                  key: 'export_result'
                }
              ]
            }
          ]}
          switcherIcon={
            <CommonIconStyleWrapper className="custom-icon custom-icon-arrow-down">
              <DownOutlined width={16} height={16} />
            </CommonIconStyleWrapper>
          }
        />
      </div>
    </ExportResultCardStyleWrapper>
  );
};

export default ExportResultCard;
