import { useDispatch, useSelector } from 'react-redux';
import { publicRuleTemplateListMockData } from '../../../../../testUtils/mockApi/rule_template/data';
import { ModalName } from '../../../../../data/ModalName';
import rule_template from '../../../../../testUtils/mockApi/rule_template';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import ExportRuleTemplateModal from '.';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('test Modal/ExportRuleTemplate', () => {
  const dispatchSpy = jest.fn();
  const templateName = publicRuleTemplateListMockData[0].rule_template_name;
  let exportRuleTemplateSpy: jest.SpyInstance;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: {
          modalStatus: { [ModalName.Export_Rule_Template]: true },
          selectGlobalRuleTemplate: publicRuleTemplateListMockData[0]
        }
      })
    );
    jest.useFakeTimers();
    exportRuleTemplateSpy = rule_template.exportRuleTemplate();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should call dispatch with the correct action to close the modal when onClose is triggered', () => {
    sqleSuperRender(<ExportRuleTemplateModal />);

    fireEvent.click(screen.getByText('取 消'));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      payload: {
        modalName: 'EXPORT_RULE_TEMPLATE',
        status: false
      },
      type: 'globalRuleTemplate/updateModalStatus'
    });
  });

  it('should call the rule_template.exportRuleTemplateV1 API with the correct parameters when onSubmit is triggered', async () => {
    sqleSuperRender(<ExportRuleTemplateModal />);

    fireEvent.click(screen.getByText('json'));

    fireEvent.click(screen.getByText('导 出'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(exportRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(exportRuleTemplateSpy).toHaveBeenCalledWith(
      { rule_template_name: templateName, export_type: 'json' },
      { responseType: 'blob' }
    );
    expect(screen.getByText('取 消').closest('button')).toBeDisabled();
    expect(screen.getByText('导 出').closest('button')).toBeDisabled();
    expect(
      screen.getByText(`正在导出模板 "${templateName}"...`)
    ).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText(`正在导出模板 "${templateName}"...`)
    ).not.toBeInTheDocument();
    expect(screen.getByText('取 消').closest('button')).not.toBeDisabled();
    expect(screen.getByText('导 出').closest('button')).not.toBeDisabled();
  });
});
