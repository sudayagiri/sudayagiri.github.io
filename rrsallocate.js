var strCsv = '';
var curatedLinesRolled  = [];
var purvanghamSlokas = 0;
var mahaMantras = 38;
var phalaShrutiSlokas = 0;
var avarthi = 1;

function allocaterrs(strStyle) {
	//Save all values
	tempSave();
	
	strCsv = 'Batch Number,' + window.localStorage.getItem("nsp-batchnumber") + ',,Date,'+ window.localStorage.getItem("nsp-satsangdate") + '\n\n';
	strCsv = strCsv + 'Shlokam,Start,End,Count,Devotee Name,Backup Chanter' + '\n\n';
	var txtNames = document.getElementById('names').value;
	var objallocation = document.getElementById('allocation'); 
	var text = '';
	var isRemovedNSP = false;
	
	//Names - remove spaces and new lines
	var splittedLines = txtNames.split('\n');
	var curatedLines = [];
	for (let i = 0; i < splittedLines.length; i++) {
		if (splittedLines[i].trim()  != "") {
			curatedLines.push(splittedLines[i].trim());
		}
	}
	if (curatedLines.length == 0) {
		alert('There are no people to allocate!');
		return;
	}
	if (curatedLines[0].toUpperCase() == 'NSP') { 
		curatedLines = removeNSP(curatedLines);
		isRemovedNSP = true;
	}
	
	//Randomize / Making big / Rolling
	console.log(strStyle);
	if(strStyle == 'random') shuffle(curatedLines);
	if(strStyle == 'roll') {
		if (curatedLinesRolled.length == 0) { console.log('no rolled'); rollNames(curatedLines, true); }
		else { console.log(curatedLinesRolled); rollNames(curatedLinesRolled, true); curatedLines = Array.from(curatedLinesRolled); }
	}	
	if (curatedLines.length < 20) {
		curatedLines = makeItTwenty(curatedLines);
		peopleForDhyanam = 1;
	} else peopleForDhyanam = 1;
	if(isRemovedNSP) { curatedLines = addNSP(curatedLines); }
	
	//==========================================================================================
	
	//Start Processing
	var devoteeCounter = 0;
	
	var total = purvanghamSlokas + mahaMantras + phalaShrutiSlokas;
	var totalDevotees = (curatedLines.length - 1 - peopleForDhyanam);
	var perpersonApprox = Math.round(total / totalDevotees);
	console.log(perpersonApprox + ' per person approx.');
	
//	var peopleForPoorvaangam = Math.ceil(purvanghamSlokas / perpersonApprox);
//	var peopleForPhalashruti = Math.ceil(phalaShrutiSlokas / perpersonApprox);
	var peopleForPoorvaangam = 0;
	var peopleForPhalashruti = 0;
	peopleForShlokas = totalDevotees - (peopleForPhalashruti + peopleForPoorvaangam)
	
	var strStartingPrayerPerson = getRandomName(curatedLines);
	//var strPledgePerson = getRandomName(curatedLines);
	
	txtOmNamo = '*Om Namo Narayana* \n';
	txtDashes = '--------------------------------------------\n';
	txtBatchDate = 'Batch Number: ' + window.localStorage.getItem("nsp-batchnumber") + '  [Satsang Date: ' + window.localStorage.getItem("nsp-satsangdate") + ']\n';
	//txtPledgePrayer = 'Starting Prayer: ' + strStartingPrayerPerson + '\n' + 'Pledge: ' + strPledgePerson + '\n\n';
	//strCsv = strCsv + 'Starting Prayer: ,,,,' + strStartingPrayerPerson + '\n' + 'Pledge: ,,,,' + strPledgePerson + '\n\n';
	strCsv = strCsv + 'Starting Prayer: ,,,,' + strStartingPrayerPerson + '\n\n'; //new line by NSP
	//===================================================================================================
//	nStart = devoteeCounter;  nEnd = devoteeCounter + peopleForPoorvaangam; devoteeCounter = nEnd;
//	txtPoorvangam = assignShlokas(purvanghamSlokas, nStart, nEnd, curatedLines, 'Purvangam');
//	strCsv = strCsv + '\n'; 
	
	nStart = devoteeCounter;  nEnd = devoteeCounter + 1; devoteeCounter = nEnd;
	txtNyasaa = fillDahses25("Nyasa: ") + curatedLines[nStart] + '\n';
	strCsv = strCsv + 'Nyasa' + ',,,,' + curatedLines[nStart] + "\n\n";
	
	nStart = devoteeCounter;  nEnd = devoteeCounter + peopleForDhyanam; devoteeCounter = nEnd;
	txtDhyaaanam = assignDhyaanam(peopleForDhyanam, nStart, curatedLines);
	strCsv = strCsv + '\n';
	
	nStart = devoteeCounter;  nEnd = devoteeCounter + peopleForShlokas; devoteeCounter = nEnd;
	txtShlokam = assignShlokas(mahaMantras, nStart, nEnd, curatedLines, 'Shlokam');
	strCsv = strCsv + '\n';
	
//	nStart = devoteeCounter;  nEnd = devoteeCounter + peopleForPhalashruti; devoteeCounter = nEnd;
//	txtPhalashruti = assignShlokas(phalaShrutiSlokas, nStart, nEnd, curatedLines, 'Phalashruti');
//	strCsv = strCsv + '\n';
	
	//===================================================================================================
	var strEndingPrayerPerson = getRandomName(curatedLines);
	txtEndingPrayer = 'Ending Prayer: ' + strEndingPrayerPerson + '\n';
	strCsv = strCsv + 'Ending Prayer: ,,,,' + strEndingPrayerPerson + '\n';
	
	if(strStyle != 'shloka') {
	//	objallocation.value = txtOmNamo + txtDashes + txtBatchDate + txtDashes + txtPledgePrayer + txtPoorvangam + '\n' + txtNyasaa + '\n' + txtDhyaaanam + '\n' + txtShlokam + '\n' + txtPhalashruti + '\n' + txtEndingPrayer;
	//	objallocation.value = txtOmNamo + txtDashes + txtBatchDate + txtDashes +  txtPoorvangam + '\n' + txtNyasaa + '\n' + txtDhyaaanam + '\n' + txtShlokam + '\n' + txtPhalashruti + '\n' + txtEndingPrayer;
	    objallocation.value = txtOmNamo + txtDashes + txtBatchDate + txtDashes + txtNyasaa + '\n' + txtDhyaaanam + '\n' + txtShlokam  + '\n' + txtEndingPrayer;
	} else {
		devoteeCounter = 0;
		nStart = devoteeCounter;
		console.log(curatedLines.length);
		nEnd = devoteeCounter + (curatedLines.length - 1);
		console.log('me calling assign' + nStart + '--' + nEnd);
		txtShlokam = assignShlokas(mahaMantras, nStart, nEnd, curatedLines, 'Shlokam');
		objallocation.value = txtOmNamo + txtDashes + txtBatchDate + txtDashes + txtShlokam + '\n';
	}
}

function assignShlokas(nShlokas, nStart, nEnd, curatedLines, shlokamName) {
	
	var totalPeople = nEnd - nStart;
	//var perpersonShlokasDecimal = nShlokas / totalPeople
	var perpersonShlokasDecimal = 2;
	console.log(totalPeople + ' ppl with ' + perpersonShlokasDecimal + ' each');
	var navarthi = 1; //38/2 per member = 19 minimum members
	var startShloka = 1;
	var text = '';
	var counter = nStart;
	var nPending = 0;
	text = text + navarthi+ '-Avarthi' + "\n"; 
		
	for (let i = 1; i <= totalPeople; i++) {
		nResultant = nPending + perpersonShlokasDecimal;
		nTotalShlokas = Math.floor(nResultant);
		nPending = nResultant - nTotalShlokas;
		endShlokaNumber = startShloka + nTotalShlokas-1;
		if(endShlokaNumber > mahaMantras)
			endShlokaNumber = mahaMantras;
		   		
		if (i != totalPeople ) {
			makeText = fillDahses25(shlokamName + ": " + startShloka + "-" + endShlokaNumber + '-[' + (endShlokaNumber-startShloka+1) + ']')+ curatedLines[counter] + "\n";
			strCsv = strCsv + shlokamName + ',' + startShloka + ',' + endShlokaNumber + ',' + '-[' +  (endShlokaNumber-startShloka+1) + '],' + curatedLines[counter] + "\n";
			if(endShlokaNumber == mahaMantras) {
				endShlokaNumber = 0;
			   	navarthi = navarthi + 1;
				makeText = makeText + navarthi+ '-Avarthi' + "\n";
				if(totalPeople - counter < 19){
					perpersonShlokasDecimal = 38/(totalPeople-counter+1);
				}
				}
			startShloka = endShlokaNumber + 1;
			counter++;
			text = text + makeText;
		} else {
			makeText = fillDahses25(shlokamName + ": " + startShloka + "-" + nShlokas + '-[' + (nShlokas-startShloka+1) + ']' )+ curatedLines[counter] + "\n";
			strCsv = strCsv + shlokamName + ',' + startShloka + ',' + nShlokas + ',' + '-[' +  (nShlokas-startShloka+1) + '],' + curatedLines[counter] + "\n";
			text = text + makeText;
		}
	}
	return text;
}

function assignDhyaanam(peopleForDhyanam, nStart, curatedLines) {
	makeText = fillDahses25("Dhyaanam: 1") + curatedLines[nStart] + "\n";
	strCsv = strCsv + 'Dhyaanam' + ',1,' + curatedLines[nStart] + "\n";
	
/*	if(peopleForDhyanam == 2) {
		makeText = makeText + fillDahses25("Dhyaanam: 4-8") + curatedLines[nStart+1] + "\n";
		strCsv = strCsv + 'Dhyaanam' + ',4,8,,' + curatedLines[nStart+1] + "\n";
	} else {
		makeText = makeText + fillDahses25("Dhyaanam: 4-5") + curatedLines[nStart+1] + "\n";
		strCsv = strCsv + 'Dhyaanam' + ',4,5,,' + curatedLines[nStart+1] + "\n";
		
		makeText = makeText + fillDahses25("Dhyaanam: 6-8") + curatedLines[nStart+2] + "\n";
		strCsv = strCsv + 'Dhyaanam' + ',6,8,,' + curatedLines[nStart+2] + "\n";
	}*/
	return makeText;
}

function loadPeople() {
	if(window.localStorage.getItem("nsp-batchnumber") != '')  document.getElementById('batchnumber').value = window.localStorage.getItem("nsp-batchnumber");
	if(window.localStorage.getItem("nsp-satsangdate") != '')  document.getElementById('satsangdate').value = window.localStorage.getItem("nsp-satsangdate");
	
	var objNames = document.getElementById('names');
	if(window.localStorage.getItem("nsp-names") != '') 
		objNames.value = window.localStorage.getItem("nsp-names");
	else {
		text = '';
		for (let i = 1; i <= 20; i++) {
			text += i + 'person' + '\n'
		}
		objNames.value =  text
	}	
}

function makeItTwenty(curatedLines) {
	total = curatedLines.length
	if (total < 20) loopThrough = Math.ceil(20 / curatedLines.length);
	var curatedLinesNew = [];
	
	for (i = 0; i < loopThrough; i++) {
		for (ctr = 0; ctr < curatedLines.length; ctr++) {
			curatedLinesNew.push(curatedLines[ctr].trim());
		}
	}
	return curatedLinesNew;
}

function fillDahses25(word) {
	currentLength = word.length
	dashesNeeded = 25 - currentLength;
	strDash = '';
	for (i = 1; i <= dashesNeeded; i++) {
		strDash += '-';
	}
	return word + strDash;
}

function shuffle(array) {
  var currentIndex = array.length, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
function rollNames(arr, reverse) {
  if (reverse) arr.unshift(arr.pop());
  else arr.push(arr.shift());
  
  curatedLinesRolled = Array.from(arr);
  return arr;
}

function copyToClipboard(object) {
  var copyText = document.getElementById(object);
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  alert("Copied. You can now paste in your group.");
}

function clearNames() {
  document.getElementById('names').value = '' ;
}

function downloadCSV() {
	var hiddenElement = document.createElement('a'); 
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(strCsv);
    hiddenElement.target = '_blank';
      
    //provide the name for the CSV file to be downloaded
    hiddenElement.download = 'rrs_Allocations.csv';
    hiddenElement.click();
}
function operateNames(strDesign) {
	var txtNames = document.getElementById('names').value;
	var objRandomnames = document.getElementById('randomnames');
	
	var splittedLines = txtNames.split('\n');
	var curatedLines = [];
	for (let i = 0; i < splittedLines.length; i++) {
		if (splittedLines[i].trim()  != "") {
			curatedLines.push(splittedLines[i].trim());
		}
	}
	if (curatedLines.length == 0) {
		alert('There are no names to randomize!');
		return;
	}
	shuffle(curatedLines);
	var text = '';
	for (let i = 0; i < curatedLines.length; i++) { text += curatedLines[i] + '\n'; }
	objRandomnames.value = text;
}

function tempSave() {
	window.localStorage.setItem("nsp-names", document.getElementById('names').value);
	window.localStorage.setItem("nsp-batchnumber", document.getElementById('batchnumber').value);
	window.localStorage.setItem("nsp-satsangdate", document.getElementById('satsangdate').value);
}

function removeNSP(curatedLines) {
	var curatedLinesNew = [];
	for (i = 1; i < curatedLines.length; i++) {
		curatedLinesNew.push(curatedLines[i].trim());
	}
	return curatedLinesNew;
}

function addNSP(curatedLines) {
	var curatedLinesNew = [];
	curatedLinesNew[0] = 'NSP';
	for (i = 0; i < curatedLines.length; i++) {
		curatedLinesNew.push(curatedLines[i].trim());
	}
	return curatedLinesNew;
}

function getRandomName(curatedLines) {
	var randNumber = Math.floor(Math.random() * (curatedLines.length + 1));
	return curatedLines[randNumber];
}

function sendInWhatsApp() {
	var wanumber = document.getElementById('wanumber').value;
	console.log(wanumber);
	var wanumber = wanumber.replace(/[^\d]/g, '');
	console.log(wanumber);
	if(wanumber.length == 10 ) {  location.href = "https://api.whatsapp.com/send?phone=91" + wanumber + "&text=Here is the link to register for upcoming A-Batch: https://forms.gle/Fb7XLQ45GyYNGwcQ6";  }
	else { alert('Please enter 10 digit phone number without +91 prefix.'); }
	
}