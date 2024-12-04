import { superRender } from '../../../../testUtils/customRender';
import rule_template from '../../../../testUtils/mockApi/rule_template';
import SqlAuditResult from '../component/SqlAuditResult';

describe('SqlAuditResult', () => {
  let getRulesSpy: jest.SpyInstance;

  beforeEach(() => {
    getRulesSpy = rule_template.getRuleList();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot when audit result is empty', () => {
    const { container } = superRender(
      <SqlAuditResult auditResults={[]} instanceType="MySQL" shouldFetchRules />
    );

    expect(getRulesSpy).toHaveBeenCalledTimes(0);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when audit error is not empty', () => {
    const { container } = superRender(
      <SqlAuditResult
        auditResults={[
          {
            db_type: 'MySQL',
            level: 'warn',
            message: 'message',
            rule_name: 'rule1'
          }
        ]}
        auditError="network error"
        instanceType="MySQL"
        shouldFetchRules
      />
    );

    expect(getRulesSpy).toHaveBeenCalledTimes(0);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when shouldFetchRules is equal false', () => {
    const { container } = superRender(
      <SqlAuditResult
        auditResults={[
          {
            db_type: 'MySQL',
            level: 'warn',
            message: 'message',
            rule_name: 'rule1'
          }
        ]}
        instanceType="MySQL"
        shouldFetchRules={false}
      />
    );

    expect(getRulesSpy).toHaveBeenCalledTimes(0);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when shouldFetchRules is equal true', () => {
    const { container } = superRender(
      <SqlAuditResult
        auditResults={[
          {
            db_type: 'MySQL',
            level: 'warn',
            message: 'message',
            rule_name: 'rule1'
          },
          {
            db_type: 'MySQL',
            level: 'normal',
            message: 'message',
            rule_name: 'rule2'
          }
        ]}
        instanceType="MySQL"
        shouldFetchRules
      />
    );

    expect(getRulesSpy).toHaveBeenCalledTimes(1);
    expect(getRulesSpy).toHaveBeenCalledWith({
      filter_db_type: 'MySQL',
      filter_rule_names: 'rule1,rule2'
    });

    expect(container).toMatchSnapshot();
  });
});