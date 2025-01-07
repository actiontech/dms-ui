import { useBoolean } from 'ahooks';
import { ConfigItemStyledWrapper } from './style';
import { Col, Space } from 'antd';
import { ConfigItemProps } from './ConfigItem.types';
import useHideConfigInputNode from './hooks/useHideConfigInputNode';
import { EditFilled } from '@actiontech/icons';
import { BasicButton } from '../BasicButton';

const ConfigItem: React.FC<ConfigItemProps> = ({
  label,
  inputNode,
  descNode,
  fieldVisible = false,
  showField,
  hideField,
  needEditButton = true
}) => {
  const [
    editButtonVisible,
    { setTrue: showEditButton, setFalse: hideEditButton }
  ] = useBoolean(false);

  const onMouseEnterItem = () => {
    if (!needEditButton) return;
    showEditButton();
  };
  const onMouseLeaveItem = () => {
    if (!needEditButton) return;
    hideEditButton();
  };

  useHideConfigInputNode(fieldVisible, hideField);

  return (
    <ConfigItemStyledWrapper
      justify="space-between"
      align="middle"
      onMouseEnter={onMouseEnterItem}
      onMouseLeave={onMouseLeaveItem}
    >
      <Col span={11} className="config-item-label">
        {label}
      </Col>
      <Space className="config-item-filed">
        {!descNode || fieldVisible ? (
          <>{inputNode}</>
        ) : (
          <>
            {descNode}
            {
              <BasicButton
                className="config-item-filed-edit-button"
                hidden={!needEditButton || !editButtonVisible}
                icon={<EditFilled />}
                onClick={showField}
              />
            }
          </>
        )}
      </Space>
    </ConfigItemStyledWrapper>
  );
};

export default ConfigItem;
