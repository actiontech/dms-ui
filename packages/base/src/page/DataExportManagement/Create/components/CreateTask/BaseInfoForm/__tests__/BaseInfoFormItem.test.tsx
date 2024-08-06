import { superRender } from '../../../../../../../testUtils/customRender';
import BaseInfoFormItem from '../BaseInfoFormItem';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { Form } from 'antd';

describe('test base/DataExport/Create/BaseInfoForm/BaseInfoFormItem', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE]);

  it('should match snapshot with slot', () => {
    const { container: containerWithSlot } = superRender(
      <Form>
        <BaseInfoFormItem slot={<span>slot</span>} />
      </Form>
    );
    expect(containerWithSlot).toMatchSnapshot();
  });
});
