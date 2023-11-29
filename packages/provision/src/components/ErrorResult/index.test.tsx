import { superRender } from '~/testUtil/customRender';
import ErrorResult from '.';

describe.skip('ErrorResult', () => {
  it('should match snapshot when the errorMessage props is not exist', async () => {
    const { baseElement } = superRender(<ErrorResult />);

    expect(baseElement).toMatchSnapshot();
  });
  it('should match snapshot when the errorMessage props is exist', async () => {
    const { baseElement } = superRender(
      <ErrorResult errorMessage="request error 123" />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
