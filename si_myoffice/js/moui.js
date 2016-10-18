"use strict"

/*
 * My OFFICE moui.js
 * 2016/9/29
 */

/* 実行 */
$(function(){
  MOUI.setMenulist();
  MOUI.setAccordion();
  MOUI.setTransportation();
});

/* クラス */
function MOUI() {
};

MOUI.setAccordion = function(){
  //init
  $(".moui-accordion-title").addClass("moui-close");
  $(".moui-accordion-contents").hide();
  
  //action
  $(".moui-accordion-title").on("click", function(){
    
    if($(this).hasClass("moui-close")){
      $(this).next().slideDown("fast");
      
      $(this).removeClass("moui-close");
      $(this).addClass("moui-open");
    }else{
      $(this).next().slideUp("fast");
      
      $(this).removeClass("moui-open");
      $(this).addClass("moui-close");
    }
    
  });
}

MOUI.setTransportation = function(){
  //init
  $("#moui-transportation").hide();
  
  //get param
  var vars = MOUI.getUrlVars();
  
  if(vars["suica"] != undefined){
    
    var suicaData = vars["suica"];
    
    $("#moui-transportation").show();
    
    $("#action-apply-transportation").on("click", function(){
      location.href="apply_transportation.html?suica=" + suicaData;
    });
  }
}


MOUI.getUrlVars = function(){
    var vars = {}; 
    var param = location.search.substring(1).split('&');
    for(var i = 0; i < param.length; i++) {
        var keySearch = param[i].search(/=/);
        var key = '';
        if(keySearch != -1) key = param[i].slice(0, keySearch);
        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
        if(key != '') vars[key] = decodeURI(val);
    } 
    return vars; 
}

MOUI.setMenulist = function(){
  $("main .moui-applymenulist").hide();
}

MOUI.selectMenu = function(thisObject, targetContentsId){
  //change menu
  $(".moui-menusection").find("a").each(function(){
    $(this).removeClass("moui-selected");
  });
  
  $(thisObject).addClass("moui-selected");
  
  //change contents
  $(".moui-dashboard").hide();
  $(".moui-applymenulist").hide();
  
  $(targetContentsId).show();
}