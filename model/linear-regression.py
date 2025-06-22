import numpy as np

class LinearRegressionModel:
    def __init__(self):
        self.theta = np.array([0.0,0.0]) 
        self.trained = False

    def dof(self, a, b):
        return np.dot(a,b)
    
    def run_gradient_descent(self, X, y, alpha=0.0000000001, iterations=5000):
        n = len(y)
        self.theta = np.array([0.0, 0.0])
        for _ in range(iterations):
            predictions = X.dot(self.theta)
            errors = predictions - y
            gradient = (1/n) * X.T.dot(errors)
            self.theta -= alpha * gradient
        self.trained = True

    def calculate_error(self, X, y):
        predictions = X.dot(self.theta)
        error = ((predictions - y) ** 2).mean()/2
        return error

    def train(self, dataset):
        X = np.array([[1, row[0]] for row in dataset])
        y = np.array([row[1] for row in dataset])
        self.run_gradient_descent(X, y)
        return {
            "theta": self.theta.tolist(),
            "error": self.calculate_error(X, y)
        }
    
    def predict(self, adr_value):
        if not self.trained:
            raise Exception("Model not trained yet")
        return float(self.theta[0] + self.theta[1] * adr_value)