from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import base64
import numpy as np
from datetime import datetime
import os
from pymongo import MongoClient
import traceback
import tensorflow as tf

# 1. GPU check
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    print(f"✅ Running on GPU: {gpus}")
else:
    print("❌ GPU not detected. Running on CPU.")

app = Flask(__name__)
CORS(app)

# 2. MongoDB setup
client = MongoClient(
    "mongodb+srv://sivadharshana:test123@cluster0.ais6mm7.mongodb.net/?retryWrites=true&w=majority"
)
db = client["test"]
attendance_collection = db["attendance"]

# 3. Load FaceNet model once
print("🔄 Loading FaceNet model...")
model = DeepFace.build_model("Facenet")
print("✅ FaceNet model loaded.")

@app.route('/analyze', methods=['POST'])
def analyze_face():
    try:
        data = request.json
        img_data = data['image'].split(',')[1]
        entered_id = data.get('student_id')
        user_name = data.get('user_name', entered_id)

        # Decode image
        img_bytes = base64.b64decode(img_data)
        np_img = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        cv2.imwrite("current.jpg", frame)

        # Verify reference image exists
        ref_path = f"students/{entered_id}.jpg"
        if not os.path.exists(ref_path):
            return jsonify({
                "verified": False,
                "error": "Reference image not found",
                "emotion": "N/A",
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 404

        # Face verification
        verification = DeepFace.verify(
            img1_path="current.jpg",
            img2_path=ref_path,
            model_name="Facenet",
            enforce_detection=False
        )
        if not verification.get("verified", False):
            return jsonify({
                "verified": False,
                "emotion": "N/A",
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

        # Analyze emotion
        now = datetime.now()
        timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
        emotion_result = DeepFace.analyze(
            img_path="current.jpg",
            actions=["emotion"],
            enforce_detection=False
        )
        dominant_emotion = emotion_result[0]["dominant_emotion"]

        # Save every scan (no duplicate suppression)
        attendance_collection.insert_one({
            "student_id": entered_id,
            "user_name": user_name,
            "verified": True,
            "emotion": dominant_emotion,
            "timestamp": timestamp,
            "date": now.date().isoformat()
        })

        return jsonify({
            "verified": True,
            "emotion": dominant_emotion,
            "time": timestamp
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "verified": False,
            "error": str(e),
            "emotion": "N/A",
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 500

@app.route('/attendance/<user_name>', methods=['GET'])
def get_attendance(user_name):
    try:
        records = list(attendance_collection.find(
            {"user_name": user_name}, {"_id": 0}
        ))
        return jsonify(records)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
