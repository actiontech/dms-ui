import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ExecModeController from '.';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('test TaskResultList/ExecModeController ee', () => {
  it('should match snapshot', () => {
    expect(
      toJson(
        shallow(
          <ExecModeController
            sqlComponent={<div>sqlComponent</div>}
            executeMode={WorkflowResV2ExecModeEnum.sql_file}
            sqlFileComponent={<div>sqlFileComponent</div>}
          />
        )
      )
    ).toMatchSnapshot();

    expect(
      toJson(
        shallow(
          <ExecModeController
            sqlComponent={<div>sqlComponent</div>}
            executeMode={WorkflowResV2ExecModeEnum.sqls}
            sqlFileComponent={<div>sqlFileComponent</div>}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
