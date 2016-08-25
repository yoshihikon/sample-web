/*jqlayout*/

/*
 * プロパティ
 */
Jqlayout.VERTICAL = "vertical";
Jqlayout.HORIZONTAL = "horizontal";

//インスタンスプロパティ
Jqlayout.prototype.layout;
Jqlayout.prototype.xList = [];
Jqlayout.prototype.yList = [];
Jqlayout.prototype.wList = [];
Jqlayout.prototype.hList = [];

Jqlayout.prototype.minWidth = 0;
Jqlayout.prototype.maxWidth = 0;
Jqlayout.prototype.minHeight = 0;
Jqlayout.prototype.maxHeight = 0;

Jqlayout.prototype.arrangeList = [];

/*
 * コンストラクタ
 */
function Jqlayout(layoutObject){
  if(layoutObject != null || layoutObject != undefined){
  	this.layout = layoutObject;
	}else{
	  return;
	}
	
	this.init();
	this.setLayout(this.layout.container, this.layout.orientation, this.layout.contents);
	this.arrange();
}

/*
 * public
 */
Jqlayout.prototype.resize = function(duration){
	this.setLayout(this.layout.container, this.layout.orientation, this.layout.contents);
	
	if(duration == null || duration == undefined){
	  this.arrange();
  }else{
    this.arrange(duration);
  }
}

/*
 * private
 */
//初期化
Jqlayout.prototype.init = function(){
  isFirst = true;
  arrangeList = [];
}

Jqlayout.prototype.setLayout = function (container, orientation, contents){
  var i;
  
  //スタイルの初期化
  if(orientation == Jqlayout.VERTICAL){
    var contentsLength = contents.length;
    for(i = 0; i < contentsLength; i++){
      $(contents[i].id).css({"position":"relative"});
    }
    this.setVertical(container, contents);
  }else if(orientation == Jqlayout.HORIZONTAL){
    var contentsLength = contents.length;
    for(i = 0; i < contentsLength; i++){
      $(contents[i].id).css({"position":"absolute"});
    }
    this.setHorizontal(container, contents);
  }
}

/*
 * 垂直方向の座標とサイズの設定
 */
Jqlayout.prototype.setVertical = function(container, contents){
  var i;
  var contentsLength = contents.length;
  var hList = [];
  var minHeight = 0;
  var staticSize = 0;
  var flexibleSize = 0;
  var totalWeight = 0;
  var yPoint = 0;
  var offsetTop = 0;
  
  //親要素のサイズ取得
  var containerSizeObject = new Object();
  if(container == "body"){
    containerSizeObject = Jqlayout.getScreenSize();
  }else{
    containerSizeObject = Jqlayout.getContainerSize(container);
  }
  
  //座標の基準点との差分を取得
  if($(container).css("position") == "absolute"){
    offsetTop = $(container).offset().top;
  }
  
  //固定値、最小値、横幅の設定
  for(i = 0; i < contentsLength; i++){
    if(contents[i].height != undefined){
      if(contents[i].flex == "false"){
        hList[i] =  contents[i].height;
        staticSize += contents[i].height;
      }
      $(contents[i].id).css({"min-height": contents[i].height});
      minHeight += contents[i].height;
    }
  }
  $(container).css({"min-height": minHeight});
  
  //可変部分の設定
  flexibleSize = containerSizeObject.height - staticSize;
  
  for(i = 0; i < contentsLength; i++){
    if(contents[i].flex == "true"){
      if(contents[i].weight != undefined){
        totalWeight += contents[i].weight;
      }
    }
  }
  
  for(i = 0; i < contentsLength; i++){
    if(contents[i].flex == "true"){
      var tempHeight = Math.ceil((contents[i].weight / totalWeight) * flexibleSize);
      if(contents[i].height != undefined){
        if(contents[i].height > tempHeight){
          hList[i] =  contents[i].height;
        }else{
          hList[i] =  tempHeight;
        }
      }
    }
  }
  
  //配置
  for(i = 0; i < contentsLength; i++){
    this.arrangeList.push({id:contents[i].id, layout:{width:containerSizeObject.width, height:hList[i]}});
    yPoint += hList[i];
  }
  
  for(i = 0; i < contentsLength; i++){
    if(contents[i].layout != undefined){
      this.setLayout(contents[i].id, contents[i].layout.orientation, contents[i].layout.contents);
    }
  }
}

/*
 * 水平方向の座標とサイズの設定
 */
Jqlayout.prototype.setHorizontal = function(container, contents){
  var i;
  var contentsLength = contents.length;
  var wList = [];
  var minWidth = 0;
  var staticSize = 0;
  var flexibleSize = 0;
  var totalWeight = 0;
  var xPoint = 0;
  var offsetLeft = 0;
  
  //親要素のサイズ取得
  var containerSizeObject = new Object();
  if(container == "body"){
    containerSizeObject = Jqlayout.getScreenSize();
  }else{
    containerSizeObject = Jqlayout.getContainerSize(container);
  }
  
  //座標の基準点との差分を取得
  if($(container).css("position") == "absolute"){
    offsetLeft = $(container).offset().left;
  }
  
  //固定値、最小値、高さの設定
  for(i = 0; i < contentsLength; i++){
    if(contents[i].width != undefined){
      if(contents[i].flex == "false"){
        wList[i] =  contents[i].width;
        staticSize += contents[i].width;
      }
      $(contents[i].id).css({"min-width": contents[i].width});
      minWidth += contents[i].width;
    }
  }
  $(container).css({"min-width": minWidth});
  
  //可変部分の設定
  flexibleSize = containerSizeObject.width - staticSize;
  
  for(i = 0; i < contentsLength; i++){
    if(contents[i].flex == "true"){
      if(contents[i].weight != undefined){
        totalWeight += contents[i].weight;
      }
    }
  }
  
  for(i = 0; i < contentsLength; i++){
    if(contents[i].flex == "true"){
      var tempWidth = Math.ceil((contents[i].weight / totalWeight) * flexibleSize);
      if(contents[i].width != undefined){
        if(contents[i].width > tempWidth){
          wList[i] =  contents[i].width;
        }else{
          wList[i] =  tempWidth;
        }
      }
    }
  }
  
  //配置
  for(i = 0; i < contentsLength; i++){ 
    this.arrangeList.push({id:$(contents[i].id), layout:{top:$(contents[i].id).offset().top, left:xPoint + offsetLeft, width:wList[i], height:containerSizeObject.height}});
    xPoint += wList[i];
  }
  
  for(i = 0; i < contentsLength; i++){
    if(contents[i].layout != undefined){
      this.setLayout(contents[i].id, contents[i].layout.orientation, contents[i].layout.contents);
    }
  }
}

/*
 * 配置
 */
Jqlayout.prototype.arrange = function(duration){
  var i;
  var arrangeLength = this.arrangeList.length;
  var arrangeObject;
  
  if(duration == null || duration == undefined){
    for(i = 0; i < arrangeLength; i++){
      arrangeObject = this.arrangeList[i];
      if(arrangeObject.layout.top != undefined && arrangeObject.layout.left != undefined) $(arrangeObject.id).offset({top:arrangeObject.layout.top, left:arrangeObject.layout.left});
      if(arrangeObject.layout.width != undefined) $(arrangeObject.id).width(arrangeObject.layout.width);
      if(arrangeObject.layout.height != undefined) $(arrangeObject.id).height(arrangeObject.layout.height);
    }
  }else{
    for(i = 0; i < arrangeLength; i++){
      arrangeObject = this.arrangeList[i];
      console.log(arrangeObject.layout);
      //$(arrangeObject.id).animate({top:arrangeObject.top, left:arrangeObject.left, width:arrangeObject.width, height:arrangeObject.height},duration);
      $(arrangeObject.id).animate(arrangeObject.layout ,duration);
    }
  }
  
  arrangeList = [];
}

/*共通メソッド*/
//スクリーンサイズの取得
Jqlayout.getScreenSize = function(){
  var obj = new Object();
  obj.width = window.innerWidth;
  obj.height = window.innerHeight;
  return obj;
}
//ボックスサイズの取得
Jqlayout.getContainerSize = function(id){
  var obj = new Object();
  obj.width = $(id).outerWidth();
  obj.height = $(id).outerHeight();
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