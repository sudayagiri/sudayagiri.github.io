// JavaScript to allocate Nyasam, Dhyanam, and Shlokas for a satsang event
// Ensures all names are considered and shlokas are distributed evenly

function allocaterrs() {
    // Save all values
    tempSave();
    
    let batchNumber = window.localStorage.getItem("nsp-batchnumber");
    let satsangDate = window.localStorage.getItem("nsp-satsangdate");
    let txtNames = document.getElementById('names').value;
    
    if (!batchNumber || !satsangDate || !txtNames.trim()) {
        alert("Please enter Batch Number, Satsang Date, and Names before proceeding!");
        return;
    }
    
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
    const mahaMantras = 38; // Total shlokas per Avarthi
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

        // If fewer than 3 names available, recycle names without repeating the first 10
        while (selectedNames.length < 3) {
            let extraNames = names.slice(10).sort(() => 0.5 - Math.random()).slice(0, 3 - selectedNames.length);
            selectedNames.push(...extraNames);
        }

        outputText += `Nyasa: ------------------${selectedNames[0]}\n`;
        outputText += `Dhyaanam: 1--------------${selectedNames[1]}\n\n`;
        csvContent += `Nyasa,,,${selectedNames[0]}\n\n`;
        csvContent += `Dhyaanam,,,${selectedNames[1]}\n\n`;

        let startShloka = 1;
        let shlokaAllocation = selectedNames.slice(2);

        // 🔹 **Fix: Distribute shlokas evenly and do not repeat names unnecessarily**
        let totalParticipants = shlokaAllocation.length;
        let shlokasPerPerson = Math.max(1, Math.ceil(mahaMantras / totalParticipants));
        let remainingShlokas = mahaMantras;

        console.log(`Processing Avarthi ${avarthiCount}, Total Participants: ${totalParticipants}`);

        for (let i = 0; i < totalParticipants; i++) {
            let endShloka = startShloka + shlokasPerPerson - 1;
            if (endShloka > mahaMantras) endShloka = mahaMantras;

            outputText += `Shlokam: ${startShloka}-${endShloka}-[${endShloka - startShloka + 1}]---------${shlokaAllocation[i]}\n`;
            csvContent += `Shlokam, ${startShloka}, ${endShloka}, ${endShloka - startShloka + 1}, ${shlokaAllocation[i]}\n`;

            startShloka = endShloka + 1;
            remainingShlokas -= (endShloka - startShloka + 1);
            
            if (startShloka > mahaMantras) break;
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
        alert("No CSV data available to download!!");
        return;
    }
    let blob = new Blob([csvData], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shloka_allocation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
