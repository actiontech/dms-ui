import useRuleParams from '../useRuleParams';

import { renderHook } from '@testing-library/react';

describe('sqle/components/useRuleParams', () => {
  it('should render turnLabelData', () => {
    const FormItemData = [
      {
        desc: '',
        key: 'key 1'
      },
      {
        desc: 'desc',
        key: 'key 2'
      },
      {
        desc: 'desc(P)',
        key: 'key 3'
      },
      {
        desc: 'desc（P）',
        key: 'key 4'
      },
      {
        desc: 'desc。b',
        key: 'key 5'
      }
    ];
    const { result } = renderHook(() => useRuleParams(FormItemData));
    expect(result.current.formItemData).toEqual([
      { desc: '', key: 'key 1', label: '', labelTip: '' },
      { desc: 'desc', key: 'key 2', label: 'desc', labelTip: '' },
      { desc: 'desc(P)', key: 'key 3', label: 'desc', labelTip: 'P' },
      { desc: 'desc（P）', key: 'key 4', label: 'desc', labelTip: 'P' },
      { desc: 'desc。b', key: 'key 5', label: 'desc', labelTip: 'b' }
    ]);
  });
});
