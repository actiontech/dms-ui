import { RenderResult } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { renderWithRouter } from './customRender';

export const renderLocationDisplay = (): [
  () => RenderResult,
  () => JSX.Element
] => {
  const LocationComponent = () => {
    const location = useLocation();

    return <div data-testid="location-display">{location.pathname}</div>;
  };

  return [() => renderWithRouter(<LocationComponent />), LocationComponent];
};
