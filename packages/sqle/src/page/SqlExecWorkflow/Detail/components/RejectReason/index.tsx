import { BasicButton, EmptyBox } from '@actiontech/dms-kit';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { RejectReasonStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { RejectReasonProps } from './index.type';
import { Col, Row } from 'antd';
import { RejectFileFilled } from '@actiontech/icons';
const RejectReason: React.FC<RejectReasonProps> = ({
  stepInfo,
  currentUsername,
  showModifySqlStatementStep,
  createWorkflowUserName
}) => {
  const { t } = useTranslation();
  return (
    <RejectReasonStyleWrapper>
      <RejectFileFilled width={24} height={24} />
      <Row wrap={false} align="middle" className="full-width-element">
        <Col
          xxl={{
            span: 22
          }}
          sm={{
            span: 20
          }}
        >
          <div className="reject-workflow-reason-content">
            <div className="reject-workflow-reason-content-text">
              {t('execWorkflow.detail.operator.rejectDetail', {
                name: stepInfo.operation_user_name
              })}
              <BasicTypographyEllipsis
                textCont={stepInfo.reason ?? ''}
                className="reject-workflow-reason-content-text-reason"
              />
            </div>
            <div className="reject-workflow-reason-content-tips">
              {t('execWorkflow.detail.operator.rejectTips')}
            </div>
          </div>
        </Col>

        <Col
          xxl={{
            span: 2
          }}
          sm={{
            span: 4
          }}
        >
          <EmptyBox
            if={currentUsername === createWorkflowUserName}
            defaultNode={
              <div className="wait-operator-modify-sql">
                {t('execWorkflow.detail.operator.waitModifySql', {
                  username: createWorkflowUserName
                })}
              </div>
            }
          >
            <BasicButton type="primary" onClick={showModifySqlStatementStep}>
              {t('execWorkflow.detail.operator.modifySql')}
            </BasicButton>
          </EmptyBox>
        </Col>
      </Row>
    </RejectReasonStyleWrapper>
  );
};
export default RejectReason;
