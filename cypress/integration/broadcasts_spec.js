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
  cy.route({
    method: "GET",
    url: "/api/broadcasts/1018401629/audio_files*",
    response: "fixture:audio_files/info.json"
  });
  cy.route({
    method: "GET",
    url: "/api/tracks*",
    response: {
      data: []
    }
  });
});

describe("Broadcasts", () => {
  it("has items with denied access", () => {
    cy.visit("/");
    cy.get(".navbar-brand").should("contain", "RaBe Archiv");
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(1) h4")
      .should("contain", "23:00 - 08:00")
      .should("contain", "Klangbecken")
      .should("have.class", "access-denied");
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(2) h4")
      .should("contain", "08:00 - 11:00")
      .should("contain", "der Morgen")
      .should("have.class", "access-denied")
      .find(".glyphicon-lock")
      .should("exist");
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(3) h4")
      .should("contain", "11:00 - 11:30")
      .should("contain", "Info")
      .should("not.have.class", "access-denied")
      .find(".glyphicon-lock")
      .should("not.exist");

    cy.get("sd-broadcasts-date sd-broadcast:nth-child(2) h4").click();
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(2) .list-group-item-text")
      .should("contain", "Du hast keinen Zugriff")
      .find(".audio-links tr")
      .should("not.exist");

    cy.get("sd-broadcasts-date sd-broadcast:nth-child(2) h4").click();
    cy.get(
      "sd-broadcasts-date sd-broadcast:nth-child(2) .list-group-item-text"
    ).should("not.exist");

    cy.get("sd-broadcasts-date sd-broadcast:nth-child(3) h4").click();
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(3) .list-group-item-text")
      .should("contain", "Viele Infos von heute")
      .find(".audio-links tr")
      .should("have.length", 2);
  });
});
