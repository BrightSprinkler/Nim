var settings = {
  // 0 = 15
  // 1 = 30
  // 2 = 45
  gameLength: 0,
  hentaiEnabled: false,
  cbtEnabled: false,
  onlyCbtEnabled: false,
  // fuck enums, all my homies hat enums, or maps, or dictionaries
  // 0 = very easy
  // 1 = easy
  // 2 = medium
  // 3 = hard
  // 4 = very hard
  difficulty: 2,
  // 0 = guranteed
  // 1 = high
  // 2 = balanced
  // 3 = low
  // 4 = never
  orgasmChance: 2,
  autoPlayEnabled: false,
  autoPlayDifficulty: 2
};

var slideShow = {
  imagePageStack: [],
  running: false
};

var game = {
  maxMatches: 15,
  currentMatches: 15,
  currentSet: 0,
  lastMatches: 15,
  lastSet: 0,
  isPlayerTurn: true,
  wonGames: 0,
  handleTurn: function(count) {
    game.lastMatches = game.currentMatches;
    game.lastSet = game.currentSet;

    for (var i = 1; i < count + 1; i++) {
      console.info("game", "handleTurn", "removing match", i, "of", count);

      game.currentMatches -= 1;

      if (game.currentMatches % 15 === 0 && game.currentSet > 0) {
        game.currentSet -= 1;
      }
    }

    if (game.currentMatches <= 0) {
      game.currentMatches === 0;
    }

    if (game.currentMatches === 0 && game.isPlayerTurn) {
      game.wonGames += 1;
    }

    game.isPlayerTurn = !game.isPlayerTurn;

    console.log("game", "handleTurn", game);

    return game.currentMatches === 0;
  },
  getCurrentSetCurrentMatches: function () {
    return game.currentMatches - (game.currentSet * 15);
  },
  getCurrentSetLastMatches: function () {
    return game.lastMatches - (game.currentSet * 15);
  },
  getLastSetLastMatches: function () {
    return game.lastMatches - (game.lastSet * 15);
  },
  getLastSetCurrentMatches: function () {
    return game.currentMatches - (game.lastSet * 15);
  },
  getOrgasmChance: function() {
    var chance = 0;

    switch(settings.orgasmChance){
      case  0:
        chance = 100; // always
        break;
      case  1:
         chance = 50 + (game.wonGames * 25); // after 2 won games 100 %
        break;
      case  2:
         chance = 20 + (game.wonGames * 20); // after 4 won games 100 %
         break;
      case  3:
         chance = 20 + (game.wonGames * 10); // after 8 won games 100 %
         break;
      case  4:
         chance = game.wonGames; // after 100 won games 100 %
        break;
    }

    console.log("game", "getOrgasmChance", chance);
    return chance;
  }
};

var ai = {
  performPlayerTurn: function () {
    console.log("ai", "performPlayerTurn");

    return ai.performTurn(settings.autoPlayDifficulty);
  },
  performAiTurn: function () {
    console.log("ai", "performAiTurn");

    return ai.performTurn(settings.difficulty);
  },
  performTurn: function (difficulty) {
    console.log("ai", "performTurn", "difficulty:", difficulty);
    var count = 0;

    switch(difficulty){
      case  0:
        count = ai.performVeryEasyTurn();
        break;
      case  1:
         count = ai.performVeryEasyOrHardTurnByChance(75);
        break;
      case  2:
         count = ai.performVeryEasyOrHardTurnByChance(50);
         break;
      case  3:
         count = ai.performVeryEasyOrHardTurnByChance(25);
         break;
      case  4:
         count = ai.performVeryHardTurn();
        break;
    }

    return count > game.currentMatches ? game.currentMatches : count;
  },
  performVeryEasyTurn: function () {
    console.log("ai", "performVeryEasyTurn");

    return utils.getRandomInt(1, 3);
  },
  performVeryHardTurn: function () {
    console.log("ai", "performVeryHardTurn");
    
    var matches = game.currentMatches % 4;
    // if matches is 0, ai will lose if player does not missplay any further
    return matches === 0 ? ai.performVeryEasyTurn() : matches;
  },
  performVeryEasyOrHardTurnByChance: function (chanceForVeryEasy) {
    console.log("ai", "performVeryEasyOrHardTurnByChance");

    if(utils.getRandomInt(1, 100) <= chanceForVeryEasy) {
      return ai.performVeryEasyTurn();
    }

    return ai.performVeryHardTurn();
  }
};

var coin = {
  prediction: true,
  lastResult: true,
  flip: function () {
    coin.lastResult = utils.getRandomInt(1, 2) === 1;
    
    return coin.lastResult;
  }
};

var utils = {
  getRandomInt: function(min, max) {
    return Math.floor((Math.random() * max) + min);
  },
  padEnd: function(value, char, count) {
    
    // where the fk is padEnd on the string object
    for(var i = 0; i < count; i++){
      value += char;
    }

    return value;
  }
};