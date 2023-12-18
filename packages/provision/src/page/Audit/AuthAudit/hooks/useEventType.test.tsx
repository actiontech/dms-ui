import { Select } from 'antd';
import { render } from '@testing-library/react';
import useEventType from './useEventType';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('page/auth/AuthAudit/useEventType', () => {
  it('should return event type options', async () => {
    const { result } = renderHooksWithTheme(useEventType);
    expect(result.current.authAuditEventTypeOptions).toHaveLength(3);
    const { baseElement } = render(
      <Select options={result.current.authAuditEventTypeOptions} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
