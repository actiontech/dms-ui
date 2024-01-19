import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import BasicInfoWrapper from '.';

import { renderWithTheme } from '../../../../testUtils/customRender';
import { BasicInfoWrapperProps } from './index.type';

describe('sqle/Order/BasicInfoWrapper', () => {
  const customRender = (params: BasicInfoWrapperProps) => {
    return renderWithTheme(<BasicInfoWrapper {...params} />);
  };

  it('render snap when has need params', () => {
    const { baseElement } = customRender({
      title: 'basic title'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has all params', () => {
    const { baseElement } = customRender({
      title: 'basic title',
      desc: 'this is a desc str',
      status: WorkflowRecordResV2StatusEnum.exec_failed,
      className: 'custom-class-name-a',
      gap: 10
    });
    expect(baseElement).toMatchSnapshot();
  });
});
