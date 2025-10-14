import React, { useState } from 'react';
import { ConfigItem, ConfigProvider, ImageUploader } from '@actiontech/dms-kit';
import { useBoolean } from 'ahooks';
import { message } from 'antd';
import type { UploadProps } from 'antd';

const ConfigItemImageUploaderDemo = () => {
  const [fieldVisible, { setTrue: showField, setFalse: hideField }] =
    useBoolean(false);
  const [
    submitLoading,
    { setTrue: setSubmitLoading, setFalse: setSubmitLoadingFalse }
  ] = useBoolean(false);
  const [logoUrl, setLogoUrl] = useState(
    'https://via.placeholder.com/100x50/4583FF/ffffff?text=LOGO'
  );

  const handleUpload: UploadProps['customRequest'] = (options) => {
    setSubmitLoading();
    // 模拟上传
    setTimeout(() => {
      // 这里通常会调用真实的上传API
      const newUrl = URL.createObjectURL(options.file as File);
      setLogoUrl(newUrl);
      setSubmitLoadingFalse();
      hideField();
      message.success('上传成功');
      options.onSuccess?.(newUrl);
    }, 2000);
  };

  return (
    <ConfigProvider>
      <div style={{ width: 600 }}>
        <ConfigItem
          label="系统 Logo"
          descNode="点击编辑按钮上传新的 Logo"
          inputNode={
            <ImageUploader
              submitLoading={submitLoading}
              onSubmit={handleUpload}
              url={logoUrl}
            />
          }
          fieldVisible={fieldVisible}
          showField={showField}
          hideField={hideField}
        />
      </div>
    </ConfigProvider>
  );
};

export default ConfigItemImageUploaderDemo;
