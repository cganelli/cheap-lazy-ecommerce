import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { vi } from 'vitest';

// Mock next/link to avoid internal state updates warnings in tests.
vi.mock('next/link', async () => {
  const mod = await import('@/test/mocks/next-link');
  return { default: mod.default, __esModule: true };
});
