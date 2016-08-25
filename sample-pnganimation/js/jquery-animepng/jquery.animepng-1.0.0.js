 /*
 * //////////////////////////////////////////////////////////////////////
 * Animepng
 * 
 * @description this jquery plugin was png and jpg and gif tilemap animetion.
 * @version 1.0.0
 * @date December-2011
 * @author Yu Ishihara - http://hommebrew.com/
 * @requires jQuery v1.4.1 or later
 * @example http://is8r.github.com/jquery-plugin/animepng/
 * 
 * @howtouse
   //head
  <script type="text/javascript"><!--
  $(function() {
      $('.anime').animepng({
        src:'./images/char_sandogasa.png',
        width:32,
        height:48,
        fps:4
      });
  });
  // --></script>

   //body
   <div class="anime"></div>
 
 * //////////////////////////////////////////////////////////////////////
*/

jQuery(function($) {
  $.fn.animepng = function(settings) {
    settings = $.extend({
      direction: 'x', //タイルの方向を切り替え
      posx: 0,        //タイルのスタート位置を指定
      posy: 0,        //タイルのスタート位置を指定
      loop: true,     //loopさせるかどうか
      length: 30,     //loopさせない場合の停止までのフレーム数
      width: 32,
      height: 32,
      frame: 0,
      fps: 30,
      src: '',
      timer: null
    }, settings);
    
    return this.each(function(){
      var base = $(this);
      
      //cancel
      if(base.attr('isReady') != undefined) return;
      base.attr('isReady','true');
      
      //add css
      base.css("background", "url("+settings.src+")");    
      base.css("width", settings.width);    
      base.css("height", settings.height);  
      
      var interval = 1/settings.fps*1000;
      settings.timer = setInterval(tick, interval);
      
      //----------------------------------------------------------------------
  
      function tick(){
        
        var x;
        var y;
        if(settings.direction == 'x') {
          x = -settings.width * settings.frame;
          y = settings.posy;
        } else if(settings.direction == 'y') {
          x = settings.posx;
          y = -settings.height * settings.frame;
        }
        base.css("background-position", x+"px "+ y +"px");
        settings.frame++;
        if(settings.frame > settings.length - 1){
          if(!settings.loop) clearInterval( settings.timer );
          settings.frame = 0;
        };
      }
      
      //----------------------------------------------------------------------
  
    });
  };
});

