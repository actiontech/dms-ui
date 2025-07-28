// test freezes with '5999999999999000000000000000000000000000000'
// const urlPattern = new RegExp(
//   '^(https?:\\/\\/)?' + // protocol
//     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
//     '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
//     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
//     '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
//     '(\\#[-a-z\\d_]*)?$',
//   'i',
// ); // fragment locator

export function isValidUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('http://');
}
