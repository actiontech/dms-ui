import { UploadProps } from 'antd';
import { CustomUploadDraggerStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { UploadCloudOutlined } from '@actiontech/icons';

const CustomDraggerUpload: React.FC<
  UploadProps & { title?: React.ReactNode; icon?: React.ReactNode }
> = ({
  title,
  icon = <UploadCloudOutlined height={40} width={40} className="custom-icon" />,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <CustomUploadDraggerStyleWrapper
      {...props}
      hiddenContainer={!!props.fileList?.length}
    >
      {icon}
      <div className="title">{title ?? t('common.tips.selectFile')}</div>
    </CustomUploadDraggerStyleWrapper>
  );
};

export default CustomDraggerUpload;
