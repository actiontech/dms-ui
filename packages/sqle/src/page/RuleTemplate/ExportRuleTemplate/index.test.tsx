import { useDispatch, useSelector } from 'react-redux';
import ExportRuleTemplateModal from '.';
import { projectRuleTemplateListMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';
import { ModalName } from '../../../data/ModalName';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('test Modal/ExportRuleTemplate', () => {
  const dispatchSpy = jest.fn();
  const templateName = projectRuleTemplateListMockData[0].rule_template_name;
  let exportRuleTemplateSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        ruleTemplate: {
          modalStatus: { [ModalName.Export_Rule_Template]: true },
          selectRuleTemplate: projectRuleTemplateListMockData[0]
        }
      })
    );
    jest.useFakeTimers();
    exportRuleTemplateSpy = rule_template.exportProjectRuleTemplate();
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
      type: 'ruleTemplate/updateModalStatus'
    });
  });

  it('should call the rule_template.exportRuleTemplateV1 API with the correct parameters when onSubmit is triggered', async () => {
    sqleSuperRender(<ExportRuleTemplateModal />);

    fireEvent.click(screen.getByText('json'));

    fireEvent.click(screen.getByText('导 出'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(exportRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(exportRuleTemplateSpy).toHaveBeenCalledWith(
      {
        rule_template_name: templateName,
        export_type: 'json',
        project_name: mockProjectInfo.projectName
      },
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
