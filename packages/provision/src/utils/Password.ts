class Password {
  private capitalLetter = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ];

  private lowercaseLetter = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ];

  private number = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  private specialChar = ['@', '#', '$', '%', '^', '*', '+', '-', '=', '_'];

  /**
   * generate random number between [min, max]
   * @param min the minimal number of random
   * @param max the maximum number of random
   */
  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * generate n Numbers equal to target (Line segmentation)
   * @param n the number of generate
   * @param target the sum of generate number
   */
  private randomNumberSumEqualTarget(n: number, target: number): number[] {
    if (n > target) {
      throw new Error(
        'Password: randomNumberSumEqualTarget: n must smaller than target'
      );
    }
    const result = new Set<number>();
    while (result.size < n - 1) {
      result.add(this.randomNumber(1, target - 1));
    }
    const resultArray = Array.from(result)
      .sort((a, b) => a - b)
      .concat([0]);
    return resultArray.map((e, i, a) => {
      if (i === a.length - 1) {
        return target - a[i - 1];
      } else if (i === 0) {
        return e;
      }
      return a[i] - a[i - 1];
    });
  }

  /**
   * shuffle any array
   * @param array shuffle array
   */
  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = this.randomNumber(0, i);
      const temp = array[randomIndex];
      array[randomIndex] = array[i];
      array[i] = temp;
    }
    return array;
  }

  /**
   * generate random string by characterSet and the length equal n
   * @param n the length of generate
   * @param characterSet generate string from this set
   * @param canDuplicate result can duplicate when this params is true, default is false
   */
  private randomString(
    n: number,
    characterSet: string[],
    canDuplicate = false
  ): string {
    if (!canDuplicate && n > characterSet.length) {
      throw new Error(
        'Password: randomString: n must small than length of characterSet when canDuplicate is false'
      );
    }
    const characterSetCurrent = characterSet.slice();
    let result = '';
    for (let i = 0; i < n; i++) {
      const currentIndex = this.randomNumber(0, characterSetCurrent.length - 1);
      result += characterSetCurrent[currentIndex];
      if (!canDuplicate) {
        characterSetCurrent.splice(currentIndex, 1);
      }
    }
    return result;
  }

  /**
   * maybe someday will delete this method.
   * use a hexadecimal number generate the random string length of 4.
   */
  private s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  public generateMySQLPassword(length: number): string {
    const digits = this.randomNumberSumEqualTarget(4, length);
    let result = '';
    const characterSet = [
      this.capitalLetter,
      this.lowercaseLetter,
      this.number,
      this.specialChar
    ];
    digits.forEach((e, i) => {
      result += this.randomString(e, characterSet[i], true);
    });
    return this.shuffle<string>(result.split('')).join('');
  }

  public generateGUID(): string {
    return (
      this.s4() +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      this.s4() +
      this.s4()
    );
  }

  public generateMysqlInstanceId(): string {
    const digits = this.randomNumberSumEqualTarget(2, 6);
    let result = '';
    const characterSet = [this.lowercaseLetter, this.number];
    digits.forEach((e, i) => {
      result += this.randomString(e, characterSet[i], true);
    });
    return this.shuffle<string>(result.split('')).join('');
  }

  public generateRedisInstanceId(): string {
    return this.generateMysqlInstanceId();
  }

  public generateMysqlServerId(): string {
    return Math.ceil(Math.random() * Math.pow(2, 31)).toString();
  }

  public generateOBClusterId(): string {
    return `ob-cluster-${this.generateMysqlInstanceId()}`;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Password();
