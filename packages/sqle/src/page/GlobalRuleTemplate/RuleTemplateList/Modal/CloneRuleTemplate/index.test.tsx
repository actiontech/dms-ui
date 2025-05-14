import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import CloneRuleTemplate from '.';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { useDispatch, useSelector } from 'react-redux';
import rule_template from '../../../../../testUtils/mockApi/rule_template';
import { publicRuleTemplateListMockData } from '../../../../../testUtils/mockApi/rule_template/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('sqle/GlobalRuleTemplate/CloneRuleTemplate', () => {
  const dispatchSpy = jest.fn();
  let cloneRuleTemplateSpy: jest.SpyInstance;
  const templateName = publicRuleTemplateListMockData[0].rule_template_name;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: {
          modalStatus: { [ModalName.Clone_Rule_Template]: true },
          selectGlobalRuleTemplate: publicRuleTemplateListMockData[0]
        }
      })
    );
    mockUseCurrentProject();
    jest.useFakeTimers();
    cloneRuleTemplateSpy = rule_template.cloneRuleTemplate();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => superRender(<CloneRuleTemplate />);

  it('should send clone project rule template request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('正在克隆审核规则模板')).toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('模板名称'), {
      target: { value: 'test2' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');

    await act(async () => jest.advanceTimersByTime(3000));
    expect(cloneRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(cloneRuleTemplateSpy).toHaveBeenCalledWith({
      rule_template_name: templateName,
      new_rule_template_name: 'test2'
    });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'globalRuleTemplate/updateModalStatus',
      payload: {
        modalName: ModalName.Clone_Rule_Template,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Global_Rule_Template_List
    );
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it('should send clone project rule template request when click submit button with desc', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('正在克隆审核规则模板')).toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('模板名称'), {
      target: { value: 'test2' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(screen.getByLabelText('模板描述'), {
      target: { value: 'test desc' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');

    await act(async () => jest.advanceTimersByTime(3000));
    expect(cloneRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(cloneRuleTemplateSpy).toHaveBeenCalledWith({
      rule_template_name: templateName,
      new_rule_template_name: 'test2',
      desc: 'test desc'
    });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'globalRuleTemplate/updateModalStatus',
      payload: {
        modalName: ModalName.Clone_Rule_Template,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Global_Rule_Template_List
    );
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = customRender();
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'globalRuleTemplate/updateModalStatus',
      payload: {
        modalName: ModalName.Clone_Rule_Template,
        status: false
      }
    });
  });
});
