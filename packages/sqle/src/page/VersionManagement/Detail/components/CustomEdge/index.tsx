import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  Edge,
  getBezierPath
} from '@xyflow/react';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import { PaperPlaneFilled } from '@actiontech/icons';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { CustomEdgeStyleWrapper } from '../../style';
import { CustomEdgeData } from '../../index.type';

const CustomEdge: React.FC<EdgeProps<Edge<CustomEdgeData>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}) => {
  const { t } = useTranslation();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <CustomEdgeStyleWrapper labelX={labelX} labelY={labelY}>
          <Space direction="vertical">
            <EmptyBox if={!!data?.onRelease}>
              <BasicButton
                type="primary"
                onClick={data?.onRelease}
                disabled={!data?.allowRelease}
                icon={
                  <PaperPlaneFilled fill="currentColor" color="currentColor" />
                }
              >
                {t('versionManagement.detail.deploy')}
              </BasicButton>
            </EmptyBox>
          </Space>
        </CustomEdgeStyleWrapper>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
