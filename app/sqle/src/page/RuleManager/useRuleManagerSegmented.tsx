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

  return { activeKey, updateActiveSegmentedKey };
};

export default useRuleManagerSegmented;
