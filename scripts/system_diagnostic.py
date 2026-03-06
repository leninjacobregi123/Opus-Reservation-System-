import requests
import sys
import json

BASE_URL = "http://localhost:5001/api"
DEMO_USER = {
    "email": "john@example.com",
    "password": "password123"
}

class SystemDiagnostic:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
        self.results = []

    def log(self, task, status, details=""):
        icon = "✅" if status else "❌"
        self.results.append({"task": task, "status": status, "details": details})
        print(f"{icon} {task: <40} {'[PASS]' if status else '[FAIL]'} {details}")

    def run_checks(self):
        print("\n" + "="*60)
        print(" 🔍 BOOK MY SEAT - SYSTEM DIAGNOSTIC SUITE")
        print("="*60 + "\n")

        # 1. API Connectivity
        try:
            res = self.session.get(f"{BASE_URL}/restaurants")
            if res.status_code == 200:
                self.log("Discovery Suite Connectivity", True, f"Found {len(res.json().get('data', []))} venues")
                self.restaurant_id = res.json()['data'][0]['id']
            else:
                self.log("Discovery Suite Connectivity", False, f"Status: {res.status_code}")
        except Exception as e:
            self.log("Discovery Suite Connectivity", False, str(e))

        # 2. Authentication Protocol
        try:
            res = self.session.post(f"{BASE_URL}/auth/login", json=DEMO_USER)
            if res.status_code == 200:
                self.token = res.json()['data']['token']
                self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                self.log("Elite Access Authentication", True, "JWT Token issued")
            else:
                self.log("Elite Access Authentication", False, f"Status: {res.status_code}")
        except Exception as e:
            self.log("Elite Access Authentication", False, str(e))

        # 3. Architectural Asset Fetching
        if hasattr(self, 'restaurant_id'):
            try:
                res = self.session.get(f"{BASE_URL}/restaurants/{self.restaurant_id}/tables")
                if res.status_code == 200:
                    self.log("Asset Schematic Retrieval", True, f"Mapped {len(res.json().get('data', []))} tables")
                else:
                    self.log("Asset Schematic Retrieval", False, f"Status: {res.status_code}")
            except Exception as e:
                self.log("Asset Schematic Retrieval", False, str(e))

        # 4. Profile Sync
        if self.token:
            try:
                res = self.session.get(f"{BASE_URL}/auth/profile")
                if res.status_code == 200:
                    self.log("User Profile Synchronization", True, f"User: {res.json()['data']['full_name']}")
                else:
                    self.log("User Profile Synchronization", False, f"Status: {res.status_code}")
            except Exception as e:
                self.log("User Profile Synchronization", False, str(e))

        print("\n" + "="*60)
        final_status = all(r['status'] for r in self.results)
        print(f"OVERALL STATUS: {'🟢 READY FOR DEPLOYMENT' if final_status else '🔴 SYSTEM ERRORS DETECTED'}")
        print("="*60 + "\n")

if __name__ == "__main__":
    diagnostic = SystemDiagnostic()
    diagnostic.run_checks()
