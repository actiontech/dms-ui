const IPV4_OCTET = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
const IPV4 = `${IPV4_OCTET}(?:\\.${IPV4_OCTET}){3}`;
const IPV4_OR_CIDR = new RegExp(`^(?:${IPV4}(?:\\/(?:3[0-2]|[12]?\\d))?)$`);

export const isValidIPv4OrCIDR = (value?: string): boolean => {
  if (!value || !value.trim()) {
    return false;
  }
  return IPV4_OR_CIDR.test(value.trim());
};
