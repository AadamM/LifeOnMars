'use strict';

/**
 * @param {Phaser.Game} game -- reference to the current game instance
 * @param {number} w -- width of the building (in grid cells)
 * @param {number} h -- height of the building (in grid cells)
 * @param {string} key -- the cached key of the building sprite
 * @param {string} frame -- (optional) image frame in a texture atlas/spritesheet
 */
function Building(game, w, h, key, frame) {
    Phaser.Sprite.call(this, game, 0, 0, key, frame);

    this.game = game;
    this.w = w;
    this.h = h;
    this.held = false;
    this.placed = false;

    game.add.existing(this);
    game.gameWorld.add(this);

    //start at half resolution
    this.scale.set(.5);

    this.inputEnabled = true;
    //give the sprite button functionality

    //This will later be changed to somewhere else
    //Because the building object should be created
    //When this function is called
    this.events.onInputDown.addOnce(this.purchased, this);
}

Building.prototype = Object.create(Phaser.Sprite.prototype);
Building.prototype.constructor = Building;

Building.prototype.purchased = function() {
    this.alpha = .75;
    this.held = true;
    this.game.holdingBuilding = true;
    this.game.gameWorld.bringToTop(this);
    this.anchor.set(.5);
    this.events.onInputDown.addOnce(Building.prototype.placed, this);
};

Building.prototype.placed = function() {
    this.placed = true;
    this.held = false;

    //this.orientation only applies to walkways, otherwise it should set to 0
    if (this.orientation) {
        this.anchor.x = this.orientation.x;
        this.anchor.y = this.orientation.y;
    } else {
        this.anchor.set(0);
    }

    this.alpha = 1;
    this.game.holdingBuilding = false;

    var xPos = this.game.g.xStart + this.game.g.upperLeftRow;
    var yPos = this.game.g.yStart + this.game.g.upperLeftColumn;

    this.x = xPos * 32;
    this.y = yPos * 32;

    //update cell info here
    for (let i = xPos; i < xPos + this.w; i++) {
        for (let j = yPos; j < yPos + this.h; j++) {
            this.game.g.cells[i][j].occupied = true;
        }
    }

    this.game.g.bmdOverlay.clear();
    this.events.onInputDown.add(Building.prototype.getInfo, this);
};

Building.prototype.getInfo = function() {
    //UI popup to give player info about the building
};

Building.prototype.update = function() {
    if (this.held) {
        this.x = this.game.input.worldX / this.game.worldScale;
        this.y = this.game.input.worldY / this.game.worldScale;

        var xPos = this.game.g.xStart + this.game.g.upperLeftRow;
        var yPos = this.game.g.yStart + this.game.g.upperLeftColumn;
        var highlightColor = '#66ff33';
        var opacity = .25;
        this.events.onInputDown.active = true;

        if (xPos && yPos) {
            for (let i = xPos; i < xPos + this.w; i++) {
                for (let j = yPos; j < yPos + this.h; j++) {
                    if (this.game.g.cells[i][j].occupied) {
                        highlightColor = '#facade';
                        opacity = .5;
                        this.events.onInputDown.active = false;
                    }
                }
            }
        }

        this.game.g.draw(this.w, this.h, opacity, highlightColor);
    }
};

/**
 * A sublclass of Building, this defines a building that can be rotated
 */
function RotatableBuilding(game, w, h, key, frame, otherFrames) {
    Building.call(this, game, w, h, key, frame);

    if (otherFrames) {
        this.otherFrames = otherFrames;
        this.otherFrames.push(frame);
        this.frameIndex = 0;
    }

    var r = game.input.keyboard.addKey(Phaser.Keyboard.R);
    r.onDown.add(this.rotate, this);
}

RotatableBuilding.prototype = Object.create(Building.prototype);
RotatableBuilding.prototype.constructor = RotatableBuilding;

RotatableBuilding.prototype.rotate = function() {
    if (this.held && this.otherFrames) {
        this.frameName = this.otherFrames[this.frameIndex++];
        this.frameIndex %= this.otherFrames.length;
        this.w = this.width / 32;
        this.h = this.height / 32;
    }
};

/**
 * A subclass of Building, the walkway is a special case
 */
function Walkway(game, w, h, key, frame) {
    RotatableBuilding.call(this, game, w, h, key, frame);

    this.orientation = {
        x: 0,
        y: 0
    };
    //0 = down, 1 = left, 2 = up, 3 = right
    this.rotation = 0;
}

Walkway.prototype = Object.create(RotatableBuilding.prototype);
Walkway.prototype.constructor = Walkway;

Walkway.prototype.rotate = function() {
    if (this.held) {

        this.angle += 90;

        if (this.orientation.x === 0 && this.orientation.y === 0) {
            this.orientation.y = 1;
        } else if (this.orientation.x > 0 && this.orientation.y === 0) {
            this.orientation.x = 0;
        } else if (this.orientation.y > 0 && this.orientation.x === 0) {
            this.orientation.x = 1;
        } else {
            this.orientation.y = 0;
        }

    }
};

/**
 * @override Building.prototype.changeType
 */
Walkway.prototype.changeType = function() {
    var cells = this.game.g.cells;
    var xPos = this.x / 32;
    var yPos = this.y / 32;

    if (cells[xPos - 1][yPos].connects.right && cells[xPos][yPos - 1].connects.down) {

        this.frameName = 'WalkwayTShape';
    }
};

function CommandCenter(game, w, h, key, frame) {
    Building.call(this, game, w, h, key, frame);
}

CommandCenter.prototype = Object.create(Building.prototype);
CommandCenter.prototype.constructor = CommandCenter;

/**
 * Habitation Unit inherits from the rotatable building object
 */
function HabUnit(game, w, h, key, frame, otherFrames) {
    RotatableBuilding.call(this, game, w, h, key, frame, otherFrames);
}

HabUnit.prototype = Object.create(RotatableBuilding.prototype);
HabUnit.prototype.constructor = HabUnit;