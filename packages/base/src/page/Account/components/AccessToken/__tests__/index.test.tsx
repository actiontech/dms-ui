import { cleanup } from '@testing-library/react-hooks';
import AccessToken from '..';
import { superRender } from '../../../../../testUtils/customRender';
import { AccessTokenProps } from '../../../index.type';
import { fireEvent, screen } from '@testing-library/dom';

describe('test AccessToken', () => {
  const updateUserInfoSpy = jest.fn();

  const customRender = (props: Omit<AccessTokenProps, 'updateUserInfo'>) => {
    return superRender(
      <AccessToken {...props} updateUserInfo={updateUserInfoSpy} />
    );
  };

  it('should match snapshot', () => {
    const { container } = customRender({});
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('生成Token'));
    expect(container).toMatchSnapshot();

    cleanup();

    expect(
      customRender({
        token: 'access_token',
        expiration: '2024-03-31T10:25:10+08:00',
        hasExpired: false
      }).container
    ).toMatchSnapshot();

    cleanup();

    expect(
      customRender({
        token: 'access_token',
        expiration: '',
        hasExpired: false
      }).container
    ).toMatchSnapshot();

    cleanup();

    expect(
      customRender({
        token: 'access_token',
        expiration: '',
        hasExpired: true
      }).container
    ).toMatchSnapshot();
    cleanup();
  });
});
