import { expect, test } from 'vitest';

import { sum } from '@utils/arithmetics.js';

// Simple function to tests 
test('adds 1 + 2 to equal 3', () => {
  const result = sum(1, 2);

  expect(result).toBe(3);
});
