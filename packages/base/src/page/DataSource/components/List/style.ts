import { styled } from '@mui/material/styles';
import { BasicTag } from '@actiontech/shared';

/**
 * todo Basic宽度默认占据一行 使用时不太方便 后续对BasicTag的样式进行调整
 */
export const ServiceEnvironmentTagStyleWrapper = styled(BasicTag)`
  &.ant-tag {
    width: max-content;
  }
`;
