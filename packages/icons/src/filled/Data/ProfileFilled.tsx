import type { SVGProps } from 'react';
const ProfileFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="M14 6v7.995a.666.666 0 0 1-.662.672H2.662A.66.66 0 0 1 2 14.005V1.995c0-.358.298-.662.665-.662h6.668v4A.667.667 0 0 0 10 6zm0-1.333h-3.333V1.335zm-8.667 0V6h2V4.667zm0 2.666v1.334h5.334V7.333zm0 2.667v1.333h5.334V10z" />
    </svg>
  );
};
export default ProfileFilled;
