import useBack from '../../hooks/useBack';
import { LeftArrowOutlined } from '@actiontech/icons';
import { BackButtonProps } from './BackButton.types';
import { BasicButton } from '../BasicButton';

const BackButton: React.FC<BackButtonProps> = (props) => {
  const { goBack } = useBack();

  return (
    <BasicButton
      icon={<LeftArrowOutlined />}
      onClick={goBack}
      key="goBack"
      {...props}
    />
  );
};

export default BackButton;
