from flask import Flask, jsonify, request, render_template
from model.linear_regression import LinearRegressionModel

app = Flask(__name__)
model = LinearRegressionModel()

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