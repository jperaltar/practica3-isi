var selectGraceHopper = function (callback) {
  Session.set("selected_player", Players.findOne({name: "Grace Hopper"})._id);
  if (callback) {
    Deps.afterFlush(callback);
  }
};

var unselectPlayer = function () {
  Session.set("selected_player", null);
};

describe("Selecting Grace Hopper", function () {
  beforeEach(function (done) {
    Meteor.autorun(function (c) {
      var grace = Players.findOne({name: "Grace Hopper"});
      if (grace) {
        c.stop();
        selectGraceHopper(done);
      }
    })
  });

  it("should show Grace above the give points button", function () {
    expect($("div.details > div.name").html()).toEqual("Grace Hopper");
  });


  it("should highlight Grace's name", function () {
    var parentDiv = $("span.name:contains(Grace Hopper)").parent();
    expect(parentDiv.hasClass("selected")).toBe(true);
  });
});

describe("Point Assignment", function () {
  beforeEach(function (done) {
    selectGraceHopper(done);
  });

  it("should give a player 5 points when he is selected and the button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("input.inc").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints + 5);
  });
  it("should subtract 5 points from the player score when the button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("input.sub").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints - 5)
  })
});

describe("Player Ordering", function () {
  it("should result in a list where the first player has as many or more points than the second player", function () {
    var players = PlayersService.getPlayerList().fetch();
    expect(players[0].score >= players[1].score).toBe(true);
  });
});

describe("Player Adding", function () {
  beforeEach(function(done){
    Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
      Tracker.afterFlush(done);
    });
  });
  afterEach(function(done){
    Meteor.logout(function() {
      Tracker.afterFlush(done);
    });
  });

  it("should find the new added player in the list with the current user id in the createdBy field", function () {
    var testName = "Barry Fooler";
    var userId = Meteor.userId();
    $("[name=playerName]").val(testName);
    $(".addPlayer").submit();
    expect(Players.findOne({name: testName}).name).toBe(testName);
    expect(Players.findOne({name: testName}).createdBy).toBe(userId);
  });
});

describe("Player Removal", function () {
  beforeEach(function (done) {
    selectGraceHopper(done);
  });

  it("should not find removed player in the list after removal", function () {
    $("input.remove").click();
    expect(Players.findOne({name: "Grace Hopper"})).toBeFalsy();
  })
});