from flask import Flask, jsonify, request, render_template
from model.linear_regression import LinearRegressionModel

app = Flask(__name__)
model = LinearRegressionModel()

# Dummy CS:GO dataset
dataset = [
    [45.2, 0.78], [52.1, 0.85], [61.3, 0.92], [58.7, 0.89], [66.4, 0.98],
    [49.8, 0.82], [71.2, 1.05], [54.6, 0.87], [68.9, 1.01], [63.1, 0.94],
    [57.3, 0.88], [74.6, 1.12], [50.9, 0.83], [69.7, 1.03], [62.8, 0.95],
    [76.1, 1.18], [55.2, 0.86], [67.4, 0.99], [60.5, 0.91], [72.8, 1.08],
    [48.7, 0.81], [65.9, 0.97], [59.1, 0.90], [73.5, 1.10], [56.8, 0.87],
    [70.3, 1.04], [51.4, 0.84], [64.7, 0.96], [61.9, 0.93], [75.8, 1.15]
]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/load-data", methods=["GET"])
def load_data():
    return jsonify({"dataset": dataset})

@app.route("/train", methods=["POST"])
def train():
    result = model.train(dataset)
    return jsonify({
        "theta": result["theta"],
        "error": result["error"]
    })

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    adr_value = float(data["adr"])
    rating = model.predict(adr_value)
    return jsonify({"prediction": rating})

if __name__ == "main":
    app.run(debug=True)