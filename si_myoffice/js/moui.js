"use strict"

/*
 * My OFFICE moui.js
 * 2016/9/29
 */

/* 実行 */
$(function(){
  MOUI.setAccordion();
});

/* クラス */
function MOUI() {
};

MOUI.someMethod = function(){
  
}

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