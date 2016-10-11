try {

  // コンテキストメニューを開いた元の Window オブジェクトを取得
  var ownerWindow = window.external.menuArguments;
  
  // コンテキストメニューを開いたときのイベントオブジェクトを取得
  var ownerEvent = ownerWindow.event;
  
  // 選択文字列を取得
  // NOTE: 選択されていないときは空文字列になる
  var selectedText = '';
  selectedText += ownerWindow.document.selection.createRange().text;
  
  var dateArray = selectedText.split("\n");
  //var test2 = selectedText.split("\t");
  
  for(var i=0; i < dateArray.length; i++){
    var onedayDataArray = dateArray[i].split("mmm");
  }
  
  //var aaa = prompt("test", onedayDataArray);
  //document.write(aaa);
  
  window.alert(onedayDataArray);
  
  // 出力するメッセージを作成
  var message = '';
  message += '  選択文字列： ';
  message += selectedText;
 
  // メッセージを表示
  //window.alert(message);

} catch ( exception ) {

  window.alert(exception);

}