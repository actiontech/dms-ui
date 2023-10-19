import { cleanup } from '@testing-library/react';
import Link from '.';
import { superRender } from '../../testUtil/customRender';
import { getHrefByText } from '../../testUtil/customQuery';

const baseUrl = '/base/';
describe('test CustomLink', () => {
  afterEach(() => {
    cleanup();
  });
  test('should render href', () => {
    superRender(<Link to="/test">test</Link>);

    expect(getHrefByText('test')).toBe('/test');
  });

  test('should be add custom prefix', () => {
    superRender(
      <Link to="test" baseUrl={baseUrl}>
        test
      </Link>
    );
    expect(getHrefByText('test')).toBe(`${baseUrl}test`);
    cleanup();

    superRender(<Link to={`${baseUrl}test`}>test</Link>);
    expect(getHrefByText('test')).toBe(`${baseUrl}test`);
    cleanup();

    superRender(
      <Link to={{ pathname: 'test', search: '123' }} baseUrl={baseUrl}>
        test
      </Link>
    );
    expect(getHrefByText('test')).toBe(`${baseUrl}test?123`);
    cleanup();

    superRender(
      <Link to={{ pathname: `${baseUrl}test`, search: '123' }}>test</Link>
    );
    expect(getHrefByText('test')).toBe(`${baseUrl}test?123`);

    cleanup();

    superRender(<Link to={{ pathname: undefined }}>test</Link>);
    expect(getHrefByText('test')).toBe('/');
  });
});
