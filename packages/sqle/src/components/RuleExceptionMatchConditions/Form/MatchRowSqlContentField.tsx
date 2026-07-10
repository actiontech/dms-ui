import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { EditFilled } from '@actiontech/icons';
import { MatchRowSqlContentTriggerStyleWrapper } from './style';
import SqlContentEditModal from './SqlContentEditModal';

const MATCH_ROW_CONTENT_WIDTH = 320;

type MatchRowSqlContentInputProps = {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  modalTitle: string;
};

const toTriggerSummary = (value?: string) =>
  value?.replace(/\s+/g, ' ').trim() ?? '';

const MatchRowSqlContentInput: React.FC<MatchRowSqlContentInputProps> = ({
  id,
  value = '',
  onChange,
  modalTitle
}) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [draftValue, setDraftValue] = useState('');

  const openModal = useCallback(() => {
    setDraftValue(value);
    setModalOpen(true);
  }, [value]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    onChange?.(draftValue);
    setModalOpen(false);
  }, [draftValue, onChange]);

  const summary = toTriggerSummary(value);

  return (
    <>
      <MatchRowSqlContentTriggerStyleWrapper
        id={id}
        className="match-row-sql-trigger"
        style={{ width: MATCH_ROW_CONTENT_WIDTH }}
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal();
          }
        }}
      >
        {summary ? (
          <span className="match-row-sql-trigger-text">{summary}</span>
        ) : (
          <span className="match-row-sql-trigger-placeholder">
            {t('common.form.placeholder.input')}
          </span>
        )}
        <span
          className="match-row-sql-trigger-icon"
          onClick={(event) => {
            event.stopPropagation();
            openModal();
          }}
        >
          <EditFilled width={14} height={14} color="currentColor" />
        </span>
      </MatchRowSqlContentTriggerStyleWrapper>
      <SqlContentEditModal
        open={modalOpen}
        title={modalTitle}
        value={draftValue}
        onChange={setDraftValue}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </>
  );
};

type MatchRowSqlContentFieldProps = {
  fieldName: number;
  modalTitle: string;
};

const MatchRowSqlContentField: React.FC<MatchRowSqlContentFieldProps> = ({
  fieldName,
  modalTitle
}) => {
  return (
    <Form.Item
      name={[fieldName, 'content']}
      rules={[{ required: true }]}
      className="match-row-sql-content-item"
    >
      <MatchRowSqlContentInput modalTitle={modalTitle} />
    </Form.Item>
  );
};

export default MatchRowSqlContentField;
