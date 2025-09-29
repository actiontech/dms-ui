import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult
} from '@actiontech/dms-kit';
import { TypedLink } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/dms-kit/es/components/CustomForm/style';
import { Form } from 'antd';
import { FormItemBigTitle, FormItemLabel } from '@actiontech/dms-kit';
import Icon from '@ant-design/icons';
import { getFileFromUploadChangeEvent } from '@actiontech/dms-kit';
import { ActiontechTable } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { useBoolean } from 'ahooks';
import FileUpload from './FileUpload';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { useState } from 'react';
import { IPreviewImportProjectsV2 } from '@actiontech/shared/lib/api/base/service/common';
import { importProjectListColumn } from './column';
import { ImportProjectUploadFileWrapper } from '../style';
import { LeftArrowOutlined, OverviewOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const ImportProject = () => {
  const { t } = useTranslation();
  const [selectFileForm] = Form.useForm<{
    projectsFile: File;
  }>();
  const [showProjectsTable, { setTrue: showTable, setFalse: hideTable }] =
    useBoolean();
  const [
    importLoading,
    { setTrue: setImportPending, setFalse: setImportDone }
  ] = useBoolean();
  const [resultVisible, { setTrue: showResult, setFalse: hideResult }] =
    useBoolean(false);
  const [importProjects, setImportProjects] = useState<
    IPreviewImportProjectsV2[]
  >([]);
  const onSubmit = async () => {
    await selectFileForm.validateFields();
    setImportPending();
    DmsApi.ProjectService.ImportProjectsV2({
      projects: importProjects
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          showResult();
        }
      })
      .finally(() => {
        setImportDone();
      });
  };
  const resetAndHideResult = () => {
    selectFileForm.resetFields();
    hideResult();
    hideTable();
    setImportProjects([]);
  };
  return (
    <ImportProjectUploadFileWrapper>
      <PageHeader
        fixed
        title={
          <TypedLink to={ROUTE_PATHS.BASE.PROJECT.index}>
            <BasicButton icon={<LeftArrowOutlined />}>
              {t('dmsProject.backToList')}
            </BasicButton>
          </TypedLink>
        }
        extra={
          <EmptyBox if={!resultVisible}>
            <BasicButton
              type="primary"
              onClick={onSubmit}
              loading={importLoading}
            >
              {t('dmsProject.importProject.buttonText')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <EmptyBox
        if={!resultVisible}
        defaultNode={
          <BasicResult
            status="success"
            title={t('dmsProject.importProject.successTitle')}
            subTitle={
              <TypedLink to={ROUTE_PATHS.BASE.PROJECT.index}>
                {t('dmsProject.importProject.successTips')} {'>'}
              </TypedLink>
            }
            extra={[
              <BasicButton
                type="primary"
                key="resetAndClose"
                onClick={resetAndHideResult}
              >
                {t('common.resetAndClose')}
              </BasicButton>
            ]}
          />
        }
      >
        <FormAreaBlockStyleWrapper className="fix-header-padding">
          <FormStyleWrapper
            form={selectFileForm}
            colon={false}
            labelAlign="left"
            className="hasTopHeader"
            {...formItemLayout.spaceBetween}
          >
            <FormItemBigTitle>
              <Icon component={OverviewOutlined} className="title-icon" />
              <span>{t('dmsProject.importProject.title')}</span>
            </FormItemBigTitle>
            <FormItemLabel
              className="has-required-style"
              label={t('dmsProject.importProject.selectFile')}
              name="projectFile"
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
                  selectFileForm.setFieldsValue({
                    projectsFile: []
                  });
                  hideTable();
                }}
                accept=".csv"
                customRequest={(option) => {
                  DmsApi.ProjectService.PreviewImportProjectsV2({
                    projects_file: option.file
                  })
                    .then((res) => {
                      if (res.data.code === ResponseCode.SUCCESS) {
                        option?.onSuccess?.(option.file);
                        setImportProjects(res.data.data ?? []);
                        showTable();
                      }
                    })
                    .catch((error) => {
                      option?.onError?.(error);
                    });
                }}
              >
                <BasicButton>{t('common.upload')}</BasicButton>
              </FileUpload>
            </FormItemLabel>
            <EmptyBox if={showProjectsTable}>
              <ActiontechTable
                rowKey="name"
                loading={false}
                dataSource={
                  importProjects.length > 10
                    ? importProjects.slice(0, 10)
                    : importProjects
                }
                pagination={false}
                columns={importProjectListColumn}
              />
            </EmptyBox>
          </FormStyleWrapper>
        </FormAreaBlockStyleWrapper>
      </EmptyBox>
    </ImportProjectUploadFileWrapper>
  );
};
export default ImportProject;
