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

function tempSave() {
    window.localStorage.setItem("nsp-names", document.getElementById('names').value);
    window.localStorage.setItem("nsp-batchnumber", document.getElementById('batchnumber').value);
    window.localStorage.setItem("nsp-satsangdate", document.getElementById('satsangdate').value);
}

function allocateShlokas(names) {
    const mahaMantras = 38;
    let csvContent = "Shlokam, Start, End, Count, Devotee Name\n";
    let outputText = "*Om Namo Narayana* \n--------------------------------------------\n";

    let batchNumber = "Batch 1";
    let satsangDate = "Date: 1";
    outputText += `Batch Number: ${batchNumber}  [Satsang Date: ${satsangDate}]\n--------------------------------------------\n`;
    
    let avarthiCount = 1;
    let currentIndex = 0;
    while (currentIndex < names.length) {
        outputText += `\n${avarthiCount}-Avarthi\n`;
        
        let selectedNames = names.slice(currentIndex);
        if (selectedNames.length < 3) {
            alert("Not enough people to allocate a full avarthi!");
            return;
        }
        
        outputText += `Nyasa: ------------------${selectedNames[0]}\n`;
        outputText += `Dhyaanam: 1--------------${selectedNames[1]}\n`;
        csvContent += `Nyasa,,,${selectedNames[0]}\n`;
        csvContent += `Dhyaanam,,,${selectedNames[1]}\n`;
        
        let startShloka = 1;
        let shlokaAllocation = selectedNames.slice(2);
        let shlokasPerPerson = Math.ceil(mahaMantras / shlokaAllocation.length);
        
        for (let i = 0; i < shlokaAllocation.length; i++) {
            let endShloka = startShloka + shlokasPerPerson - 1;
            if (endShloka > mahaMantras) endShloka = mahaMantras;
            outputText += `Shlokam: ${startShloka}-${endShloka}-[${endShloka - startShloka + 1}]---------${shlokaAllocation[i]}\n`;
            csvContent += `Shlokam, ${startShloka}, ${endShloka}, ${endShloka - startShloka + 1}, ${shlokaAllocation[i]}\n`;
            startShloka = endShloka + 1;
            if (startShloka > mahaMantras) break;
        }
        
        avarthiCount++;
        currentIndex += selectedNames.length;
    }

    outputText += `\nEnding Prayer: ${names[Math.floor(Math.random() * names.length)]}\n`;
    
    console.log(outputText);
    document.getElementById('allocation').value = outputText;
    downloadCSV(csvContent);
}

function downloadCSV(csvData) {
    let blob = new Blob([csvData], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shloka_allocation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
