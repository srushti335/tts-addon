import edge_tts
import sys
import asyncio

async def generate_tts(text, voice, format_type):
    tts = edge_tts.Communicate(text, voice)
    await tts.save("output.mp3")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Text input is required")
        sys.exit(1)

    text = sys.argv[1]
    voice = sys.argv[2] if len(sys.argv) > 2 else "en-US-JennyNeural"
    format_type = sys.argv[3] if len(sys.argv) > 3 else "audio-16khz-32kbitrate-mp3"

    asyncio.run(generate_tts(text, voice, format_type))
