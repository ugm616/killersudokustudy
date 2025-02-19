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
        const MAX_SUM = 45; // Set maximum sum to 45
        
        // Calculate min sums for each digit count
        const minSums = {};
        for (let digits = 2; digits <= 9; digits++) {
            // Sum of first 'digits' numbers (e.g., for 3 digits: 1+2+3)
            minSums[digits] = (digits * (digits + 1)) / 2;
        }

        // Generate rows from minimum possible sum (3 for 2 digits) to 45
        for (let sum = 3; sum <= MAX_SUM; sum++) {
            const row = document.createElement('tr');
            const sumCell = document.createElement('td');
            sumCell.textContent = sum;
            row.appendChild(sumCell);

            // Generate columns for each digit count (2 to 9)
            for (let digits = 2; digits <= 9; digits++) {
                const cell = document.createElement('td');
                
                // Check if sum is possible with this many digits
                if (sum >= minSums[digits] && sum <= MAX_SUM) {
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
