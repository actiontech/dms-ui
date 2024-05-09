import { Space } from 'antd';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import { useTranslation } from 'react-i18next';

const FileModeHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Space className="file-mode-title">
      <IconEllipse />

      <span className="file-mode-title-text">
        {t('audit.fileModeExecute.headerTitle')}
      </span>
    </Space>
  );
};

export default FileModeHeader;
