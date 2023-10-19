import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';
import { UserDescStyledWrapper } from '../style';

const UserDesc: React.FC<{ desc: string }> = ({ desc }) => {
  return (
    <UserDescStyledWrapper
      ellipsis={{
        expandable: false,
        tooltip: {
          placement: 'topLeft',
          ...tooltipsCommonProps(<span>{desc}</span>, 600)
        }
      }}
    >
      {desc}
    </UserDescStyledWrapper>
  );
};

export default UserDesc;
