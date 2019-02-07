/**
 * This algorithm was created for sdbm (a public-domain reimplementation of sdbm) 
 * database library. it was found to do well in scrambling bits, causing better 
 * distribution of the keys and fewer splits. 
 * See http://www.cse.yorku.ca/~oz/hash.html.
 *
 * Note this algorithm should work even for UCS-2 (javascript's internal code) 
 * since both of the 2 charactors will be included. The USC-2 code uses up to 2 
 * characters to represent a code point. See ucs2decode(string) from 
 * https://github.com/bestiejs/punycode.js/blob/221463da/punycode.js#L94-L128 
 */

export function sdbmHash(str: string): number {
  let hash: number = 0;
  if (str) {
    for (let i = 0; i < str.length; i++) {
      // Neither Number(char) nor unary '+' convert to number unless the 
      // char is a string version of a number. 
      // Use the charCodeAt method.

      // tslint:disable-next-line:no-bitwise
      hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    }
  }
  return hash;
}

/**
 * Translate x in input range to x in output range
 */

export function translateInRange(
  x: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number
): number {
  return (x - inputStart) / (inputEnd - inputStart) * (outputEnd - outputStart) + outputStart;
}
