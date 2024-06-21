import type { SVGProps } from 'react';
const CheckCircleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#41BF9A"
        d="M10 18.333a8.333 8.333 0 1 1 0-16.666 8.333 8.333 0 1 1 0 16.666m-.83-5 5.89-5.892-1.177-1.178-4.714 4.714-2.357-2.358-1.179 1.179z"
      />
    </svg>
  );
};
export default CheckCircleFilled;
