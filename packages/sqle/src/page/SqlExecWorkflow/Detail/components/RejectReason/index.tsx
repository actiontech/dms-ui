import {
  BasicButton,
  BasicTypographyEllipsis,
  EmptyBox
} from '@actiontech/shared';
import { RejectReasonStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { RejectReasonProps } from './index.type';
import { IconWorkflowRejectReason } from '../../../../../icon/SqlExecWorkflow';
import { Col, Row } from 'antd';

const RejectReason: React.FC<RejectReasonProps> = ({
  stepInfo,
  currentUsername,
  showModifySqlStatementStep,
  createWorkflowUserName
}) => {
  const { t } = useTranslation();

  return (
    <RejectReasonStyleWrapper>
      <IconWorkflowRejectReason />
      <Row wrap={false} align="middle" className="full-width-element">
        <Col xxl={{ span: 22 }} sm={{ span: 20 }}>
          <div className="reject-workflow-reason-content">
            <div className="reject-workflow-reason-content-text">
              {t('order.operator.rejectDetail', {
                name: stepInfo.operation_user_name
              })}
              <BasicTypographyEllipsis
                textCont={stepInfo.reason ?? ''}
                className="reject-workflow-reason-content-text-reason"
              />
            </div>
            <div className="reject-workflow-reason-content-tips">
              {t('order.operator.rejectTips')}
            </div>
          </div>
        </Col>

        <Col xxl={{ span: 2 }} sm={{ span: 4 }}>
          <EmptyBox
            if={currentUsername === createWorkflowUserName}
            defaultNode={
              <div className="wait-operator-modify-sql">
                {t('order.operator.waitModifySql', {
                  username: createWorkflowUserName
                })}
              </div>
            }
          >
            <BasicButton type="primary" onClick={showModifySqlStatementStep}>
              {t('order.operator.modifySql')}
            </BasicButton>
          </EmptyBox>
        </Col>
      </Row>
    </RejectReasonStyleWrapper>
  );
};

export default RejectReason;
