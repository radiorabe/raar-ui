import { datePath } from "../support/helpers";

let today = new Date();

beforeEach(() => {
  cy.server();
  cy.route({
    method: "GET",
    url: "/api/login",
    response: "fixture:login/failed.json",
    status: 401
  });
  cy.route({
    method: "GET",
    url: "/api/shows?since=2018-01-01&sort=-last_broadcast_at&page[size]=100",
    response: "fixture:shows/current.json"
  });
  cy.route({
    method: "GET",
    url: "/api/broadcasts" + datePath(today),
    response: "fixture:broadcasts/monday.json"
  });
});

describe("Shows", () => {
  it("lists items", () => {
    cy.visit("/");
    cy.get("sd-shows .list-group-item").should("have.length", 3);
    cy.get("sd-shows .list-group-item:first-child").should(
      "have.class",
      "access-denied"
    );
    cy.get("sd-shows .list-group-item:nth-child(2)").should(
      "not.have.class",
      "access-denied"
    );
  });
});
