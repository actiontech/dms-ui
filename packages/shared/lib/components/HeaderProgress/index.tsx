import Nprogress from 'nprogress';
import { useEffect } from 'react';
Nprogress.configure({
  showSpinner: false
});

const HeaderProgress = () => {
  useEffect(() => {
    Nprogress.start();
    return () => {
      Nprogress.done();
    };
  }, []);

  return null;
};

export default HeaderProgress;
