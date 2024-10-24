// todo 无法覆盖中文以及特殊字符
export function compress(input: string): string {
  const dictionary: { [key: string]: number } = {};
  const result: number[] = [];
  let dictSize = 256;

  // 初始化字典
  for (let i = 0; i < 256; i++) {
    dictionary[String.fromCharCode(i)] = i;
  }

  let current = '';
  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);
    const combined = current + char;

    // eslint-disable-next-line no-prototype-builtins
    if (dictionary.hasOwnProperty(combined)) {
      current = combined;
    } else {
      result.push(dictionary[current]);
      dictionary[combined] = dictSize++;
      current = char;
    }
  }

  if (current !== '') {
    result.push(dictionary[current]);
  }

  // 将数字数组转换为 URL 安全的字符串
  return encodeNumbers(result);
}

// LZW 解压缩算法
export function decompress(compressed: string): string {
  // 将 URL 安全的字符串转换回数字数组
  const input = decodeNumbers(compressed);

  const dictionary: string[] = [];
  let dictSize = 256;

  // 初始化字典
  for (let i = 0; i < 256; i++) {
    dictionary[i] = String.fromCharCode(i);
  }

  let result = '';
  let word = dictionary[input[0]];
  result += word;

  for (let i = 1; i < input.length; i++) {
    const entry = input[i];
    let sequence: string;

    if (entry >= dictionary.length) {
      sequence = word + word.charAt(0);
    } else {
      sequence = dictionary[entry];
    }

    result += sequence;
    dictionary[dictSize++] = word + sequence.charAt(0);
    word = sequence;
  }

  return result;
}

// 辅助函数：将数字数组编码为 URL 安全的字符串
function encodeNumbers(numbers: number[]): string {
  // 将数字转换为二进制字符串
  const binaryStr = numbers
    .map((num) => {
      let bin = num.toString(2);
      while (bin.length < 16) bin = '0' + bin; // 使用 16 位表示每个数字
      return bin;
    })
    .join('');

  // 将二进制字符串按 6 位分组并转换为 Base64URL
  const base64Chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';

  for (let i = 0; i < binaryStr.length; i += 6) {
    let chunk = binaryStr.slice(i, i + 6);
    while (chunk.length < 6) chunk += '0'; // 补齐最后一组
    result += base64Chars[parseInt(chunk, 2)];
  }

  return result;
}

// 辅助函数：将 URL 安全的字符串解码回数字数组
function decodeNumbers(encoded: string): number[] {
  const base64Chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

  // 将 Base64URL 转换回二进制字符串
  let binaryStr = '';
  for (let i = 0; i < encoded.length; i++) {
    const value = base64Chars.indexOf(encoded[i]);
    let binary = value.toString(2);
    while (binary.length < 6) binary = '0' + binary;
    binaryStr += binary;
  }

  // 将二进制字符串按 16 位分组并转换为数字
  const numbers: number[] = [];
  for (let i = 0; i < binaryStr.length; i += 16) {
    const chunk = binaryStr.slice(i, i + 16);
    if (chunk.length === 16) {
      // 忽略不完整的最后一组
      numbers.push(parseInt(chunk, 2));
    }
  }

  return numbers;
}

export function compressData<T>(data: T): string {
  const jsonStr = JSON.stringify(data);
  return compress(jsonStr);
}

export function decompressData<T>(compressed: string): T {
  const jsonStr = decompress(compressed);
  return JSON.parse(jsonStr);
}
