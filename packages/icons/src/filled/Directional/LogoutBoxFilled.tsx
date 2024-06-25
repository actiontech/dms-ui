import type { SVGProps } from 'react';
const LogoutBoxFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M3.333 1.334h9.334c.368 0 .666.298.666.666v12a.667.667 0 0 1-.666.667H3.333A.667.667 0 0 1 2.667 14V2c0-.368.298-.667.666-.667m2.667 6v-2L2.667 8 6 10.667v-2h4V7.334z"
      />
    </svg>
  );
};
export default LogoutBoxFilled;
