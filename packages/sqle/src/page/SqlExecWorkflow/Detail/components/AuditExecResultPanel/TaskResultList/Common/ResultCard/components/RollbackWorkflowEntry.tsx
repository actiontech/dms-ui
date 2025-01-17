import { RollbackWorkflowEntryProps } from '../index.type';
import { Dropdown, MenuProps } from 'antd';
import { BasicButton, TypedLink } from '@actiontech/shared';
import { DownOutlined } from '@actiontech/icons';
import { useMemo } from 'react';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import { RollbackWorkflowItemStyleWrapper } from './style';

const RollbackWorkflowEntry: React.FC<RollbackWorkflowEntryProps> = ({
  workflows
}) => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const menuItems: MenuProps['items'] = useMemo(() => {
    return (
      workflows?.map((item) => {
        return {
          key: item.workflow_id,
          label: (
            <RollbackWorkflowItemStyleWrapper title={item.workflow_name}>
              <TypedLink
                target="_blank"
                to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
                params={{ projectID, workflowId: item.workflow_id ?? '' }}
              >
                {item.workflow_name}
              </TypedLink>
            </RollbackWorkflowItemStyleWrapper>
          ),
          type: 'group'
        };
      }) ?? []
    );
  }, [workflows, projectID]);

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
      <BasicButton>
        {t('execWorkflow.detail.associatedRollbackWorkflow')}
        <DownOutlined color="currentColor" />
      </BasicButton>
    </Dropdown>
  );
};

export default RollbackWorkflowEntry;
