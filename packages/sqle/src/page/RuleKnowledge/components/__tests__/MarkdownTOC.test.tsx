import React from 'react';
import { screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import MarkdownTOC from '../MarkdownTOC/index';

describe('RuleKnowledge/MarkdownTOC', () => {
  const mockContainerRef = {
    current: {
      className: 'markdown-container',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }
  } as unknown as React.RefObject<HTMLElement>;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="markdown-container">
        <h1 id="title1">Title 1</h1>
        <p>Some content</p>
        <h2 id="subtitle1">Subtitle 1</h2>
        <p>More content</p>
        <h2>Subtitle without ID</h2>
        <h3>Nested subtitle</h3>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('should render nothing when markdownLoaded is false', () => {
    const { container } = superRender(
      <MarkdownTOC markdownLoaded={false} containerRef={mockContainerRef} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when no headers are found', () => {
    document.body.innerHTML =
      '<div class="markdown-container"><p>Only paragraph</p></div>';

    const { container } = superRender(
      <MarkdownTOC markdownLoaded={true} containerRef={mockContainerRef} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render anchor items based on headers', () => {
    const { container } = superRender(
      <MarkdownTOC markdownLoaded={true} containerRef={mockContainerRef} />
    );

    expect(container).toMatchSnapshot();
    expect(container.firstChild).not.toBeNull();
    expect(screen.getAllByText('Title 1')).toHaveLength(2);
    expect(screen.getAllByText('Subtitle 1')).toHaveLength(2);
    expect(screen.getAllByText('Subtitle without ID')).toHaveLength(2);
    expect(screen.getAllByText('Nested subtitle')).toHaveLength(2);
  });

  it('should create proper hierarchy for nested headers', () => {
    document.body.innerHTML = `
      <div class="markdown-container">
        <h1 id="main">Main Title</h1>
        <h2 id="sub1">Sub 1</h2>
        <h3 id="nested1">Nested 1</h3>
        <h3 id="nested2">Nested 2</h3>
        <h2 id="sub2">Sub 2</h2>
      </div>
    `;

    const { container } = superRender(
      <MarkdownTOC markdownLoaded={true} containerRef={mockContainerRef} />
    );
    expect(container).toMatchSnapshot();

    expect(screen.getAllByText('Main Title')).toHaveLength(2);
    expect(screen.getAllByText('Sub 1')).toHaveLength(2);
    expect(screen.getAllByText('Nested 1')).toHaveLength(2);
    expect(screen.getAllByText('Nested 2')).toHaveLength(2);
    expect(screen.getAllByText('Sub 2')).toHaveLength(2);
  });

  it('should handle empty containerRef', () => {
    const { container } = superRender(<MarkdownTOC markdownLoaded={true} />);

    expect(container.firstChild).toBeNull();
  });
});
