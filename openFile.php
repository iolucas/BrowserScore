<?php
	$xmlText = $_POST['file'];

	$xmlObj=simplexml_load_string($xmlText) or die("Error: Cannot create object");
	//print_r($xml);

 	$json = json_encode($xmlObj);

 	print_r($json);
?>