import asyncio
import json
import os
import sys
import time
import edge_tts

# Ensure UTF-8 stdout on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEGMENTS_FILE = os.path.join(ROOT_DIR, "audio-segments.json")
PUBLIC_AUDIO_DIR = os.path.join(ROOT_DIR, "public", "audio")

# Default voice: Natural, engaging tech narrative voice
DEFAULT_VOICE = "en-US-ChristopherNeural"

async def synthesize_segment(segment, voice: str, index: int, total: int):
    chapter = segment["chapter"]
    step = segment["step"]
    text = segment["text"].strip()
    audio_rel = segment["audio"]

    if not text:
        print(f"[{index}/{total}] Skipped silent step ({chapter} step {step})")
        return

    out_file = os.path.join(PUBLIC_AUDIO_DIR, audio_rel)
    os.makedirs(os.path.dirname(out_file), exist_ok=True)

    t0 = time.time()
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(out_file)
    elapsed = time.time() - t0
    size_kb = os.path.getsize(out_file) / 1024

    print(f"[{index}/{total}] OK: {audio_rel} ({size_kb:.1f} KB, {elapsed:.2f}s) -> \"{text}\"")

async def main():
    voice = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("PRESENTATION_TTS_VOICE", DEFAULT_VOICE)
    print(f"Starting Audio Synthesis with Voice: {voice}")
    print(f"Reading segments from: {SEGMENTS_FILE}")

    if not os.path.exists(SEGMENTS_FILE):
        print(f"Segments file not found: {SEGMENTS_FILE}")
        sys.exit(1)

    with open(SEGMENTS_FILE, "r", encoding="utf-8") as f:
        segments = json.load(f)

    total = len(segments)
    print(f"Found {total} segments to synthesize.\n")

    for i, seg in enumerate(segments, 1):
        await synthesize_segment(seg, voice, i, total)

    print("\nAll audio segments synthesized successfully!")
    print(f"Target directory: {PUBLIC_AUDIO_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
