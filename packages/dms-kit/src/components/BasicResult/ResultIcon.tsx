import { ResultProps } from 'antd';

const ResultIcon = (status: ResultProps['status']) => {
  if (status === 'error') {
    return (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 58.5C8 62.6786 22.3 66 40 66C57.7 66 72 62.6786 72 58.5C72 54.3214 57.7 51 40 51C22.2999 51 8 54.3214 8 58.5Z"
          fill="#EBEAE7"
        />
        <path
          d="M54.1761 9.19916C53.4239 8.43216 52.3947 8 51.3204 8H21C18.7909 8 17 9.79086 17 12V56C17 58.2091 18.7909 60 21 60H59C61.2091 60 63 58.2091 63 56V19.8302C63 18.7828 62.5892 17.7772 61.8558 17.0294L54.1761 9.19916Z"
          fill="#F2F1EF"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.3501 12.0001C16.3501 9.43197 18.432 7.3501 21.0001 7.3501H51.3204C52.5694 7.3501 53.7658 7.85248 54.6403 8.74413L54.1762 9.19926L54.6403 8.74413L62.3199 16.5744C63.1725 17.4437 63.6501 18.6127 63.6501 19.8303V56.0001C63.6501 58.5682 61.5682 60.6501 59.0001 60.6501H21.0001C18.432 60.6501 16.3501 58.5682 16.3501 56.0001V12.0001ZM21.0001 8.6501C19.1499 8.6501 17.6501 10.1499 17.6501 12.0001V56.0001C17.6501 57.8503 19.1499 59.3501 21.0001 59.3501H59.0001C60.8503 59.3501 62.3501 57.8503 62.3501 56.0001V19.8303C62.3501 18.9531 62.006 18.1109 61.3918 17.4846L53.7121 9.6544C53.0821 9.01203 52.2202 8.6501 51.3204 8.6501H21.0001Z"
          fill="#E6E4E3"
        />
        <path
          d="M52 12.4141C52 11.5232 53.0771 11.077 53.7071 11.707L59.2929 17.2928C59.9229 17.9228 59.4767 18.9999 58.5858 18.9999H53C52.4477 18.9999 52 18.5522 52 17.9999V12.4141Z"
          fill="white"
        />
        <path
          d="M60 42C55.0345 42 51 46.0345 51 51C51 55.9655 55.0345 60 60 60C64.9655 60 69 55.9655 69 51C69.3103 46.0345 65.2759 42 60 42Z"
          fill="#F66074"
        />
        <path
          d="M59.9998 45C60.7527 44.9945 61.5 45.6007 61.5 46.1623L61.1277 51.9757C61.1277 52.5374 60.6199 52.9979 59.9998 52.9979C59.3796 52.9979 58.8727 52.5383 58.8727 51.9757L58.5005 46.1623C58.5005 45.6007 59.0918 45.0205 59.9998 45ZM59.9998 56.9973C59.602 56.9973 59.2205 56.8392 58.9393 56.558C58.658 56.2767 58.5 55.8952 58.5 55.4975C58.5 55.0997 58.658 54.7182 58.9393 54.437C59.2205 54.1557 59.602 53.9977 59.9998 53.9977C60.3974 53.9977 60.7788 54.1557 61.0599 54.4368C61.3411 54.718 61.4991 55.0994 61.4991 55.497C61.4991 55.8947 61.3411 56.276 61.0599 56.5572C60.7788 56.8384 60.3974 56.9963 59.9998 56.9963V56.9973Z"
          fill="white"
        />
        <path
          d="M27 23C27 22.4477 27.4477 22 28 22H39C39.5523 22 40 22.4477 40 23V24C40 24.5523 39.5523 25 39 25H28C27.4477 25 27 24.5523 27 24V23Z"
          fill="white"
        />
        <path
          d="M27 32C27 31.4477 27.4477 31 28 31H52C52.5523 31 53 31.4477 53 32V33C53 33.5523 52.5523 34 52 34H28C27.4477 34 27 33.5523 27 33V32Z"
          fill="white"
        />
        <path
          d="M28 40C27.4477 40 27 40.4477 27 41V42C27 42.5523 27.4477 43 28 43H43C43.5523 43 44 42.5523 44 42V41C44 40.4477 43.5523 40 43 40H28Z"
          fill="white"
        />
      </svg>
    );
  }

  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_3998_2816)">
        <rect x="15" y="30" width="128" height="100" rx="6" fill="white" />
        <rect
          x="15.5"
          y="30.5"
          width="127"
          height="99"
          rx="5.5"
          stroke="#F2F1F0"
        />
      </g>
      <circle cx="21.5" cy="36.5" r="1.5" fill="#F66074" />
      <circle cx="27.5" cy="36.5" r="1.5" fill="#EDB054" />
      <circle cx="33.5" cy="36.5" r="1.5" fill="#1CB889" />
      <rect x="27" y="52" width="37" height="5" rx="2" fill="#EBEAE7" />
      <rect x="27" y="62" width="17" height="4" rx="2" fill="#EBEAE7" />
      <rect x="70" y="78" width="19" height="4" rx="2" fill="#F2F1EF" />
      <rect x="27" y="78" width="40" height="4" rx="2" fill="#F2F1EF" />
      <rect x="42" y="87" width="47" height="4" rx="2" fill="#F2F1EF" />
      <rect x="27" y="87" width="12" height="4" rx="2" fill="#F66074" />
      <rect x="79" y="96" width="10" height="4" rx="2" fill="#F66074" />
      <rect x="63" y="96" width="13" height="4" rx="2" fill="#F2F1EF" />
      <rect x="27" y="96" width="33" height="4" rx="2" fill="#F2F1EF" />
      <rect x="55" y="105" width="34" height="4" rx="2" fill="#F2F1EF" />
      <rect x="27" y="105" width="25" height="4" rx="2" fill="#F66074" />
      <rect x="27" y="114" width="49" height="4" rx="2" fill="#F2F1EF" />
      <rect x="99" y="48" width="32" height="72" rx="3" fill="#F7F6F4" />
      <rect
        x="103"
        y="52"
        width="24"
        height="6"
        rx="1"
        fill="white"
        stroke="#E8E7E6"
      />
      <rect
        x="103"
        y="76"
        width="24"
        height="6"
        rx="1"
        fill="white"
        stroke="#E8E7E6"
      />
      <g filter="url(#filter1_d_3998_2816)">
        <rect x="102" y="63" width="26" height="8" rx="2" fill="#4583FF" />
      </g>
      <rect
        x="103"
        y="87"
        width="24"
        height="6"
        rx="1"
        fill="white"
        stroke="#E8E7E6"
      />
      <rect
        x="103"
        y="98"
        width="24"
        height="6"
        rx="1"
        fill="white"
        stroke="#E8E7E6"
      />
      <rect
        x="103"
        y="109"
        width="24"
        height="6"
        rx="1"
        fill="white"
        stroke="#E8E7E6"
      />
      <g filter="url(#filter2_d_3998_2816)">
        <path
          d="M134 136C138.418 136 142.418 134.209 145.314 131.314C148.209 128.418 150 124.418 150 120C150 115.582 148.209 111.582 145.314 108.686C142.418 105.791 138.418 104 134 104C129.582 104 125.582 105.791 122.686 108.686C119.791 111.582 118 115.582 118 120C118 124.418 119.791 128.418 122.686 131.314C125.582 134.209 129.582 136 134 136Z"
          fill="#1CB889"
        />
      </g>
      <path
        d="M128.4 120L132.6 124.2L141 115.8"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="27"
        y="73"
        width="37"
        height="50"
        fill="url(#paint0_linear_3998_2816)"
      />
      <rect x="62" y="73" width="2" height="50" fill="#15C7D4" />
      <defs>
        <filter
          id="filter0_d_3998_2816"
          x="10"
          y="27"
          width="138"
          height="110"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.2 0 0 0 0 0.173333 0 0 0 0 0.12 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3998_2816"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3998_2816"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_3998_2816"
          x="98"
          y="60"
          width="34"
          height="16"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.270588 0 0 0 0 0.513726 0 0 0 0 1 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3998_2816"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3998_2816"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_d_3998_2816"
          x="112"
          y="100"
          width="44"
          height="44"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.109804 0 0 0 0 0.721569 0 0 0 0 0.537255 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3998_2816"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3998_2816"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_3998_2816"
          x1="64"
          y1="73"
          x2="27"
          y2="73"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1ACEDB" stopOpacity="0.3" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ResultIcon;
