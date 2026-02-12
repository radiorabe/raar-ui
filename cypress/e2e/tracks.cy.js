import { datePath } from "../support/helpers";

describe("Tracks", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "/api/shows?since=2018-01-01&sort=-last_broadcast_at&page%5Bsize%5D=100",
      {
        fixture: "shows/current.json",
      },
    );
  });

  it("shows running tracks in the middle of day", () => {
    const now = new Date("2019-04-15T22:55:01");
    cy.clock(now.getTime(), ["Date"]);
    cy.intercept("GET", "/api/broadcasts/2019/04/15", {
      fixture: "broadcasts/monday.json",
    });
    cy.intercept("GET", "/api/tracks/2019/04/15/21*", {
      fixture: "tracks/21.json",
    });
    cy.intercept("GET", "/api/tracks/2019/04/15/22*", {
      fixture: "tracks/22.json",
    });

    cy.visit("/");
    cy.get("h1.title").should("contain", "Montag 15. April 2019");
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
    cy.get("sd-broadcasts-date sd-running-broadcast").should("have.length", 1);
    cy.get("sd-broadcasts-date sd-running-broadcast").should(
      "contain",
      "21:00",
    );

    cy.get("sd-broadcasts-date sd-running-broadcast .title").click();
    cy.get(".tracklist li").should("have.length", 30);
  });

  it("shows running tracks at the end of yesterday", () => {
    const now = new Date("2019-04-16T03:22:01");
    cy.clock(now.getTime(), ["Date"]);
    cy.intercept("GET", "/api/broadcasts/2019/04/15", {
      fixture: "broadcasts/monday.json",
    });
    cy.intercept("GET", "/api/tracks/2019/04/15/21*", {
      fixture: "tracks/21.json",
    });
    cy.intercept("GET", "/api/tracks/2019/04/15/22*", {
      fixture: "tracks/22.json",
    });
    cy.intercept("GET", "/api/tracks/2019/04/15/23*", {
      fixture: "tracks/23.json",
    });

    cy.visit("/2019/04/15;time=2100", { failOnStatusCode: false });
    cy.get("h1.title").should("contain", "Montag 15. April 2019");
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
    cy.get("sd-broadcasts-date sd-running-broadcast").should("have.length", 1);
    cy.get("sd-broadcasts-date sd-running-broadcast").should(
      "contain",
      "21:00",
    );
    cy.url().should("include", datePath(new Date("2019-04-15")) + ";time=2100");
    cy.get(".tracklist li").should("have.length", 44);
  });

  it("shows latest tracks at the beginning of today", () => {
    const now = new Date("2019-04-15T01:45:01");
    cy.clock(now.getTime(), ["Date"]);
    cy.intercept("GET", "/api/broadcasts/2019/04/15", {
      body: {
        data: [],
      },
    });
    cy.intercept("GET", "/api/tracks/2019/04/15/00*", {
      fixture: "tracks/00.json",
    });
    cy.intercept("GET", "/api/tracks/2019/04/15/01*", {
      fixture: "tracks/01.json",
    });

    cy.visit("/");
    cy.get("h1.title").should("contain", "Montag 15. April 2019");
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 0);
    cy.get("sd-broadcasts-date sd-running-broadcast").should("have.length", 1);
    cy.get("sd-broadcasts-date sd-running-broadcast").should(
      "contain",
      "00:00",
    );

    cy.get("sd-broadcasts-date sd-running-broadcast .title").click();
    cy.url().should("include", datePath(now) + ";time=0000");
    cy.get(".tracklist li").should("have.length", 25);
  });
});
