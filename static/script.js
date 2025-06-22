let dataset = [];

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
    document.getElementById('iterationsMetric').textContent = '5,000';
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
