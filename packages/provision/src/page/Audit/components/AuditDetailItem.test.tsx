import { AuditDetailItemProps } from './AuditDetailItem.d';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import AuditDetailItem from './AuditDetailItem';

describe('/provision/Audit/AuditDetailItem', () => {
  it('render audit detail item with value', () => {
    const props: AuditDetailItemProps = {
      label: 'test label',
      value: 'test value'
    };

    const { baseElement } = renderWithTheme(<AuditDetailItem {...props} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('render audit detail item with children', () => {
    const props: AuditDetailItemProps = {
      label: 'test label',
      children: <span>test value</span>
    };

    const { baseElement } = renderWithTheme(<AuditDetailItem {...props} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('render diff type detail item', () => {
    const customRender = (type: AuditDetailItemProps['type']) => {
      const props: AuditDetailItemProps = {
        label: 'test label',
        value: 'test value',
        type
      };
      return renderWithTheme(<AuditDetailItem {...props} />);
    };

    const { baseElement } = customRender('action');
    expect(baseElement).toMatchSnapshot();

    const { baseElement: baseElement1 } = customRender('date');
    expect(baseElement1).toMatchSnapshot();

    const { baseElement: baseElement2 } = customRender('user');
    expect(baseElement2).toMatchSnapshot();
  });
});
