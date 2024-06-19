import type { SVGProps } from 'react';
const CenterCircleHexagonTwoTone = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#C3C6CD"
        d="M16.125 4.875 9 .75 1.875 4.875v8.25L9 17.25l7.125-4.125zM9 12.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5"
      />
      <path
        fill="#8A8F99"
        d="M9 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5"
      />
    </svg>
  );
};
export default CenterCircleHexagonTwoTone;
