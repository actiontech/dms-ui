import { BasicButton } from '@actiontech/dms-kit';
import { Copy, HighlightCode } from '@actiontech/dms-kit';
import { Divider, Space, Tooltip, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ExportResultCardProp } from './index.type';
import AuditResultTree from './AuditResultTree';
import {
  ExportContentStyleWrapper,
  ExportResultCardStyleWrapper,
  ExportResultTreeStyleWrapper
} from '../../style';
import AuditResultTag from './AuditResultTag';
import ExportExecStatusTag from './ExportExecStatusTag';
import { DownOutlined } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/dms-kit';
import { ListDataExportTaskSQLExportStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { resolveExportResultDisplayText } from '../../../../utils/exportFailDisplay';

const EXPORT_RESULT_TOOLTIP_MIN_LEN = 48;

const ExportResultCard: React.FC<ExportResultCardProp> = (props) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const onCopyExecSql = () => {
    Copy.copyTextByTextarea(props.sql ?? '');
    messageApi.success(t('common.copied'));
  };

  const exportStatus = props.export_status?.trim() ?? '';
  const isFailed =
    exportStatus === ListDataExportTaskSQLExportStatusEnum.failed;

  const exportResultText = resolveExportResultDisplayText({
    exportStatus: props.export_status,
    exportResult: props.export_result,
    failedFallback: t(
      'dmsDataExport.detail.record.basicInfo.exportFailSummaryFallback'
    ),
    notExecutedHint: t('dmsDataExport.execStatus.notExecutedHint')
  });

  const exportResultTextNode = (
    <span
      className={
        isFailed
          ? 'export-result-text export-result-text-failed'
          : 'export-result-text'
      }
      data-testid="export-result-text"
      data-export-status={exportStatus || undefined}
    >
      {exportResultText}
    </span>
  );

  const exportResultNode =
    isFailed && exportResultText.length >= EXPORT_RESULT_TOOLTIP_MIN_LEN ? (
      <Tooltip title={exportResultText}>{exportResultTextNode}</Tooltip>
    ) : (
      exportResultTextNode
    );

  return (
    <ExportResultCardStyleWrapper>
      {contextHolder}
      <div className="result-card-header">
        <Space>
          <span className="number">#{props.uid}</span>
          <div className="result-card-status-wrap">
            <Divider type="vertical" className="result-card-status-divider" />
            <Space size={4}>
              <AuditResultTag auditResult={props.audit_sql_result} />
              <ExportExecStatusTag status={props.export_status} />
            </Space>
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
                  title: exportResultNode,
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
