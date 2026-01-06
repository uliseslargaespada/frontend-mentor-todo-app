// Simple addition test
export function sum(a, b) {
  return a + b;
}

// Simple subtraction test
export function subtract(a, b) {
  return a - b;
}

// Simple multiplication test
export function multiply(a, b) {
  return a * b;
}

// Simple division test
export function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed.");
  }
  return a / b;
}
