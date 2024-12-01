import os
import threading

from flask import Flask, render_template
from playsound import playsound

app = Flask(__name__)

# Audio playlist and index
VOICE = 0
PWD = os.getcwd()
VOICES = [
    os.path.join(PWD, "scenario-1", "ttsmaker-file-2024-11-29-10-42-27.mp3"),
    os.path.join(PWD, "scenario-1", "ttsmaker-file-2024-11-29-12-27-19.mp3"),
    os.path.join(PWD, "scenario-1", "ttsmaker-file-2024-11-29-12-55-44.mp3"),
    os.path.join(PWD, "scenario-1", "ttsmaker-file-2024-11-29-13-32-12.mp3"),
    os.path.join(PWD, "scenario-1", "ttsmaker-file-2024-11-29-14-0-8.mp3"),
    os.path.join(PWD, "scenario-1", "ttsmaker-file-2024-11-29-12-58-10.mp3"),
]

# Lock to prevent race conditions
play_lock = threading.Lock()


def play_sound():
    global VOICE

    # Play the current audio file
    with play_lock:
        current_voice = VOICES[VOICE]
        playsound(current_voice)

        # Move to the next audio
        VOICE = (VOICE + 1) % len(VOICES)  # Loop back to the start if at the end


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/play', methods=['POST'])
def play():
    # Run the sound function in a separate thread
    threading.Thread(target=play_sound).start()
    return "Playing sound!", 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
