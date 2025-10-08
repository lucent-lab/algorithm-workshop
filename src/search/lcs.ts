export interface LCSOptions {
  a: string;
  b: string;
}

export interface LCSResult {
  length: number;
  sequence: string;
}

export interface DiffOp {
  type: 'equal' | 'insert' | 'delete';
  value: string;
}

export function longestCommonSubsequence(options: LCSOptions): LCSResult {
  const { a, b } = options;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = a.length;
  let j = b.length;
  const result: string[] = [];
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.push(a[i - 1]);
      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  return { length: dp[a.length][b.length], sequence: result.reverse().join('') };
}

export function diffStrings(options: LCSOptions): DiffOp[] {
  const { a, b } = options;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));

  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      ops.push({ type: 'equal', value: a[i] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'delete', value: a[i] });
      i += 1;
    } else {
      ops.push({ type: 'insert', value: b[j] });
      j += 1;
    }
  }
  while (i < a.length) {
    ops.push({ type: 'delete', value: a[i] });
    i += 1;
  }
  while (j < b.length) {
    ops.push({ type: 'insert', value: b[j] });
    j += 1;
  }

  return ops;
}

