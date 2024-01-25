import { useTranslation } from 'react-i18next';
import { ExportMethodEnum } from './index.enum';
import { IconOrderSQLUpload } from 'sqle/src/icon/Order';
import {
  ExportMethodItemStyleWrapper,
  ExportMethodStyleWrapper
} from './style';

const ExportMethodItems: React.FC<{
  value?: ExportMethodEnum;
  onChange?: (value: ExportMethodEnum) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <ExportMethodStyleWrapper>
      <ExportMethodItemStyleWrapper
        onClick={() => onChange?.(ExportMethodEnum.sql)}
        active={value === ExportMethodEnum.sql}
      >
        <IconOrderSQLUpload />
        <span className="text">
          {t('dmsDataExport.create.form.method.manualInput')}
        </span>
      </ExportMethodItemStyleWrapper>
    </ExportMethodStyleWrapper>
  );
};

export default ExportMethodItems;
