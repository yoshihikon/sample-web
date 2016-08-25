$(function(){
  //dummy
  $.getJSON('dummy.json', function (data) {
    ko.applyBindings(data);
  });
  
  //実際の処理
  
});