var strCsv = '';
var curatedLinesRolled = [];
var purvanghamSlokas = 0;
var mahaMantras = 38;
var phalaShrutiSlokas = 0;

function allocaterrs(strStyle) {
    tempSave();
    strCsv = 'Batch Number,' + window.localStorage.getItem("nsp-batchnumber") + ',,Date,'+ window.localStorage.getItem("nsp-satsangdate") + '\n\n';
    strCsv += 'Shlokam,Start,End,Count,Devotee Name,Backup Chanter\n\n';
    
    var txtNames = document.getElementById('names').value;
    var objallocation = document.getElementById('allocation'); 
    
    var curatedLines = txtNames.split('\n').map(name => name.trim()).filter(name => name);
    if (curatedLines.length == 0) {
        alert('There are no people to allocate!');
        return;
    }
    
    if (curatedLines[0].toUpperCase() == 'NSP') {
        curatedLines = removeNSP(curatedLines);
    }
    
    if (strStyle == 'random') shuffle(curatedLines);
    if (strStyle == 'roll') {
        if (curatedLinesRolled.length == 0) rollNames(curatedLines, true);
        else rollNames(curatedLinesRolled, true);
        curatedLines = [...curatedLinesRolled];
    }
    
    var devoteeCounter = 0;
    
    var totalShlokas = mahaMantras;
    var perPersonShlokas = Math.ceil(totalShlokas / curatedLines.length);
    
    var strStartingPrayerPerson = getRandomName(curatedLines);
    strCsv += 'Starting Prayer: ,,,,' + strStartingPrayerPerson + '\n\n';
    
    var txtNyasa = 'Nyasa: ' + curatedLines[devoteeCounter++] + '\n';
    strCsv += 'Nyasa' + ',,,,' + curatedLines[devoteeCounter - 1] + "\n\n";
    
    var txtShlokam = assignShlokas(mahaMantras, devoteeCounter, curatedLines);
    
    var strEndingPrayerPerson = getRandomName(curatedLines);
    strCsv += 'Ending Prayer: ,,,,' + strEndingPrayerPerson + '\n';
    
    objallocation.value = 'Om Namo Narayana\n' + txtNyasa + '\n' + txtShlokam + '\nEnding Prayer: ' + strEndingPrayerPerson + '\n';
}

function assignShlokas(totalShlokas, startIdx, curatedLines) {
    var text = '';
    var numPeople = curatedLines.length - startIdx;
    var perPerson = Math.floor(totalShlokas / numPeople);
    var remaining = totalShlokas % numPeople;
    var start = 1;
    
    for (let i = startIdx; i < curatedLines.length; i++) {
        let count = perPerson + (remaining-- > 0 ? 1 : 0);
        let end = start + count - 1;
        
        text += `Shlokas ${start}-${end}: ${curatedLines[i]}\n`;
        strCsv += `Shlokam,${start},${end},${end - start + 1},${curatedLines[i]}\n`;
        
        start = end + 1;
    }
    return text;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function rollNames(arr, reverse) {
    if (reverse) arr.unshift(arr.pop());
    else arr.push(arr.shift());
    curatedLinesRolled = [...arr];
}

function getRandomName(curatedLines) {
    return curatedLines[Math.floor(Math.random() * curatedLines.length)];
}
