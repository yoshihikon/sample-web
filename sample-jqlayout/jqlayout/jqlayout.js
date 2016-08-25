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

Jqlayout.prototype.isFirst = true;

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
  
  isFirst = false;
}

/*
 * public
 */
Jqlayout.prototype.resize = function(){
  this.setLayout(this.layout.container, this.layout.orientation, this.layout.contents);
}

/*
 * private
 */
//初期化
Jqlayout.prototype.init = function(){
  isFirst = true;
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
    if(contents[i].width != undefined){
      $(contents[i].id).css({"width": containerSizeObject.width});
    }
    if(contents[i].height != undefined){
      if(contents[i].flex == "false"){
        hList[i] =  contents[i].height;
        staticSize += contents[i].height;
      }
      
      var hOuter = ($(contents[i].id).outerHeight() - $(contents[i].id).height());
      var outerHeight = contents[i].height - hOuter;
      
      $(contents[i].id).css({"min-height": outerHeight});
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
    
    var hOuter = ($(contents[i].id).outerHeight() - $(contents[i].id).height());
    var outerHeight = hList[i] - hOuter;
    
    if(isFirst == true){
      $(contents[i].id).height(outerHeight);
    }else{
      $(contents[i].id).animate({height:outerHeight}, 200);
    }
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
    if(contents[i].height != undefined){
      $(contents[i].id).css({"height": containerSizeObject.height});
    }
    if(contents[i].width != undefined){
      if(contents[i].flex == "false"){
        wList[i] =  contents[i].width;
        staticSize += contents[i].width;
      }
      
      var wOuter = ($(contents[i].id).outerWidth() - $(contents[i].id).width());
      var outerWidth = contents[i].width - wOuter;
    
      $(contents[i].id).css({"min-width": outerWidth});
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
    
    var wOuter = ($(contents[i].id).outerWidth() - $(contents[i].id).width());
    var outerWidth = wList[i] - wOuter;
    
    if(isFirst == true){
      $(contents[i].id).offset({top:$(contents[i].id).offset().top, left:xPoint + offsetLeft});
      $(contents[i].id).width(outerWidth);
    }else{
      $(contents[i].id).animate({left:xPoint + offsetLeft, width:outerWidth}, 200);
    }
    xPoint += wList[i];
  }
  
  for(i = 0; i < contentsLength; i++){
    if(contents[i].layout != null || contents[i].layout != undefined){
      this.setLayout(contents[i].id, contents[i].layout.orientation, contents[i].layout.contents);
    }
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