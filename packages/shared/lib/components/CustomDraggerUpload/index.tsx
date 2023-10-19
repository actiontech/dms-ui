import { UploadProps } from 'antd5';
import { CustomUploadDraggerStyleWrapper } from './style';
import { IconUploadCloud } from '../../Icon/common';
import { useTranslation } from 'react-i18next';

const CustomDraggerUpload: React.FC<
  UploadProps & { title?: React.ReactNode; icon?: React.ReactNode }
> = ({ title, icon = <IconUploadCloud />, ...props }) => {
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
