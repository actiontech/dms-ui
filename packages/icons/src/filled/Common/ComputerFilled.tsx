import type { SVGProps } from 'react';
const ComputerFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#8A8F99"
        d="M7.5 12.2c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2v2.182a1 1 0 0 0 .553.894l.836.419a.2.2 0 0 1 .111.179v.426a.2.2 0 0 1-.2.2H6.2a.2.2 0 0 1-.2-.2v-.426a.2.2 0 0 1 .11-.18l.837-.418a1 1 0 0 0 .553-.894z"
      />
      <path
        fill="#C3C6CD"
        d="M2.5 2.25a1 1 0 0 0-1 1v9.25a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V3.25a1 1 0 0 0-1-1zm1 8.25a.5.5 0 0 0-.5.5v.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V11a.5.5 0 0 0-.5-.5z"
      />
    </svg>
  );
};
export default ComputerFilled;
