import type { SVGProps } from 'react';
const BookMarkTagFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#7453DA'}
        d="M3.333 1.333h9.334a.667.667 0 0 1 .666.667v12.762a.332.332 0 0 1-.51.283L8 12.02l-4.823 3.024a.333.333 0 0 1-.51-.282V2a.667.667 0 0 1 .666-.667m2 4.667v1.333h5.334V6z"
      />
    </svg>
  );
};
export default BookMarkTagFilled;
