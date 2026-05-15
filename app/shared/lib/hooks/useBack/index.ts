import React from 'react';
import { useTypedNavigate } from '../../components/TypedRouter';

const useBack = () => {
  const navigate = useTypedNavigate();

  const goBack = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return { goBack };
};

export default useBack;
