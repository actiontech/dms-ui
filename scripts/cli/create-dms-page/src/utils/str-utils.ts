export class StrUtils {
  static convertFirstLetterToLowerCase(str: string) {
    return str.replace(/^[A-Z]/, (match) => match.toLowerCase());
  }

  static convertFirstLetterToUpperCase(str: string) {
    return str.replace(/^[a-z]/, (match) => match.toUpperCase());
  }

  static camelCaseToUpperCaseSnakeCase(str: string): string {
    const firstChar = str.charAt(0).toLowerCase();
    const remainingChars = str
      .slice(1)
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase();
    return `${firstChar}${remainingChars}`.toUpperCase();
  }

  static isSvgContent(str: string): boolean {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(str, 'image/svg+xml');
      return doc.documentElement.tagName.toLowerCase() === 'svg';
    } catch (error) {
      return false;
    }
  }
}
