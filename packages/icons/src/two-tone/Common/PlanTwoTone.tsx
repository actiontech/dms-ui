import type { SVGProps } from 'react';
const PlanTwoTone = (props: SVGProps<SVGSVGElement>) => {
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
        d="M15.75 11.25v3.755a.745.745 0 0 1-.745.745H2.995a.745.745 0 0 1-.745-.745V11.25zm0-4.5H2.25V2.995c0-.411.334-.745.745-.745h12.01c.411 0 .745.334.745.745z"
      />
      <path fill="#8A8F99" d="M1.5 8.25h15v1.5h-15z" />
    </svg>
  );
};
export default PlanTwoTone;
