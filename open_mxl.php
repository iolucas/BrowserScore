<?php
	
	//Check if we received a mxl file and it is valid (has a name), if not, exit script
	if(!$_FILES["mxlFile"]["name"]) 
		exit("MXL_OPEN_ERROR");	//exit script signling error

	$filename = $_FILES["mxlFile"]["name"];	//Get the file name
	$source = $_FILES["mxlFile"]["tmp_name"];	//Get its source (?what is it)
	$type = $_FILES["mxlFile"]["type"];	//Get its type

	
	//MUST CREATE FUNCTION TO CREATE AND DELETE TEMP STUFF

	//$rootDir = "phpDebug/";
	//$tempDir = "tempDir/";

	//mkdir($rootDir . $tempDir, 0777);

	//Check if the type matches one of the valid types
	switch($type) {

		case "application/zip":
			break;

		case "application/x-zip-compressed":
			break;

		case "multipart/x-zip":
			break;

		case "application/x-compressed":
			break;

		case "application/octet-stream":
			break;

		//If it doesn't match any of the cases, it will fall here
		default:
			exit("MXL_OPEN_ERROR");	//exit script signling error
	}

	//place and file to extract the zip file
	$targetPath = "phpDebug/".$filename;

	
	//Move the uploaded temporary file to the target location
	$moveResult = move_uploaded_file($source, $targetPath);
	if(!$moveResult)
		exit("MXL_OPEN_ERROR");	//exit script signling error
	
	//Open and extract the zip file
	$extractResult = OpenAndExtractFile($targetPath, "phpDebug/");
	if($extractResult == "EXTRACT_ERROR")
		exit("MXL_OPEN_ERROR");	//exit script signling error


	//Open and read the musicxml file
	$readResult = OpenAndReadFile("phpDebug/musicXML.xml");
	if($readResult == "OPENREAD_ERROR")
		exit("MXL_OPEN_ERROR");	//exit script signling error

	echo $readResult;
	//print_r($readResult);


	function OpenAndExtractFile($targetFile, $extractPlace) {
		$zip = new ZipArchive();	//Create new zip archive
		$zipResult = $zip->open($targetFile);	//Open the targeted file

		//If the file were open succesfully
		if($zipResult === true) {
			$zip->extractTo($extractPlace); //Extract the files to the specified location
			$zip->close();	//close the zip file

			@unlink($targetFile);	//Delete the zip file

		} else {
			return "EXTRACT_ERROR";
		}
	}

	function OpenAndReadFile($fileName) {

		//@ -> suppress warnings

		$fileOpened = @fopen($fileName, "r");	//Open file specified
		$openResult = @fread($fileOpened, filesize($fileName));	//Read the complete file and get its content
		@fclose($fileOpened);	//close the file handle	

		//If no result were get, set msg
		if(!$openResult)
			$openResult = "OPENREAD_ERROR";

		//Delete the read file
		@unlink($fileName);

		return $openResult;
	}

	function deleteDirectory($dir) {
		if (!file_exists($dir)) {
		    return true;
		}

		if (!is_dir($dir)) {
		    return unlink($dir);
		}

		foreach (scandir($dir) as $item) {
		    if ($item == '.' || $item == '..') {
		        continue;
		    }

		    if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
		        return false;
		    }

		}

		return rmdir($dir);
	}

?>