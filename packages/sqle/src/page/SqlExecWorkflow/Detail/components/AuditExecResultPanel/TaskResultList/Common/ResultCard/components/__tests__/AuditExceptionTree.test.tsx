import { fireEvent, screen } from '@testing-library/dom';
import { superRender } from '../../../../../../../../../../testUtils/customRender';
import AuditExceptionTree from '../AuditExceptionTree';
import {
  getAllBySelector,
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { AuditTaskSQLsMockDataWithExceptionRule } from '../../../../../../../../../../testUtils/mockApi/task/data';

describe('AuditExceptionTree', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render tree with audit exception results', () => {
    const { container } = superRender(
      <AuditExceptionTree
        auditExceptionResults={
          AuditTaskSQLsMockDataWithExceptionRule[0].audit_result!
        }
      />
    );

    expect(screen.getByText('审核异常')).toBeInTheDocument();

    fireEvent.click(getBySelector('.custom-icon-arrow-down', container));

    expect(getAllBySelector('.exception-item', container)).toHaveLength(
      AuditTaskSQLsMockDataWithExceptionRule[0].audit_result!.length
    );
  });

  it('should render empty tree when no audit results provided', () => {
    const { container } = superRender(
      <AuditExceptionTree auditExceptionResults={[]} />
    );

    expect(screen.getByText('审核异常')).toBeInTheDocument();
    expect(
      queryBySelector('.custom-icon-arrow-down', container)
    ).not.toBeInTheDocument();
  });
});
