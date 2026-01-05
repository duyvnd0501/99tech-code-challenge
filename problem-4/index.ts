// PROBLEM 4 : THREE FUNCTIONS
// Use Gauss formula: O(1), accurate , extrmely fast
function sumToNA(n: number): number {
    return n * (n + 1) / 2;
}
// Tail recursion - good, but JS does not optimize tail recursion. 
// Work for small n, avoid for large n due to stack overflow
function sumToNB(n: number): number {
    if (n <= 1) return n;
    return n + sumToNB(n - 1);
}

// Use traditional for loop (iterative)
function sumToNC(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}