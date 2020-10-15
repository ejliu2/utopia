/******************************************************************************
 * Icons
******************************************************************************/
const emoji_icons = {
    'fish': '🐟',
    'harbour': '⚓',
    'fishing_boat': '⛵',
    'fishing': '🎣',
    'pirate_ship': '‍🏴‍☠️',
    'gun_boat': '🚤',
    'farm': '🌽',
    'house': '🏠',
    'stadium': '🏟️',
    'boom': '💥',
    'rain_cloud': '🌧️',
    'construction': '🏗️',
}

/******************************************************************************
 * Constants and Variables
******************************************************************************/
let tile_colour = {'water': 'blue', 'land': 'green', 'rain': 'yellow', 'harbour': 'purple', 'fish': 'lightBlue', 'highlight': 'orange'};
let build_times = {'fishing_boat': 2, 'farm': 2, 'house': 2, 'stadium': 2, 'gun_boat': 2};
let build_costs = {'fishing_boat': 50, 'farm': 50, 'house': 50, 'stadium': 50, 'gun_boat': 50};
let build_collapse = {'farm': 25, 'house': 25, 'stadium': 25};
let movespeed = {'fishing_boat': 5, 'gun_boat': 7, 'pirate_ship': 7};
let events_chance = {'earthquake': 2, 'pirate_ship': 20};
let alive = true;
let curr_turn = 1;
let max_turns = 50;
let info_grid = createGameGrid(world_grid);
let score = 0;
let curr_food = 2;  // start with some extra food
let step_for_pop = 5;
let curr_step = 1;
let food_gather_rate = 2;
let curr_gold = 100; // start with some gold
let curr_pop = 0; // start with zero population
let curr_happiness = 0;
let rain_cloud_spawn_chance = 20;
let fish_spawn_chance = 2;
let pirate_ship_spawn_chance = 2;

/******************************************************************************
 * Water Constants and Variables
******************************************************************************/
let fish_icon = {
    'current': emoji_icons.fish,
    getIcon: function() {
        return this.current;
    },
    setIcon: function(type) {
        switch (type) {
            case 'fish':
                this.current = emoji_icons.fish;
                break;
            default:
                this.current = emoji_icons.fish;
        }
    }
}
class Fish {
    constructor(index) {
        this.icon = Object.create(fish_icon);
        this.index = index;
    }
}
//let fish = {'icon': Object.create(fish_icon), 'index': -1};
let fishes = [];


let harbour_icon = {
    'current': emoji_icons.harbour,
    getIcon: function() {
        return this.current;
    },
    setIcon: function(type) {
        switch (type) {
            case 'harbour':
                this.current = emoji_icons.harbour;
                break;
            case 'consturction':
                this.current = emoji_icons.construction;
                break;
            default:
                this.current = emoji_icons.harbour;
        }
    }
}
class Harbour {
    constructor(index) {
        this.icon = Object.create(harbour_icon);
        this.prod_queue = [];
        this.prod_types = [];
        this.index = index;
    }
}
//let harbour = {'icon': Object.create(harbour_icon), 'prod_queue': ''}; // currently queue length of 1 only
let harbours = [];

let fishing_boat_icon = {
    'current': emoji_icons.construction,
    getIcon: function() {
        return this.current;
    },
    setIcon: function(type) {
        switch (type) {
            case 'fishing':
                this.current = emoji_icons.fishing;
                break;
            case 'fishing_boat':
                this.current = emoji_icons.fishing_boat;
                break;
            case 'construction':
                this.current = emoji_icons.construction;
                break;
            default:
                this.current = emoji_icons.fishing_boat;
        }
    },
};
let fishing_boat_move = {
    'move_remain': movespeed.fishing_boat,
    'max_move': movespeed.fishing_boat,
    getMove: function() {
        return this.move_remain;
    },
    restoreMaxMove: function() {
        this.move_remain = this.max_move;
    },
    setMove: function(amount) {
        if (amount <= this.move_remain) {
            this.move_remain -= amount;
        }
    },
};
let build_fishing_boat = {
    'cost': build_costs.fishing_boat,
    'start_turn': null,
    'end_turn': null,
    'build_time': build_times.fishing_boat,
    getCost: function() {
        return this.cost;
    },
    getStartTurn: function() {
        return this.start_turn;
    },
    getEndTurn: function() {
        return this.end_turn;
    },
    isConstructing: function(turn) {
        if (this.start_turn != null && this.end_turn != null) {
            return turn < this.end_turn;
        }
        return false;
    },
    setEndTurn: function() {
        if (this.start_turn != null) {
            this.end_turn = this.start_turn + this.build_time;
        }
    },
    setStartTurn: function(turn) {
        this.start_turn = turn;
        this.setEndTurn();
    },
}
class FishingBoat {
    constructor (index) {
        this.icon = Object.create(fishing_boat_icon);
        this.build = Object.create(build_fishing_boat);
        this.index = index;
        this.move = Object.create(fishing_boat_move);
        this.alive = true;
    }
}
//let fishing_boat = {'icon': Object.create(fishing_boat_icon), 'build': Object.create(build_fishing_boat), 'index': -1, 'move': Object.create(fishing_boat_move), 'alive': true};
let fishing_boats = [];

let pirate_ship_icon = {
    'current': emoji_icons.pirate_ship,
    getIcon: function() {
        return this.current;
    },
    setIcon: function(type) {
        switch (type) {
            case 'pirate_ship':
                this.current = emoji_icons.pirate_ship;
                break;
            case 'boom':
                this.current = emoji_icons.boom;
                break;
            default:
                this.current = emoji_icons.pirate_ship;
        }
    },
};
let pirate_ship_move = {
    'move_remain': movespeed.pirate_ship,
    'max_move': movespeed.pirate_ship,
    getMove: function() {
        return this.move_remain;
    },
    setMove: function(amount) {
        if (amount <= move_remain) {
            move_remain -= amount;
        }
    },
};
class PirateShip {
    constructor(index) {
        this.icon = Object.create(pirate_ship_icon);
        this.index = index;
        this.alive = true;
        this.move = Object.create(pirate_ship_move);
    }
}
//let pirate_ship = {'icon': Object.create(pirate_ship_icon), 'index:': -1, 'alive': true, 'move': Object.create(pirate_ship_move)}
let pirate_ships = [];

let gun_boat_icon = {
    'current': emoji_icons.construction,
    getIcon: function() {
        return this.current;
    },
    setIcon: function(type) {
        switch (type) {
            case 'pirate_ship':
                this.current = emoji_icons.gun_boat;
                break;
            case 'boom':
                this.current = emoji_icons.boom;
                break;
            case 'construction':
                this.current = emoji_icons.construction;
                break;
            default:
                this.current = emoji_icons.gun_boat;
        }
    },
};
let gun_boat_move = {
    'move_remain': movespeed.gun_boat,
    'max_move': movespeed.gun_boat,
    getMove: function() {
        return this.move_remain;
    },
    restoreMaxMove: function() {
        this.move_remain = this.max_move;
    },
    setMove: function(amount) {
        if (amount <= this.move_remain) {
            this.move_remain -= amount;
        }
    },
};
let build_gun_boat = {
    'cost': build_costs.gun_boat,
    'start_turn': null,
    'end_turn': null,
    'build_time': build_times.gun_boat,
    getCost: function() {
        return this.cost;
    },
    getStartTurn: function() {
        return this.start_turn;
    },
    getEndTurn: function() {
        return this.end_turn;
    },
    isConstructing: function(turn) {
        if (this.start_turn != null && this.end_turn != null) {
            return turn < this.end_turn;
        }
        return false;
    },
    setEndTurn: function() {
        if (this.start_turn != null) {
            this.end_turn = this.start_turn + this.build_time;
        }
    },
    setStartTurn: function(turn) {
        this.start_turn = turn;
        this.setEndTurn();
    },
}
class GunBoat {
    constructor(index) {
        this.icon = Object.create(gun_boat_icon);
        this.build = Object.create(build_gun_boat);
        this.index = index;
        this.alive = true;
        this.move = Object.create(gun_boat_move);
    }
}
//let gun_boat = {'icon': Object.create(gun_boat_icon), 'build': Object.create(build_gun_boat), 'index': -1, 'alive': true, 'move': Object.create(gun_boat_move)};
let gun_boats = [];

/******************************************************************************
 * Land Constants and Variables
******************************************************************************/
let farm_icon = {
    'current': emoji_icons.construction,
    getIcon: function() {
        return this.current;
    },
    setIcon: function(type) {
        switch (type) {
            case 'farm':
                this.current = emoji_icons.farm;
                break;
            case 'rain':
                this.current = emoji_icons.rain_cloud;
                break;
            case 'construction':
                this.current = emoji_icons.construction;
                break;
            case 'collapse':
                this.current = emoji_icons.boom;
                break;
            default:
                this.current = emoji_icons.farm;
        }
    },
};
let build_farm = {
    'cost': build_costs.farm,
    'start_turn': null,
    'end_turn': null,
    'build_time': build_times.farm,
    'collapse_chance': build_collapse.farm,
    getCost: function() {
        return this.cost;
    },
    getStartTurn: function() {
        return this.start_turn;
    },
    getEndTurn: function() {
        return this.end_turn;
    },
    getCollapseChance: function() {
        return this.collapse_chance;
    },
    isConstructing: function(turn) {
        if (this.start_turn != null && this.end_turn != null) {
            return turn < this.end_turn;
        }
        return false;
    },
    setEndTurn: function() {
        if (this.start_turn != null) {
            this.end_turn = this.start_turn + this.build_time;
        }
    },
    setStartTurn: function(turn) {
        this.start_turn = turn;
        this.setEndTurn();
    },
}
class Farm {
    constructor(index) {
        this.icon = Object.create(farm_icon);
        this.build = Object.create(build_farm);
        this.index = index;
        this.alive = true;
    }
}
//let farm = {'icon': Object.create(farm_icon), 'build': Object.create(build_farm), 'index': null, 'alive': true};
let farms = [];

class RainCloud{
    constructor(index) {
        this.index = index;
        this.alive = true;
    }
}
//let rain_cloud = {'index': -1, 'alive': true};
let rain_clouds = [];

let house_icon = {
    'current': emoji_icons.construction,
    getIcon: function() {
        return this.current;
    },
    setIcon: function(type) {
        switch (type) {
            case 'house':
                this.current = emoji_icons.house;
                break;
            case 'boom':
                this.current = emoji_icons.boom;
                break;
            case 'construction':
                this.current = emoji_icons.construction;
                break;
            case 'collapse':
                this.current = emoji_icons.boom;
                break;
            default:
                this.current = emoji_icons.house;
        }
    },
};
let build_house = {
    'cost': build_costs.house,
    'start_turn': null,
    'end_turn': null,
    'build_time': build_times.house,
    'collapse_chance': build_collapse.house,
    getCost: function() {
        return this.cost;
    },
    getStartTurn: function() {
        return this.start_turn;
    },
    getEndTurn: function() {
        return this.end_turn;
    },
    isConstructing: function(turn) {
        if (this.start_turn != null && this.end_turn != null) {
            return turn < this.end_turn;
        }
        return false;
    },
    getCollapseChance: function() {
        return this.collapse_chance;
    },
    setEndTurn: function() {
        if (this.start_turn != null) {
            this.end_turn = this.start_turn + this.build_time;
        }
    },
    setStartTurn: function(turn) {
        this.start_turn = turn;
        this.setEndTurn();
    },
}
class House {
    constructor(index) {
        this.icon = Object.create(house_icon);
        this.build = Object.create(build_house);
        this.index = index;
        this.alive = true;
    }
}
//let house = {'icon': Object.create(house_icon), 'build': Object.create(build_house), 'index': -1, 'alive': true};
let houses = [];

let stadium_icon = {
    'current': emoji_icons.construction,
    getIcon: function() {
        return this.current;
    },
    setIcon: function(type) {
        switch (type) {
            case 'stadium':
                this.current = emoji_icons.stadium;
                break;
            case 'boom':
                this.current = emoji_icons.boom;
                break;
            case 'construction':
                this.current = emoji_icons.construction;
                break;
            case 'collapse':
                this.current = emoji_icons.boom;
                break;
            default:
                this.current = emoji_icons.stadium;
        }
    },
};
let build_stadium = {
    'cost': build_costs.stadium,
    'start_turn': null,
    'end_turn': null,
    'build_time': build_times.stadium,
    'collapse_chance': build_collapse.stadium,
    getCost: function() {
        return this.cost;
    },
    getStartTurn: function() {
        return this.start_turn;
    },
    getEndTurn: function() {
        return this.end_turn;
    },
    getCollapseChance: function() {
        return this.collapse_chance;
    },
    isConstructing: function(turn) {
        if (this.start_turn != null && this.end_turn != null) {
            return turn < this.end_turn;
        }
        return false;
    },
    setEndTurn: function() {
        if (this.start_turn != null) {
            this.end_turn = this.start_turn + this.build_time;
        }
    },
    setStartTurn: function(turn) {
        this.start_turn = turn;
        this.setEndTurn();
    },
}
class Stadium {
    constructor(index) {
        this.icon = Object.create(stadium_icon);
        this.build = Object.create(build_stadium);
        this.index = index;
        this.alive = true;
    }
}
//let stadium = {'icon': Object.create(stadium_icon), 'build': Object.create(build_stadium), 'index': -1, 'alive': true};
let stadiums = [];

/******************************************************************************
 * Gameplay Constants and Variables
******************************************************************************/

// This object is meant to flag which of the buttons was pressed to represent
// which building or item that the users wants to build
let build_flags = {
    'farm': false,
    'house': false,
    'stadium': false,
    'fishing_boat': false,
    'gun_boat': false,
};

function getBuildFlag() {
    if (build_flags.farm) return 'farm';
    else if (build_flags.house) return 'house';
    else if (build_flags.stadium) return 'stadium';
    else if (build_flags.fishing_boat) return 'fishing_boat';
    else if (build_flags.gun_boat) return 'gun_boat';
    else return '';
}

function setBuildFlag(build) {
    build_flags.farm = false;
    build_flags.house = false;
    build_flags.stadium = false;
    build_flags.fishing_boat = false;
    build_flags.gun_boat = false;
    switch (build) {
        case 'farm':
            console.log("farm");
            build_flags.farm = true;
            if (boat_to_be_moved.getBoatToBeMoved() !== null) boat_to_be_moved.setBoatToBeMoved(null, '', -1); //  clear boat flag if set
            break;
        case 'house':
            console.log("house");
            build_flags.house = true;
            if (boat_to_be_moved.getBoatToBeMoved() !== null) boat_to_be_moved.setBoatToBeMoved(null, '', -1); //  clear boat flag if set
            break;
        case 'stadium':
            console.log("stadium");
            build_flags.stadium = true;
            if (boat_to_be_moved.getBoatToBeMoved() !== null) boat_to_be_moved.setBoatToBeMoved(null, '', -1); //  clear boat flag if set
            break;
        case 'fishing_boat':
            console.log("fishing_boat");
            build_flags.fishing_boat = true;
            if (boat_to_be_moved.getBoatToBeMoved() !== null) boat_to_be_moved.setBoatToBeMoved(null, '', -1); //  clear boat flag if set
            break;
        case 'gun_boat':
            console.log("gun_boat");
            if (boat_to_be_moved.getBoatToBeMoved() !== null) boat_to_be_moved.setBoatToBeMoved(null, '', -1); //  clear boat flag if set
            build_flags.gun_boat = true;
            break;
        case '':
            console.log("reset build flag");
            break;
        default:
            console.log("Setting the build flags - Something went wrong!");
    }
}

let move_tiles = [];
function revealMoveTiles(origin, move_amount) {
    [originX, originY] = convertToCoordinates(origin);
    for (let i = 0; i < info_grid.length; i++) {
        [destinationX, destinationY] = convertToCoordinates(i);
        let x = Math.abs(originX - destinationX);
        let y = Math.abs(originY - destinationY);
        if (destinationX >= originX - move_amount && destinationX <= originX + move_amount && destinationY >= originY - move_amount && destinationY <= originY + move_amount) {
            if (pathfinder(originX, originY, destinationX, destinationY, move_amount) >= 0 && info_grid[i].type === 'water') {
                let tile = createCellQueryID(destinationX, destinationY);
                document.querySelector(tile).style.backgroundColor = tile_colour.highlight;
                move_tiles.push(i);
            }
        }
        if (i === 127) {
            console.log("originX:", originX);
            console.log("destinationX:", destinationX);
            console.log("originY:", originY);
            console.log("destinationY:", destinationY);
            console.log("move_amount:", move_amount);
            console.log(createSubGrid(originX, originY, destinationX, destinationY, move_amount));
        }
        if (i === 194) {
            console.log("originX:", originX);
            console.log("destinationX:", destinationX);
            console.log("originY:", originY);
            console.log("destinationY:", destinationY);
            console.log("move_amount:", move_amount);
            console.log(createSubGrid(originX, originY, destinationX, destinationY, move_amount));
        }
    }
}

function hideMoveTiles() {
    move_tiles.forEach(function(item, arr_index, array) {
        [x, y] = convertToCoordinates(item);
        let tile = createCellQueryID(x, y);
        document.querySelector(tile).style.backgroundColor = tile_colour.water;
        fishes.some(function(fish, fish_index, array) {
            if (fish.index == item) {
                document.querySelector(tile).style.backgroundColor = tile_colour.fish;
            }
            return fish.index == item;
        });
    })
}

let boat_to_be_moved = {
    'index': -1,
    'current': null,
    'type': '',
    getBoatType: function() {
        return this.type;
    },
    getBoatToBeMoved: function() {
        return this.current;
    },
    setBoatToBeMoved: function(boat, name, index) {
        if (boat !== null) {
            switch (name) {
                case 'fishing_boat':
                    this.current = boat;
                    this.type = name;
                    this.index = index;
                    if (getBuildFlag() !== '') setBuildFlag('');  // clear build flag if set
                    break;
                case 'gun_boat':
                    this.current = boat;
                    this.type = name;
                    this.index = index;
                    if (getBuildFlag() !== '') setBuildFlag('');  // clear build flag if set
                    break;
                case '':
                    this.current = null;
                    this.type = '';
                    this.index = index;
                    hideMoveTiles();
                    break;
                default:
                    console.log("Problem occurred at setBoatToBeMoved");
            }
        }
        else {
            this.current = null;
            this.type = '';
            this.index = index;
            hideMoveTiles();
        }
    }
};

/******************************************************************************
 * Game Logic
******************************************************************************/

// Create a game grid to represent the world
function createGameGrid(tiles) {
    let arr = new Array(num_of_rows*num_of_cols);
    for (let i = 0; i < num_of_rows*num_of_cols; i++) {
        let value = '';
        if (tiles[i] == 0) {
            value = 'water';
        } else if (tiles[i] == 1) {
            value = 'land';
        } else {
            value = 'harbour';
        }
        arr[i] = {index: i, row: Math.floor(i/num_of_rows), col: i%num_of_cols, type: value, occupied: false, weather: 'none'};
    }
    return arr;
}

// Create Fishes on the game world
function spawnFish() {
    for (let i = 0; i < info_grid.length; i++) {
        let tile = info_grid[i];
        if (tile.type === 'water') {
            if (getRandomInt(100) < fish_spawn_chance) {
                let new_fish = new Fish(i);
                // if fish spawns under fishing boat then change that fishing boats icon to fishing
                let boat = null;
                let boat_type = '';
                let id = createCellQueryID(tile.row, tile.col);
                fishing_boats.some(function(item, arr_index, array) {
                    [x, y] = convertToCoordinates(item.index);
                    if (item.index === i) {
                        boat = item;
                        boat_type = 'fishing_boat';
                    }
                    return item.index === i;
                });
                gun_boats.some(function(item, arr_index, array) {
                    [x, y] = convertToCoordinates(item.index);
                    if (item.index === i) {
                        boat = item;
                        boat_type = 'gun_boat';
                    }
                    return item.index === i;
                });
                gun_boats.some(function(item, arr_index, array) {
                    [x, y] = convertToCoordinates(item.index);
                    if (item.index === i) {
                        boat = item;
                        boat_type = 'pirate_ship';
                    }
                    return item.index === i;
                });
                // if there is a boat and if it is a fishing boat then set it to fishing
                if (boat !== null) {
                    if (boat_type = 'fishing_boat') {
                        boat.icon.setIcon('fishing');
                        document.querySelector(id).textContent = boat.icon.getIcon();
                    }
                }
                else {
                    document.querySelector(id).textContent = new_fish.icon.getIcon();
                }
                document.querySelector(id).style.backgroundColor = tile_colour.fish;
                fishes.push(new_fish);
            }
        }
    }
}

// Remove Fishes in the game world
// This function must run before spawnFish()
function despawnFish() {
    fishes.forEach(function(item, arr_index, array) {
        // if fish despawns under fishing boat then revert the fishing boat back to regular fishing boat icon
        [x, y] = convertToCoordinates(item.index);
        let tile = createCellQueryID(x, y);
        let boat = null;
        let boat_type = '';
        fishing_boats.some(function(boat_item, boat_arr_index, boat_array) {
            if (item.index === boat_item.index) {
                boat = boat_item;
                boat_type = 'fishing_boat';
            }
            return item.index === boat_item.index;
        })
        if (boat !== null) {
            boat.icon.setIcon('fishing_boat');
            document.querySelector(tile).textContent = boat.icon.getIcon();
        }
        else {
            document.querySelector(tile).textContent = '';
        }

        document.querySelector(tile).style.backgroundColor = tile_colour.water;
    });
    fishes = [];
}

// Count how much food
function gatherFood() {
    fishes.forEach(function(fish, fish_arr_index, array){
        let being_fished = fishing_boats.some(function(fishing_boat, arr_index, array) {
            if (fishing_boat.index === fish.index) {
                return true;
            }
        });
        if (being_fished) {
            curr_food += food_gather_rate;
        }
    });
}

// If there is enough food, then increase pop,
// If there is not enough food, then stay the same,
// If there is too little food, then decrease pop.
// This function should run AFTER gatherFood();
function updatePopulation() {
    curr_food -= curr_pop + 1;
    if (curr_food < 0) gameOver();
    let next_step = Math.floor(curr_food / step_for_pop);
    if (curr_step > next_step) {
        curr_pop--;
        curr_step--;
    }
    if (curr_pop < houses.length) {
        if (next_step > curr_step) {
            curr_pop++;
            curr_step++;
        }
    }
    document.querySelector('#next_population').innerHTML = "Next Population at Food: " + ((curr_step + 1) * step_for_pop);
    document.querySelector('#food').innerHTML = "Food: " + (curr_food.toString());
    document.querySelector('#population').innerHTML = "Population: " + (curr_pop.toString());
}

// Happiness
function updateHappiness() {
    let num_of_stadiums = 0;
    stadiums.forEach(function(item, arr_index, array) {
        if (item.build.getEndTurn() <= curr_turn) {
            num_of_stadiums++;
        }
    })
    curr_happiness = num_of_stadiums - curr_pop;
    document.querySelector('#happiness').innerHTML = "Happiness: " + curr_happiness.toString();
}

function updateScore() {
    score += curr_pop * curr_happiness;
    document.querySelector('#score').innerHTML = "Score: " + score.toString();
}

// Spawn rain clouds (only spawns directly on top of farms at this time)
function spawnRainClouds() {
    farms.forEach(function(item, index, array) {
        if (getRandomInt(100) < rain_cloud_spawn_chance && !item.build.isConstructing(curr_turn) && item.alive) {
            let tile = getQuerySelector(item);
            item.icon.setIcon('rain');
            tile.style.backgroundColor = tile_colour.rain;
            tile.textContent = item.icon.getIcon();
            let new_rain_cloud = new RainCloud(item.index);
            rain_clouds.push(new_rain_cloud);
        }
    });
}

// Despawn rain clouds
function despawnRainClouds() {
    farms.forEach(function(item, index, array) {
        if (!item.build.isConstructing(curr_turn)) {
            let tile = getQuerySelector(item);
            tile.style.backgroundColor = tile_colour.land;
            item.icon.setIcon('farm');
            tile.textContent = item.icon.getIcon();
        }
    });
    rain_clouds = [];
}

// Count how much money
function generateIncome() {
    despawnRainClouds();
    spawnRainClouds();
    farms.forEach(function(item, index, array) {
        if (item.icon.getIcon() == emoji_icons.rain_cloud) {
            curr_gold += 50;
            document.querySelector('#gold').innerHTML = "Gold: " + curr_gold;
        }
    });
    return;
}

// Refresh all icons on the screen
function updateIcons() {
    farms.forEach(function(item, index, array) {
        // change each objects icon if end turn is met
        if (item.build.getEndTurn() === curr_turn) {
            item.icon.setIcon('farm');
            tile = getQuerySelector(item);
            tile.textContent = item.icon.getIcon();
        }
    });
    houses.forEach(function(item, index, array) {
        // change each objects icon if end turn is met
        if (item.build.getEndTurn() === curr_turn) {
            item.icon.setIcon('house');
            tile = getQuerySelector(item);
            tile.textContent = item.icon.getIcon();
        }
    });
    stadiums.forEach(function(item, index, array) {
        // change each objects icon if end turn is met
        if (item.build.getEndTurn() === curr_turn) {
            item.icon.setIcon('stadium');
            tile = getQuerySelector(item);
            tile.textContent = item.icon.getIcon();
        }
    });
    fishing_boats.forEach(function(item, index, array) {
        // change each objects icon if end turn is met
        if (item.build.getEndTurn() === curr_turn) {
            item.icon.setIcon('fishing_boat');
            tile = getQuerySelector(item);
            tile.textContent = item.icon.getIcon();
        }
    });
    gun_boats.forEach(function(item, index, array) {
        // change each objects icon if end turn is met
        if (item.build.getEndTurn() === curr_turn) {
            item.icon.setIcon('gun_boat');
            tile = getQuerySelector(item);
            tile.textContent = item.icon.getIcon();
        }
    });
}

function updateBoatMove() {
    fishing_boats.forEach(function(item, index, array) {
        item.move.setMove(item.move.restoreMaxMove());
    });
    gun_boats.forEach(function(item, index, array) {
        item.move.setMove(item.move.restoreMaxMove());
    });
}

function clearFlags() {
    setBuildFlag('');
    boat_to_be_moved.setBoatToBeMoved(null,'',-1);
}

// Earthquake can destroy buildings
function triggerEarthquake() {
    let indices_of_destroyed_farms = [];
    farms.forEach(function(item, arr_index, array) {
        if (getRandomInt(100) < item.build.getCollapseChance()) {
            item.icons.setIcon('collapse');
            let tile = getQuerySelector(item);
            tile.textContent = item.icons.getIcon();
            tile.occupied = false;
            indices_of_destroyed_farms.push(arr_index);
        }
    });
    indices_of_destroyed_farms.forEach(function(item, arr_index, array) {
        farms.splice(item, 1);
    });

    let indices_of_destroyed_houses = [];
    houses.forEach(function(item, arr_index, array) {
        if (getRandomInt(100) < item.build.getCollapseChance()) {
            item.icons.setIcon('collapse');
            let tile = getQuerySelector(item);
            tile.textContent = item.icons.getIcon();
            tile.occupied = false;
            indices_of_destroyed_houses.push(arr_index);
        }
    });
    indices_of_destroyed_houses.forEach(function(item, arr_index, array) {
        houses.splice(item, 1);
    });

    let indices_of_destroyed_stadiums = [];
    stadiums.forEach(function(item, arr_index, array) {
        if (getRandomInt(100) < item.build.getCollapseChance()) {
            item.icons.setIcon('collapse');
            let tile = getQuerySelector(item);
            tile.textContent = item.icons.getIcon();
            tile.occupied = false;
            indices_of_destroyed_stadiums.push(arr_index);
        }
    });
    indices_of_destroyed_stadiums.forEach(function(item, arr_index, array) {
        farms.splice(item, 1);
    });
    document.querySelector('#annoucements').style.display="block";
}

function spawnPirateShip() {
    let spawned = false;
    let new_pirate_ship = null;
    while (!spawned) {
        for (let i = 0; i < num_of_rows*num_of_cols; i++) {
            if (info_grid[i].type === 'water') {
                if (getRandomInt(100) < pirate_ship_spawn_chance) {
                    new_pirate_ship = new PirateShip(i);
                    pirate_ships.push(new_pirate_ship);
                    [x, y] = convertToCoordinates(i);
                    let id = createCellQueryID(x, y);
                    let index_of_fishing_boat_to_be_destroyed = -1;
                    fishing_ships.some(function(item, arr_index, array) {
                        if (i === item.index) {
                            index_of_fishing_boat_to_be_destroyed = arr_index;
                        }
                    });
                    if (index_of_fishing_boat_to_be_destroyed >= 0) {
                        fishing_boats.splice(index_of_fishing_boat_to_be_destroyed, 1);
                    }
                    document.querySelector(id).textContent = new_pirate_ship.icon.getIcon();
                    spawned = true;
                }
            }
        }
    }
}

// Update method
function update() {
    // clean up end of turn things
    gatherFood();
    updatePopulation();
    despawnFish();
    spawnFish();
    updateIcons();
    generateIncome();
    updateHappiness();
    updateScore();
    document.querySelector('#annoucements').style.display="none";
    // start next turn things
    updateBoatMove();
    clearFlags();
    if (getRandomInt(100) < events_chance.earthquake) {triggerEarthquake()};
    if (curr_turn >= 10) {
        if (getRandomInt(100) < events_chance.pirate_ship) {spawnPirateShip()};
    }
    // if (pirate_ships.length > 0) {movePirateShips()}; // if this is commented, then not implemented yet.
    curr_turn++;
    document.querySelector('#turn').innerHTML = "Turn: " + curr_turn;
    if (curr_turn > max_turns) {
        gameOver();
    }
}

/******************************************************************************
 * Utility Functions
******************************************************************************/
// Create a cell id based on its location in the grid
function createCellID(i, j) {
    return 'tile-' + i + '-' + j;
}

// Covert row and column to index in grid
function convertToIndex(i, j) {
    return i * num_of_rows + j;
}

// Convert index to row and column
function convertToCoordinates(i) {
    let x = Math.floor(i / num_of_rows);
    let y = i % num_of_rows;
    return [x, y];
}

// return the item requested from the query selector
function getQuerySelector(tile) {
    let [x, y] = convertToCoordinates(tile.index);
    let id = createCellQueryID(x, y);
    return document.querySelector(id);
}

// Returns an ID that can be used in querySelector
function createCellQueryID(i, j) {
    return '#' + createCellID(i, j);
}

// Random chance
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Game Over
function gameOver() {
    alive = false;
    document.querySelector('#lost').style.display="block";
    return;
}

/******************************************************************************
 * On Loading Initialization
******************************************************************************/
window.addEventListener('load', function () {
    document.querySelector('#lost').style.display = 'none';

    let grid = document.createElement('table');
    let row;
    let tile;
    for (let i = 0; i < num_of_rows; i++) {
        row = document.createElement('tr');
        for (let j = 0; j < num_of_cols; j++) {
            tile = document.createElement('td');
            tile.id = createCellID(i, j);
            let index = convertToIndex(i, j);
            switch (info_grid[index].type) {
                case 'water':
                    tile.style.backgroundColor = tile_colour.water;
                    break;
                case 'land':
                    tile.style.backgroundColor = tile_colour.land;
                    break;
                case 'harbour':
                    tile.style.backgroundColor = tile_colour.harbour;
                    tile.textContent = emoji_icons.fishing_boat;  // player starts with one fishing boat
                    new_harbour = new Harbour(index);
                    harbours.push(new_harbour);
                    break;
                default:
                    print("something went wrong at colouring the background grid");
            }
            row.appendChild(tile);
            addCellListener(tile, i, j);
        }
        grid.append(row);
    }
    document.querySelector('#field').appendChild(grid); // add game grid
    spawnFish();
    starting_fishing_boat = new FishingBoat(harbours[0].index);
    starting_fishing_boat.build.start_turn = 0;
    starting_fishing_boat.build.end_turn = 1;
    harbours[0].prod_queue = [starting_fishing_boat];
    harbours[0].prod_types = ['fishing_boat'];
    fishing_boats.push(starting_fishing_boat);
});

/******************************************************************************
 * Game Grid Initialization
******************************************************************************/
// Add Event Listeners to each individual cell in the game
function addCellListener(tile, i, j) {
    tile.addEventListener('click', function(event) {
        if (!alive) return;
        let index = convertToIndex(i, j);
        let game_tile = info_grid[index];
        console.log("BuildFlag =", getBuildFlag());
        if (game_tile.type === 'land') {  // player is going to click a tile to build a building
            if (!game_tile.occupied) {
                console.log("event listener - going to build building");
                buildLand(getBuildFlag(), index);
            }
            else {
                console.log("event listener - NOT going to build building");
                // player is not going to build a building or misclick, do nothing
            }
            setBuildFlag('');  // clear the build flag regardless of what happens, player should re-click build if they want to build
            boat_to_be_moved.setBoatToBeMoved(null, '', index);
        }
        else if (game_tile.type === 'water') {  // player is going to pick a boat or move a boat
            let boat = null;
            let boat_type = '';
            // check if a boat already exists on this tile
            fishing_boats.forEach(function (item , arr_index, array) {
                if (item.index === index) {
                    console.log(item);
                    boat = item;
                    boat_type = 'fishing_boat';
                }
            });
            gun_boats.forEach(function(item, arr_index, array) {
                if (item.index === index) {
                    console.log(item);
                    boat = item;
                    boat_type = 'gun_boat';
                }
            });
            console.log(boat_to_be_moved.getBoatToBeMoved());
            if (boat_to_be_moved.getBoatToBeMoved() === null && boat === null) {
                console.log("event listener - there is no boat to be moved and no existing boat");
                // there is no boat on the tile and no boat to be moved, do nothing
            }
            // check if there is boat that has been selected to move
            // if there hasn't and there is boat in the tile, then that is the boat to be selected to move
            else if (boat_to_be_moved.getBoatToBeMoved() === null && boat !== null) {
                console.log("event listener - choosing boat to be moved");
                boat_to_be_moved.setBoatToBeMoved(boat, boat_type, index);
                revealMoveTiles(boat_to_be_moved.index, boat_to_be_moved.getBoatToBeMoved().move.getMove());
            }
            // if there is a boat already picked, then we are moving that boat to this tile that has been clicked as long as nothing is already here
            else {
                console.log("event listener - attempting to move boat");
                if (boat === null) {
                    console.log("event listener - attempting to move boat - no collision");
                    let move_remain = boat_to_be_moved.getBoatToBeMoved().move.getMove();
                    console.log("move_remain: ", move_remain);
                    let result = checkDistance(boat_to_be_moved.getBoatToBeMoved().index, index, move_remain);
                    console.log("checkDistance: ", result);
                    if (result >= 0) {
                        console.log("event listener - attempting to move boat - within movement area");
                        // change the movement remaining in the boat and move the boat to this selected tile
                        // if it was moved from harbour, reset the harbour and icon
                        if (harbours[0].prod_queue.length > 0 && boat_to_be_moved.getBoatToBeMoved().index === harbours[0].index) {
                            console.log("event listener - moving boat from harbour");
                            harbours[0].prod_queue = [];
                            harbours[0].prod_types = [];
                            let harbour_tile = getQuerySelector(harbours[0]);
                            harbours[0].icon.setIcon('harbour');
                            harbour_tile.textContent = harbours[0].icon.getIcon();
                        }
                        // if moving from other water tile, reset that water tile to nothing or fishes
                        else {
                            console.log("event listener - moving boat from water");
                            let old_tile = getQuerySelector(boat_to_be_moved.getBoatToBeMoved());
                            old_tile.textContent = '';
                            console.log(boat_to_be_moved);
                            fishes.some(function (item, arr_index, array) {
                                if (boat_to_be_moved.index === item.index) {
                                    console.log("replacing fish in old tile");
                                    old_tile.textContent = item.icon.getIcon();
                                }
                                return boat_to_be_moved.index === index;
                            });
                        }
                        // if we are moving a fishing boat then change then boat icon to fishing if landing on fish else change to boat
                        // if landing on pirate ship, then be destroyed
                        if (boat_to_be_moved.getBoatType() === 'fishing_boat') {
                            console.log("moving fishing_boat");
                            if (!fishes.some(function (item, arr_index, array) {
                                console.log(index);
                                console.log(item);
                                if (index === item.index) {
                                    console.log("change icon to fishing");
                                    boat_to_be_moved.getBoatToBeMoved().icon.setIcon('fishing');
                                }
                                return index === item.index;
                            })) {
                                boat_to_be_moved.getBoatToBeMoved().icon.setIcon('fishing_boat');
                            }
                            if (pirate_ships.some(function(item, arr_index, array) {
                                return index === item.index;
                            })) {
                                let index_of_fishing_boat_to_be_destroyed = -1;
                                fishing_boats.some(function(item, arr_index, array) {
                                    index_of_fishing_boat_to_be_destroyed = arr_index;
                                })
                                fishing_boats.splice(index_of_fishing_boat_to_be_destroyed, 1);
                            }
                        }
                        // if we are moving a gun boat then destroy a pirate ship if it lands on it
                        if (boat_to_be_moved.getBoatType() === 'gun_boat') {
                            console.log("moving gun_boat");
                            let index_of_destroyed_pirate_ship = -1;
                            pirate_ships.some(function (item, arr_index, array) {
                                if (index === item.index) {
                                    index_of_destroyed_pirate_ship = arr_index;
                                }
                                return index === item.index
                            });
                            if (index_of_destroyed_pirate_ship >= 0) {
                                pirate_ships.splice(index_of_destroyed_pirate_ship, 1);
                            }
                        }
                        boat_to_be_moved.getBoatToBeMoved().move.setMove(move_remain - result);
                        boat_to_be_moved.getBoatToBeMoved().index = index;
                        hideMoveTiles();
                        tile.textContent = boat_to_be_moved.getBoatToBeMoved().icon.getIcon();
                    }
                }
                boat_to_be_moved.setBoatToBeMoved(null, '', -1);  // clear the boat to be moved regardless of movement
            }
            setBuildFlag('');
        }
        else if (game_tile.type === 'harbour') {
            if (getBuildFlag() === 'fishing_boat' || getBuildFlag() === 'gun_boat') {  // player is going to build a fishing fishing_boat
                buildBoat(getBuildFlag(), index);
                console.log("build boat");
            }
            else if (harbours[0].prod_queue.length > 0 && harbours[0].prod_queue[0].build.getEndTurn() <= curr_turn) {  // player is going to move a completed boat
                boat_to_be_moved.setBoatToBeMoved(harbours[0].prod_queue[0], harbours[0].prod_types[0], harbours[0].index);
                revealMoveTiles(boat_to_be_moved.index, boat_to_be_moved.getBoatToBeMoved().move.getMove());
                console.log(boat_to_be_moved.getBoatToBeMoved());
                console.log("move boat");
            }
            else {  // there is no boat or boat is under construction, do nothing

            }
            setBuildFlag('');
        }
        else {
            // some error
        }
    });
}

/******************************************************************************
 * Game Grid Initialization (Land Utility Functions)
******************************************************************************/
function buildLand(flag, index) {
    switch (flag) {
        case 'farm':
            buildFarm(index);
            break;
        case 'house':
            buildHouse(index);
            break;
        case 'stadium':
            buildStadium(index);
            break;
        default:
            console.log("Something went wrong at addCellListener trying to build land building");
    }
}

function buildFarm(index) {
    btb = new Farm(index); // building to build
    if (checkAndUpdateMap(btb, index)) {
        farms.push(btb);
    }
}

function buildHouse(index) {
    btb = new House(index); // building to build
    if (checkAndUpdateMap(btb, index)) {
        houses.push(btb);
    }
}

function buildStadium(index) {
    btb = new Stadium(index); // building to build
    if (checkAndUpdateMap(btb, index)) {
        stadiums.push(btb);
    }
}

function checkAndUpdateMap(building, index) {
    if (curr_gold >= building.build.getCost()) {
        curr_gold -= building.build.getCost();
        document.querySelector('#gold').innerHTML = "Gold: " + curr_gold;
        info_grid[index].occupied = true;
        building.build.setStartTurn(curr_turn);
        building.build.setEndTurn();
        let tile = getQuerySelector(building);
        tile.textContent = building.icon.getIcon();
        building.index = index;
        return true;
    }
    return false;
}

/******************************************************************************
 * Game Grid Initialization (Water Utility Functions)
******************************************************************************/

// function to create a smaller subgrid between the origin and destination
function createSubGrid(originX, originY, destinationX, destinationY, limit) {
    if (Math.abs(destinationX - originX) > limit) return [];
    if (Math.abs(destinationY - originY) > limit) return [];

    let startX = originX;
    let startY = originY;
    let endX = destinationX;
    let endY = destinationY;
    if (originX > destinationX) {
        let temp = startX;
        startX = endX;
        endX = temp;
    }
    if (originY > destinationY) {
        let temp = startY;
        startY = endY;
        endY = temp;
    }
    let sub_grid = [];
    let sub_sub_grid = [];
    if (startX <= endX && startY <= endY) {
        for (let i = 0; i < info_grid.length; i++) {
            [x, y] = convertToCoordinates(i);
            if (x >= startX && x <= endX && y >= startY && y <= endY) {
                if (info_grid[i].type === 'water') {
                    sub_sub_grid.push({'index': i, 'cost': 1});
                }
                else if (info_grid[i].type === 'harbour') {
                    sub_sub_grid.push({'index': i, 'cost': 1});
                }
                else {
                    sub_sub_grid.push({'index': i, 'cost': 10000});
                }
            }
            if (sub_sub_grid.length === endY - startY + 1) {
                sub_grid.push(sub_sub_grid);
                sub_sub_grid = [];
            }
        }
    }

    return sub_grid;
}

// function that takes a subgrid and calculates the path to the destination
function pathfinder(originX, originY, destinationX, destinationY, limit) {
    let sub_grid = createSubGrid(originX, originY, destinationX, destinationY, limit);
    if (sub_grid.length > 0) {
        let height = sub_grid.length;
        let width = sub_grid[0].length;
        let solution_grid = Array.from(Array(height), () => new Array(width));
        solution_grid[0][0] = {'index': sub_grid[0][0].index, 'cost': 0};
        for (let i = 1; i < width; i++) {
            solution_grid[0][i] = {'index': sub_grid[0][i].index, 'cost': sub_grid[0][i].cost + solution_grid[0][i-1].cost}
        }

        for (let i = 1; i < height; i++) {
            solution_grid[i][0] = {'index': sub_grid[i][0].index, 'cost': sub_grid[i][0].cost + solution_grid[i-1][0].cost}
        }

        for (let row = 1; row < height; row++) {
            for (let col = 1; col < width; col++) {
                solution_grid[row][col] = {'index': sub_grid[row][col].index, 'cost': sub_grid[row][col].cost + Math.min(solution_grid[row-1][col].cost, solution_grid[row][col-1].cost)}
            }
        }
        console.log(solution_grid);
        return limit - (solution_grid[height-1][width-1].cost);
    }
    return -1;
}

// function to check whether two indices are within a certain distance of each other
// @param origin - index
// @param destination - index
// @param distance - integer (move)
function checkDistance(origin, destination, movement) {
    let [originX, originY] = convertToCoordinates(origin);
    let [destinationX, destinationY] = convertToCoordinates(destination);
    // let x = Math.abs(destinationX - originX);
    // let y = Math.abs(destinationY - originY);
    // return movement - (x + y);
    return pathfinder(originX, originY, destinationX, destinationY, movement);
};

function buildBoat(flag, index) {
    switch (flag) {
        case 'fishing_boat':
            buildFishingBoat(index);
            break;
        case 'gun_boat':
            buildGunBoat(index);
            break;
        default:
            console.log("Something went wrong at addCellListener trying to build land building");
    }
}

function buildFishingBoat(index) {
    btb = new FishingBoat(index); // boat to build
    if (checkAndUpdateHarbour(btb, index)) {
        harbours[0].prod_types = ['fishing_boat'];
        fishing_boats.push(btb);
    }
}

function buildGunBoat(index) {
    btb = new GunBoat(index); // boat to build
    if (checkAndUpdateHarbour(btb, index)) {
        harbours[0].prod_types = ['gun_boat'];
        gun_boats.push(btb);
    }
}

function checkAndUpdateHarbour(boat, index) {
    if (curr_gold >= boat.build.getCost()) {
        if (harbours[0].prod_queue.length === 0) {
            curr_gold -= boat.build.getCost();
            document.querySelector('#gold').innerHTML = "Gold: " + curr_gold;
            harbours[0].prod_queue = [boat];  // Right now there is only one harbour and hard code to it
            boat.build.setStartTurn(curr_turn);
            boat.build.setEndTurn();
            let tile = getQuerySelector(boat);
            tile.textContent = boat.icon.getIcon();
            boat.index = index;
            return true;
        }
    }
    return false;
}