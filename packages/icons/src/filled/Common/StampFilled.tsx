import type { SVGProps } from 'react';
const StampFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width={16}
      height={16}
      {...props}
    >
      <path d="M8.167 5.833c0-.554.33-1.043.671-1.48a2.333 2.333 0 1 0-3.677 0c.342.437.672.926.672 1.48H2.917c-.645 0-1.167.523-1.167 1.167v2.333c0 .323.261.584.583.584h9.334a.583.583 0 0 0 .583-.584V7c0-.644-.522-1.167-1.167-1.167zM12.25 12.25v-1.167H1.75v1.167z" />
    </svg>
  );
};
export default StampFilled;
