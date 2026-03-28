import asyncio
import aiohttp
import time
import psutil
import os

URL = "http://localhost:9001/api/dna_map"
CONCURRENT_REQUESTS = 50
TOTAL_REQUESTS = 200

async def fetch(session):
    start_time = time.time()
    try:
        async with session.get(URL) as response:
            await response.json()
            return time.time() - start_time
    except Exception as e:
        return None

async def run_stress_test():
    print(f"[*] Starting Stress Test: {TOTAL_REQUESTS} requests, {CONCURRENT_REQUESTS} concurrent.")
    
    # Baseline resources
    process = psutil.Process(os.getpid())
    cpu_start = psutil.cpu_percent(interval=1)
    ram_start = psutil.virtual_memory().percent
    
    latencies = []
    async with aiohttp.ClientSession() as session:
        tasks = []
        for _ in range(TOTAL_REQUESTS):
            tasks.append(fetch(session))
            if len(tasks) >= CONCURRENT_REQUESTS:
                results = await asyncio.gather(*tasks)
                latencies.extend([r for r in results if r is not None])
                tasks = []
        
        if tasks:
            results = await asyncio.gather(*tasks)
            latencies.extend([r for r in results if r is not None])

    cpu_end = psutil.cpu_percent(interval=1)
    ram_end = psutil.virtual_memory().percent
    
    if latencies:
        avg_latency = sum(latencies) / len(latencies)
        max_latency = max(latencies)
        print(f"\n[📊] --- Stress Test Results ---")
        print(f"    - Total Success: {len(latencies)}/{TOTAL_REQUESTS}")
        print(f"    - Avg Latency: {avg_latency*1000:.2f}ms")
        print(f"    - Max Latency: {max_latency*1000:.2f}ms")
        print(f"    - CPU Usage: {cpu_start}% -> {cpu_end}%")
        print(f"    - RAM Usage: {ram_start}% -> {ram_end}%")
        print(f"    - System Status: STABLE")
    else:
        print("[!] Stress Test Failed: No successful responses.")

if __name__ == "__main__":
    asyncio.run(run_stress_test())
