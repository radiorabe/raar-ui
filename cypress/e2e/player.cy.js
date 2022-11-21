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
    cy.intercept(
      "GET",
      "/api/tracks?broadcast_id=1018401629&sort=started_at&page%5Bsize%5D=500",
      {
        fixture: "tracks/11.json",
      }
    );
    cy.intercept("GET", "/api/audio_files/2019/04/15/*.mp3", {
      fixture: "audio_files/silence.mp3,null",
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": "70627",
      },
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
  });

  it("plays audio at track position", () => {
    cy.visit("/");
    cy.get("sd-broadcasts-date sd-broadcast").should("have.length", 11);
    cy.get("sd-broadcasts-date sd-broadcast:nth-child(3) h4")
      .should("contain", "11:00 - 11:30")
      .should("contain", "Info");

    cy.get("sd-broadcasts-date sd-broadcast:nth-child(3) h4").click();
    cy.get(
      "sd-broadcasts-date sd-broadcast:nth-child(3) sd-tracks ul li"
    ).should("have.length", 9);

    cy.get(
      "sd-broadcasts-date sd-broadcast:nth-child(3) sd-tracks ul li:nth-child(1) a .track-info"
    ).click();
    cy.url().should("include", "/2019/04/15;play=high;format=mp3;time=110002");
    cy.get("sd-player .controls .glyphicon-pause").should("exist");
    cy.get("sd-player .time-passed").should("contain", "00:02");
    cy.get(
      "sd-broadcasts-date sd-broadcast:nth-child(3) sd-tracks ul li:nth-child(1) a"
    )
      .should("have.class", "active")
      .find(".glyphicon-play-circle")
      .should("exist");
  });
});
