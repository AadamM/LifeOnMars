function UserInterface(game, camera){
	this.game = game;
	this.camera = camera;

	this.toolbar = this.game.add.sprite(0, this.camera.y+this.camera.height, 'tool1');
	this.toolbar.anchor.setTo(.5, 1);

	this.yDisplaceDef = 4*(this.toolbar.height/5);
	this.yDisplace = this.yDisplaceDef;

	this.toolbar.y += this.yDisplace;

	this.instructText = this.game.add.text(0, 0, "Press E to open Menu");
	this.instructText.anchor.setTo(.5, 1);

	this.menuActive = false;

	this.buildingArray = ['hab1x1', 'hab2x1', 'habBed'];
	this.i;
	this.icons = this.game.add.group();

	//this.icons.x = this.camera.width/2;
	//this.icons.y = 0;


	for(this.i=0; this.i<this.buildingArray.length; this.i++){
		//this.indivIcon = this.icons.create(0, 0, this.buildingArray[this.i]);
		this.indivIcon = this.icons.create((this.i+1)*(this.camera.width/(1.3*this.buildingArray.length)), this.toolbar.y-this.yDisplace-(this.toolbar.height/2), this.buildingArray[this.i]);
		this.indivIcon.anchor.setTo(.5, .5);
		this.indivIcon.scale.setTo(1.7, 1.7);
	}
	//this.icons.align(this.buildingArray.length, 1, 50, 50);
	//this.icons.pivot.x = this.camera.width/2;
}

UserInterface.prototype.display = function(){
	if(this.game.input.keyboard.justPressed(Phaser.Keyboard.E)){
    	if(this.menuActive == false){
    		this.game.add.tween(this).to({ yDisplace: 0 }, 300, Phaser.Easing.Default, true);
    		this.menuActive = true;
    	} else {
    		this.game.add.tween(this).to({ yDisplace: this.yDisplaceDef }, 300, Phaser.Easing.Default, true);
    		this.menuActive = false;
    	}
    }

    if(this.menuActive){
    	this.icons.alpha = 100;
    } else {
    	this.icons.alpha = 0;
    }

    if(this.camera.x != 0 || this.camera.y != 0){
    	this.icons.alpha = 0;
    }

	//this.camera = camera;
	this.toolbar.x = this.camera.x + (this.camera.width/2);
	this.toolbar.y = this.camera.y + this.camera.height + this.yDisplace;
	this.instructText.x = this.toolbar.x;
	this.instructText.y = this.toolbar.y-this.yDisplace;

	//this.icons.x += this.camera.x;
	//this.icons.y = this.toolbar.y-this.yDisplace-51;

	if(this.yDisplace == 0){
    	this.instructText.text = "";
    } else if (this.yDisplace == this.yDisplaceDef){
    	this.instructText.text = "Press E to open Menu";
    } else {
    	this.instructText.text = "";
    }
};

/*UserInterface.prototype.open = function(){
	this.game.add.tween(this.toolbar).to({ y: 71}, Phaser.Easing.Default, true);
};*/