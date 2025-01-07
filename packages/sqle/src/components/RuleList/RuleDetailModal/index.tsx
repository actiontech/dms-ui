import { useTranslation } from 'react-i18next';
import { BasicDrawer, EmptyBox } from '@actiontech/shared';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { Form } from 'antd';
import useRuleParams from '../../BackendForm/useRuleParams';
import { RuleDetailItemStyleWrapper } from './style';
import RuleBaseInfo from './RuleBaseInfo';
import { ruleLevelDictionary } from '../../../hooks/useStaticStatus/index.data';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import classNames from 'classnames';

export type IEditRuleTemplate = {
  visible: boolean;
  dataSource: IRuleResV1 | undefined;
  onClosed: () => void;
};

const RuleDetailModal = (props: IEditRuleTemplate) => {
  const { t } = useTranslation();

  const { visible, dataSource, onClosed } = props;

  const { formItemData } = useRuleParams(dataSource?.params || []);

  return (
    <BasicDrawer
      open={visible}
      title={t('rule.ruleDetail.title')}
      showClosedIcon
      closable={false}
      onClose={onClosed}
      footer={null}
    >
      <Form layout="vertical">
        <RuleBaseInfo dataSource={dataSource} showKnowledge />
        <Form.Item
          label={t('ruleTemplate.editModal.ruleLevelLabel')}
          name="level"
        >
          <RuleDetailItemStyleWrapper>
            {t(ruleLevelDictionary[dataSource?.level as RuleResV1LevelEnum])}
          </RuleDetailItemStyleWrapper>
        </Form.Item>
        <EmptyBox if={!!dataSource?.params && dataSource.params.length > 0}>
          {formItemData.map((item) => {
            const { labelTip, label, value, key } = item;
            return (
              <FormItemLabel
                key={key}
                className={classNames({
                  'has-label-tip': !!labelTip
                })}
                label={
                  <div className="label-cont-custom">
                    <div>{label}</div>
                    <div hidden={!labelTip} className="tip-content-box">
                      {labelTip}
                    </div>
                  </div>
                }
                name={['params', key ?? '']}
                valuePropName="checked"
              >
                <RuleDetailItemStyleWrapper>{value}</RuleDetailItemStyleWrapper>
              </FormItemLabel>
            );
          })}
        </EmptyBox>
      </Form>
    </BasicDrawer>
  );
};

export default RuleDetailModal;
