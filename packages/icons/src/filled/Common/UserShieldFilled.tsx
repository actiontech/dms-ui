import type { SVGProps } from 'react';
const UserShieldFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M2.522 1.884 8 .667l5.478 1.217a.67.67 0 0 1 .522.65v6.659a4 4 0 0 1-1.781 3.328L8 15.333l-4.219-2.812A4 4 0 0 1 2 9.193V2.535a.67.67 0 0 1 .522-.65M8 7.334A1.667 1.667 0 1 0 8 4a1.667 1.667 0 0 0 0 3.333m-2.982 3.333h5.964a3 3 0 0 0-5.964 0"
      />
    </svg>
  );
};
export default UserShieldFilled;
