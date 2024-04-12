function isEven(num) {
    if (num === 0 || num % 2 === 0) {
        return true
    }
    return false
}

function evenNums() {
    for (let num = 1; num <= 20; num++) {
        let numType = isEven(num) ? "Even" : "Odd"
        console.log(num, numType)
    }
}

// evenNums()

function isMultiple(base, by) {
    if (base % by === 0) {
        return true
    }
    return false
}

function sumFizzBuzz() {
    for (let num = 1; num <= 50; num++) {
        let fizzOrBuzz
        if (isMultiple(num, 3)) {
            fizzOrBuzz = "Fizz"
        } else if (isMultiple(num, 5)) {
            fizzOrBuzz = "Buzz"
        } else {
            fizzOrBuzz = "None of them"
        }
        console.log(num, fizzOrBuzz)
    }
}


function sumFizzBuzz() {
    let sum = 0
    for (let num = 1; num <= 1000; num++) {
        if (isMultiple(num, 3) || isMultiple(num, 5)) {
            sum += num
        }
    }
    console.log(`The sum of all the numbers divisible by 3 or 5 from 1 to 1000 is ${sum}`)
}

// sumFizzBuzz()

function reverseString(str) {
    let reversedStr = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversedStr += str[i];
    }
    return reversedStr;
}

// let str = "Hello World"
// console.log(`The reverse of ${str} is ${reverseString(str)}`)

// Exercise 5: Palindrome Checker
// Write a function that takes a string as input and checks if it is a palindrome
// (reads the same forwards and backwards). Return true if it is a palindrome,
// and false otherwise.

function isPalindrome(str) {
    let reversed = reverseString(str)
    if (str === reversed) {
        return true
    }
    return false
}

// let str = "radar"
// console.log(`It's ${isPalindrome(str)} that the word ${str} is a palindrome`)

// Exercise 6: Factorial
// Write a function that calculates the factorial of a given number. The factorial of
// a non-negative integer n is the product of all positive integers less than or equal
// to n. For example, the factorial of 5 (denoted as 5!) is 5 * 4 * 3 * 2 * 1 = 120.

function factorial(num) {
    let result = 1
    for (let n = num; n > 0; n--) {
        result *= n
    }
    return result
}

// console.log(factorial(5))

// Exercise 7: Prime Number Checker
// Write a function that takes a number as input and checks if it is a prime number.
// A prime number is a natural number greater than 1 that has no positive divisors
// other than 1 and itself. Return true if the number is prime, and false otherwise.

function isPrime(num) {
    if (num <= 3) {
        return false
    }
    for (let seq = num - 1; seq > 1; seq--) {
        if (num % seq === 0) {
            return false
        }
    }
    return true
}

// console.log(isPrime(147))
