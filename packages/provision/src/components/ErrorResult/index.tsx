import { Empty, Result } from 'antd';
import { useTranslation } from 'react-i18next';

export interface IErrorResult {
  errorMessage?: string;
}

const ErrorResult: React.FC<IErrorResult> = (props) => {
  const { t } = useTranslation();
  const { errorMessage } = props;

  if (props.errorMessage) {
    return (
      <Result
        status="error"
        title={t('common.request.noticeFailTitle')}
        subTitle={errorMessage}
      />
    );
  }

  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
};

export default ErrorResult;
