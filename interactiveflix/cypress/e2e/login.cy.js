describe("Dashboard Test", () => {
  before(() => {
    cy.log("Visiting login page");
    cy.visit("http://108.142.96.145/");
    cy.log("Typing email");
    cy.get('input[name="email"]').type("rikhendrix@live.nl");
    cy.log("Typing password");
    cy.get('input[name="password"]').type(Cypress.env("react"));
    cy.log("Clicking submit button");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("should display the movie Borthers (2009)", () => {
    cy.visit("http://108.142.96.145/dashboard");
    cy.intercept("GET", "**/get/videometa").as("getVideos");
    cy.wait("@getVideos");
    cy.log("Waiting for video items to be loaded");
    cy.get(".video-item", { timeout: 10000 }).should("exist");
    cy.log("Checking for movie Borthers (2009)");
    cy.get(".video-title").contains("Borthers (2009)").should("be.visible");
  });
});
//npx cypress open
//npx cypress run --env react=
