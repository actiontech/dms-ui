import { useTranslation } from 'react-i18next';
import { WorkflowRecordInfoProps } from './index.type';
import { LazyLoadComponent, BasicDrawer } from '@actiontech/dms-kit';
import RecordInfo from './RecordInfo';
import { useMedia } from '@actiontech/shared';

const WorkflowRecordInfo: React.FC<WorkflowRecordInfoProps> = ({
  visibility,
  ...restProps
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMedia();
  if (isMobile) {
    return (
      <BasicDrawer
        size="default"
        width="23rem"
        title={t('execWorkflow.detail.operator.title')}
        open={visibility}
        onClose={restProps.onClose}
      >
        <RecordInfo {...restProps} />
      </BasicDrawer>
    );
  }

  return (
    <LazyLoadComponent open={visibility}>
      <RecordInfo {...restProps} />
    </LazyLoadComponent>
  );
};
export default WorkflowRecordInfo;
