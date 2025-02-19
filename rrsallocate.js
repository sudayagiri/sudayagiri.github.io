var strCsv = '';
var curatedLinesRolled = [];
var purvanghamSlokas = 0;
var mahaMantras = 38;
var phalaShrutiSlokas = 0;
var avarthi = 1;

function allocaterrs(strStyle) {
    strCsv = 'Batch Number,' + window.localStorage.getItem("nsp-batchnumber") + ',,Date,'+ window.localStorage.getItem("nsp-satsangdate") + '\n\n';
    strCsv += 'Shlokam,Start,End,Count,Devotee Name,Backup Chanter' + '\n\n';
    var txtNames = document.getElementById('names').value;
    var objallocation = document.getElementById('allocation');
    var text = '';
    var isRemovedNSP = false;

    var splittedLines = txtNames.split('\n');
    var curatedLines = [];
    var nspNames = [];

    for (let i = 0; i < splittedLines.length; i++) {
        let name = splittedLines[i].trim();
        if (name !== "") {
            if (name.toUpperCase() === "NSP") {
                if (!isRemovedNSP) {
                    nspNames.push(name);
                    isRemovedNSP = true;
                }
            } else {
                curatedLines.push(name);
            }
        }
    }

    if (curatedLines.length === 0) {
        alert('There are no people to allocate!');
        return;
    }

    if (curatedLines.length < 20) {
        curatedLines = makeItTwenty(curatedLines);
    }

    curatedLines = nspNames.concat(curatedLines);

    var devoteeCounter = 0;
    var total = purvanghamSlokas + mahaMantras + phalaShrutiSlokas;
    var totalDevotees = curatedLines.length - 1;
    var perPersonApprox = Math.round(total / totalDevotees);
    var peopleForShlokas = totalDevotees;

    var strStartingPrayerPerson = getRandomName(curatedLines);
    strCsv += 'Starting Prayer: ,,,,' + strStartingPrayerPerson + "\n\n";

    nStart = devoteeCounter;  nEnd = devoteeCounter + 1; devoteeCounter = nEnd;
    txtNyasaa = fillDahses25("Nyasa: ") + curatedLines[nStart] + '\n';
    strCsv += 'Nyasa' + ',,,,' + curatedLines[nStart] + "\n\n";

    nStart = devoteeCounter;  nEnd = devoteeCounter + 1; devoteeCounter = nEnd;
    txtDhyaaanam = assignDhyaanam(1, nStart, curatedLines);
    strCsv += '\n';

    nStart = devoteeCounter;  nEnd = devoteeCounter + peopleForShlokas;
    txtShlokam = assignShlokas(mahaMantras, nStart, nEnd, curatedLines, 'Shlokam');
    strCsv += '\n';

    var strEndingPrayerPerson = getRandomName(curatedLines);
    txtEndingPrayer = 'Ending Prayer: ' + strEndingPrayerPerson + '\n';
    strCsv += 'Ending Prayer: ,,,,' + strEndingPrayerPerson + '\n';

    objallocation.value = txtNyasaa + '\n' + txtDhyaaanam + '\n' + txtShlokam + '\n' + txtEndingPrayer;
}

function assignShlokas(nShlokas, nStart, nEnd, curatedLines, shlokamName) {
    var totalPeople = nEnd - nStart;
    var perpersonShlokasDecimal = Math.floor(nShlokas / totalPeople);
    var startShloka = 1;
    var text = '';
    var counter = nStart;
    var avarthiCounter = 1;
    var remainingPeople = totalPeople;

    text += avarthiCounter + '--Avarthi' + "\n";

    for (let i = 1; i <= totalPeople; i++) {
        let endShlokaNumber = startShloka + perpersonShlokasDecimal - 1;
        if (endShlokaNumber > mahaMantras) {
            endShlokaNumber = mahaMantras;
        }

        if (i != totalPeople) {
            let makeText = fillDahses25(shlokamName + ": " + startShloka + "-" + endShlokaNumber) + curatedLines[counter] + "\n";
            strCsv += shlokamName + ',' + startShloka + ',' + endShlokaNumber + ',' + curatedLines[counter] + "\n";
            remainingPeople--;

            if (endShlokaNumber === mahaMantras && remainingPeople > 5) {
                avarthiCounter++;
                text += avarthiCounter + '-Avarthi' + "\n";
            } else if (remainingPeople <= 5) {
                break;
            }

            startShloka = endShlokaNumber + 1;
            counter++;
            text += makeText;
        }
    }
    return text;
}
