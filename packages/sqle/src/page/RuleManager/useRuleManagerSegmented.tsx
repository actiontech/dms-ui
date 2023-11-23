import { SegmentedProps } from 'antd';
import { RuleManagerSegmentedKey } from './index.type';
import { useDispatch, useSelector } from 'react-redux';
import { updateRuleManagerActiveSegmentedKey } from '../../store/globalRuleTemplate';
import { IReduxState } from '../../store';

const useRuleManagerSegmented = () => {
  const dispatch = useDispatch();
  const activeKey = useSelector(
    (state: IReduxState) => state.globalRuleTemplate.activeSegmentedKey
  );

  const updateActiveSegmentedKey = (key: RuleManagerSegmentedKey) => {
    dispatch(updateRuleManagerActiveSegmentedKey(key));
  };

  const onSegmentedChange: SegmentedProps['onChange'] = (key) => {
    updateActiveSegmentedKey(key as RuleManagerSegmentedKey);
  };

  return { activeKey, updateActiveSegmentedKey, onSegmentedChange };
};

export default useRuleManagerSegmented;
