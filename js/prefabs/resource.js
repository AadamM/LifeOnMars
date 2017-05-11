'use strict';

function Resource(game, currentAmount, storage, xpos, ypos, key){
	Phaser.Sprite.call(this, game, xpos, ypos, key);
	this.name=name;
	this.currentAmount=currentAmount;
	this.storage=storage;
	this.x=xpos;
	this.y=ypos;
	//this.button = game.add.button(xpos,ypos,key, clickAction,this);
	this.income=0;
	this.outcome=0;
	this.hovered=false;
	game.add.existing(this);
    this.inputEnabled = true;
    //var style={font:"12px Arial"}
    this.text=game.add.text(this.x+40,this.y, this.currentAmount+'/'+this.storage);
    this.incomeText=game.add.text(this.x,this.y+40,'Income here');
	this.outcomeText=game.add.text(this.x,this.y+80,'Expences here');
	this.incomeText.alpha=0;
	this.outcomeText.alpha=0;
    //this.text.fixToCamera=true;
    //this.events.onInputDown.add(this.clickAction, this);
}

Resource.prototype = Object.create(Phaser.Sprite.prototype);
Resource.prototype.constructor = Resource;

// Resource.prototype.clickAction=function(){
// 	var resText=this.currentAmount+'/'+this.storage;
// 	var text=game.add.text(this.x+40,this.y, resText);
// }

Resource.prototype.update = function(){
	this.text.x=this.x+40;
	this.text.y=this.y;
	this.incomeText.x=this.x;
	this.incomeText.y=this.y+40;
	this.outcomeText.x=this.x;
	this.outcomeText.y=this.y+80;
	//this.text.fixToCamera=true;
	if(this.input.pointerOver()){
		this.incomeText.alpha=.99;
		this.outcomeText.alpha=.99;
	}
	else{this.incomeText.alpha=0;
		this.outcomeText.alpha=0;
	}
};