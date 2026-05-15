import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SQLRenderer } from '..';

describe('test SQLrenderer', () => {
  it('should match snapshot', () => {
    expect(
      toJson(
        shallow(
          <SQLRenderer
            sql={`CREATE TABLE IF NOT EXISTS
    task (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT,
      status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <SQLRenderer.Snippet
            sql={`CREATE TABLE IF NOT EXISTS
    task (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT,
      status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <SQLRenderer.ViewOnlyEditor
            sql={`CREATE TABLE IF NOT EXISTS
    task (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT,
      status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
