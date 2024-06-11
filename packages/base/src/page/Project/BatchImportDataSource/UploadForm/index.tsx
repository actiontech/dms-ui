import { BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import {
  FormItemBigTitle,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import Icon from '@ant-design/icons';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { IconProjectTitle } from '../../../../icon/sideMenu';
import { BatchImportDataSourceFormType } from '../index.type';
import FileUpload from './FileUpload';

const BatchImportDataSourceForm: React.FC<{
  form: BatchImportDataSourceFormType;
}> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <FormAreaBlockStyleWrapper className="fix-header-padding">
      <FormStyleWrapper
        form={form}
        colon={false}
        labelAlign="left"
        className="hasTopHeader"
        {...formItemLayout.spaceBetween}
      >
        <FormItemBigTitle>
          <Icon component={IconProjectTitle} className="title-icon" />
          <span>{t('dmsProject.batchImportDataSource.title')}</span>
        </FormItemBigTitle>

        <FormItemLabel
          className="has-required-style"
          label={t('dmsProject.importProject.selectFile')}
          name="files"
          valuePropName="fileList"
          getValueFromEvent={getFileFromUploadChangeEvent}
          rules={[
            {
              required: true,
              message: t('dmsProject.importProject.fileRequireTips')
            }
          ]}
        >
          <FileUpload
            maxCount={1}
            onRemove={() => {
              form.setFieldsValue({
                files: []
              });
            }}
            accept=".csv"
            beforeUpload={(file) => {
              form.setFieldsValue({
                files: [file]
              });
              return false;
            }}
          >
            <BasicButton>{t('common.upload')}</BasicButton>
          </FileUpload>
        </FormItemLabel>
      </FormStyleWrapper>
    </FormAreaBlockStyleWrapper>
  );
};

export default BatchImportDataSourceForm;
