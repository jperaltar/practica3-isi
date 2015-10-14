describe('Collection: Players', function () {
  beforeAll(function () {
    if (!PlayersService.playersExist()) {
      PlayersService.generateRandomPlayers();
    }
  });

  it('some players are available in the collection', function () {
    expect(Players.find().count()).toBeGreaterThan(0);
  });
});
