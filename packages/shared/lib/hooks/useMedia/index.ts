import { useMediaQuery, useTheme } from '@mui/material';

const useMedia = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 768px
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm')); // 480px

  return { isMobile, isSmallMobile };
};

export default useMedia;
