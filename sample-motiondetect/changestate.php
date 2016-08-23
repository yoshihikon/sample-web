#!/usr/local/bin/php54
<?php

$stateFilePath = '/home/sites/heteml/users/y/o/s/yoshihiko/web/goodmix/photon/motiondetect/state.txt';

if (isset($_GET['state'])) {
  $state = $_GET['state'];
}else{
  $state = '';
}
echo $state;

if(!file_exists($stateFilePath)){
  touch($stateFilePath);
}else{
}

chmod($stateFilePath, 0666);

file_put_contents($stateFilePath, $state, LOCK_EX);

?>