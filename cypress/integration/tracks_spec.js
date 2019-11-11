import { datePath } from "../support/helpers";

beforeEach(() => {
  cy.server({ force404: true });
  cy.route({
    method: "GET",
    url: "/api/shows?since=2018-01-01&sort=-last_broadcast_at&page[size]=100",
    response: "fixture:shows/current.json"
  });
});

describe("Tracks", () => {
  it("shows running tracks in the middle of day", () => {
    const now = new Date("2019-04-15T22:55:01");
    cy.clock(now.getTime(), ["Date"]);
    cy.route({
      method: "GET",
      url: "/api/broadcasts/2019/04/15",
      response: "fixture:broadcasts/monday.json"
    });
    cy.route({
      method: "GET",
      url: "/api/tracks/2019/04/15/21*",
      response: "fixture:tracks/21.json"
    });
    cy.route({
      method: "GET",
      url: "/api/tracks/2019/04/15/22*",
      response: "fixture:tracks/22.json"
    });

    cy.visit("/");
    cy.get("h2.title").should("contain", "Montag 15. April 2019");
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
    cy.get("sd-broadcasts-date sd-running-broadcast").should("have.length", 1);
    cy.get("sd-broadcasts-date sd-running-broadcast").should(
      "contain",
      "21:00"
    );

    cy.get("sd-broadcasts-date sd-running-broadcast h4").click();
    cy.get(".tracklist li").should("have.length", 30);
  });

  it("shows running tracks at the end of yesterday", () => {
    const now = new Date("2019-04-16T03:22:01");
    cy.clock(now.getTime(), ["Date"]);
    cy.route({
      method: "GET",
      url: "/api/broadcasts/2019/04/15",
      response: "fixture:broadcasts/monday.json"
    });
    cy.route({
      method: "GET",
      url: "/api/tracks/2019/04/15/21*",
      response: "fixture:tracks/21.json"
    });
    cy.route({
      method: "GET",
      url: "/api/tracks/2019/04/15/22*",
      response: "fixture:tracks/22.json"
    });
    cy.route({
      method: "GET",
      url: "/api/tracks/2019/04/15/23*",
      response: "fixture:tracks/23.json"
    });

    cy.visit("/2019/04/15;time=2100");
    cy.get("h2.title").should("contain", "Montag 15. April 2019");
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
    cy.get("sd-broadcasts-date sd-running-broadcast").should("have.length", 1);
    cy.get("sd-broadcasts-date sd-running-broadcast").should(
      "contain",
      "21:00"
    );
    cy.url().should("include", datePath(new Date("2019-04-15")) + ";time=2100");
    cy.get(".tracklist li").should("have.length", 44);
  });

  it("shows latest tracks at the beginning of today", () => {
    const now = new Date("2019-04-15T01:45:01");
    cy.clock(now.getTime(), ["Date"]);
    cy.route({
      method: "GET",
      url: "/api/broadcasts/2019/04/15",
      response: {
        data: []
      }
    });
    cy.route({
      method: "GET",
      url: "/api/tracks/2019/04/15/00*",
      response: "fixture:tracks/00.json"
    });
    cy.route({
      method: "GET",
      url: "/api/tracks/2019/04/15/01*",
      response: "fixture:tracks/01.json"
    });

    cy.visit("/");
    cy.get("h2.title").should("contain", "Montag 15. April 2019");
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 0);
    cy.get("sd-broadcasts-date sd-running-broadcast").should("have.length", 1);
    cy.get("sd-broadcasts-date sd-running-broadcast").should(
      "contain",
      "00:00"
    );

    cy.get("sd-broadcasts-date sd-running-broadcast h4").click();
    cy.url().should("include", datePath(now) + ";time=0000");
    cy.get(".tracklist li").should("have.length", 25);
  });
});
