import type { SVGProps } from 'react';
const UserFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      width={16}
      height={16}
      {...props}
    >
      <g fill={props.color ? 'currentColor' : '#15C7D4'}>
        <path d="M4.457 4.684a2.182 2.182 0 1 1 3.087-3.086 2.182 2.182 0 0 1-3.087 3.086M10.584 9.47a3.49 3.49 0 0 0-3.492-3.492H4.909A3.49 3.49 0 0 0 1.417 9.47v.218a.873.873 0 0 0 .873.874h7.42a.873.873 0 0 0 .874-.874z" />
      </g>
    </svg>
  );
};
export default UserFilled;
