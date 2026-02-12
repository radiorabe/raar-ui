describe("Broadcasts for show", () => {
  const today = new Date("2019-04-15");

  beforeEach(() => {
    cy.clock(today.getTime(), ["Date"]);
    cy.intercept("GET", "/api/login", {
      fixture: "login/failed.json",
      statusCode: 401,
    });
    cy.intercept("GET", "/api/shows/415164569", {
      fixture: "shows/klangbecken.json",
    });
    cy.intercept(
      "GET",
      "/api/shows?since=2018-01-01&sort=-last_broadcast_at&page%5Bsize%5D=100",
      {
        fixture: "shows/current.json",
      },
    );
    cy.intercept("GET", "/api/broadcasts?show_id=415164569&sort=-started_at", {
      fixture: "broadcasts/klangbecken-1.json",
    });
    cy.intercept(
      "GET",
      "/api/broadcasts?page%5Bnumber%5D=2&page%5Bsize%5D=50&show_id=415164569&sort=-started_at",
      {
        fixture: "broadcasts/klangbecken-2.json",
      },
    );
  });

  it("finds shows on type", () => {
    cy.intercept("GET", "/api/broadcasts/2019/04/15", {
      fixture: "broadcasts/monday.json",
    });
    cy.intercept("GET", "/api/shows?q=klang&sort=name", {
      fixture: "shows/query-klang.json",
    });

    cy.visit("/");
    cy.get("sd-shows .list-group .list-group-item").should("have.length", 3);

    cy.get("#show_query").type("klang");
    cy.get("sd-shows .list-group .list-group-item").should("have.length", 2);

    cy.get("sd-shows .list-group .list-group-item:first-child").click();
    cy.get("sd-shows .list-group .list-group-item.active").should(
      "contain",
      "Klangbecken",
    );
    cy.get("h1.title").should("contain", "Klangbecken");
    cy.url().should("include", "/show/415164569-klangbecken");

    cy.get(
      "sd-shows > .form-search > .form-control-feedback > .glyphicon-remove",
    ).click();
    cy.get("#show_query").should("have.value", "");
    cy.get("sd-shows .list-group .list-group-item").should("have.length", 3);
    cy.get("sd-shows .list-group .list-group-item.active").should(
      "contain",
      "Klangbecken",
    );
  });

  it("loads more results on scroll", () => {
    cy.visit("/show/415164569-klangbecken", { failOnStatusCode: false });
    cy.get("h1.title").should("contain", "Klangbecken");
    cy.get(".details").should("contain", "Musig ohni Gschnurr");
    cy.get("sd-shows a.list-group-item.active").should(
      "contain",
      "Klangbecken",
    );

    cy.get("[infinite-scroll] div:nth-child(1) > h2.title").should(
      "contain",
      "Februar 2019",
    );
    cy.get("[infinite-scroll] div:nth-child(1) .list-group-item").should(
      "have.length",
      1,
    );
    cy.get("[infinite-scroll] div:nth-child(2) > h2.title").should(
      "contain",
      "März 2016",
    );
    cy.get("[infinite-scroll] div:nth-child(2) .list-group-item").should(
      "have.length",
      50,
    );
    cy.get("[infinite-scroll] div:nth-child(3) > h2.title").should(
      "contain",
      "Februar 2016",
    );
    cy.get("[infinite-scroll] div:nth-child(3) .list-group-item").should(
      "have.length",
      20,
    );

    cy.scrollTo(0, 500);
    cy.get("[infinite-scroll] div:nth-child(3) .list-group-item").should(
      "have.length",
      20,
    );

    cy.scrollTo("bottom");
    cy.get("[infinite-scroll] div:nth-child(3) .list-group-item").should(
      "have.length",
      67,
    );
    cy.get("[infinite-scroll] div:nth-child(4) > h2.title").should(
      "contain",
      "Januar 2016",
    );
  });
});
