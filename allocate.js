document.getElementById('allocateButton').addEventListener('click', function() {
    const batchNumber = document.getElementById('batchNumber').value;
    const date = document.getElementById('date').value;
    const names = document.getElementById('names').value.split(',').map(name => name.trim());

    // Simple allocation logic (for demonstration purposes)
    const allocations = names.map((name, index) => {
        return {
            name: name,
            sloka: `Sloka ${index + 1}` // Replace with actual sloka allocation logic
        };
    });

    // Display the allocations
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<h3>Allocations:</h3><ul>' + allocations.map(allocation => `<li>${allocation.name}: ${allocation.sloka}</li>`).join('') + '</ul>';

    // Show the download button
    document.getElementById('downloadButton').style.display = 'block';

    // Prepare CSV download
    document.getElementById('downloadButton').onclick = function() {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Name,Sloka\n" 
            + allocations.map(allocation => `${allocation.name},${allocation.sloka}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "allocations.csv");
        document.body.appendChild(link); // Required for FF

        link.click(); // This will download the data file named "allocations.csv".
    };
});