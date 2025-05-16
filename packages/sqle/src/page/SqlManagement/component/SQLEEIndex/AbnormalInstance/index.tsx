import React from 'react';
import { EmptyBox } from '@actiontech/shared/lib/components/EmptyBox';
import { Alert } from 'antd';
import { Space } from 'antd';
import { TypedLink } from '@actiontech/shared/lib/components/TypedRouter';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { AbnormalAuditPlanTipsStyleWrapper } from '../style';
import { IAbnormalAuditPlanInstance } from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';

interface IAbnormalInstance extends IAbnormalAuditPlanInstance {
  expire?: string;
}

interface AbnormalInstanceProps {
  abnormalInstances?: IAbnormalInstance[];
  willExpiredInstances?: IAbnormalInstance[];
  expiredInstances?: IAbnormalInstance[];
}

const AbnormalInstance: React.FC<AbnormalInstanceProps> = ({
  abnormalInstances,
  willExpiredInstances,
  expiredInstances
}) => {
  const { projectID } = useCurrentProject();
  const { t } = useTranslation();

  return (
    <EmptyBox
      if={
        !!abnormalInstances?.length ||
        !!willExpiredInstances?.length ||
        !!expiredInstances?.length
      }
    >
      <AbnormalAuditPlanTipsStyleWrapper>
        <Alert
          message={
            <Space direction="vertical">
              <EmptyBox if={!!abnormalInstances?.length}>
                <div>
                  <Space>
                    {abnormalInstances?.map((instance, index) => {
                      return (
                        <TypedLink
                          to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail}
                          params={{
                            projectID,
                            id:
                              instance.instance_audit_plan_id?.toString() ?? ''
                          }}
                          key={index}
                        >
                          {instance.instance_name}
                        </TypedLink>
                      );
                    })}
                  </Space>
                  {t('sqlManagement.abnormalAuditPlanTips')}
                </div>
              </EmptyBox>
              <EmptyBox if={!!willExpiredInstances?.length}>
                <Space direction="vertical">
                  {willExpiredInstances?.map((instance, index) => {
                    return (
                      <div key={index}>
                        <TypedLink
                          to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail}
                          params={{
                            projectID,
                            id:
                              instance.instance_audit_plan_id?.toString() ?? ''
                          }}
                        >
                          {instance.instance_name}
                        </TypedLink>
                        {t('sqlManagement.scannerWillExpiredTips', {
                          date: instance.expire
                        })}
                      </div>
                    );
                  })}
                </Space>
              </EmptyBox>
              <EmptyBox if={!!expiredInstances?.length}>
                <div>
                  <Space>
                    {expiredInstances?.map((instance, index) => {
                      return (
                        <TypedLink
                          to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail}
                          params={{
                            projectID,
                            id:
                              instance.instance_audit_plan_id?.toString() ?? ''
                          }}
                          key={index}
                        >
                          {instance.instance_name}
                        </TypedLink>
                      );
                    })}
                  </Space>
                  {t('sqlManagement.scannerExpiredTips')}
                </div>
              </EmptyBox>
            </Space>
          }
          type="warning"
          showIcon
        />
      </AbnormalAuditPlanTipsStyleWrapper>
    </EmptyBox>
  );
};

export default AbnormalInstance;
