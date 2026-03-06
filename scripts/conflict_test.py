import requests
import concurrent.futures
import time

BASE_URL = "http://localhost:5001/api"
DEMO_USER = {"email": "john@example.com", "password": "password123"}

def get_token():
    res = requests.post(f"{BASE_URL}/auth/login", json=DEMO_USER)
    return res.json()['data']['token']

def attempt_booking(token, table_id, random_time):
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "restaurant_id": 1,
        "table_id": table_id,
        "booking_date": "2026-12-25",
        "booking_time": random_time,
        "guest_count": 2,
        "special_occasion": "Casual"
    }
    res = requests.post(f"{BASE_URL}/bookings", json=payload, headers=headers)
    return res.status_code, res.json()

def run_conflict_test():
    print("\n⚔️  STARTING DOUBLE-BOOKING CONFLICT TEST...")
    token = get_token()
    table_id = 1 
    random_time = f"{time.time() % 24:02.0f}:00" # Unique time for this run
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(attempt_booking, token, table_id, random_time) for _ in range(10)]
        
        results = [f.result() for f in concurrent.futures.as_completed(futures)]

    successes = [r for r in results if r[0] == 210 or r[0] == 201]
    conflicts = [r for r in results if r[0] == 400]

    print("\n" + "="*50)
    print(" 🛡️  CONCURRENCY LOGIC VERIFICATION")
    print("="*50)
    print(f"Total Simultaneous Attempts: {len(results)}")
    print(f"Successful Bookings:         {len(successes)} (Should be 1)")
    print(f"Prevented Double-Bookings:   {len(conflicts)} (Should be 9)")
    print("="*50)

    if len(successes) == 1:
        print("\n🟢 SUCCESS: Race condition prevented. Constraint is working.")
    else:
        print(f"\n🔴 FAILURE: {len(successes)} people booked the same table! Logic leak detected.")

if __name__ == "__main__":
    run_conflict_test()
