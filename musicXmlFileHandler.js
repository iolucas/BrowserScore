
function OpenMXLFile(mxlFile, loadCallback) {

	//Create form data object
	var formData = new FormData();

	//Add the mxlFile to the form
	formData.append("mxlFile", mxlFile);

	//Create ajax object to post the form
    var request = $.ajax({
        url: "open_mxl.php",	//address to send request
        type: "POST",	//ajax http method
        data: formData,	//form data to be send
        processData: false,	//tell ajax not worry about this
        contentType: false	//tell ajax not worry about this
    });


    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR) {
		loadCallback(response);
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
    	loadCallback("MXL_OPEN_ERROR");
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {});
}

function OpenXMLFile(xmlFile, loadCallback) {

    //Create reader object to read the file
    var reader = new FileReader();

    reader.onloadend = function() {

        if(reader.readyState == 2)
            loadCallback(reader.result);

    }

    reader.onerror = function() {
        loadCallback("XML_OPEN_ERROR");
    }

    //Read the pointed file as a text
    reader.readAsText(xmlFile);
}
