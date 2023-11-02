import { act, renderHook, screen } from '@testing-library/react';
import { Col, Form, Input } from 'antd';
import { FilterFormColLayout } from '~/data/common';
import { superRender } from '~/testUtil/customRender';
import TableFilterForm from '.';
import { sleep } from '../../../testUtil/customQuery';

describe('TableFilterForm', () => {
  it('should update filteredInfo when click search button', async () => {
    const { result } = renderHook(() => Form.useForm());
    const updateFilteredInfo = jest.fn();
    const { container, userEvent } = superRender(
      <TableFilterForm
        form={result.current[0]}
        updateFilteredInfo={updateFilteredInfo}
        filterFormButtonLayout={{ xl: 8 }}
      >
        <Col {...FilterFormColLayout}>
          <Form.Item name="filter_purpose" label="目的">
            <Input />
          </Form.Item>
        </Col>
      </TableFilterForm>
    );

    expect(container).toMatchSnapshot();

    await act(() => userEvent.tripleClick(screen.getByLabelText('目的')));
    await act(() => userEvent.keyboard('asd'));
    await act(() => userEvent.click(screen.getByText('搜 索')));
    await sleep(1000);
    expect(updateFilteredInfo).toBeCalledTimes(1);
    expect(updateFilteredInfo).toBeCalledWith({ filter_purpose: 'asd' });
  });
  it('should clear filteredInfo when click reset button', async () => {
    const { result } = renderHook(() => Form.useForm());
    const updateFilteredInfo = jest.fn();
    const { container, userEvent } = superRender(
      <TableFilterForm
        form={result.current[0]}
        updateFilteredInfo={updateFilteredInfo}
        filterFormButtonLayout={{ xl: 8 }}
      >
        <Col {...FilterFormColLayout}>
          <Form.Item name="filter_purpose" label="目的">
            <Input />
          </Form.Item>
        </Col>
      </TableFilterForm>
    );
    await act(() => userEvent.click(screen.getByText('重 置')));
    expect(updateFilteredInfo).toBeCalledTimes(1);
    expect(updateFilteredInfo).toBeCalledWith(null);
  });
});
