import { BasicButton, BasicModal } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';

const BasicVersionModal: React.FC<{
  open: boolean;
  width?: number | string;
  setVersionModalClose: () => void;
  children?: React.ReactNode;
}> = ({ open, width, setVersionModalClose, children }) => {
  const { t } = useTranslation();

  return (
    <BasicModal
      size="large"
      width={width}
      className="version-modal"
      open={open}
      onCancel={setVersionModalClose}
      footer={
        <Space>
          <BasicButton type="primary">
            <a
              target="_blank"
              href="https://actiontech.github.io/sqle-docs/"
              rel="noreferrer"
            >
              {t('common.showMore')}
            </a>
          </BasicButton>
          <BasicButton type="primary" onClick={setVersionModalClose}>
            {t('dmsSystem.version.gotIt')}
          </BasicButton>
        </Space>
      }
    >
      {children}
    </BasicModal>
  );
};

export default BasicVersionModal;
