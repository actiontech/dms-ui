import { BackendFormProps } from '..';
import AutoCreatedFormItemByApi from '../AutoCreatedFormItemByApi';
import { sqleSuperRender } from '../../../../../sqle/src/testUtils/superRender';
import Form from 'antd/es/form/Form';

describe('sqle/components/BackendForm', () => {
  const customRender = (params: BackendFormProps) => {
    return sqleSuperRender(
      <Form>
        <AutoCreatedFormItemByApi {...params} formMode="create" />
      </Form>
    );
  };

  describe('render type is bool', () => {
    it('render layout is fullLine', () => {
      const { baseElement } = customRender({
        isFullLine: true,
        params: [
          {
            key: 'bool1',
            type: 'bool',
            desc: 'this is a tip'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render layout is spaceBetween & no desc', () => {
      const { baseElement } = customRender({
        isFullLine: false,
        params: [
          {
            key: 'bool2',
            type: 'bool',
            desc: 'this is a tip'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render layout has desc', () => {
      const { baseElement } = customRender({
        isFullLine: false,
        disabled: true,
        params: [
          {
            key: 'bool3',
            type: 'bool',
            desc: 'desc 。desc1',
            value: 'true'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });
  });
  describe('render type is spaceBetween', () => {
    it('render layout is fullLine', () => {
      const { baseElement } = customRender({
        params: [
          {
            key: 'int1',
            type: 'int',
            desc: 'desc 。desc1'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render layout is spaceBetween & no desc', () => {
      const { baseElement } = customRender({
        isFullLine: false,
        disabled: true,
        params: [
          {
            key: 'int2',
            type: 'int',
            desc: 'desc (desc2)'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render type is password', () => {
    it('render layout is fullLine', () => {
      const { baseElement } = customRender({
        params: [
          {
            key: 'input1',
            type: 'password',
            desc: 'desc 。desc1'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render form mode is update', () => {
      const { baseElement } = customRender({
        formMode: 'update',
        params: [
          {
            key: 'input1',
            type: 'password',
            desc: 'desc 。desc1'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render layout is spaceBetween & no desc', () => {
      const { baseElement } = customRender({
        isFullLine: false,
        disabled: true,
        params: [
          {
            key: 'input2',
            type: 'password',
            desc: 'desc (desc2)'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render type is input', () => {
    it('render layout is fullLine', () => {
      const { baseElement } = customRender({
        params: [
          {
            key: 'input1',
            type: 'string',
            desc: 'desc 。desc1'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render layout is spaceBetween & no desc', () => {
      const { baseElement } = customRender({
        isFullLine: false,
        disabled: true,
        params: [
          {
            key: 'input2',
            type: 'string',
            desc: 'desc (desc2)'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render hidden is true', () => {
      const { baseElement } = customRender({
        params: [
          {
            hidden: true,
            value: '1',
            key: 'input1',
            type: 'string',
            desc: 'desc 。desc1'
          }
        ]
      });

      expect(baseElement).toMatchSnapshot();
    });
  });
});
