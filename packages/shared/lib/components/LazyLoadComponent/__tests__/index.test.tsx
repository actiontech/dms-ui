import { fireEvent, screen } from '@testing-library/dom';
import LazyLoadComponent from '../LazyLoadComponent';
import { superRender } from '../../../testUtil/customRender';
import { useState } from 'react';
import { LazyLoadComponentProps } from '../LazyLoadComponent.types';
import { getBySelector } from '../../../testUtil/customQuery';

describe('test LazyLoadComponent', () => {
  const Wrapper = (
    params: Omit<LazyLoadComponentProps, 'open' | 'children'>
  ) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <LazyLoadComponent open={open} {...params}>
          Lazy Content
        </LazyLoadComponent>

        <button
          onClick={() => {
            setOpen((v) => !v);
          }}
        >
          按钮
        </button>
      </>
    );
  };

  it('initializes with correct status', () => {
    superRender(
      <LazyLoadComponent open={false}>Lazy Content</LazyLoadComponent>
    );
    expect(screen.queryByText(/Lazy Content/)).toBeNull();
  });

  it('mounts the component when open is true', () => {
    superRender(
      <LazyLoadComponent open={true}>Lazy Content</LazyLoadComponent>
    );
    expect(screen.getByText(/Lazy Content/i)).toBeInTheDocument();
  });

  it('forces render the component when forceRender is true and open is false', () => {
    superRender(
      <LazyLoadComponent open={false} forceRender={true}>
        Lazy Content
      </LazyLoadComponent>
    );
    expect(screen.getByText(/Lazy Content/i)).toBeInTheDocument();
  });

  it('destroys the component when destroyOnClose is true and component is closed', () => {
    superRender(<Wrapper destroyOnClose />);

    expect(screen.queryByText(/Lazy Content/)).toBeNull();

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.getByText(/Lazy Content/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.queryByText(/Lazy Content/)).toBeNull();
  });

  it('changes status correctly based on open prop changes', () => {
    superRender(<Wrapper />);

    expect(screen.queryByText(/Lazy Content/)).toBeNull();

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.getByText(/Lazy Content/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.getByText(/Lazy Content/i)).toBeInTheDocument();
  });

  it('applies animation classes correctly', () => {
    superRender(
      <LazyLoadComponent open={true} animation="fade">
        Lazy Content
      </LazyLoadComponent>
    );
    expect(getBySelector('.lazy-load-wrapper')).toHaveStyle('animation: fade');
  });
});
