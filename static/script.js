let dataset = [];
let chart = null;

function log(message, type = 'info') {
    const console = document.getElementById('console');
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `<span class="timestamp">[${timestamp}]</span> <span class="${type}">${message}</span>\n`;
    console.innerHTML += logEntry;
    console.scrollTop = console.scrollHeight;
}

function updateStatus(status) {
    const statusIndicator = document.getElementById('statusIndicator');
    statusIndicator.className = 'status-indicator ' + status;
    
    if (status === 'training') {
        document.getElementById('progressFill').style.width = '100%';
    } else {
        document.getElementById('progressFill').style.width = '0%';
    }
}

function createChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    const labels = dataset.map(d => d[0]);
    const data = dataset.map(d => d[1]);
    
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'ADR vs Rating',
                data: dataset.map(d => ({ x: d[0], y: d[1] })),
                backgroundColor: 'rgba(0, 123, 255, 0.6)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                pointRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Average Damage per Round (ADR)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Player Rating'
                    }
                }
            }
        }
    });
}

function resetModel() {
    // Reset UI elements
    document.getElementById('errorMetric').textContent = '-';
    document.getElementById('slopeMetric').textContent = '-';
    document.getElementById('interceptMetric').textContent = '-';
    document.getElementById('equation').textContent = 'Model not trained';
    document.getElementById('iterationsMetric').textContent = '-';
    document.getElementById('predictionResult').classList.remove('show');
    document.getElementById('predictionResult').innerHTML = '';
    document.getElementById('trainBtn').disabled = true;
    document.getElementById('predictBtn').disabled = true;
    
    // Reset chart if it exists
    if (chart) {
        chart.destroy();
        chart = null;
    }
    
    // Reset dataset
    dataset = [];
    document.getElementById('sampleCount').textContent = '0';
    document.getElementById('datasetStatus').textContent = 'Not loaded';
    
    updateStatus('idle');
    log('Model reset', 'info');
}

// Keep the existing functions
async function loadData() {
    log('Fetching data from server...');
    updateStatus('training');
    const res = await fetch('/load-data');
    const data = await res.json();
    dataset = data.dataset;
    document.getElementById('sampleCount').textContent = dataset.length;
    document.getElementById('datasetStatus').textContent = 'Loaded (from server)';
    log(`Loaded ${dataset.length} samples from backend`, 'success');
    createChart();
    updateStatus('ready');
    document.getElementById('trainBtn').disabled = false;
}

async function trainModel() {
    log('Training model on server...');
    updateStatus('training');
    document.getElementById('trainBtn').disabled = true;
    const res = await fetch('/train', { method: 'POST' });
    const result = await res.json();
    const [intercept, slope] = result.theta;
    const error = result.error;
    document.getElementById('errorMetric').textContent = error.toFixed(4);
    document.getElementById('slopeMetric').textContent = slope.toFixed(3);
    document.getElementById('interceptMetric').textContent = intercept.toFixed(3);
    document.getElementById('equation').textContent = `y = ${intercept.toFixed(3)} + ${slope.toFixed(3)}x`;
    document.getElementById('iterationsMetric').textContent = '1000000';
    log(`Training complete. Error: ${error.toFixed(6)}`, 'success');
    document.getElementById('predictBtn').disabled = false;
    updateStatus('ready');
}

async function predict() {
    const adr = parseFloat(document.getElementById('adrInput').value);
    if (isNaN(adr)) {
        log('Invalid input for ADR', 'error');
        return;
    }
    const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adr })
    });
    const result = await res.json();
    const prediction = result.prediction;
    document.getElementById('predictionResult').innerHTML = `<strong>Predicted Rating: ${prediction.toFixed(3)}</strong>`;
    document.getElementById('predictionResult').classList.add('show');
    log(`Predicted rating: ${prediction.toFixed(3)} for ADR ${adr}`);
}
