import RuleDetailModal, { IEditRuleTemplate } from '..';

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../../..//testUtils/customRender';

describe('sqle/components/RuleList/RuleDetailModal', () => {
  const customRender = (params: IEditRuleTemplate) => {
    return renderWithTheme(<RuleDetailModal {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });
});
