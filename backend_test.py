
import requests
import unittest
import sys
import os
import json

class DadflixBackendTest(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(DadflixBackendTest, self).__init__(*args, **kwargs)
        # Get the backend URL from the frontend .env file
        self.base_url = "https://1ddf0bd6-fe10-40a3-8ade-e75c4fc5f228.preview.emergentagent.com"
        print(f"Testing backend at: {self.base_url}")

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        response = requests.get(f"{self.base_url}/api")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("message"), "Hello World")
        print("✅ Root endpoint test passed")

    def test_status_endpoint_get(self):
        """Test the GET status endpoint"""
        response = requests.get(f"{self.base_url}/api/status")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        print("✅ GET status endpoint test passed")

    def test_status_endpoint_post(self):
        """Test the POST status endpoint"""
        test_data = {"client_name": "test_client"}
        response = requests.post(f"{self.base_url}/api/status", json=test_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("client_name"), "test_client")
        self.assertIn("id", data)
        self.assertIn("timestamp", data)
        print("✅ POST status endpoint test passed")

def run_tests():
    """Run all tests"""
    test_suite = unittest.TestSuite()
    test_suite.addTest(DadflixBackendTest('test_root_endpoint'))
    test_suite.addTest(DadflixBackendTest('test_status_endpoint_get'))
    test_suite.addTest(DadflixBackendTest('test_status_endpoint_post'))
    
    runner = unittest.TextTestRunner()
    result = runner.run(test_suite)
    
    return result.wasSuccessful()

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
