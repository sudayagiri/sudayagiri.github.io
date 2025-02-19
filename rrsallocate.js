function allocateChanting(strStyle) {
    tempSave();
    
    var txtNames = document.getElementById('names').value;
    var objallocation = document.getElementById('allocation');
    
    var splittedLines = txtNames.split('\n').map(name => name.trim()).filter(name => name !== "");
    if (splittedLines.length === 0) {
        alert('There are no people to allocate!');
        return;
    }
    
    if (strStyle === 'random') shuffle(splittedLines);
    
    let totalSlokas = 38;
    let avarthi = 1;
    let personIndex = 0;
    let text = "";
    
    while (personIndex < splittedLines.length) {
        text += `Avarthi ${avarthi}\n`;
        
        // Assign Nyasam
        text += `Nyasam: ${splittedLines[personIndex]}\n`;
        personIndex = (personIndex + 1) % splittedLines.length;
        
        // Assign Dhyanam
        text += `Dhyanam: ${splittedLines[personIndex]}\n`;
        personIndex = (personIndex + 1) % splittedLines.length;
        
        // Assign Slokas
        let slokasPerPerson = Math.ceil(totalSlokas / (splittedLines.length - personIndex));
        let startSloka = 1;
        for (; personIndex < splittedLines.length; personIndex++) {
            let endSloka = Math.min(startSloka + slokasPerPerson - 1, totalSlokas);
            text += `Slokas ${startSloka}-${endSloka}: ${splittedLines[personIndex]}\n`;
            if (endSloka === totalSlokas) break;
            startSloka = endSloka + 1;
        }
        
        avarthi++;
    }
    
    objallocation.value = text;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
