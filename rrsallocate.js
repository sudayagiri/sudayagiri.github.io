// JavaScript to allocate Nyasam, Dhyanam, and Shlokas for a satsang event
// Reads a list of names and assigns them in full Avarthi sets

function allocaterrs(strStyle) {
    // Save all values
    tempSave();
    
    let batchNumber = window.localStorage.getItem("nsp-batchnumber");
    let satsangDate = window.localStorage.getItem("nsp-satsangdate");
    let txtNames = document.getElementById('names').value;
    
    if (!batchNumber || !satsangDate || !txtNames.trim()) {
        alert("Please enter Batch Number, Satsang Date, and Names before proceeding!");
        return;
    }
    
    let objallocation = document.getElementById('allocation'); 
    
    // Names - remove spaces and new lines
    let names = txtNames.split('\n').map(name => name.trim()).filter(name => name !== "");
    if (names.length === 0) {
        alert('There are no people to allocate!');
        return;
    }
    
    allocateShlokas(names);
}

function tempSave() {
    window.localStorage.setItem("nsp-names", document.getElementById('names').value);
    window.localStorage.setItem("nsp-batchnumber", document.getElementById('batchnumber').value);
    window.localStorage.setItem("nsp-satsangdate", document.getElementById('satsangdate').value);
}

function allocateShlokas(names) {
    const mahaMantras = 38;
    let csvContent = `Batch Number,,${window.localStorage.getItem("nsp-batchnumber")},,Date,${window.localStorage.getItem("nsp-satsangdate")}\n\n`;
    csvContent += "Shlokam, Start, End, Count, Devotee Name\n\n";
    let outputText = "*Om Namo Narayana* \n--------------------------------------------\n";

    let batchNumber = window.localStorage.getItem("nsp-batchnumber");
    let satsangDate = window.localStorage.getItem("nsp-satsangdate");
    outputText += `Batch Number: ${batchNumber}  [Satsang Date: ${satsangDate}]\n--------------------------------------------\n\n`;
    
    let avarthiCount = 1;
    let currentIndex = 0;

    while (currentIndex < names.length) {
        outputText += `\n${avarthiCount}-Avarthi\n`;
        
        let selectedNames = names.slice(currentIndex, currentIndex + mahaMantras + 2);
        
        if (selectedNames.length < 3) {
            let extraNames = names.slice(10).sort(() => 0.5 - Math.random()).slice(0, 3 - selectedNames.length);
            selectedNames.push(...extraNames);
        }
        
        outputText += `\nNyasa: ------------------${selectedNames[0]}\n`;
        outputText += `Dhyaanam: 1--------------${selectedNames[1]}\n\n`;
        csvContent += `\nNyasa,,,${selectedNames[0]}\n\n`;
        csvContent += `Dhyaanam,,,${selectedNames[1]}\n\n`;
        
        let startShloka = 1;
        let shlokaAllocation = selectedNames.slice(2);

        if (shlokaAllocation.length < mahaMantras) {
            let extraNames = names.slice(10).sort(() => 0.5 - Math.random()).slice(0, mahaMantras - shlokaAllocation.length);
            shlokaAllocation.push(...extraNames);
        }
        
        let remainingShlokas = mahaMantras;
        let remainingParticipants = shlokaAllocation.length;
        let shlokasPerPerson = Math.min(5, Math.ceil(remainingShlokas / remainingParticipants));
        
        console.log(`Processing Avarthi ${avarthiCount}, Total Participants: ${shlokaAllocation.length}`);
        
        for (let i = 0; i < shlokaAllocation.length; i++) {
            let endShloka = startShloka + shlokasPerPerson - 1;
            if (endShloka > mahaMantras) endShloka = mahaMantras;
            
            outputText += `Shlokam: ${startShloka}-${endShloka}-[${endShloka - startShloka + 1}]---------${shlokaAllocation[i]}\n`;
            csvContent += `Shlokam, ${startShloka}, ${endShloka}, ${endShloka - startShloka + 1}, ${shlokaAllocation[i]}\n`;
            
            startShloka = endShloka + 1;
            remainingShlokas -= (endShloka - startShloka + 1);
            remainingParticipants--;
            
            if (startShloka > mahaMantras) break;
            
            if (remainingParticipants > 0) {
                shlokasPerPerson = Math.min(5, Math.ceil(remainingShlokas / remainingParticipants));
            }
        }

        currentIndex += mahaMantras + 2;
        avarthiCount++;
    }
    
    let endingPrayerPerson = names[Math.floor(Math.random() * names.length)];
    outputText += `\nEnding Prayer: ${endingPrayerPerson}\n`;
    csvContent += `\nEnding Prayer,,,${endingPrayerPerson}\n`;
    
    console.log(outputText);
    document.getElementById('allocation').value = outputText;
    window.localStorage.setItem("csvData", csvContent);
}

function downloadCSV() {
    let csvData = window.localStorage.getItem("csvData");
    if (!csvData) {
        alert("No CSV data available to download!!!");
        return;
    }
    let blob = new Blob([csvData], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'RRS_shloka_allocation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
