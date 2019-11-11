const today = new Date("2019-04-15");
const yesterday = new Date("2019-04-14");

beforeEach(() => {
  cy.clock(today.getTime(), ["Date"]);
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
    url: "/api/broadcasts/2019/04/15",
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

  /*
  adjust once full network stubbing is available
  https://github.com/cypress-io/cypress/pull/4176

  cy.fixture("audio_files/silence.mp3", "binary").as("audio");
  cy.route({
    method: "GET",
    url: "/api/audio_files/2019/04/15/110000_high.mp3",
    response: "@audio"
  });
  */
});

describe("Player", () => {
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
