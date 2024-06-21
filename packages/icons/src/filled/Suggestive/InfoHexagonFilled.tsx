import type { SVGProps } from 'react';
const InfoHexagonFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#6094FC"
        d="m13.28 2.084 4.637 4.638v6.558l-4.638 4.638H6.721L2.083 13.28V6.722l4.638-4.638zM9.165 12.5v1.667h1.667V12.5zm0-6.666v5h1.667v-5z"
      />
    </svg>
  );
};
export default InfoHexagonFilled;
