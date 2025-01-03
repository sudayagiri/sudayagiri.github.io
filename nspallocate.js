// Simulated Google Sheets data
let spreadsheet = {
    sheets: {
        "Sheet1": {
            data: [
                ["Name1"],
                ["Name2"],
                ["Name3"],
                ["Name4"],
                ["Name5"],
                ["Name6"],
                ["Name7"],
                // Add more names as needed
            ]
        },
        "AllocateSloka": {
            data: []
        }
    },
    getSheetByName: function(name) {
        return this.sheets[name] || null;
    },
    insertSheet: function(name) {
        this.sheets[name] = { data: [] };
        return this.sheets[name];
    }
};

function allocateSlokas(batchNumber, date, names) {
    /*const sourceSheet = spreadsheet.getSheetByName("Sheet1");

    // Check if the source sheet exists
    if (!sourceSheet) {
        console.log("Source sheet 'Sheet1' not found.");
        return;
    }*/

    // Get the range of names
 //   const namesArray = sourceSheet.data.map(row => row[0]).filter(name => name); // Flatten and filter out empty names
      const namesArray = names;

    // Create or clear the destination sheet
    const destinationSheetName = "AllocateSloka";
    let destinationSheet = spreadsheet.getSheetByName(destinationSheetName);

    if (destinationSheet) {
        // Clear the existing sheet if it exists
        destinationSheet.data = [];
    } else {
        // Create a new sheet if it doesn't exist
        destinationSheet = spreadsheet.insertSheet(destinationSheetName);
    }

    // Check if there are any names
    if (namesArray.length <= 5) {
        const alertMessage = "ALERT - No sufficient names found. Need at least 5 names for Satsang";
        destinationSheet.data.push([alertMessage]);
        console.log(alertMessage);
        return;
    }

    const slokaCount = 154;
    let rowIndex = 0;
    const mahamantradivision = Math.floor(slokaCount / (namesArray.length - 5));
    let startslokas = 1;
    let slokaincrement = mahamantradivision;

    if (mahamantradivision < 3 && mahamantradivision >= 1) {
        slokaincrement = 3;
    } else if (mahamantradivision < 1) {
        const alertMessage = "ALERT - Create another Satsang as 1-Hour time is too short!";
        destinationSheet.data.push([alertMessage]);
        console.log(alertMessage);
        return;
    }

    // Set headers
    destinationSheet.data.push(["BATCH:", batchNumber]);
    destinationSheet.data.push(["DATE:", date]);
    destinationSheet.data.push(["STARTING PRAYER:"]);
    destinationSheet.data.push(["ENDING PRAYER"]);
    destinationSheet.data.push(["NAME", "START", "END", "CATEGORY"]);

    // Allocate slokas
    for (let i = 0; i < Math.min(5, namesArray.length); i++) {
        const name = namesArray[i];
        if (name) {
            destinationSheet.data.push([name, startslokas, startslokas + 3, "పూర్వాంగం"]);
            startslokas += slokaincrement;
            rowIndex++;
        }
    }

    // Generate CSV from the allocated data
    generateCSV(destinationSheet.data);
}

function generateCSV(data) {
    // Convert the data array to CSV format
    const csvContent = data.map(row => row.join(",")).join("\n");

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a link element to download the CSV
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "allocations.csv");
    document.body.appendChild(link); // Required for Firefox

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
}

// Example usage
document.getElementById('allocateButton').addEventListener('click', function() {
    const batchNumber = document.getElementById('batchNumber').value;
    const date = document.getElementById('date').value;
    const names = document.getElementById('names').value.split(',').map(name => name.trim());

    allocateSlokas(batchNumber,date, names)