import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { message } from 'antd5';
import { useNavigate } from 'react-router-dom';

import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { PlanDetailRowStyleWrapper } from './style';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import DetailCom from './DetailCom';
import AuditResult from './AuditResult';

import { useParams } from 'react-router-dom';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { PlanDetailUrlParams } from './index.type';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';

const PlanDetail = () => {
  const { t } = useTranslation();
  const navigater = useNavigate();

  const urlParams = useParams<PlanDetailUrlParams>();
  const { projectName, projectArchive, projectID } = useCurrentProject();
  const [auditLoading, setAuditLoading] = useState(false);
  const [messageApi, contextMessageHolder] = message.useMessage();

  const onSkipList = () => {
    navigater(`/sqle/project/${projectID}/auditPlan`);
  };

  const onAudit = () => {
    if (!urlParams.auditPlanName || !projectName) return;
    const hide = messageApi.loading(t('auditPlan.sqlPool.action.loading'), 0);
    setAuditLoading(true);
    audit_plan
      .triggerAuditPlanV1({
        audit_plan_name: urlParams.auditPlanName,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('auditPlan.sqlPool.action.triggerSuccess'));
          EventEmitter.emit(EmitterKey.Refresh_Audit_Plan_Record);
        }
      })
      .finally(() => {
        hide();
        setAuditLoading(false);
      });
  };

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      {contextMessageHolder}
      <PageHeader
        fixed
        title={
          <BasicButton onClick={onSkipList} icon={<IconLeftArrow />}>
            {t('auditPlan.action.backButton')}
          </BasicButton>
        }
        extra={
          <EmptyBox if={!projectArchive}>
            <BasicButton
              type="primary"
              htmlType="submit"
              onClick={onAudit}
              loading={auditLoading}
            >
              {t('auditPlan.detail.action.audit')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <PlanDetailRowStyleWrapper>
        <section className="derail-left-wrapper">
          <DetailCom />
        </section>
        <section className="audit-right-wrapper">
          <AuditResult />
        </section>
      </PlanDetailRowStyleWrapper>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default PlanDetail;
