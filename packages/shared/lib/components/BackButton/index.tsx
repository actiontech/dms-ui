import { ButtonProps } from 'antd';
import useBack from '../../hooks/useBack';
import BasicButton from '../BasicButton';
import { LeftArrowOutlined } from '@actiontech/icons';

const BackButton: React.FC<ButtonProps> = (props) => {
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
