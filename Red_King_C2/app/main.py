import logging
import os
import shutil
import sys
import tempfile
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from scapy.all import IP, rdpcap

# Load environment variables from .env file
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
sys.stderr.write("✅ Environment Variables Loaded\n")
sys.stderr.flush()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RedKing_Core")

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = (BASE_DIR.parent / "war_room" / "dist").resolve()
FRONTEND_INDEX = FRONTEND_DIST / "index.html"

app = FastAPI(title="Red King C2", version="2.1.0-Intel")

frontend_origins = [
    os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
    "http://127.0.0.1:5173",
]

if os.getenv("ALLOW_ALL_ORIGINS", "false").lower() in ("1", "true", "yes"):
    frontend_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "OPERATIONAL", "module": "PCAP_ANALYZER_ACTIVE"}

@app.post("/api/analyze-pcap")
async def analyze_pcap(file: UploadFile = File(...)):
    suffix = Path(file.filename or "upload.pcap").suffix or ".pcap"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        temp_path = Path(tmp.name)

    try:
        with temp_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        packets = rdpcap(str(temp_path))
        analysis_report = []
        unique_ips = set()

        for pkt in packets[:50]:
            if IP in pkt:
                src = pkt[IP].src
                dst = pkt[IP].dst
                ttl = pkt[IP].ttl
                unique_ips.add(src)

                if ttl == 64:
                    os_guess = "Linux/Mac/Android"
                elif ttl == 128:
                    os_guess = "Windows"
                elif ttl == 255:
                    os_guess = "Cisco/Network Gear"
                else:
                    os_guess = "Unknown"

                analysis_report.append(
                    {
                        "src": src,
                        "dst": dst,
                        "ttl": ttl,
                        "os_fingerprint": os_guess,
                        "protocol": int(pkt[IP].proto),
                    }
                )

        return {
            "status": "ANALYSIS_COMPLETE",
            "total_packets": len(packets),
            "unique_targets": list(unique_ips),
            "fingerprints": analysis_report[:10],
        }
    except Exception as e:
        logger.exception("PCAP analysis failed")
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        try:
            if temp_path.exists():
                temp_path.unlink()
        except Exception:
            pass

# Mount /assets folder as static files (for JS/CSS bundles)
assets_path = FRONTEND_DIST / "assets"
if assets_path.exists():
    app.mount("/assets", StaticFiles(directory=str(assets_path)), name="assets")

# Serve other static files from dist root (favicons, etc.)
dist_path = str(FRONTEND_DIST)
if Path(dist_path).exists():
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")

# Fallback: Serve SPA for any unmatched routes
@app.get("/{catchall:path}")
async def serve_spa_fallback(catchall: str):
    if FRONTEND_INDEX.exists():
        return FileResponse(FRONTEND_INDEX)
    return JSONResponse(
        status_code=404,
        content={
            "error": "Frontend build not found",
            "hint": "Run `cd Red_King_C2/war_room && npm run build` or use Vite dev server in development.",
        },
    )