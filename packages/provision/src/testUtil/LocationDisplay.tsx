import { useLocation } from 'react-router-dom';

const LocationDisplay = () => {
  const location = useLocation();

  return (
    <>
      <div data-testid="location-display">{location.pathname}</div>
      <div data-testid="location-search-display">{location.search}</div>
    </>
  );
};

export const LocationDisplayTestId = 'location-display';
export const LocationSearchDisplayTestId = 'location-search-display';

export default LocationDisplay;
