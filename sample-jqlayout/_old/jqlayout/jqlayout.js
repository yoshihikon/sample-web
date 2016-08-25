/*jqlayout*/

/*
 * プロパティ
 */
Jqlayout.HORIZONTAL = "horizontal";
Jqlayout.VERTICAL = "vertical";

//インスタンスプロパティ
Jqlayout.prototype.layout;
Jqlayout.prototype.direction = Jqlayout.HORIZONTAL;
Jqlayout.prototype.option;
Jqlayout.prototype.parent;
Jqlayout.prototype.xList = [];
Jqlayout.prototype.yList = [];
Jqlayout.prototype.wList = [];
Jqlayout.prototype.hList = [];
Jqlayout.prototype.initWList = [];
Jqlayout.prototype.initHList = [];

Jqlayout.prototype.minWidth = 0;
Jqlayout.prototype.maxWidth = 0;
Jqlayout.prototype.minHeight = 0;
Jqlayout.prototype.maxHeight = 0;

/*
 * コンストラクタ
 */
function Jqlayout(layoutObject, direction, option){
	this.layout = layoutObject;
	if(direction != undefined){
		this.direction = direction;
	}
	
	if(option != undefined){
		this.option = option;
	}
	
	//
	var i = 0;
	var length = this.layout.length;
	for(i = 0; i < length; i++){
		this.initWList[i] = $("#"+this.layout[i].id).width();
		this.initHList[i] = $("#"+this.layout[i].id).height();
	}
	
	//実行
	this.init();
	
	if(this.direction == Jqlayout.HORIZONTAL){
		this.initHorizontal();
		this.setHorizontalPoint();
		this.arrangeHorizontal();
	}else if(this.direction == Jqlayout.VERTICAL){
		this.initVertical();
		this.setVerticalPoint();
		this.arrangeVertical();
	}
}

/*
 * public
 */
Jqlayout.prototype.resize = function(){
	this.init();
	
	if(this.direction == Jqlayout.HORIZONTAL){
		this.setHorizontalPoint();
		this.arrangeHorizontal();
	}else if(this.direction == Jqlayout.VERTICAL){
		this.setVerticalPoint();
		this.arrangeVertical();
	}
}

/*
 * private
 */
//初期化
Jqlayout.prototype.init = function(){
	var i;
	var length;
	
	//親要素の取得
	this.parent = $("#" + this.layout[0].id).parent();
	
	//値の初期化
	length = this.layout.length;
	for(i = 0; i < length; i++){
		this.xList[i] = 0;
		this.yList[i] = 0;
		this.wList[i] = 0;
		this.hList[i] = 0;
	}
	
	this.minWidth = 0;
	this.maxWidth = 0;
	this.minHeight = 0;
	this.maxHeight = 0;
}
Jqlayout.prototype.initHorizontal = function(){
	//すべての要素を絶対配置に設定
	var i;
	var length;
	length = this.layout.length;
	for(i = 0; i < length; i++){
		$("#" + this.layout[i].id).css({
			"position":"absolute"
		});
	}
}
Jqlayout.prototype.initVertical = function(){
	//すべての要素を絶対配置に設定
	var i;
	var length;
	length = this.layout.length;
	for(i = 0; i < length; i++){
		$("#" + this.layout[i].id).css({
			"position":"static"
		});
	}
}

/*水平方向のレイアウト*/
//座標とサイズの設定
Jqlayout.prototype.setHorizontalPoint = function(){
	var i;
	var length;
	var staticSize = 0;
	var flexibleSize = 0;
	var xPoint = 0;
	
	//固定値、最小値、高さの設定
	length =this.layout.length;
	for(i = 0; i < length; i++){
		if(this.layout[i].flex == "false"){
			this.wList[i] = this.layout[i].width;
			staticSize += this.layout[i].width;
		}
		this.minWidth += this.layout[i].width;
		this.hList[i] = $("#" + this.layout[i].id).height();
	}
	
	this.hList.sort(function(a,b){return b - a;});
	this.maxHeight = this.hList[0];
	
	//親要素の最小値のセット
	this.parent.height(this.maxHeight);
	this.parent.css({
		"min-width":this.minWidth + "px"
	});
	
	//可変部分の設定
	flexibleSize = this.parent.width() - staticSize;
	
	var totalWeight = 0;
	var length = this.layout.length;
	for(i = 0; i < length; i++){
		if(this.layout[i].flex == "true"){
			if(this.layout[i].weight != undefined){
				totalWeight += this.layout[i].weight;
			}
		}
	}
	
	length = this.layout.length;
	for(i = 0; i < length; i++){
		if(this.layout[i].flex == "true"){
			this.wList[i] = Math.ceil((this.layout[i].weight / totalWeight) * flexibleSize);
		}
	}
	
	//x座標の設定
	xPoint = 0;
	length = this.layout.length;
	for(i = 0; i < length; i++){
		this.xList[i] = xPoint;
		xPoint += this.wList[i];
	}
}

//配置
Jqlayout.prototype.arrangeHorizontal = function(){
	var i;
	var length;
	var xPoint = 0;
	
	length = this.layout.length;
	for(i = 0; i < length; i++){
		$("#"+this.layout[i].id).css({
			"left":this.xList[i] + "px"
		});
		$("#"+this.layout[i].id).width(this.wList[i]);
		$("#"+this.layout[i].id).height(this.maxHeight);
		xPoint += this.wList[i];
	}
}

/*垂直方向のレイアウト*/
//座標とサイズの設定
Jqlayout.prototype.setVerticalPoint = function(){
	var i;
	var length;
	var staticSize = 0;
	var flexibleSize = 0;
	var yPoint = 0;
	
	//固定値、最小値、高さの設定
	length =this.layout.length;
	for(i = 0; i < length; i++){
		if(this.layout[i].flex == "false"){
			if(this.layout[i].height > this.initHList[i]){
				this.hList[i] =  this.layout[i].height;
			}else{
				if(this.layout[i].overflow == "true"){
					this.hList[i] = this.initHList[i];
				}else{
					this.hList[i] = this.layout[i].height;
				}
			}

			staticSize += this.hList[i];
		}		
		this.minHeight += this.layout[i].height;
	}
	
	//可変部分の設定
	var screenObject = Jqlayout.getScreenSize();
	var parentInnerTop = this.parent.position().top + parseInt(this.parent.css("border-top-width"));
	
	var bottomHeight = 0;
	if(this.option != undefined && this.option.bottomHeight != undefined){
		bottomHeight = this.option.bottomHeight;
	}
	
	flexibleSize = screenObject.height - (parentInnerTop + bottomHeight + staticSize);
	
	var totalWeight = 0;
	var length = this.layout.length;
	for(i = 0; i < length; i++){
		if(this.layout[i].flex == "true"){
			if(this.layout[i].weight != undefined){
				totalWeight += this.layout[i].weight;
			}
		}
	}
	
	length = this.layout.length;
	for(i = 0; i < length; i++){
		if(this.layout[i].flex == "true"){
			var tempHeight = Math.ceil((this.layout[i].weight / totalWeight) * flexibleSize);
			if(tempHeight > this.initHList[i]){
				this.hList[i] =  tempHeight;
			}else{
				if(this.layout[i].overflow == "true"){
					this.hList[i] = this.initHList[i];
				}else{
					this.hList[i] = tempHeight;
				}
			}
		}
	}
	
	//y座標の設定
	yPoint = 0;
	length = this.layout.length;
	for(i = 0; i < length; i++){
		this.yList[i] = yPoint;
		yPoint += this.hList[i];
	}
}

//配置
Jqlayout.prototype.arrangeVertical = function(){
	var i;
	var length;
	var yPoint = 0;
	
	length = this.layout.length;
	for(i = 0; i < length; i++){
		$("#"+this.layout[i].id).height(this.hList[i]);
		yPoint += this.hList[i];
	}
}

/*共通メソッド*/
//スクリーンサイズの取得
Jqlayout.getScreenSize = function(){
	var obj = new Object();
	obj.width = window.innerWidth;
	obj.height = window.innerHeight;
	return obj;
}
//親要素の大きさにフィットさせる
Jqlayout.fitWrapperHeight = function(wrapperElementId){
	var i;
	var length;
	var parent = $("#"+wrapperElementId);
	var children = parent.children();
	
	length = children.length
	for(i = 0; i < length; i++){
		$(children[i]).height(parent.height());
	}
}
//他の要素に高さをフィットさせる
Jqlayout.fitContentsHeight = function(layoutObject){
	var i;
	var length;
	var maxHeight;
	var hList = [];
	
	length = layoutObject.length
	for(i = 0; i < length; i++){
		hList[i] = $("#"+layoutObject[i].id).height();
	}
	
	hList.sort(function(a,b){return b - a;});
	maxHeight = hList[0];
	
	length = hList.length
	for(i = 0; i < length; i++){
		$("#"+layoutObject[i].id).height(maxHeight);
	}
}
//親要素の大きさにフィットさせる
Jqlayout.setHeight = function(targetElementId, height){
	$("#"+targetElementId).height(height);
}