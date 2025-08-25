import GitSSHConfig from './index';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../testUtils/superRender';
import configuration from '@actiontech/shared/lib/testUtil/mockApi/sqle/configuration';
import { getSSHPublicKeyMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/configuration/data';
import { Copy } from '@actiontech/dms-kit';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('base/System/GitSSHConfig', () => {
  let mockCopy: jest.SpyInstance;

  beforeEach(() => {
    mockCopy = jest.spyOn(Copy, 'copyTextByTextarea');
    jest.useFakeTimers();
    configuration.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => {
    return baseSuperRender(<GitSSHConfig />);
  };

  it('should match snapshot when get ssh public key', async () => {
    const getSSHPublicKeySpy = configuration.mockGetSSHPublicKey();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSSHPublicKeySpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render generate button when no public key', async () => {
    const getSSHPublicKeySpy = configuration
      .mockGetSSHPublicKey()
      .mockImplementation(() =>
        createSpySuccessResponse({ data: { public_key: '' } })
      );
    customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSSHPublicKeySpy).toHaveBeenCalled();
    expect(screen.getByText('生成SSH密钥')).toBeInTheDocument();
  });

  it('should generate ssh public key when click generate button', async () => {
    const getSSHPublicKeySpy = configuration
      .mockGetSSHPublicKey()
      .mockImplementation(() =>
        createSpySuccessResponse({ data: { public_key: '' } })
      );
    const genSSHPublicKeySpy = configuration.mockGenSSHPublicKey();

    customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSSHPublicKeySpy).toHaveBeenCalled();

    const generateButton = screen.getByText('生成SSH密钥');
    expect(generateButton).toBeInTheDocument();

    fireEvent.click(generateButton);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(genSSHPublicKeySpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSSHPublicKeySpy).toHaveBeenCalledTimes(2);
  });

  it('should copy public key when click copy button', async () => {
    const getSSHPublicKeySpy = configuration.mockGetSSHPublicKey();
    customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSSHPublicKeySpy).toHaveBeenCalled();

    const copyButton = screen.getByText('复 制');
    expect(copyButton).toBeInTheDocument();

    fireEvent.click(copyButton);
    await act(async () => jest.advanceTimersByTime(100));

    expect(mockCopy).toHaveBeenCalledWith(getSSHPublicKeyMockData.public_key);
    await screen.findByText('复制成功');
  });
});
