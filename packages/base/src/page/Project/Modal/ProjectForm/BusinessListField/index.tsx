import { EditInput } from '@actiontech/shared/lib/components/ConfigItem';
import { Space } from 'antd';
import { useBoolean } from 'ahooks';
import { DrawerFormIconWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicInput, EmptyBox, BasicToolTips } from '@actiontech/shared';
import useHideConfigInputNode from '@actiontech/shared/lib/components/ConfigItem/hooks/useHideConfigInputNode';
import { useTranslation } from 'react-i18next';
import { EditFilled, MinusCircleFilled } from '@actiontech/icons';

type BusinessListFieldProps = {
  value?: string;
  onChange?: (value: string) => void;
  onDelete?: () => void;
  deletable?: boolean;
  lastItem?: boolean;
};

const BusinessListField: React.FC<BusinessListFieldProps> = ({
  value = '',
  onChange,
  onDelete,
  deletable = true,
  lastItem = true
}) => {
  const { t } = useTranslation();

  const [fieldVisible, { setTrue: showField, setFalse: hideField }] =
    useBoolean();

  const onChangePropsValue = (v: string) => {
    onChange?.(v);
    hideField();
  };

  useHideConfigInputNode(fieldVisible, hideField);

  return (
    <Space>
      <EmptyBox
        if={fieldVisible}
        defaultNode={
          <Space>
            <BasicInput
              placeholder=""
              width={200}
              disabled
              value={value}
            ></BasicInput>
            <DrawerFormIconWrapper
              onClick={() => {
                showField();
              }}
              icon={<EditFilled />}
              className="edit-button"
            />
          </Space>
        }
      >
        <EditInput
          fieldValue={value}
          hideField={hideField}
          onSubmit={onChangePropsValue}
        />
      </EmptyBox>
      <EmptyBox
        if={deletable && !lastItem}
        defaultNode={
          <BasicToolTips
            titleWidth={280}
            title={!deletable ? t('dmsProject.projectForm.deleteTip') : null}
          >
            <DrawerFormIconWrapper
              className="delete-button-disabled"
              disabled
              icon={<MinusCircleFilled />}
            />
          </BasicToolTips>
        }
      >
        <DrawerFormIconWrapper
          onClick={onDelete}
          icon={<MinusCircleFilled />}
          className="delete-button"
        />
      </EmptyBox>
    </Space>
  );
};

export default BusinessListField;
