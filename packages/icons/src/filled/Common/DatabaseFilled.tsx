import type { SVGProps } from 'react';
const DatabaseFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#4583FF'}
        d="M15.75 7.125v2.25c0 1.864-3.023 3.375-6.75 3.375s-6.75-1.511-6.75-3.375v-2.25C2.25 8.989 5.273 10.5 9 10.5s6.75-1.511 6.75-3.375m-13.5 3.75c0 1.864 3.023 3.375 6.75 3.375s6.75-1.511 6.75-3.375v2.25c0 1.864-3.023 3.375-6.75 3.375s-6.75-1.511-6.75-3.375zM9 9C5.273 9 2.25 7.489 2.25 5.625S5.273 2.25 9 2.25s6.75 1.511 6.75 3.375S12.727 9 9 9"
      />
    </svg>
  );
};
export default DatabaseFilled;
