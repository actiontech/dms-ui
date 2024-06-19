import type { SVGProps } from 'react';
const OverviewTwoTone = (props: SVGProps<SVGSVGElement>) => {
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
        d="m9.385.982 6.578 3.946a.375.375 0 0 1 0 .644L9 9.75 2.036 5.572a.375.375 0 0 1 0-.644L8.613.982a.75.75 0 0 1 .772 0"
      />
      <path
        fill="#8A8F99"
        d="m15.062 7.875.901.54a.375.375 0 0 1 0 .644L9 13.238 2.036 9.059a.375.375 0 0 1 0-.643l.901-.541L9 11.512zm0 3.525.901.54a.376.376 0 0 1 0 .644l-6.577 3.947a.75.75 0 0 1-.773 0l-6.577-3.947a.374.374 0 0 1 0-.643l.901-.541L9 15.037z"
      />
    </svg>
  );
};
export default OverviewTwoTone;
