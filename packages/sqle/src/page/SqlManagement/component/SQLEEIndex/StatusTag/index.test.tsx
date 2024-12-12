import { cleanup, screen } from '@testing-library/react';
import StatusTag from '.';
import { superRender } from '../../../../../testUtils/customRender';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('page/SqlManagement/StatusTag', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (status: SqlManageStatusEnum) => {
    return superRender(<StatusTag status={status} />);
  };

  it('render ignored status tag', () => {
    const { baseElement } = customRender(SqlManageStatusEnum.ignored);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('已忽略')).toBeInTheDocument();
  });

  it('render manual_audited status tag', () => {
    const { baseElement } = customRender(SqlManageStatusEnum.manual_audited);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('已人工审核')).toBeInTheDocument();
  });

  it('render solved status tag', () => {
    const { baseElement } = customRender(SqlManageStatusEnum.solved);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('已解决')).toBeInTheDocument();
  });

  it('render unhandled status tag', () => {
    const { baseElement } = customRender(SqlManageStatusEnum.unhandled);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('未处理')).toBeInTheDocument();
  });

  it('render sent status tag', () => {
    const { baseElement } = customRender(SqlManageStatusEnum.sent);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('已推送至其他平台')).toBeInTheDocument();
  });
});
