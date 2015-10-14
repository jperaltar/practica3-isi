describe('PlayersService', function () {
  'use strict';

  describe('getPlayerList', function () {
    it('should ask for the players in primarily in descending score order, then in alphabetical order and return them', function () {
      var result = {};
      spyOn(Players, 'find').and.returnValue(result);

      expect(PlayersService.getPlayerList()).toBe(result);
      expect(Players.find.calls.argsFor(0)).toEqual([{}, {sort: {score: -1, name: 1}}]);
    });
  });

  describe('getPlayer', function () {
    it('should ask for the player with the given id and return it', function () {
      var playerId = 1;
      var result = {_id: playerId};
      spyOn(Players, 'findOne').and.returnValue(result);

      expect(PlayersService.getPlayer(playerId)).toBe(result);
      expect(Players.findOne.calls.argsFor(0)).toEqual([playerId]);
    });
  });

  describe('rewardPlayer', function () {
    it('should add 5 points to the player score with the given id', function () {
      var playerId = 1;
      spyOn(Players, 'update');

      PlayersService.rewardPlayer(playerId);
      expect(Players.update.calls.argsFor(0)).toEqual([playerId, {$inc: {score: 5}}]);
    });
  });

  describe('penalizePlayer', function () {
    it('should subtract 5 points to the player score with the given id', function () {
      var playerId = 1;
      spyOn(Players, 'update');

      PlayersService.penalizePlayer(playerId);
      expect(Players.update.calls.argsFor(0)).toEqual([playerId, {$inc: {score: -5}}]);
    });
  })

  describe('playersExist', function () {
    it('should return true when players exist', function () {
      var cursor = {
        count: function () {
          return 1;
        }
      };
      spyOn(Players, 'find').and.returnValue(cursor);
      expect(PlayersService.playersExist()).toBe(true);
    });

    it('should return false when no players exist', function () {
      var cursor = {
        count: function () {
          return 0;
        }
      };
      spyOn(Players, 'find').and.returnValue(cursor);
      expect(PlayersService.playersExist()).toBe(false);
    });
  });

  describe("addPlayer", function () {
    beforeEach(function(done){
      Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
        Tracker.afterFlush(done);
      });
      console.log(Meteor.userId());
    });
    afterEach(function(done){
      Meteor.logout(function() {
        Tracker.afterFlush(done);
      });
    });

    it("should add a new player to the list", function () {
      var playerName = "Barry Fooler"
      spyOn(Players, 'insert');

      PlayersService.addPlayer(playerName);
      expect(Players.insert.calls.argsFor(0)).toEqual([{name: playerName, score: 0,
                                                      createdBy: Meteor.userId()}]);
    })
  })

  describe("Player Removal", function () {
    it("should remove the selected player from the list", function () {
      var playerId = 1;
      spyOn(Players, 'remove');

      PlayersService.removePlayer(playerId);
      expect(Players.remove.calls.argsFor(0)).toEqual([{_id: playerId}]);
    })
  });
});
