// https://github.com/angryshhh/my-leetcode/blob/master/72.%E7%BC%96%E8%BE%91%E8%B7%9D%E7%A6%BB.js
export const minStringDistance = (str1, str2) => {
  let len1 = str1.length, len2 = str2.length;
  let d = [];

  for (let i = 0; i <= len1; i++) d.push([i, ...new Array(len2).fill(0)]);

  for (let i = 0; i <= len2; i++) d[0][i] = i;
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (str1[i - 1] !== str2[j - 1] ? 1 : 0)
      );
    }
  }

  return d[len1][len2];
};

const algorithms = { minStringDistance };

export default algorithms;
