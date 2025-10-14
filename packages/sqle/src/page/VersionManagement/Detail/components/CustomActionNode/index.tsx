import { BasicButton, EmptyBox, BasicToolTip } from '@actiontech/dms-kit';
import type { Node, NodeProps } from '@xyflow/react';
import { CustomActionNodeStyleWrapper } from '../../style';
import { useTranslation } from 'react-i18next';
import { StageNodeData } from '../../index.type';
import { DoubleArrowOutlined } from '@actiontech/icons';
const CustomActionNode: React.FC<NodeProps<Node<StageNodeData>>> = ({
  data
}) => {
  const { onExecute, allowExecute } = data;
  const { t } = useTranslation();
  return (
    <CustomActionNodeStyleWrapper>
      <EmptyBox if={!!onExecute}>
        <BasicToolTip
          title={
            !allowExecute ? t('versionManagement.execute.disableTips') : ''
          }
          overlayClassName="whitespace-pre-line"
        >
          <BasicButton
            type="primary"
            disabled={!allowExecute}
            onClick={onExecute}
            icon={
              <DoubleArrowOutlined fill="currentColor" color="currentColor" />
            }
          >
            {t('versionManagement.detail.execute')}
          </BasicButton>
        </BasicToolTip>
      </EmptyBox>
    </CustomActionNodeStyleWrapper>
  );
};
export default CustomActionNode;
