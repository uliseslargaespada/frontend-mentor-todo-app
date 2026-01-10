/**
 * Basic Cypress configuration for local dev.
 * Set baseUrl to your Vite dev server URL.
 */
// ES6 Syntax
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    video: false,
    screenshotOnRunFailure: true
  }
});
