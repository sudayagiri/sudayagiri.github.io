// JavaScript to allocate Nyasam, Dhyanam, and Shlokas for a satsang event
// Reads a list of names and assigns them in full Avarthi sets

function allocaterrs(strStyle) {
    // Save all values
    tempSave();
    
    let strCsv = 'Batch Number,' + window.localStorage.getItem("nsp-batchnumber") + ',,Date,'+ window.localStorage.getItem("nsp-satsangdate") + '\n\n';
    strCsv += 'Shlokam,Start,End,Count,Devotee Name,Backup Chanter' + '\n\n';
    
    let txtNames = document.getElementById('names').value;
    let objallocation = document.getElementById('allocation'); 
    let text = '';
    let isRemovedNSP = false;
    
    // Names - remove spaces and new lines
    let splittedLines = txtNames.split('\n');
    let curatedLines = [];
    for (let i = 0; i < splittedLines.length; i++) {
        if (splittedLines[i].trim() !== "") {
            curatedLines.push(splittedLines[i].trim());
        }
    }
    if (curatedLines.length === 0) {
        alert('There are no people to allocate!');
        return;
    }
    if (curatedLines[0].toUpperCase() === 'NSP') { 
        curatedLines = removeNSP(curatedLines);
        isRemovedNSP = true;
    }
    
    allocateShlokas(curatedLines);
}

function allocateShlokas(names) {
    const mahaMantras = 38; // Total shlokas per avarthi
    const peoplePerAvarthi = 20; // Number of people in one complete set (Nyasam + Dhyanam + 38 Shlokas)
    let csvContent = "Shlokam, Start, End, Count, Devotee Name\n";
    let outputText = "*Om Namo Narayana* \n--------------------------------------------\n";

    let batchNumber = "Batch 1";
    let satsangDate = "Date: 1";
    outputText += `Batch Number: ${batchNumber}  [Satsang Date: ${satsangDate}]\n--------------------------------------------\n`;
    
    let currentIndex = 0;
    let avarthiCount = 1;

    while (currentIndex < names.length) {
        outputText += `\n${avarthiCount}-Avarthi\n`;
        
        let startIndex = currentIndex;
        let selectedNames = names.slice(startIndex, startIndex + peoplePerAvarthi);
        
        if (selectedNames.length < peoplePerAvarthi) {
            let additionalNames = names.slice(5, 5 + (peoplePerAvarthi - selectedNames.length));
            selectedNames = selectedNames.concat(additionalNames);
        }
        
        outputText += `Nyasa: ------------------${selectedNames[0]}\n`;
        outputText += `Dhyaanam: 1--------------${selectedNames[1]}\n`;
        csvContent += `Nyasa,,,${selectedNames[0]}\n`;
        csvContent += `Dhyaanam,,,${selectedNames[1]}\n`;
        
        let startShloka = 1;
        for (let i = 2; i < selectedNames.length; i++) {
            let endShloka = startShloka + 1;
            outputText += `Shlokam: ${startShloka}-${endShloka}-[2]---------${selectedNames[i]}\n`;
            csvContent += `Shlokam, ${startShloka}, ${endShloka}, 2, ${selectedNames[i]}\n`;
            startShloka = endShloka + 1;
        }
        
        avarthiCount++;
        currentIndex += peoplePerAvarthi;
    }

    // Add ending prayer
    outputText += `\nEnding Prayer: ${names[Math.floor(Math.random() * names.length)]}\n`;
    
    console.log(outputText);
    downloadCSV(csvContent);
}

// Function to download CSV file
function downloadCSV(csvData) {
    let blob = new Blob([csvData], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shloka_allocation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
