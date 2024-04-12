import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import { Form } from 'antd';
import {
  FormItemBigTitle,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import Icon from '@ant-design/icons';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { useBoolean } from 'ahooks';
import { IconProjectTitle } from '../../../icon/sideMenu';
import FileUpload from './FileUpload';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useState } from 'react';
import { IPreviewImportProjects } from '@actiontech/shared/lib/api/base/service/common';
import { importProjectListColumn } from './column';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { ImportProjectUploadFileWrapper } from '../style';

const ImportProject = () => {
  const { t } = useTranslation();

  const [selectFileForm] = Form.useForm<{ projectsFile: File }>();

  const [showProjectsTable, { setTrue: showTable, setFalse: hideTable }] =
    useBoolean();

  const [
    importLoading,
    { setTrue: setImportPending, setFalse: setImportDone }
  ] = useBoolean();

  const [resultVisible, { setTrue: showResult, setFalse: hideResult }] =
    useBoolean(false);

  const [importProjects, setImportProjects] = useState<
    IPreviewImportProjects[]
  >([]);

  const onSubmit = async () => {
    await selectFileForm.validateFields();
    setImportPending();
    const projects = importProjects.map((project) => {
      if (project.business?.length === 1 && project.business[0] === '') {
        return {
          ...project,
          business: []
        };
      }
      return project;
    });
    dms
      .ImportProjects({
        projects: projects
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
          <Link to={`/project`}>
            <BasicButton icon={<IconLeftArrow />}>
              {t('dmsProject.backToList')}
            </BasicButton>
          </Link>
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
            icon={<IconSuccessResult />}
            title={t('dmsProject.importProject.successTitle')}
            subTitle={
              <Link to={`/project`}>
                {t('dmsProject.importProject.successTips')} {'>'}
              </Link>
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
              <Icon component={IconProjectTitle} className="title-icon" />
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
                  dms
                    .PreviewImportProjects({ projects_file: option.file })
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
