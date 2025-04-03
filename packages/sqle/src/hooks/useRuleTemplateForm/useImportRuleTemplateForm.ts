import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { IParseProjectRuleTemplateFileResDataV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import {
  MIMETypeEnum,
  ResponseBlobJsonType,
  ResponseCode
} from '@actiontech/shared/lib/enum';
import { FileUploadCheckStatusType, SelectFileFormFields } from './index.type';
import { Form, UploadProps } from 'antd';
import useFormStep from './useFormStep';
import useRules from './useRules';
import { AxiosResponse } from 'axios';
import {
  GetErrorMessageParams,
  getErrorMessage,
  isExportFileResponse,
  jsonParse
} from '@actiontech/shared/lib/utils/Common';

const useImportRuleTemplate = () => {
  const { t } = useTranslation();

  const [selectFileForm] = Form.useForm<SelectFileFormFields>();

  const {
    form: ruleTemplateForm,
    step,
    setStep,
    submitSuccessStatus,
    prevStep,
    nextStep,
    baseInfoFormSubmitLoading,
    setBaseInfoFormSubmitLoading,
    dbType,
    ruleVersion
  } = useFormStep();

  const [ruleTemplateFormVisibility, { setTrue: showRuleTemplateForm }] =
    useBoolean();

  const importFileData = useRef<IParseProjectRuleTemplateFileResDataV1>();

  const [createLoading, { setTrue: startCreate, setFalse: finishCreate }] =
    useBoolean();

  const [uploadCheckStatus, setUploadCheckStatus] =
    useState<FileUploadCheckStatusType>({
      success: false
    });

  const {
    allRules,
    getAllRulesLoading,
    activeRule,
    setActiveRule,
    clearSearchValue,
    filteredRule,
    setFilteredRule,
    ruleFilterForm,
    filterCategoryTags
  } = useRules(dbType, ruleVersion);

  const importServicesCheck = useCallback(
    (
      res: AxiosResponse<unknown>,
      onSuccess: (data: IParseProjectRuleTemplateFileResDataV1) => void
    ) => {
      if (
        res.data instanceof Blob &&
        res.data.type === MIMETypeEnum.Application_Json
      ) {
        res.data.text().then((text) => {
          const json = jsonParse<
            ResponseBlobJsonType & {
              data: IParseProjectRuleTemplateFileResDataV1;
            }
          >(text);
          if (json.code === ResponseCode.SUCCESS) {
            setUploadCheckStatus({
              success: true
            });
            onSuccess(json.data);
          } else {
            setUploadCheckStatus({
              success: false,
              errorMessage: json.message
            });
          }
        });
      } else if (isExportFileResponse(res)) {
        setUploadCheckStatus({
          success: false,
          errorMessage: t('ruleTemplate.importRuleTemplate.parseFileFailed')
        });
      }
    },
    [t]
  );

  const uploadFileCustomRequest = useCallback<
    Required<UploadProps>['customRequest']
  >(
    async (options) => {
      try {
        const values = await selectFileForm.validateFields(['fileType']);
        importFileData.current = undefined;
        const res = await rule_template.importProjectRuleTemplateV1(
          {
            rule_template_file: options.file,
            file_type: values.fileType
          },
          { responseType: 'blob' }
        );
        const onSuccess = (
          parseFileData: IParseProjectRuleTemplateFileResDataV1
        ) => {
          if (parseFileData) {
            importFileData.current = parseFileData;
          }
        };
        importServicesCheck(res, onSuccess);
        options?.onSuccess?.(options?.file);
      } catch (error) {
        options?.onError?.(
          new Error(getErrorMessage(error as GetErrorMessageParams))
        );
      }
    },
    [importServicesCheck, selectFileForm]
  );

  const importFile = useCallback(async () => {
    await selectFileForm.validateFields();
    showRuleTemplateForm();
    if (importFileData.current) {
      ruleTemplateForm.setFieldsValue({
        templateDesc: importFileData.current.desc,
        templateName: importFileData.current.name,
        db_type: importFileData.current.db_type,
        ruleVersion: importFileData.current.rule_version
      });
    }
  }, [ruleTemplateForm, selectFileForm, showRuleTemplateForm]);

  const removeUploadFile = useCallback(() => {
    setUploadCheckStatus({
      success: false
    });
    importFileData.current = undefined;
    selectFileForm.setFieldsValue({
      ruleTemplateFile: []
    });
  }, [selectFileForm]);

  const baseInfoFormSubmit = useCallback(async () => {
    setBaseInfoFormSubmitLoading(true);
    try {
      await ruleTemplateForm.validateFields();
      if (!activeRule.length) {
        const activeRules =
          importFileData.current?.rule_list?.filter((rule) => {
            return allRules?.some(
              (allRule) => allRule.rule_name === rule.rule_name
            );
          }) ?? [];
        setActiveRule(activeRules);
        setFilteredRule(activeRules);
      }
      nextStep();
      setBaseInfoFormSubmitLoading(false);
    } catch {
      setBaseInfoFormSubmitLoading(false);
    }
  }, [
    ruleTemplateForm,
    nextStep,
    setBaseInfoFormSubmitLoading,
    activeRule,
    allRules,
    setActiveRule,
    setFilteredRule
  ]);

  const resetAll = () => {
    selectFileForm.resetFields();

    setActiveRule([...(importFileData.current?.rule_list ?? [])]);
    setFilteredRule([...(importFileData.current?.rule_list ?? [])]);

    setStep(0);
    ruleTemplateForm.resetFields(['templateName', 'templateDesc']);
    clearSearchValue();
    setUploadCheckStatus({
      success: false
    });
    importFileData.current = undefined;
  };

  return {
    ruleTemplateFormVisibility,
    selectFileForm,
    ruleTemplateForm,
    allRules,
    getAllRulesLoading,
    importFile,
    activeRule,
    setActiveRule,
    resetAll,
    step,
    setStep,
    nextStep,
    prevStep,
    submitSuccessStatus,
    baseInfoFormSubmit,
    baseInfoFormSubmitLoading,
    dbType,
    createLoading,
    startCreate,
    finishCreate,
    filteredRule,
    setFilteredRule,
    uploadCheckStatus,
    removeUploadFile,
    uploadFileCustomRequest,
    ruleFilterForm,
    filterCategoryTags
  };
};

export default useImportRuleTemplate;
