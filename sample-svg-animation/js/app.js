$(function () {
  $('#button-animation').on('click', function(){
    $(this).toggleClass('on');
    var element = document.getElementById('animation-ellipse');
    element.classList.toggle('on');
  });
});
