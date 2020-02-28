import * as bcrypt from 'bcrypt';

export const Errors = {
  HASH_ERROR: new Error('Unable to hash the given word')
};

export interface HashStrategy {

  /**
   * Hashes the given word.
   * This function rejects with Errors.HASH_ERROR if an error occurred while hashing the given word.
   *
   * @param word the word to hash
   *
   * @return the hashed version of the given word or an error
   */
  hash(word: string): Promise<string>;

  /**
   * Checks if the given plainWord is equal to hashedWord once hashed.
   * This function rejects with Errors.HASH_ERROR if an error occurred while hashing plainWord.
   *
   * @param plainWord the plain (no hashed) password
   * @param hashedWord the hashed word to check against
   *
   * @return true if plainWord, once hashed, matches hashedPassword, else returns false.
   */
  check(plainWord: string, hashedWord: string): Promise<boolean>;
}

class BCryptHashStrategy implements HashStrategy {

  constructor(private saltRounds: number) {}

  async hash(word: string): Promise<string> {
    const bytes = [...Buffer.from(word)];

    // https://www.npmjs.com/package/bcrypt#security-issues-and-concerns
    if (bytes.length > 72) {
      console.warn(`Warning: trying to hash a word bigger than 72 bytes. ${bytes.length - 72} bytes will be ignored.`);
    }

    try {
      const hashedWord = await bcrypt.hash(word, this.saltRounds);
      return Promise.resolve(hashedWord);
    } catch (e) {
      console.error('Unable to hash a word.');
      console.error(e);
      return Promise.reject(Errors.HASH_ERROR);
    }

  }

  async check(plainWord: string, hashedWord: string): Promise<boolean> {
    try {
      const matches = await bcrypt.compare(plainWord, hashedWord);
      return Promise.resolve(matches);
    } catch (e) {
      console.error('Unable to check if two passwords matches');
      console.error(e);
      return Promise.reject(Errors.HASH_ERROR);
    }
  }

}

export const PASSWORD_HASH_STRATEGY: HashStrategy = new BCryptHashStrategy(10);
