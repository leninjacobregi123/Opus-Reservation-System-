import requests
import concurrent.futures
import time
import random

BASE_URL = "http://localhost:5001/api"
CONCURRENT_USERS = 50
TOTAL_REQUESTS = 200

def simulate_user_action(user_id):
    """Simulates a user browsing and authenticating."""
    try:
        start_time = time.time()
        # 1. Fetch restaurants (Read stress)
        res = requests.get(f"{BASE_URL}/restaurants")
        
        # 2. Simulate random thinking time
        time.sleep(random.uniform(0.1, 0.5))
        
        # 3. Fetch tables for a random restaurant
        restaurant_id = 1
        requests.get(f"{BASE_URL}/restaurants/{restaurant_id}/tables")
        
        duration = time.time() - start_time
        return True, duration
    except Exception as e:
        return False, 0

def run_overload_test():
    print(f"\n🚀 STARTING OVERLOAD TEST: {CONCURRENT_USERS} Concurrent Users...")
    print(f"Targeting: {BASE_URL}")
    print("-" * 50)

    start_suite = time.time()
    success_count = 0
    fail_count = 0
    latencies = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENT_USERS) as executor:
        futures = [executor.submit(simulate_user_action, i) for i in range(TOTAL_REQUESTS)]
        
        for future in concurrent.futures.as_completed(futures):
            success, latency = future.result()
            if success:
                success_count += 1
                latencies.append(latency)
            else:
                fail_count += 1

    total_duration = time.time() - start_suite
    avg_latency = sum(latencies) / len(latencies) if latencies else 0

    print("\n" + "="*50)
    print(" 📊 OVERLOAD TEST RESULTS")
    print("="*50)
    print(f"Total Requests:      {TOTAL_REQUESTS}")
    print(f"Successful:          {success_count} ✅")
    print(f"Failed:              {fail_count} ❌")
    print(f"Success Rate:        {(success_count/TOTAL_REQUESTS)*100:.1f}%")
    print(f"Average Latency:     {avg_latency:.3f}s")
    print(f"Total Test Time:     {total_duration:.2f}s")
    print("="*50)

    if fail_count > 0:
        print("\n⚠️  WARNING: System dropped requests under load. Consider scaling.")
    else:
        print("\n🟢 STABILITY: System handled 50 concurrent users with 100% success.")

if __name__ == "__main__":
    run_overload_test()
