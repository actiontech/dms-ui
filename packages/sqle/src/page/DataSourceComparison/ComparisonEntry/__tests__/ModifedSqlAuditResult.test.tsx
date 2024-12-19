import {
  IDatabaseDiffModifySQL,
  ISQLStatementWithAuditResult
} from '@actiontech/shared/lib/api/sqle/service/common';
import { superRender } from '../../../../testUtils/customRender';
import ModifiedSqlAuditResult from '../component/ModifiedSqlAuditResult';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { fireEvent, screen } from '@testing-library/dom';
import ModifiedSqlAuditResultList from '../component/ModifiedSqlAuditResult/List';

describe('ModifiedSqlAuditResult', () => {
  const auditResultCollapseActiveKeysOnChangeSpy = jest.fn();
  const instanceName = 'MySQL-Test-01';
  const instanceType = 'MySQL';
  const auditResultCollapseActiveKeys = ['0', '1'];
  const dataSource: IDatabaseDiffModifySQL[] = [
    {
      schema_name: 'schema_name1',
      modify_sqls: [
        {
          sql_statement: 'USE sqle;\n'
        },
        {
          sql_statement: 'DROP TABLE `audit_files`;\n',
          audit_results: [
            {
              level: 'error',
              message: '禁止除索引外的DROP操作',
              rule_name: 'ddl_disable_drop_statement',
              db_type: 'MySQL',
              i18n_audit_result_info: {
                en: {
                  Message: 'Do not use DROP operations except for indexes'
                },
                zh: {
                  Message: '禁止除索引外的DROP操作'
                }
              }
            }
          ]
        },
        {
          sql_statement: 'DROP TABLE `audit_plan_report_sqls_v2`;\n',
          audit_results: [
            {
              level: 'error',
              message: '禁止除索引外的DROP操作',
              rule_name: 'ddl_disable_drop_statement',
              db_type: 'MySQL',
              i18n_audit_result_info: {
                en: {
                  Message: 'Do not use DROP operations except for indexes'
                },
                zh: {
                  Message: '禁止除索引外的DROP操作'
                }
              }
            }
          ]
        }
      ]
    },
    {
      schema_name: 'schema_name2',
      modify_sqls: [
        {
          sql_statement: 'USE sqle;\n'
        },
        {
          sql_statement: 'DROP TABLE `audit_files`;\n',
          audit_results: [
            {
              level: 'error',
              message: '禁止除索引外的DROP操作',
              rule_name: 'ddl_disable_drop_statement',
              db_type: 'MySQL',
              i18n_audit_result_info: {
                en: {
                  Message: 'Do not use DROP operations except for indexes'
                },
                zh: {
                  Message: '禁止除索引外的DROP操作'
                }
              }
            }
          ]
        },
        {
          sql_statement: 'DROP TABLE `audit_plan_report_sqls_v2`;\n',
          audit_results: [
            {
              level: 'error',
              message: '禁止除索引外的DROP操作',
              rule_name: 'ddl_disable_drop_statement',
              db_type: 'MySQL',
              i18n_audit_result_info: {
                en: {
                  Message: 'Do not use DROP operations except for indexes'
                },
                zh: {
                  Message: '禁止除索引外的DROP操作'
                }
              }
            }
          ]
        }
      ]
    },
    {
      schema_name: 'schema_name3',
      modify_sqls: [
        {
          sql_statement: 'USE sqle;\n'
        },
        {
          sql_statement: 'DROP TABLE `audit_files`;\n',
          audit_results: [
            {
              level: 'error',
              message: '禁止除索引外的DROP操作',
              rule_name: 'ddl_disable_drop_statement',
              db_type: 'MySQL',
              i18n_audit_result_info: {
                en: {
                  Message: 'Do not use DROP operations except for indexes'
                },
                zh: {
                  Message: '禁止除索引外的DROP操作'
                }
              }
            }
          ]
        },
        {
          sql_statement: 'DROP TABLE `audit_plan_report_sqls_v2`;\n',
          audit_results: [
            {
              level: 'error',
              message: '禁止除索引外的DROP操作',
              rule_name: 'ddl_disable_drop_statement',
              db_type: 'MySQL',
              i18n_audit_result_info: {
                en: {
                  Message: 'Do not use DROP operations except for indexes'
                },
                zh: {
                  Message: '禁止除索引外的DROP操作'
                }
              }
            }
          ]
        }
      ]
    }
  ];

  describe('index', () => {
    const customRender = (dataSource?: IDatabaseDiffModifySQL[]) => {
      return superRender(
        <ModifiedSqlAuditResult
          dataSource={dataSource}
          instanceName={instanceName}
          instanceType="MySQL"
          auditResultCollapseActiveKeys={auditResultCollapseActiveKeys}
          auditResultCollapseActiveKeysOnChange={
            auditResultCollapseActiveKeysOnChangeSpy
          }
        />
      );
    };

    beforeEach(() => {
      mockUseCurrentUser();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it('should render without crashing when no dataSource is provided', () => {
      const { container } = customRender();

      expect(container).toMatchSnapshot();
    });

    it('should set the activeTabKey to the first schema_name in dataSource on initial render if dataSource is provided', () => {
      const { container } = customRender(dataSource);

      expect(container).toMatchSnapshot();

      expect(
        screen.getByTestId(dataSource[0].schema_name!).parentNode?.parentNode
      ).toHaveClass('ant-segmented-item-selected');
    });

    it('should update the activeTabKey and re-render the component when a new tab is selected', () => {
      const { container } = customRender(dataSource);

      fireEvent.click(screen.getByTestId(dataSource[1].schema_name!));
      expect(container).toMatchSnapshot();
      expect(
        screen.getByTestId(dataSource[1].schema_name!).parentNode?.parentNode
      ).toHaveClass('ant-segmented-item-selected');
    });

    it('should render error message when audit_error is not empty', async () => {
      customRender(
        dataSource.map((v) => ({ ...v, audit_error: 'audit error message' }))
      );

      fireEvent.click(screen.getAllByText('变更SQL语句审核结果')[0]);
      expect(screen.queryAllByText('审核失败')[0]).toBeInTheDocument();
      expect(
        screen.queryAllByText('audit error message')[0]
      ).toBeInTheDocument();
    });
  });

  describe('list', () => {
    const customRender = (
      dataSource?: ISQLStatementWithAuditResult[],
      auditError?: string
    ) => {
      return superRender(
        <ModifiedSqlAuditResultList
          dataSource={dataSource}
          instanceType={instanceType}
          auditResultCollapseActiveKeys={auditResultCollapseActiveKeys}
          auditResultCollapseActiveKeysOnChange={
            auditResultCollapseActiveKeysOnChangeSpy
          }
          auditError={auditError}
        />
      );
    };
    it('should render without crashing when no dataSource is provided', () => {
      const { container } = customRender();
      expect(container).toMatchSnapshot();
    });

    it('should render the correct number of list items based on the dataSource length', () => {
      const { container } = customRender(dataSource[0].modify_sqls);
      expect(container).toMatchSnapshot();

      expect(screen.getAllByRole('listitem')).toHaveLength(
        dataSource[0].modify_sqls!.length
      );
    });

    it('should render the SQLRenderer component with the correct SQL statement', () => {
      customRender(dataSource[0].modify_sqls);
      expect(screen.getByText(/USE sqle;/)).toBeInTheDocument();
    });

    it('should call auditResultCollapseActiveKeysOnChange with updated keys when a collapse item is toggled', () => {
      customRender(dataSource[1].modify_sqls);
      fireEvent.click(screen.getAllByText(/变更SQL语句审核结果/)[0]);
      expect(auditResultCollapseActiveKeysOnChangeSpy).toHaveBeenCalledTimes(1);
      expect(auditResultCollapseActiveKeysOnChangeSpy).toHaveBeenCalledWith([
        '1'
      ]);
    });

    it('should render error message when audit_error is not empty', async () => {
      customRender(dataSource[1].modify_sqls, 'audit error message');

      expect(screen.queryAllByText('变更SQL语句审核结果')).toHaveLength(
        dataSource[1].modify_sqls?.length!
      );
      fireEvent.click(screen.getAllByText('变更SQL语句审核结果')[0]);
      expect(screen.queryAllByText('审核失败')[0]).toBeInTheDocument();
      expect(
        screen.queryAllByText('audit error message')[0]
      ).toBeInTheDocument();
    });
  });
});
