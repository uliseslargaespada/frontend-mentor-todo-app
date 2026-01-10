/**
 * E2E demo with cy.intercept to stub Supabase REST calls.
 *
 * This keeps the test deterministic and avoids relying on real Supabase state.
 * It also demonstrates how Cypress can test behavior end-to-end in the browser.
 */
import { describe, it, cy } from "cypress";

describe("Tasks app (stubbed Supabase)", () => {
  it("loads tasks, adds a task, and toggles theme", () => {
    // 1) Stub initial GET tasks
    cy.intercept("GET", "**/rest/v1/tasks*", {
      statusCode: 200,
      body: [{ id: 1, title: "Seed Task", is_complete: false }]
    }).as("getTasks");

    // 2) Stub INSERT
    cy.intercept("POST", "**/rest/v1/tasks*", {
      statusCode: 201,
      body: [{ id: 2, title: "Cypress Task", is_complete: false }]
    }).as("createTask");

    // 3) Stub UPDATE / DELETE (keep it simple)
    cy.intercept("PATCH", "**/rest/v1/tasks*", { statusCode: 204, body: {} }).as("updateTask");
    cy.intercept("DELETE", "**/rest/v1/tasks*", { statusCode: 204, body: {} }).as("deleteTask");

    cy.visit("/");

    cy.wait("@getTasks");
    cy.contains("Seed Task").should("exist");

    // Add task: adjust selectors to your UI
    cy.get('input[aria-label="Task title"]').type("Cypress Task");
    cy.contains("button", /^Add$/i).click();

    cy.wait("@createTask");
    cy.contains("Cypress Task").should("exist");

    // Theme toggle is in Header
    cy.contains("button", /Change to Light Mode|Change to Dark Mode/i).click();

    // Your ThemeProvider toggles "dark" class on <html>
    cy.get("html").should("have.class", "dark");
  });
});