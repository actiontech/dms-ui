import { BasicButton, EmptyBox } from '@actiontech/shared';
import type { Node, NodeProps } from '@xyflow/react';
import { CustomActionNodeStyleWrapper } from '../../style';
import { useTranslation } from 'react-i18next';
import { StageNodeData } from '../../index.type';

const CustomActionNode: React.FC<NodeProps<Node<StageNodeData>>> = ({
  data
}) => {
  const { onExecute, allowExecute } = data;

  const { t } = useTranslation();

  return (
    <CustomActionNodeStyleWrapper>
      <EmptyBox if={!!onExecute}>
        <BasicButton
          type="primary"
          disabled={!allowExecute}
          onClick={onExecute}
        >
          {t('versionManagement.detail.execute')}
        </BasicButton>
      </EmptyBox>
    </CustomActionNodeStyleWrapper>
  );
};

export default CustomActionNode;
