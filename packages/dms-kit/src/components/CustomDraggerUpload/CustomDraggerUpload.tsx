import { CustomUploadDraggerStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { UploadCloudOutlined } from '@actiontech/icons';
import { CustomDraggerUploadProps } from './CustomDraggerUpload.types';

const CustomDraggerUpload: React.FC<CustomDraggerUploadProps> = ({
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
