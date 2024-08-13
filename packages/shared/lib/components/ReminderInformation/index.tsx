import { Typography } from 'antd';
import { CommonIconStyleWrapper } from '../../styleWrapper/element';
import { CloseCircleOutlined, CheckCircleOutlined } from '@actiontech/icons';
import EmptyBox from '../EmptyBox';
import { ReminderInformationStyleWrapper } from './style';

const ReminderInformation: React.FC<{
  show: boolean;
  status: 'success' | 'error';
  message: string;
}> = (props) => {
  return (
    <EmptyBox if={props.show}>
      <ReminderInformationStyleWrapper align="start">
        <CommonIconStyleWrapper>
          {props.status === 'success' ? (
            <CheckCircleOutlined className="custom-icon" />
          ) : (
            <CloseCircleOutlined className="custom-icon" />
          )}
        </CommonIconStyleWrapper>
        <Typography.Text
          type={props.status === 'success' ? 'success' : 'danger'}
        >
          <pre>{props.message}</pre>
        </Typography.Text>
      </ReminderInformationStyleWrapper>
    </EmptyBox>
  );
};

export default ReminderInformation;
