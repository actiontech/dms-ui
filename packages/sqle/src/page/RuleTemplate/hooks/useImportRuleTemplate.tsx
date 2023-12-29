import { Dispatch, SetStateAction, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { FormInstance, useForm } from 'antd/es/form/Form';
import { MessageInstance } from 'antd/es/message/interface';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { SelectFileFormFields } from '../ImportRuleTemplate/index.type';
import { RuleTemplateFormProps } from '../RuleTemplateForm/index.type';
import { RuleTemplateBaseInfoFields } from '../RuleTemplateForm/BaseInfoForm/index.type';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { useEffect } from 'react';

interface IUseImportRuleTemplateProps {
  ruleTemplateForm: FormInstance<RuleTemplateBaseInfoFields>;
  setActiveRule: Dispatch<SetStateAction<IRuleResV1[]>>;
  messageApi: MessageInstance;
}
const useImportRuleTemplate = ({
  ruleTemplateForm,
  setActiveRule,
  messageApi
}: IUseImportRuleTemplateProps) => {
  const { t } = useTranslation();

  const [selectFileForm] = useForm<SelectFileFormFields>();

  const [ruleTemplateFormVisibility, { setTrue: showRuleTemplateForm }] =
    useBoolean();
  const [
    getAllRulesLoading,
    { setTrue: startGetAllRules, setFalse: finishGetAllRules }
  ] = useBoolean();
  const [allRules, setAllRules] = useState<RuleTemplateFormProps['allRules']>(
    []
  );
  const [importRuleListDataByApi, setImportRuleListDataByApi] = useState<
    IRuleResV1[]
  >([]);

  const [importActiveRuleData, setImportActiveRuleData] = useState<
    IRuleResV1[]
  >([]);

  const importRulesRef = useRef<IRuleResV1[]>();
  const importDBTypeRef = useRef<string>();

  const getAllRulesByDbTypeAndFilterActiveRuleList = (
    importRuleList: IRuleResV1[],
    dbType?: string,
    keyword?: string,
    isSearchEvent?: boolean
  ) => {
    startGetAllRules();
    rule_template
      .getRuleListV1({
        filter_db_type: dbType,
        fuzzy_keyword_rule: keyword
      })
      .then((res) => {
        if (ResponseCode.SUCCESS === res.data.code) {
          setAllRules(res.data.data ?? []);
          const activeRules = importRuleList.filter((rule) => {
            return res.data.data?.some(
              (allRule) => allRule.rule_name === rule.rule_name
            );
          });
          setImportActiveRuleData(activeRules);
          if (isSearchEvent) {
            setActiveRule(activeRules);
          }
        }
      })
      .finally(() => {
        finishGetAllRules();
      });
  };

  const importFile = async () => {
    await selectFileForm.validateFields();
    const importValues = selectFileForm.getFieldsValue();
    const hideLoading = messageApi.loading(
      t('ruleTemplate.importRuleTemplate.importingFile'),
      0
    );
    rule_template
      .importProjectRuleTemplateV1({
        rule_template_file: importValues.ruleTemplateFile[0]
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const parseFileData = res.data.data;
          if (parseFileData) {
            showRuleTemplateForm();
            setImportRuleListDataByApi(parseFileData.rule_list ?? []);
            getAllRulesByDbTypeAndFilterActiveRuleList(
              parseFileData.rule_list ?? [],
              parseFileData.db_type
            );
            importRulesRef.current = parseFileData.rule_list ?? [];
            importDBTypeRef.current = parseFileData.db_type;
            ruleTemplateForm.setFieldsValue({
              templateDesc: parseFileData.desc,
              templateName: parseFileData.name,
              db_type: parseFileData.db_type
            });
          }
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Search_Rule_Template_Rule_Select_List,
      (value: string) => {
        getAllRulesByDbTypeAndFilterActiveRuleList(
          importRulesRef.current ?? [],
          importDBTypeRef.current,
          value,
          true
        );
      }
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ruleTemplateFormVisibility,
    selectFileForm,
    allRules,
    getAllRulesLoading,
    importFile,
    importRuleListDataByApi,
    importActiveRuleData
  };
};

export default useImportRuleTemplate;
