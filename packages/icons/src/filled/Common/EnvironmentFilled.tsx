import type { SVGProps } from 'react';
const EnvironmentFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#4583FF'}
        d="M512 938.667c-53.333 0-384-257.259-384-469.334s171.925-384 384-384 384 171.926 384 384-330.667 469.334-384 469.334m0-352c64.8 0 117.333-52.534 117.333-117.334S576.8 352 512 352s-117.333 52.533-117.333 117.333S447.2 586.667 512 586.667"
      />
    </svg>
  );
};
export default EnvironmentFilled;
