try {

  // �R���e�L�X�g���j���[���J�������� Window �I�u�W�F�N�g���擾
  var ownerWindow = window.external.menuArguments;
  
  // �R���e�L�X�g���j���[���J�����Ƃ��̃C�x���g�I�u�W�F�N�g���擾
  var ownerEvent = ownerWindow.event;
  
  // �I�𕶎�����擾
  // NOTE: �I������Ă��Ȃ��Ƃ��͋󕶎���ɂȂ�
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
  
  // �o�͂��郁�b�Z�[�W���쐬
  var message = '';
  message += '  �I�𕶎���F ';
  message += selectedText;
 
  // ���b�Z�[�W��\��
  //window.alert(message);

} catch ( exception ) {

  window.alert(exception);

}