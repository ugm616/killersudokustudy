document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const MAX_SUM = 45;
    const MIN_DIGITS = 2;
    const MAX_DIGITS = 9;
    let chart = null;

    // DOM Elements
    const modal = document.getElementById('customModal');
    const closeButton = document.querySelector('.close-button');
    const applyButton = document.getElementById('applySelections');

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

    // Generate dataset
    function generateDataset() {
        const dataset = {};
        
        for (let digits = MIN_DIGITS; digits <= MAX_DIGITS; digits++) {
            dataset[digits] = {};
            for (let sum = 3; sum <= MAX_SUM; sum++) {
                const combinations = generateCombinations(digits, sum);
                if (combinations.length > 0) {
                    dataset[digits][sum] = combinations.length;
                }
            }
        }
        
        return dataset;
    }

    // Create chart
    function createChart(data, selectedDigits = null, selectedSums = null) {
        const ctx = document.getElementById('combinationsGraph').getContext('2d');
        
        // Destroy existing chart if it exists
        if (chart) {
            chart.destroy();
        }

        // Prepare datasets
        const datasets = [];
        const digits = selectedDigits || Object.keys(data);
        
        digits.forEach(digit => {
            const sums = selectedSums || Object.keys(data[digit]);
            const values = [];
            sums.forEach(sum => {
                if (data[digit][sum]) {
                    values.push({
                        x: parseInt(sum),
                        y: data[digit][sum]
                    });
                }
            });

            if (values.length > 0) {
                datasets.push({
                    label: `${digit} Digits`,
                    data: values,
                    borderColor: getColor(digit),
                    backgroundColor: getColor(digit, 0.1),
                    tension: 0.4
                });
            }
        });

        // Create new chart
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Sum Total',
                            color: '#fff3e0'
                        },
                        ticks: {
                            color: '#fff3e0'
                        },
                        grid: {
                            color: 'rgba(255, 243, 224, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Combinations',
                            color: '#fff3e0'
                        },
                        ticks: {
                            color: '#fff3e0'
                        },
                        grid: {
                            color: 'rgba(255, 243, 224, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff3e0'
                        }
                    }
                }
            }
        });
    }

    // Color generator
    function getColor(index, alpha = 1) {
        const colors = [
            `rgba(255, 99, 132, ${alpha})`,
            `rgba(54, 162, 235, ${alpha})`,
            `rgba(255, 206, 86, ${alpha})`,
            `rgba(75, 192, 192, ${alpha})`,
            `rgba(153, 102, 255, ${alpha})`,
            `rgba(255, 159, 64, ${alpha})`,
            `rgba(255, 99, 255, ${alpha})`,
            `rgba(99, 255, 132, ${alpha})`
        ];
        return colors[(index - 2) % colors.length];
    }

    // Setup controls
    function setupControls(data) {
        const digitControls = document.getElementById('digitControls');
        const sumControls = document.getElementById('sumControls');
        
        // Create digit checkboxes
        for (let i = MIN_DIGITS; i <= MAX_DIGITS; i++) {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.innerHTML = `
                <input type="checkbox" class="digit-checkbox" value="${i}">
                ${i} Digits
            `;
            digitControls.appendChild(label);
        }

        // Create sum checkboxes
        for (let i = 3; i <= MAX_SUM; i++) {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.innerHTML = `
                <input type="checkbox" class="sum-checkbox" value="${i}">
                Sum ${i}
            `;
            sumControls.appendChild(label);
        }
    }

    // Update chart based on selections
    function updateCustomView() {
        const selectedDigits = [...document.querySelectorAll('.digit-checkbox:checked')]
            .map(cb => cb.value);
        const selectedSums = [...document.querySelectorAll('.sum-checkbox:checked')]
            .map(cb => cb.value);
        
        createChart(dataset, selectedDigits, selectedSums);
        modal.style.display = 'none';
    }

    // Initialize
    const dataset = generateDataset();
    setupControls(dataset);
    createChart(dataset);

    // Event Listeners
    document.getElementById('showAllBtn').addEventListener('click', (e) => {
        document.getElementById('showCustomBtn').classList.remove('active');
        e.target.classList.add('active');
        createChart(dataset);
    });

    document.getElementById('showCustomBtn').addEventListener('click', (e) => {
        document.getElementById('showAllBtn').classList.remove('active');
        e.target.classList.add('active');
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    applyButton.addEventListener('click', updateCustomView);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
