import { useTranslation } from 'react-i18next';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { Space, Upload } from 'antd';
import { ConfigItemImageUploaderProps } from '../ConfigItem.types';

const ImageUploader: React.FC<ConfigItemImageUploaderProps> = ({
  submitLoading,
  onSubmit,
  url,
  disabled
}) => {
  const { t } = useTranslation();
  const [maskVisible, { setTrue: showMask, setFalse: hideMask }] =
    useBoolean(false);
  return (
    <Upload
      name="logo"
      listType="picture-card"
      showUploadList={false}
      customRequest={onSubmit}
      disabled={submitLoading || disabled}
      accept="image/*"
    >
      {submitLoading ? (
        <LoadingOutlined />
      ) : (
        <div
          className={'upload-content-wrapper'}
          onMouseEnter={showMask}
          onMouseLeave={hideMask}
        >
          <img src={`${url}?temp=${new Date().getTime()}`} alt="logo" />
          {maskVisible && (
            <div className="mask">
              <Space direction="vertical" align="center" size={4}>
                <UploadOutlined />
                {t('common.uploadAndUpdate')}
              </Space>
            </div>
          )}
        </div>
      )}
    </Upload>
  );
};

export default ImageUploader;
