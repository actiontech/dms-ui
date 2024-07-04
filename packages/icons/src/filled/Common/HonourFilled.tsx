import type { SVGProps } from 'react';
const HonourFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 14 14"
      {...props}
    >
      <path d="M12.25 2.333v8.588a.29.29 0 0 1-.174.267L7 13.434l-5.076-2.246a.29.29 0 0 1-.174-.268V2.333H.583V1.167h12.834v1.166zM4.667 7v1.167h4.666V7zm0-2.333v1.166h4.666V4.667z" />
    </svg>
  );
};
export default HonourFilled;
