document.addEventListener('DOMContentLoaded', () => {
    const cageForm = document.getElementById('cageForm');
    const combinationsList = document.getElementById('combinations-list');
    const excludeNumbers = document.getElementById('excludeNumbers');
    const applyFilter = document.getElementById('applyFilter');
    
    let currentCombinations = [];

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

    function displayCombinations(combinations) {
        currentCombinations = combinations;
        combinationsList.innerHTML = '';
        
        if (combinations.length === 0) {
            combinationsList.innerHTML = '<p>No valid combinations found.</p>';
            return;
        }

        combinations.forEach(combo => {
            const div = document.createElement('div');
            div.className = 'combination';
            div.textContent = combo.join(', ');
            combinationsList.appendChild(div);
        });
    }

    function filterCombinations(excludedNumbers) {
        const filtered = currentCombinations.filter(combo => {
            return !combo.some(num => excludedNumbers.includes(num));
        });
        displayCombinations(filtered);
    }

    cageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cellCount = parseInt(document.getElementById('cellCount').value);
        const total = parseInt(document.getElementById('cageTotal').value);
        
        if (cellCount < 1 || cellCount > 9 || total < 1 || total > 45) {
            alert('Please enter valid numbers (cells: 1-9, total: 1-45)');
            return;
        }

        const combinations = generateCombinations(cellCount, total);
        displayCombinations(combinations);
    });

    applyFilter.addEventListener('click', () => {
        const excluded = excludeNumbers.value
            .split(' ')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num) && num >= 1 && num <= 9);

        filterCombinations(excluded);
    });

    // Clear filter when input is empty
    excludeNumbers.addEventListener('input', () => {
        if (excludeNumbers.value.trim() === '') {
            displayCombinations(currentCombinations);
        }
    });
});
