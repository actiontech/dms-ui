import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicButton, BasicModal } from '@actiontech/shared';
import { MonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import { SqlContentEditModalStyleWrapper } from './style';
import { RULE_EXCEPTION_NESTED_MODAL_Z_INDEX } from '../../RuleException/drawerZIndex';

export type SqlContentEditModalProps = {
  open: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const SQL_CONTENT_MODAL_WIDTH = 880;
const SQL_CONTENT_EDITOR_HEIGHT = '480px';

const SqlContentEditModal: React.FC<SqlContentEditModalProps> = ({
  open,
  title,
  value,
  onChange,
  onConfirm,
  onCancel
}) => {
  const { t } = useTranslation();

  return (
    <BasicModal
      title={title}
      open={open}
      width={SQL_CONTENT_MODAL_WIDTH}
      zIndex={RULE_EXCEPTION_NESTED_MODAL_Z_INDEX}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space>
          <BasicButton onClick={onCancel}>{t('common.cancel')}</BasicButton>
          <BasicButton type="primary" onClick={onConfirm}>
            {t('common.ok')}
          </BasicButton>
        </Space>
      }
    >
      <SqlContentEditModalStyleWrapper>
        <MonacoEditor
          className="match-row-sql-modal-textarea"
          value={value}
          onChange={(editorValue) => onChange(editorValue ?? '')}
          width="100%"
          height={SQL_CONTENT_EDITOR_HEIGHT}
          language="sql"
          options={{
            wordWrap: 'on',
            scrollBeyondLastLine: false
          }}
        />
      </SqlContentEditModalStyleWrapper>
    </BasicModal>
  );
};

export default SqlContentEditModal;
