describe("Player", () => {
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
      }
    );
    cy.intercept("GET", "/api/broadcasts/2019/04/15", {
      fixture: "broadcasts/monday.json",
    });
    cy.intercept("GET", "/api/broadcasts/1018401629/audio_files*", {
      fixture: "audio_files/info.json",
    });
    cy.intercept("GET", "/api/tracks*", {
      body: {
        data: [],
      },
    });
    cy.fixture("audio_files/silence.mp3", "binary").then((audio) => {
      cy.intercept("GET", "/api/audio_files/2019/04/15/110000_high.mp3", audio);
    });
  });

  it("plays audio for broadcast", () => {
    cy.visit("/");
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(3) h4")
      .should("contain", "11:00 - 11:30")
      .should("contain", "Info");

    cy.get("sd-broadcasts-date sd-broadcast:nth-child(3) h4").click();
    cy.get(
      "sd-broadcasts-date sd-broadcast:nth-child(3) .list-group-item-text .audio-links tr"
    ).should("have.length", 2);
    cy.url().should("include", "/2019/04/15;time=1100");

    cy.get("table.audio-links tr:first-child td:first-child a").click();
    cy.url().should("include", "/2019/04/15;play=high;format=mp3;time=110000");
    cy.get("sd-player .controls .glyphicon-pause").should("exist");
    cy.get(".time-total").should("contain", "30:00");
  });

  it("plays audio at track position");

  it("highlights track at current audio position");

  it("plays next broadcast when finished");
});
