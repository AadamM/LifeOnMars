function UserInterface(game, camera){
	this.game = game;
	this.camera = camera;

	// Creates the visual toolbar located at the bottom of the screen
	this.toolbar = this.game.add.sprite(0, this.camera.y+this.camera.height, 'buildings', 'Toolbar1');
	this.toolbar.scale.y = .7;
	this.toolbar.anchor.setTo(.5, 1);

	// Refers to position of toolbar on screen. DisplaceDef is the default value.
	this.yDisplaceDef = 4*(this.toolbar.height/5);
	this.yDisplace = this.yDisplaceDef;

	// Setting the toolbar in the correct position.
	this.toolbar.y += this.yDisplace;

	// Visual instructions for the toolbar.
	this.instructText = this.game.add.text(0, 0, "Press E to open Menu");
	this.instructText.anchor.setTo(.5, -.1);

	// Boolean to test whether or not the player has the toolbar enabled.
	this.menuActive = false;

	this.buildingArray = ['HabitationUnit1x1Up', 'HabitationUnit2x1LeftRight', 'HabitationUnit2x2'];
	this.i;
	this.icons = this.game.add.group();
	this.icons.classType = Phaser.Button;

	this.icons.x = this.camera.x + this.camera.width/2;
	this.icons.y = this.toolbar.y;//this.camera.y + this.camera.height - this.yDisplaceDef;


	for(this.i=0; this.i<this.buildingArray.length; this.i++){
		this.indivIcon = this.icons.create( 2 * (this.i - Math.floor(this.buildingArray.length/2)) * (this.camera.width/(this.buildingArray.length*2)), 0, 'buildings', this.makeBuilding, this);		this.indivIcon.frameName = this.buildingArray[this.i];
		this.indivIcon.y += (this.toolbar.height*this.toolbar.scale.y)/2;
		//this.indivIcon = this.icons.create((this.i+1)*(this.camera.width/(1.3*this.buildingArray.length)), this.toolbar.y-this.yDisplace-(this.toolbar.height/2), this.buildingArray[this.i]);
		this.indivIcon.anchor.setTo(.5, .5);
		this.indivIcon.scale.setTo(.75, .75);
	}
	//this.icons.align(this.buildingArray.length, 1, 50, 50);
	//this.icons.pivot.x = this.camera.width/2;
}

UserInterface.prototype.display = function(){
	if(this.game.input.keyboard.justPressed(Phaser.Keyboard.E)){
		// If the menu is not activated, pull it up. Otherwise, close it.
    	if(this.menuActive == false){
    		this.game.add.tween(this).to({ yDisplace: 0 }, 300, Phaser.Easing.Quadratic.InOut, true);
    		this.menuActive = true;
    	} else {
    		this.game.add.tween(this).to({ yDisplace: this.yDisplaceDef }, 300, Phaser.Easing.Default, true);
    		this.menuActive = false;
    	}
    }

    // This ensures that the icons only appear when the player has the toolbar enabled.
    /*if(this.menuActive){
    	this.icons.alpha = 100;
    } else {
    	this.icons.alpha = 0;
    }*/

    this.icons.x = this.camera.x + this.camera.width/2;
    this.icons.y = this.camera.y + this.camera.height - (this.yDisplaceDef - this.yDisplace);

	// Setting the toolbar and instruction text in the correct locations.
	this.toolbar.x = this.camera.x + (this.camera.width/2);
	this.toolbar.y = this.camera.y + this.camera.height + this.yDisplace;
	this.instructText.x = this.toolbar.x;
	this.instructText.y = this.toolbar.y - this.toolbar.height;

	// The text will change depending on the state of the menu.
	if (this.yDisplace == this.yDisplaceDef){
    	this.instructText.text = "Press E to open Menu";
    } else {
    	this.instructText.text = "Press E to close Menu";
    }
};

UserInterface.prototype.makeBuilding = function(){
	if(this.frameName == 'HabitationUnit1x1Up'){
		this.buttonBuilding = new Building(this.game, 1, 1, 'buildings', 'HabitationUnit1x1Down', true, [
            'HabitationUnit1x1Left', 'HabitationUnit1x1Up', 'HabitationUnit1x1Right'
        ]);
		this.buttonBuilding.x = this.game.input.mousePointer.x;
		this.buttonBuilding.y = this.game.input.mousePointer.y;
	}
};
