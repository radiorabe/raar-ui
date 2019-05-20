import { datePath } from "../support/helpers";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const WEEKDAYS = {
  "0": "Sonntag",
  "1": "Montag",
  "2": "Dienstag",
  "3": "Mittwoch",
  "4": "Donnerstag",
  "5": "Freitag",
  "6": "Samstag"
};

beforeEach(() => {
  cy.server({ force404: true });
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
    url: "/api/broadcasts" + datePath(yesterday),
    response: "fixture:broadcasts/sunday.json"
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
  it("navigates back and forth", () => {
    cy.visit("/");
    cy.get("h2.title").should("contain", WEEKDAYS[today.getDay()]);
    cy.url().should("include", datePath(today));
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);

    cy.get(".pager > li:first-child a").click();
    cy.get("h2.title").should("contain", WEEKDAYS[yesterday.getDay()]);
    cy.url().should("include", datePath(yesterday));
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 13);

    cy.get(".pager > li:last-child a").click();
    cy.get("h2.title").should("contain", WEEKDAYS[today.getDay()]);
    cy.url().should("include", datePath(today));
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
  });

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

    // because fixtures contain a different date, the url time query param
    // is not set correctly.
    // cy.url().should('include', datePath(today) + ';time=0800')

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

  it("reloads page after login", () => {
    cy.visit("/");
    cy.get("h2.title").should("contain", WEEKDAYS[today.getDay()]);
    cy.url().should("include", datePath(today));

    cy.get(".pager > li:first-child a").click();
    cy.get("h2.title").should("contain", WEEKDAYS[yesterday.getDay()]);
    cy.url().should("include", datePath(yesterday));
    cy.get("sd-broadcasts-date sd-broadcast h4.access-denied").should(
      "have.length",
      12
    );
    cy.get("sd-shows .list-group .list-group-item.access-denied").should(
      "have.length",
      2
    );
    cy.get("sd-shows .list-group .list-group-item:not(.access-denied)").should(
      "have.length",
      1
    );

    // Login
    cy.get(".navbar-nav.navbar-right li:first-child a").click();
    cy.get("sd-login form .btn-primary").click();
    cy.get("sd-login .alert-danger").should("exist");

    cy.route({
      method: "GET",
      url: "/api/login",
      response: "fixture:login/access-code.json"
    });
    cy.route({
      method: "GET",
      url: "/api/broadcasts" + datePath(yesterday),
      response: "fixture:broadcasts/sunday-access.json"
    });
    cy.route({
      method: "GET",
      url: "/api/shows?since=2018-01-01&sort=-last_broadcast_at&page[size]=100",
      response: "fixture:shows/current-access.json"
    });

    cy.get("sd-login form input[name=accessCode]").type("1337dead");
    cy.get("sd-login form .btn-primary").click();

    cy.get("h2.title").should("contain", WEEKDAYS[yesterday.getDay()]);
    cy.get("sd-broadcasts-date sd-broadcast h4.access-denied").should(
      "have.length",
      0
    );
    cy.get("sd-broadcasts-date sd-broadcast h4:not(.access-denied)").should(
      "have.length",
      13
    );
    cy.get("sd-shows .list-group .list-group-item.access-denied").should(
      "have.length",
      0
    );
    cy.get("sd-shows .list-group .list-group-item:not(.access-denied)").should(
      "have.length",
      3
    );

    // Logout
    cy.route({
      method: "GET",
      url: "/api/broadcasts" + datePath(yesterday),
      response: "fixture:broadcasts/sunday.json"
    });
    cy.route({
      method: "GET",
      url: "/api/shows?since=2018-01-01&sort=-last_broadcast_at&page[size]=100",
      response: "fixture:shows/current.json"
    });

    cy.get(".navbar-nav.navbar-right li:first-child a").click();

    cy.get("h2.title").should("contain", WEEKDAYS[yesterday.getDay()]);
    cy.get("sd-broadcasts-date sd-broadcast h4.access-denied").should(
      "have.length",
      12
    );
    cy.get("sd-broadcasts-date sd-broadcast h4:not(.access-denied)").should(
      "have.length",
      1
    );
    cy.get("sd-shows .list-group .list-group-item.access-denied").should(
      "have.length",
      2
    );
    cy.get("sd-shows .list-group .list-group-item:not(.access-denied)").should(
      "have.length",
      1
    );
  });
});
