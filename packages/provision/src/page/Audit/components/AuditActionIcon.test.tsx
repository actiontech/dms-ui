import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import AuditActionIcon from './AuditActionIcon';

describe('/provision/Audit/AuditActionIcon', () => {
  it('render action icon', () => {
    const { baseElement } = renderWithTheme(
      <AuditActionIcon value="test_created" />
    );

    expect(baseElement).toMatchSnapshot();

    const { baseElement: baseElement2 } = renderWithTheme(
      <AuditActionIcon value="test_deleted" />
    );

    expect(baseElement2).toMatchSnapshot();

    const { baseElement: baseElement3 } = renderWithTheme(
      <AuditActionIcon value="test_updated" />
    );

    expect(baseElement3).toMatchSnapshot();
  });
});
