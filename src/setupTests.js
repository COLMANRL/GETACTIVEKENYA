// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// src/setupTests.js

// If you're using create-react-app, this file is automatically
// included in your test environment.

// Polyfill for IntersectionObserver
// You can install a dedicated polyfill or just mock it for tests.
// For testing, a simple mock is often sufficient if you don't
// need to test the exact behavior of the IntersectionObserver itself.

// Option 1: A minimal mock (often sufficient for tests that just need it to exist)
if (typeof window.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
    }
    observe() {
      // Do nothing, or call callback immediately if needed for specific tests
      // For example:
      // this.callback([{ isIntersecting: true, target: {} }]);
    }
    unobserve() {}
    disconnect() {}
  };
}


// Option 2: Using an actual polyfill library (more robust, but might be overkill for simple tests)
// First, install it: `npm install intersection-observer` or `yarn add intersection-observer`
// import 'intersection-observer'; // Uncomment this if you choose to use the polyfill library
