module.exports = this;

var https = require('https');
var Promise = require('promise');

this.query = function() {
	return getlang.apply(this, arguments);
}

/*getlang('Teste 123456', '41faeac4a19b57be77e403ed6ec5804e4bca8fdcd30c26e48854f7f2c1727fd5')
	.then(function(data) {
		console.log(data);
	}, function(err) {
		console.log('ERROR');
		console.log(err);
	});*/

function getlang(text, csrf) {

	var postData = 'endpoints%5B0%5D%5Bendpoint%5D=entities&endpoints%5B0%5D%5BapiUrl%5D=%2Ftext%2FTextGetRankedNamedEntities&endpoints%5B0%5D%5BshowSourceText%5D=1&endpoints%5B0%5D%5Bsentiment%5D=1&endpoints%5B0%5D%5Bquotations%5D=1&endpoints%5B0%5D%5BmaxRetrieve%5D=50&endpoints%5B1%5D%5Bendpoint%5D=keywords&endpoints%5B1%5D%5BapiUrl%5D=%2Ftext%2FTextGetRankedKeywords&endpoints%5B1%5D%5Bsentiment%5D=1&endpoints%5B1%5D%5BshowSourceText%5D=1&endpoints%5B1%5D%5BmaxRetrieve%5D=50&endpoints%5B2%5D%5Bendpoint%5D=category&endpoints%5B2%5D%5BapiUrl%5D=%2Ftext%2FTextGetRankedTaxonomy&endpoints%5B2%5D%5BshowSourceText%5D=1&endpoints%5B3%5D%5Bendpoint%5D=concepts&endpoints%5B3%5D%5BapiUrl%5D=%2Ftext%2FTextGetRankedConcepts&endpoints%5B4%5D%5Bendpoint%5D=sentiment&endpoints%5B4%5D%5BapiUrl%5D=%2Ftext%2FTextGetTextSentiment&endpoints%5B5%5D%5Bendpoint%5D=relations&endpoints%5B5%5D%5BapiUrl%5D=%2Ftext%2FTextGetRelations&endpoints%5B5%5D%5Bentities%5D=1&endpoints%5B5%5D%5BrequireEntities%5D=1&endpoints%5B5%5D%5Bkeywords%5D=1&endpoints%5B5%5D%5Bsentiment%5D=1&endpoints%5B6%5D%5Bendpoint%5D=language&endpoints%5B6%5D%5BapiUrl%5D=%2Ftext%2FTextGetLanguage&endpoints%5B7%5D%5Bendpoint%5D=title&endpoints%5B7%5D%5BapiUrl%5D=&endpoints%5B8%5D%5Bendpoint%5D=author&endpoints%5B8%5D%5BapiUrl%5D=&endpoints%5B9%5D%5Bendpoint%5D=text&endpoints%5B9%5D%5BapiUrl%5D=&endpoints%5B9%5D%5BextractLinks%5D=1&endpoints%5B10%5D%5Bendpoint%5D=feeds&endpoints%5B10%5D%5BapiUrl%5D=&endpoints%5B11%5D%5Bendpoint%5D=microformats&endpoints%5B11%5D%5BapiUrl%5D=&endpoints%5B12%5D%5Bendpoint%5D=emotion&endpoints%5B12%5D%5BapiUrl%5D=%2Ftext%2FTextGetEmotion&content=teste&contentType=text&csrf_token='+ csrf + '&text=' + encodeURIComponent(text);


	var options = {
		hostname: 'us6.proxysite.com',
		path: '/process.php?d=x5B99EqdE1cDycrTVl%2FWg91HJ3JOiWR%2F4cawyWWKrPvpFmuhZHAgQiRc4wA%3D&b=1&f=ajax',
		method: 'POST',
		headers: {
			'content-length': postData.length,
			'content-type':'application/x-www-form-urlencoded; charset=UTF-8',
			'cookie':'__cfduid=db845ed88ffbd4fc41c169a5553958b801454425647; _hp2_id.86494855=3403844458723848.2523750263.0193895056; fs_uid=www.fullstory.com`12eV`5742484883767296:5629499534213120; optimizelyEndUserId=oeu1454453934158r0.379916338250041; c[alchemyapi.com][/][PHPSESSID]=9knpqt3jmg1pf8ip5i7hrtq0g6; c[2364371349.log.optimizely.com][/][end_user_id]=oeu1454453934158r0.379916338250041; c[heapanalytics.com][/][AWSELB]=A115C56308226E6E8E0E299DC507B18FCBA25228787F63CFF316A81472FEEE80885E664C0EFC39B4E1B58923269A67CBA91D7831E7FB2D6CA210512F11CBCED38F7844F505; c[pardot.com][/][pardot]=s6irdnt54hrciebte15aquhv87; c[doubleclick.net][/][id]=22b33d0f840400a3%7C%7Ct%3D1454501552%7Cet%3D730%7Ccs%3D002213fd48e1644ee027b7822a; c[facebook.com][/][datr]=a_GxVnYu5hov4ifpfv5ydFQ3; c[facebook.com][/][reg_ext_ref]=https%253A%252F%252Fwww.proxysite.com%252Fpt%252F; c[facebook.com][/][reg_fb_ref]=https%253A%252F%252Fm.facebook.com%252F; c[facebook.com][/][reg_fb_gate]=https%253A%252F%252Fm.facebook.com%252F; c[facebook.com][/][m_ts]=1454502251; c[google.com][/][NID]=76%3Du8KIYmeXyS0bylT_JjMKCAKU3YsViRAfMlZbeDc7sCYQoQWHEFIgWXY64MtEuFjG9MzSh92G4uVh2U2uGfB_Mc5AcP1Qq7Gq7npFEAMbk2Lg83-0DUe0ekDKkZ2gaHlaTFN38NEohw5x6dQ; _gat=1; _ga=GA1.2.89767242.1454425628; PHPSESSID=qsraph3dka7da85pb5mnpq53l6; has_js=1; optimizelySegments=%7B%222363670864%22%3A%22gc%22%2C%222373120598%22%3A%22referral%22%2C%222375901949%22%3A%22false%22%7D; optimizelyBuckets=%7B%7D; optimizelyPendingLogEvents=%5B%5D; _hp2_ses_props.3866823823=%7B%22r%22%3A%22https%3A%2F%2Fwww.proxysite.com%2Fpt%2F%22%2C%22e%22%3A%22%22%2C%22us%22%3A%22%22%2C%22um%22%3A%22%22%2C%22ut%22%3A%22%22%2C%22uc%22%3A%22%22%2C%22ua%22%3A%22%22%7D; _hp2_id.3866823823=6076095139346999.3448134784.3442129941; __hstc=4102191.db6caf82fc65aa47ddfd00ecb1b961da.1454525997548.1454525997548.1454525997548.1; __hssrc=1; __hssc=4102191.1.1454525997549; hsfirstvisit=https%3A%2F%2Fus6.proxysite.com%2Fprocess.php%3Fd%3DjoV9rFmPUFlehMPaWE7Sns0INHQNxXtgocGiwz6Y8%252FajGmrvaWU5T29B8hzgw%252B2YHF%252Fy%26b%3D1%26f%3Dnorefer|https%3A%2F%2Fwww.proxysite.com%2F|1454525997544; hubspotutk=db6caf82fc65aa47ddfd00ecb1b961da',
		}
	};


	var recData = '';

	return new Promise(function (resolve, reject) {
		var req = https.request(options, (res) => {

			//res.setEncoding('utf8');
			res.on('data', (chunk) => {
				recData += chunk;
			});

			res.on('end', () => {
				resolve(recData);
			});

		});

		req.on('error', (e) => {
			reject(e);		
		});

		req.write(postData);
		req.end();
	});

}

