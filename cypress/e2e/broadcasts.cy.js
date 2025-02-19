import { datePath } from "../support/helpers";

describe("Broadcasts", () => {
  const today = new Date("2019-04-15");
  const yesterday = new Date("2019-04-14");

  beforeEach(() => {
    cy.clock(today.getTime(), ["Date"]);
    cy.intercept("GET", "/api/login", {
      fixture: "login/failed.json",
      statusCode: 401,
    });
    cy.intercept(
      "GET",
      "/api/shows?since=2018-01-01&sort=-last_broadcast_at&page%5Bsize%5D=100",
      {
        fixture: "shows/current.json",
      },
    );
    cy.intercept("GET", "/api/broadcasts/2019/04/15", {
      fixture: "broadcasts/monday.json",
    });
    cy.intercept("GET", "/api/broadcasts/2019/04/14", {
      fixture: "broadcasts/sunday.json",
    });
    cy.intercept("GET", "/api/broadcasts/1018401629/audio_files*", {
      fixture: "audio_files/info.json",
    });
    cy.intercept("GET", "/api/tracks*", {
      body: {
        data: [],
      },
    });
  });

  it("navigates date back and forth", () => {
    cy.visit("/");
    cy.get("h2.title").should("contain", "Montag 15. April 2019");
    cy.url().should("include", datePath(today));
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
    cy.get(".dp-selected").should("contain", "15");

    cy.get(".pager > li:first-child a").click();
    cy.get("h2.title").should("contain", "Sonntag 14. April 2019");
    cy.url().should("include", datePath(yesterday));
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 13);
    cy.get(".dp-selected").should("contain", "14");

    cy.get(".pager > li:last-child a").click();
    cy.get("h2.title").should("contain", "Montag 15. April 2019");
    cy.url().should("include", datePath(today));
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
    cy.get(".dp-selected").should("contain", "15");
  });

  it("opens page for given date", () => {
    cy.visit("/2019/04/14", { failOnStatusCode: false });
    cy.get("h2.title").should("contain", "Sonntag 14. April 2019");
    cy.get(".dp-selected").should("contain", "14");
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 13);

    cy.get(".dp-current-day").click();
    cy.get("h2.title").should("contain", "Montag 15. April 2019");
    cy.url().should("include", datePath(today));
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
  });

  it("navigates over datepicker", () => {
    cy.visit("/");
    cy.intercept("GET", "/api/broadcasts/2018/10/05", {
      body: {
        data: [],
      },
    });

    cy.get(".dp-nav-header-btn").click();
    cy.get('[data-date="01-02-2019"]').should("contain", "Feb");
    cy.get(".dp-calendar-nav-left").click();
    cy.get(".dp-nav-header-btn").should("contain", "2018");
    cy.get('[data-date="01-10-2018"]').should("contain", "Okt.").click();
    cy.get('[data-date="05-10-2018"]').click();
    cy.get("h2.title").should("contain", "Freitag 5. Oktober 2018");
    cy.get("sd-broadcasts-date").should(
      "contain",
      "Keine aufgenommenen Sendungen",
    );
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 0);
    cy.get(".dp-selected").should("contain", "05");
  });

  it("opens broadcasts with and without access", () => {
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

    // der morgen
    cy.intercept("GET", "/api/tracks?broadcast_id=1018401628*", {
      fixture: "tracks/list.json",
    });
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(2) h4").click();
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(2) .list-group-item-text")
      .should("contain", "Du hast keinen Zugriff")
      .find(".audio-links tr")
      .should("not.exist");
    cy.url().should("include", datePath(today) + ";time=0800");
    cy.get(".tracklist li").should("have.length", 16);
    cy.get(".tracklist li:first-child").should("contain", "Autisti");
    cy.get(".tracklist ul.non-playable").should("exist");

    // info
    cy.intercept("GET", "/api/tracks?broadcast_id=1018401629*", {
      fixture: "tracks/list.json",
    });
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(3) h4").click();
    cy.get(
      "sd-broadcasts-date sd-broadcast:nth-child(2) .list-group-item-text",
    ).should("not.exist");
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(3) .list-group-item-text")
      .should("contain", "Viele Infos von heute")
      .find(".audio-links tr")
      .should("have.length", 2);
    cy.url().should("include", datePath(today) + ";time=1100");
    cy.get(".tracklist li").should("have.length", 16);
    cy.get(".tracklist ul.non-playable").should("not.exist");
  });

  it("reloads page after login", () => {
    cy.visit("/");
    cy.get("h2.title").should("contain", "Montag 15. April 2019");
    cy.url().should("include", datePath(today));

    cy.get(".pager > li:first-child a").click();
    cy.get("h2.title").should("contain", "Sonntag 14. April 2019");
    cy.url().should("include", datePath(yesterday));
    cy.get("sd-broadcasts-date sd-broadcast h4.access-denied").should(
      "have.length",
      12,
    );
    cy.get("sd-shows .list-group .list-group-item.access-denied").should(
      "have.length",
      2,
    );
    cy.get("sd-shows .list-group .list-group-item:not(.access-denied)").should(
      "have.length",
      1,
    );

    // Login
    cy.get(".navbar-nav.navbar-right li a").contains("Login").click();
    cy.get("sd-login form .btn-primary").click();
    cy.get("sd-login .alert-danger").should("exist");

    cy.intercept("GET", "/api/login", {
      fixture: "login/access-code.json",
    });
    cy.intercept("GET", "/api/broadcasts" + datePath(yesterday), {
      fixture: "broadcasts/sunday-access.json",
    });
    cy.intercept(
      "GET",
      "/api/shows?since=2018-01-01&sort=-last_broadcast_at&page%5Bsize%5D=100",
      {
        fixture: "shows/current-access.json",
      },
    );

    cy.get("sd-login form input[name=accessCode]").type("1337dead");
    cy.get("sd-login form .btn-primary").click();

    cy.get("h2.title").should("contain", "Sonntag 14. April 2019");
    cy.get("sd-broadcasts-date sd-broadcast h4.access-denied").should(
      "have.length",
      0,
    );
    cy.get("sd-broadcasts-date sd-broadcast h4:not(.access-denied)").should(
      "have.length",
      13,
    );
    cy.get("sd-shows .list-group .list-group-item.access-denied").should(
      "have.length",
      0,
    );
    cy.get("sd-shows .list-group .list-group-item:not(.access-denied)").should(
      "have.length",
      3,
    );

    // Logout
    cy.intercept(
      "GET",
      "/sso/redirect?logout=http://localhost:4200" + datePath(yesterday),
      (req) => {
        req.redirect(datePath(yesterday));
      },
    );
    cy.intercept("GET", "/api/broadcasts" + datePath(yesterday), {
      fixture: "broadcasts/sunday.json",
    });
    cy.intercept(
      "GET",
      "/api/shows?since=2018-01-01&sort=-last_broadcast_at&page%5Bsize%5D=100",
      {
        fixture: "shows/current.json",
      },
    );

    cy.get(".navbar-nav.navbar-right li a").contains("Logout").click();

    cy.get("h2.title").should("contain", "Sonntag 14. April 2019");
    cy.get("sd-broadcasts-date sd-broadcast h4.access-denied").should(
      "have.length",
      12,
    );
    cy.get("sd-broadcasts-date sd-broadcast h4:not(.access-denied)").should(
      "have.length",
      1,
    );
    cy.get("sd-shows .list-group .list-group-item.access-denied").should(
      "have.length",
      2,
    );
    cy.get("sd-shows .list-group .list-group-item:not(.access-denied)").should(
      "have.length",
      1,
    );
  });

  it("searches broadcasts", () => {
    cy.intercept("GET", "/api/broadcasts?q=tru&sort=-started_at", {
      fixture: "broadcasts/query-tru.json",
    });
    cy.intercept("GET", "/api/broadcasts?q=true&sort=-started_at", {
      body: {
        data: [],
      },
    });

    cy.visit("/");
    cy.get("#search_query").type("tru");
    cy.get("h2.title").should("contain", "Suchresultate für «tru»");
    cy.url().should("include", "/search/tru");
    cy.get("sd-broadcast").should("have.length", 6);
    cy.get("h3.title").should("have.length", 4);

    cy.get("#search_query").type("e");
    cy.get("h2.title").should("contain", "Suchresultate für «true»");
    cy.url().should("include", "/search/true");
    cy.get(".content").should(
      "contain",
      "Für diesen Begriff konnten keine Resultate gefunden werden",
    );

    cy.get("sd-search .form-search .glyphicon-remove").click();
    cy.get("h2.title").should("contain", "Montag 15. April 2019");
    cy.url().should("include", datePath(today));
    cy.get("#search_query").should("have.value", "");
  });
});
