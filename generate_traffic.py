# Author: Pranathi
# This script simulates live buyers interacting with an e-commerce store
# It sends random successful and failing API requests to our Node backend

import requests
import time
import random

# Our Node.js backend URL endpoint
URL = "http://localhost:5000/api/logs/create"

# Realistic things a buyer would do on a website
SCENARIOS = [
    {"endpoint": "/api/products/list", "method": "GET", "status_code": 200, "error_message": None},
    {"endpoint": "/api/cart/add", "method": "POST", "status_code": 200, "error_message": None},
    {"endpoint": "/api/wishlist/toggle", "method": "POST", "status_code": 200, "error_message": None},
    {"endpoint": "/api/checkout/coupon", "method": "POST", "status_code": 400, "error_message": "Invalid or expired coupon code used by client"},
    {"endpoint": "/api/user/profile", "method": "GET", "status_code": 401, "error_message": "Unauthorized: Session token expired"},
    {"endpoint": "/api/payment/charge", "method": "POST", "status_code": 500, "error_message": "Stripe Gateway Connection Timeout"},
    {"endpoint": "/api/wishlist/share", "method": "POST", "status_code": 200, "error_message": None},
    {"endpoint": "/api/widget/load", "method": "GET", "status_code": 503, "error_message": "Widget service temporarily unavailable"},
]

print("Starting Live E-commerce Traffic Simulator...")
print("Press Ctrl + C to stop generating logs.\n")
# just above while True:
count = 0

# inside the try block after print:
count += 1
print(f"[{count}] Sent: {scenario['method']} {scenario['endpoint']} -> Status: {scenario['status_code']}")

while True:
    # 1. Pick a random buyer activity scenario
    scenario = random.choice(SCENARIOS)
    
    # 2. Simulate a realistic random response time (between 50ms and 900ms)
    response_time = random.randint(50, 900)
    
    # 3. Build the data payload object
    payload = {
        "endpoint": scenario["endpoint"],
        "method": scenario["method"],
        "status_code": scenario["status_code"],
        "response_time": response_time,
        "error_message": scenario["error_message"]
    }
    
    try:
        # 4. Send the POST request to our Node server
        response = requests.post(URL, json=payload)
        print("Sent: " + scenario["method"] + " " + scenario["endpoint"] + " -> Status: " + str(scenario["status_code"]))
    except Exception as e:
        print(" Could not connect to backend server: " + str(e))
        
    # 5. Wait for a few seconds before generating the next customer action
    time.sleep(random.randint(2, 5))