import { renderHook } from '@testing-library/react';
import { Form } from 'antd';
import SqlUploadContent from '../components/SqlUploadContent';
import { SqlUploadContentProps } from '../components/index.type';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('test SqlUploadContent', () => {
  const customRender = (params: SqlUploadContentProps) => {
    const { result } = renderHook(() => Form.useForm());

    return (
      <Form form={result.current[0]}>
        <SqlUploadContent {...params} />
      </Form>
    );
  };

  it('renders SQL upload content based on the current upload type', () => {
    expect(
      customRender({
        currentSqlUploadType: AuditTaskResV1SqlSourceEnum.form_data,
        fieldPrefixPath: '1',
        dbSourceInfoCollection: { value: {}, set: jest.fn() }
      })
    ).toMatchSnapshot();

    expect(
      customRender({
        currentSqlUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
        fieldPrefixPath: '1',
        dbSourceInfoCollection: { value: {}, set: jest.fn() }
      })
    ).toMatchSnapshot();

    expect(
      customRender({
        currentSqlUploadType: AuditTaskResV1SqlSourceEnum.audit_plan,
        fieldPrefixPath: '1',
        dbSourceInfoCollection: { value: {}, set: jest.fn() }
      })
    ).toMatchSnapshot();
  });
});
