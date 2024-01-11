import { renderWithTheme } from '../../../../testUtils/customRender';

import AuditResultForCreateOrder from '.';
import { AuditResultForCreateOrderProps } from './index.type';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('sqle/Order/Create/AuditResultForCreateOrder', () => {
  const projectID = mockProjectInfo.projectID;
  const customRender = (params: AuditResultForCreateOrderProps) => {
    return renderWithTheme(
      <AuditResultForCreateOrder updateTaskRecordTotalNum={jest.fn()} {...params} />
    );
  };

  it('render snap when has base info', () => {
    const { baseElement } = customRender({
      baseInfo: {
        workflow_subject: 'baseInfo workflow_subject',
        desc: 'baseInfo desc'
      },
      tasks: [
        {
          audit_level: AuditTaskResV1AuditLevelEnum.normal
        }
      ],
      projectID
    });

    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has base info', () => {
    const { baseElement } = customRender({
      tasks: [
        {
          audit_level: AuditTaskResV1AuditLevelEnum.normal
        }
      ],
      projectID
    });
    expect(baseElement).toMatchSnapshot();
  });
});
