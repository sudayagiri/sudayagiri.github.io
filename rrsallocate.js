var strCsv = '';
var curatedLinesRolled  = [];
var purvanghamSlokas = 0;
var mahaMantras = 38;
var phalaShrutiSlokas = 0;
var avarthi = 1;
var needmorethan2Shlokas_lastA = 0;
var peoplePerA = [];
var magicNumber = 21;
var numA = 0;
var leftPeople = 0;
var totalPeople = 0;

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
	console.log(strStyle+'curated lines '+ curatedLines);
	if(strStyle == 'random') shuffle(curatedLines);
	if(strStyle == 'roll') {
		if (curatedLinesRolled.length == 0) { console.log('no rolled'); rollNames(curatedLines, true); }
		else { console.log(curatedLinesRolled); rollNames(curatedLinesRolled, true); curatedLines = Array.from(curatedLinesRolled); }
	}	
	//if (curatedLines.length < 20) {
	//	curatedLines = makeItTwenty(curatedLines);
	//	peopleForDhyanam = 1;
	//} else 
		peopleForDhyanam = 1;
	if(isRemovedNSP) { curatedLines = addNSP(curatedLines); }
	
	//==========================================================================================
	calculateAvarthis(curatedLines);
	//Start Processing
	var devoteeCounter = 0;
	var strStartingPrayerPerson = getRandomName(curatedLines);

	
	txtOmNamo = '*Om Namo Narayana* \n';
	txtDashes = '--------------------------------------------\n';
	txtBatchDate = 'Batch Number: ' + window.localStorage.getItem("nsp-batchnumber") + '  [Satsang Date: ' + window.localStorage.getItem("nsp-satsangdate") + ']\n';
	txtPrayer = 'Starting Prayer: ' + strStartingPrayerPerson + '\n\n';
	//strCsv = strCsv + 'Starting Prayer: ,,,,' + strStartingPrayerPerson + '\n' + 'Pledge: ,,,,' + strPledgePerson + '\n\n';
	strCsv = strCsv + 'Starting Prayer: ,,,,' + strStartingPrayerPerson + '\n\n'; //new line by NSP
	//===================================================================================================

	for (i=1; i<=numA; i++) {
	
	nStart = devoteeCounter;  nEnd = devoteeCounter + 1; devoteeCounter = nEnd;
	txtNyasaa = fillDahses25("Nyasa: ") + curatedLines[nStart] + '\n';
	strCsv = strCsv + 'Nyasa' + ',,,,' + curatedLines[nStart] + "\n\n";
	
	nStart = devoteeCounter;  nEnd = devoteeCounter + peopleForDhyanam; devoteeCounter = nEnd;
	txtDhyaaanam = assignDhyaanam(peopleForDhyanam, nStart, curatedLines);
	strCsv = strCsv + '\n';
	
	nStart = devoteeCounter;  nEnd = devoteeCounter + peoplePerA[i]-2; devoteeCounter = nEnd;
	txtShlokam = assignShlokas(mahaMantras, nStart, nEnd, curatedLines, 'Shlokam', (peoplePerA[i]-2));
	strCsv = strCsv + '\n';
	}

	//===================================================================================================
	var strEndingPrayerPerson = getRandomName(curatedLines);
	txtEndingPrayer = 'Ending Prayer: ' + strEndingPrayerPerson + '\n';
	strCsv = strCsv + 'Ending Prayer: ,,,,' + strEndingPrayerPerson + '\n';
	
	objallocation.value = txtOmNamo + txtDashes + txtBatchDate + txtDashes + txtPrayer + '\n' + txtNyasaa + '\n' + txtDhyaaanam + '\n' + txtShlokam  + '\n' + txtEndingPrayer;
	
	
}

function assignShlokas(nShlokas, nStart, nEnd, curatedLines, shlokamName, totalPeople ) {

	var perpersonShlokasDecimal = nShlokas / totalPeople;
	//var perpersonShlokasDecimal = 2;
	console.log(totalPeople + ' ppl with ' + perpersonShlokasDecimal + ' each ' + peoplePerA[1]+ '    ---1');
	
	var startShloka = 1;
	var text = '';
	var counter = nStart;
	var nPending = 0;
	
		
	for (let i = 1; i <= totalPeople; i++) {
		nResultant = nPending + perpersonShlokasDecimal;
		nTotalShlokas = Math.floor(nResultant);
		nPending = nResultant - nTotalShlokas;
		endShlokaNumber = startShloka + nTotalShlokas-1;				   		
		
			makeText = fillDahses25(shlokamName + ": " + startShloka + "-" + endShlokaNumber + '-[' + (endShlokaNumber-startShloka+1) + ']')+ curatedLines[counter] + "\n";
			strCsv = strCsv + shlokamName + ',' + startShloka + ',' + endShlokaNumber + ',' + '-[' +  (endShlokaNumber-startShloka+1) + '],' + curatedLines[counter] + "\n";
			
			startShloka = endShlokaNumber + 1;
			counter++;
			text = text + makeText;
		
		}
	
	return text;}

function assignDhyaanam(peopleForDhyanam, nStart, curatedLines) {
	makeText = fillDahses25("Dhyaanam: 1") + curatedLines[nStart] + "\n";
	strCsv = strCsv + 'Dhyaanam' + ',1,' + curatedLines[nStart] + "\n";
	
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
function calculateAvarthis(curatedLines) {
	 console.log( curatedLines.length + 'curatedLines.length ');
    if(curatedLines.length > magicNumber) {
		numA = Math.round(curatedLines.length / magicNumber);
		
		leftPeople = curatedLines.length % magicNumber; //magicNumber is 21 19 + 2 -> 19*2=38, 1 nyasam, 1 dhyanam
		if (leftPeople >= 12 && leftPeople <=20) {
			numA = numA + 1;
			needmorethan2Shlokas_lastA = 1; //means more than 2 people per person
		 }
		 else if (leftPeople <=11 && leftPeople > 0 ){
			 adjustAvarthiListwithLeftPeople = 1;
		 }
		 else {
			 //no need further allocation, since zero remaining people
		 }
		
		 console.log(numA + '- if case total Avarthis');
	}
	else {
		//total people are <= 21
		needmorethan2Shlokas_lastA = 1;
		 leftPeople = curatedLines.length;
		 numA = 1;
		console.log(numA + '- else case total Avarthis');
	     }
	  
	 console.log(numA + '-total Avarthis' + leftPeople + '-leftpeople');
	 var arrayAdjustleftpeopleforAvarti = [0] ;
	 var prevpplcount = 0; 
	 for (i=1;i<=numA;i++){
		if(numA >= 2) {
		arrayAdjustleftpeopleforAvarti[i] = Math.ceil(((leftPeople-prevpplcount)/(numA-i-1)));
		}
		prevpplcount = prevpplcount+arrayAdjustleftpeopleforAvarti[i];
		
		if(i==numA) {
		    if(needmorethan2Shlokas_lastA ==1){
			  peoplePerA[i] = leftPeople; 
			  console.log(peoplePerA + 'people for Avarthi' + i);
		     }
		}
        else {
			if(adjustAvarthiListwithLeftPeople == 1) {
				peoplePerA[i] = magicNumber + arrayAdjustleftpeopleforAvarti[i];
                console.log(peoplePerA + 'else-1 people for Avarthi' + i);				
			}
			else {
				peoplePerA[i] = magicNumber;
				console.log(peoplePerA + 'else-2 people for Avarthi' + i);
			}
		}
	 }
}
			