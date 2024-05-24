import { shallow } from 'enzyme';
import FormStep from '..';
import { renderHook } from '@testing-library/react';
import { useForm } from 'antd/es/form/Form';
import { MockSharedStepDetail } from '../../../hooks/mockData';
import toJson from 'enzyme-to-json';

describe('test FormStep', () => {
  it('should match snapshot', () => {
    const { result: baseInfoFormResult } = renderHook(() => useForm());
    const { result: sqlAuditInfoFormResult } = renderHook(() => useForm());
    const wrapper = shallow(
      <FormStep
        baseInfoForm={baseInfoFormResult.current[0]}
        sqlAuditInfoForm={sqlAuditInfoFormResult.current[0]}
        auditAction={jest.fn()}
        {...MockSharedStepDetail}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
