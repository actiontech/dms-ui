import { RenderResult } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { superRender } from './superRender';

export const renderLocationDisplay = (): [
  () => RenderResult,
  () => JSX.Element
] => {
  const LocationComponent = () => {
    const location = useLocation();

    return <div data-testid="location-display">{location.pathname}</div>;
  };

  return [() => superRender(<LocationComponent />), LocationComponent];
};
