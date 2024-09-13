import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import {
  IRuleResV1,
  IParseProjectRuleTemplateFileResDataV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import {
  MIMETypeEnum,
  ResponseBlobJsonType,
  ResponseCode
} from '@actiontech/shared/lib/enum';
import { FileUploadCheckStatusType, SelectFileFormFields } from './index.type';
import { RuleTemplateFormProps } from '../../page/RuleTemplate/RuleTemplateForm/index.type';
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
    setBaseInfoFormSubmitLoading
  } = useFormStep();

  const [ruleTemplateFormVisibility, { setTrue: showRuleTemplateForm }] =
    useBoolean();

  const [
    getAllRulesLoading,
    { setTrue: startGetAllRules, setFalse: finishGetAllRules }
  ] = useBoolean();

  const [allRules, setAllRules] = useState<RuleTemplateFormProps['allRules']>(
    []
  );

  const importFileData = useRef<IParseProjectRuleTemplateFileResDataV1>();

  const [createLoading, { setTrue: startCreate, setFalse: finishCreate }] =
    useBoolean();

  const [uploadCheckStatus, setUploadCheckStatus] =
    useState<FileUploadCheckStatusType>({
      success: false
    });

  const activeRuleRef = useRef<IRuleResV1[]>();

  const {
    getAllRulesAsync,
    activeRule,
    setActiveRule,
    dbType,
    setDbType,
    subscribe,
    clearSearchValue,
    filteredRule,
    setFilteredRule
  } = useRules(true);

  useEffect(() => {
    activeRuleRef.current = activeRule;
  }, [activeRule]);

  const getAllRulesByDbTypeAndFilterActiveRuleList = useCallback(
    (
      importRuleList: IRuleResV1[],
      init: boolean,
      type?: string,
      keyword?: string
    ) => {
      startGetAllRules();
      getAllRulesAsync({
        filter_db_type: type,
        fuzzy_keyword_rule: keyword
      })
        .then((res) => {
          setAllRules(res ?? []);
          if (init) {
            const activeRules = importRuleList.filter((rule) => {
              return res?.some(
                (allRule) => allRule.rule_name === rule.rule_name
              );
            });
            setActiveRule(activeRules);
            setFilteredRule(activeRules);
          } else {
            const rules = activeRuleRef.current?.filter((rule) => {
              return res?.some(
                (allRule) => allRule.rule_name === rule.rule_name
              );
            });
            setFilteredRule(rules ?? []);
          }
        })
        .finally(() => {
          finishGetAllRules();
        });
    },
    [
      finishGetAllRules,
      getAllRulesAsync,
      setActiveRule,
      setFilteredRule,
      startGetAllRules
    ]
  );

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
      getAllRulesByDbTypeAndFilterActiveRuleList(
        importFileData.current.rule_list ?? [],
        true,
        importFileData.current.db_type
      );
      ruleTemplateForm.setFieldsValue({
        templateDesc: importFileData.current.desc,
        templateName: importFileData.current.name,
        db_type: importFileData.current.db_type
      });
    }
  }, [
    getAllRulesByDbTypeAndFilterActiveRuleList,
    ruleTemplateForm,
    selectFileForm,
    showRuleTemplateForm
  ]);

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
      const values = await ruleTemplateForm.validateFields();
      setDbType(values.db_type);
      nextStep();
      setBaseInfoFormSubmitLoading(false);
    } catch (error) {
      setBaseInfoFormSubmitLoading(false);
    }
  }, [ruleTemplateForm, nextStep, setDbType, setBaseInfoFormSubmitLoading]);

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

  useEffect(() => {
    const unsubscribe = subscribe((value: string) => {
      getAllRulesByDbTypeAndFilterActiveRuleList(
        importFileData.current?.rule_list ?? [],
        false,
        importFileData.current?.db_type,
        value
      );
    });
    return unsubscribe;
  }, [getAllRulesByDbTypeAndFilterActiveRuleList, subscribe]);

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
    setDbType,
    createLoading,
    startCreate,
    finishCreate,
    filteredRule,
    setFilteredRule,
    uploadCheckStatus,
    removeUploadFile,
    uploadFileCustomRequest
  };
};

export default useImportRuleTemplate;
