import { cleanup } from '@testing-library/react';
import { Form } from 'antd';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import SqlAuditFields from '..';

describe('SqlAuditFields', () => {
  const mockOnNeedAuditForSqlQueryChange = jest.fn();
  const mockRuleTemplateOptions = [
    {
      label: 'MySQL规则模板',
      value: 'mysql_template',
      key: '1'
    },
    {
      label: 'PostgreSQL规则模板',
      value: 'postgres_template',
      key: '2'
    }
  ];

  const customRender = (initialValues = {}) => {
    const { result } = superRenderHook(() => Form.useForm());
    const [form] = result.current;

    return baseSuperRender(
      <Form form={form} initialValues={initialValues}>
        <SqlAuditFields
          getTemplateOptionsLoading={false}
          ruleTemplateOptions={mockRuleTemplateOptions}
          onNeedAuditForSqlQueryChange={mockOnNeedAuditForSqlQueryChange}
        />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should match snapshot when needSqlAuditService is false', () => {
    const { container } = customRender({
      needSqlAuditService: false
    });
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when needSqlAuditService is true', () => {
    const { container } = customRender({
      needSqlAuditService: true
    });
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when needSqlAuditService and needAuditForSqlQuery are both true', () => {
    const { container } = customRender({
      needSqlAuditService: true,
      needAuditForSqlQuery: true
    });
    expect(container).toMatchSnapshot();
  });
});
