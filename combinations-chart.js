document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('combinationsTable');
    const modal = document.getElementById('combinationModal');
    const closeButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');

    // Generate combinations function (same as before)
    function generateCombinations(cellCount, total) {
        const results = [];
        
        function backtrack(remaining, sum, combo, start) {
            if (remaining === 0) {
                if (sum === total) {
                    results.push([...combo]);
                }
                return;
            }
            
            for (let i = start; i <= 9; i++) {
                if (sum + i > total) break;
                combo.push(i);
                backtrack(remaining - 1, sum + i, combo, i + 1);
                combo.pop();
            }
        }
        
        backtrack(cellCount, 0, [], 1);
        return results;
    }

    // Generate table content
    function generateTable() {
        const tbody = table.querySelector('tbody');
        
        // Calculate min and max sums for each digit count
        const minMaxSums = {};
        for (let digits = 2; digits <= 9; digits++) {
            const min = (digits * (digits + 1)) / 2; // Sum of first 'digits' numbers
            const max = ((19 - digits) * digits) / 2 + 45; // Sum of last 'digits' numbers
            minMaxSums[digits] = { min: Math.floor(min), max: Math.floor(max) };
        }

        // Find overall min and max
        const minSum = Math.min(...Object.values(minMaxSums).map(x => x.min));
        const maxSum = Math.max(...Object.values(minMaxSums).map(x => x.max));

        // Generate rows
        for (let sum = minSum; sum <= maxSum; sum++) {
            const row = document.createElement('tr');
            const sumCell = document.createElement('td');
            sumCell.textContent = sum;
            row.appendChild(sumCell);

            // Generate columns for each digit count
            for (let digits = 2; digits <= 9; digits++) {
                const cell = document.createElement('td');
                const { min, max } = minMaxSums[digits];

                if (sum >= min && sum <= max) {
                    const combinations = generateCombinations(digits, sum);
                    if (combinations.length > 0) {
                        const link = document.createElement('a');
                        link.className = 'combination-link';
                        link.textContent = combinations.length;
                        link.onclick = () => showCombinations(combinations, digits, sum);
                        cell.appendChild(link);
                    } else {
                        cell.textContent = '0';
                    }
                } else {
                    cell.textContent = '-';
                }
                
                row.appendChild(cell);
            }
            
            tbody.appendChild(row);
        }
    }

    // Show combinations in modal
    function showCombinations(combinations, digits, sum) {
        modalTitle.textContent = `Combinations for ${digits} digits summing to ${sum}`;
        modalContent.innerHTML = '';

        combinations.forEach(combo => {
            const div = document.createElement('div');
            div.className = 'combination-item';
            div.textContent = combo.join(', ');
            modalContent.appendChild(div);
        });

        modal.style.display = 'block';
    }

    // Close modal
    closeButton.onclick = () => {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Initialize the table
    generateTable();
});
