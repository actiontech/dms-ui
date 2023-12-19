import { Select } from 'antd';
import { render } from '@testing-library/react';
import useStaticStatus from '.';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('provision/hooks/useStaticStatus', () => {
  it('should return event type options', async () => {
    const { result } = renderHooksWithTheme(useStaticStatus);
    expect(result.current.authAuditEventTypeOptions).toHaveLength(3);
    const { baseElement } = render(
      <Select options={result.current.authAuditEventTypeOptions} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
