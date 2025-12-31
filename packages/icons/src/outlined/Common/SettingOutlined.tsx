import type { SVGProps } from 'react';
const SettingOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13 11"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="currentColor"
        d="M.167 8.5H4.25v1.167H.167zm0-4.083h5.25v1.166H.167zm0-4.084h11.666V1.5H.167zM11.06 5.598l.674-.228.584 1.01-.535.47c.067.319.067.648 0 .967l.535.47-.584 1.01-.674-.228c-.24.216-.524.382-.837.484l-.14.697H8.917l-.14-.698a2.3 2.3 0 0 1-.837-.484l-.674.229-.583-1.01.534-.47a2.3 2.3 0 0 1 0-.967l-.534-.47.583-1.01.674.228c.24-.216.524-.382.837-.484l.14-.697h1.166l.14.697c.313.102.598.269.837.485zM9.5 8.5a1.167 1.167 0 1 0 0-2.333 1.167 1.167 0 0 0 0 2.333"
      />
    </svg>
  );
};
export default SettingOutlined;
