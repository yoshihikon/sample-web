#!/usr/local/bin/php54
<?php

/******************************
/* const
/******************************/
$currentDate = date('Y-m-d');
$currentTime = date('H:i:s');
$currentDatetime = date('Y-m-d H:i:s');

$dataDirectoryPath = '/home/sites/heteml/users/y/o/s/yoshihiko/web/goodmix/fdle/data/';
$dataDirectoryURL = 'http://goodmix.net/fdle/data/';
$nowStatusFileName = 'now.txt';
$dailyStatusFileName = $currentDate.'.txt';

/******************************
/* var
/******************************/
$statusDirectoryPath = '';
$nowStatusFilePath = '';
$errorCode = -1;

/******************************
/* parameter
/******************************/
if (isset($_GET['id'])) {
  $id = $_GET['id'];
}else{
  $errorCode = 100;
}
if (isset($_GET['status'])) {
  $status = $_GET['status'];
}else{
  $status = -1;
}
if (isset($_GET['app'])) {
  $app = $_GET['app'];
}else{
  $app = none;
}

if($errorCode > 0){
  exit('Error: parameter');
}

/******************************
/* file path, url
/******************************/
//set file path
$statusDirectoryPath = $dataDirectoryPath.'/'.$id.'/';
$nowStatusFilePath = $statusDirectoryPath.$nowStatusFileName;
$dailyStatusFilePath = $statusDirectoryPath.$dailyStatusFileName;

//set file url
$statusDirectoryURL = $dataDirectoryURL.'/'.$id.'/';
$nowStatusFileURL = $statusDirectoryURL.$nowStatusFileName;
$dailyStatusFileURL = $statusDirectoryURL.$dailyStatusFileName;

/******************************
/* create
/******************************/
//create id directory
$result = createDirectory($statusDirectoryPath);
if($result == 0){
  exit('Error: cannot create directory');
}

//create now file
$result = createFile($nowStatusFilePath, 0666);
if($result == 0){
  exit('Error: cannot create now file');
}

//write now file
$nowData = array('date' => $currentDate, 'time' => $currentTime, 'id' => $id, 'status' => $status, 'app' => $app);
$writeData = json_encode($nowData);
file_put_contents($nowStatusFilePath, $writeData, LOCK_EX);

//create daily file
$currentTimeObject = array('time' => $currentTime, 'id' => $id, 'status' => $status, 'app' => $app);
$result = createFile($dailyStatusFilePath, 0666);
if($result == 0){
  exit('Error: cannot daily file');
}else if($result == 1){
  //write new daily file
  $writeData = json_encode(array('date' => $currentDate, 'data' => array($currentTimeObject)));
  file_put_contents($dailyStatusFilePath, $writeData, LOCK_EX);
  
}else if($result == 2){
  //overwrite daily file
  $dailyStatusFileData = loadFile($dailyStatusFileURL);
  $dailyStatusDataArray = json_decode($dailyStatusFileData, true);

  array_push($dailyStatusDataArray['data'], $currentTimeObject);
  
  $writeData = json_encode($dailyStatusDataArray);
  file_put_contents($dailyStatusFilePath, $writeData, LOCK_EX);
}

//return success
exit('1');


/******************************
/* common function
/******************************/
function createDirectory($path){
  if(!file_exists($path)){
    if(mkdir($path, 0777)){
      //echo 'Success: create '.$path.PHP_EOL;
      return 1;
    }else{
      //echo 'Error: cannot create '.$path.PHP_EOL;
      return 0;
    }
  }else{
    //echo 'Success: exists '.$path.PHP_EOL;
    return 2;
  }
}

function createFile($filepath, $chmod){
  if(!file_exists($filepath)){
    if(touch($filepath)){
      //echo 'Success: create '.$filepath.PHP_EOL;
      chmod($filepath, $chmod);
      return 1;
    }else{
      //echo 'Error: cannot create '.$filepath.PHP_EOL;
      return 0;
    }
  }else{
    //echo 'Success: exists '.$filepath.PHP_EOL;
    return 2;
  }
}

function loadFile($url){
  $contents = NULL;
  
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_FAILONERROR, true);
  
  $contents = curl_exec( $ch );
  $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  
  if($statusCode != '200'){
    $errorCode = $statusCode;
    return 'Error: file load error';
  }
  
  /*
  if(($contents = @file_get_contents($url)) == FALSE ){
    // HTTPステータスコードを取得する
    list($version,$status_code,$msg) = explode(' ',$http_response_header[0], 3);
    
    // ステータスコードごとの処理
    switch($status_code) {
      case 404:
        return 'ERROR 404 - Not found.'.PHP_EOL;
        break;
      default:
        return $status_code.PHP_EOL;
        break;
    }
  }
  */
  return $contents;
}