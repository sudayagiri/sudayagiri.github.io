// JavaScript to allocate Nyasam, Dhyanam, and Shlokas for a satsang event
// Ensures all participants are assigned correctly and avoids unnecessary repetition

function allocaterrs() {
    // Save user input before processing
    tempSave();
    
    let batchNumber = window.localStorage.getItem("nsp-batchnumber");
    let satsangDate = window.localStorage.getItem("nsp-satsangdate");
    let txtNames = document.getElementById('names').value;
    
    // Validate if required fields are provided
    if (!batchNumber || !satsangDate || !txtNames.trim()) {
        alert("Please enter Batch Number, Satsang Date, and Names before proceeding!");
        return;
    }

    // Process names: Remove spaces and empty lines
    let splittedLines = txtNames.split('\n').map(name => name.trim()).filter(name => name !== "");
    if (splittedLines.length === 0) {
        alert('There are no people to allocate!');
        return;
    }
    
    allocateShlokas(splittedLines);
}

// Function to save user input in local storage
function tempSave() {
    window.localStorage.setItem("nsp-names", document.getElementById('names').value);
    window.localStorage.setItem("nsp-batchnumber", document.getElementById('batchnumber').value);
    window.localStorage.setItem("nsp-satsangdate", document.getElementById('satsangdate').value);
}

// Function to allocate shlokas to participants
function allocateShlokas(names) {
    const mahaMantras = 38; // Total shlokas per avarthi
	let actualParticipantsofAvarthi = 0; //avarthi actual allocation after division of shlokas by people
    let csvContent = `Batch Number,,${window.localStorage.getItem("nsp-batchnumber")},,Date,${window.localStorage.getItem("nsp-satsangdate")}\n\n`;
    csvContent += "Shlokam, Start, End, Count, Devotee Name\n\n";
    let outputText = "*Om Namo Narayana* \n--------------------------------------------\n";

    let batchNumber = window.localStorage.getItem("nsp-batchnumber");
    let satsangDate = window.localStorage.getItem("nsp-satsangdate");
    outputText += `Batch Number: ${batchNumber}  [Satsang Date: ${satsangDate}]\n--------------------------------------------\n\n`;

    let avarthiCount = 1;
    let currentIndex = 0;
    let firstTenNames = names.slice(0, 10); // Store the first 10 names
    let remainingNames = names.slice(10); // Names excluding the first 
	 console.log('\n total number of names :', names.length, '\n', names,'\n');

    while (currentIndex < names.length) {
        outputText += `\n${avarthiCount}-Avarthi\n`;
		        
        // Select names for the current avarthi (Nyasa, Dhyaanam, and Shlokams)
        let selectedNames = names.slice(currentIndex, currentIndex + mahaMantras + 2);
		
		
         console.log('\n selectedNames:\n', selectedNames, 'selectedNames.length:', selectedNames.length,'\n');
        // Ensure at least 3 names are available for Nyasam, Dhyanam, and Shlokam allocation
        while (selectedNames.length < 3) {
			if(names.length >= 15){
            let extraNames = remainingNames.sort(() => 0.5 - Math.random()).slice(0, 3 - selectedNames.length);
            selectedNames.push(...extraNames);
			}
			else { shlokaAllocation.push(names.sort(() => 0.5 - Math.random()).slice(0, mahaMantras - shlokaAllocation.length);
		      }
		  }

        outputText += `Nyasa: ------------------${selectedNames[0]}\n`;
        outputText += `Dhyaanam: 1--------------${selectedNames[1]}\n\n`;
        csvContent += `Nyasa,,,${selectedNames[0]}\n\n`;
        csvContent += `Dhyaanam,,,${selectedNames[1]}\n\n`;

        let startShloka = 1;
        let shlokaAllocation = selectedNames.slice(2);

        // Ensure we allocate 38 shlokas by adding extra names if needed (excluding the first 10 names)
let unusedNames = names.filter(name => !shlokaAllocation.includes(name));
   console.log('\n unused names:\n', unusedNames);

while (shlokaAllocation.length < mahaMantras) {
    if (unusedNames.length > 0) {
        // Take from unused names first
        shlokaAllocation.push(unusedNames.shift());
    } else {
        // If all names are used, start picking again (excluding the first 10 names)
		if(names.lengh >= 15){
        let extraNames = remainingNames.sort(() => 0.5 - Math.random()).slice(0, mahaMantras - shlokaAllocation.length);
        shlokaAllocation.push(...extraNames);
		console.log('extra names:',extranames, '\n');
		}
		else { shlokaAllocation.push(names.sort(() => 0.5 - Math.random()).slice(0, mahaMantras - shlokaAllocation.length);
		}
    }
}
        let remainingShlokas = mahaMantras;
        let remainingParticipants = shlokaAllocation.length;
        let shlokasPerPerson = Math.min(5, Math.floor(remainingShlokas / remainingParticipants));

        console.log(`Processing Avarthi ${avarthiCount}, Total Participants: ${shlokaAllocation.length}`);

        for (let i = 0; i < shlokaAllocation.length; i++) {
            let endShloka = startShloka + shlokasPerPerson - 1;
            if (endShloka > mahaMantras) endShloka = mahaMantras;

            outputText += `Shlokam: ${startShloka}-${endShloka}-[${endShloka - startShloka + 1}]---------${shlokaAllocation[i]}\n`;
            csvContent += `Shlokam, ${startShloka}, ${endShloka}, ${endShloka - startShloka + 1}, ${shlokaAllocation[i]}\n`;

            startShloka = endShloka + 1;
            remainingShlokas -= (endShloka - startShloka + 1);
            remainingParticipants--;
			actualParticipantsofAvarthi++;

            if (startShloka > mahaMantras) break;

            if (remainingParticipants > 0) {
                shlokasPerPerson = Math.min(5, Math.ceil(remainingShlokas / remainingParticipants));
            }
        }

        currentIndex += actualParticipantsofAvarthi + 2;
		actualParticipantsofAvarthi = 0;
        avarthiCount++;
			 console.log('currentIndex:',currentIndex,' avarthiCount:', avarthiCount, ' startShloka:', startShloka, 'names total:', names.length);
    }

    // Select a random ending prayer person from available names
    let endingPrayerPerson = names[Math.floor(Math.random() * names.length)];
    outputText += `\nEnding Prayer: ${endingPrayerPerson}\n`;
    csvContent += `\nEnding Prayer,,,${endingPrayerPerson}\n`;

    console.log(outputText);
    document.getElementById('allocation').value = outputText;
    window.localStorage.setItem("csvData", csvContent);
}

// Function to load stored names into the input field
function loadPeople() {
    let storedNames = window.localStorage.getItem("nsp-names");
    if (storedNames) {
        document.getElementById('names').value = storedNames;
    }
}

// Function to download CSV output
function downloadCSV() {
    let csvData = window.localStorage.getItem("csvData");
    if (!csvData) {
        alert("No CSV data available to download!!");
        return;
    }
    let blob = new Blob([csvData], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'rrs_allocation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
