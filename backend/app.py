from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
from flask_cors import CORS  # Import CORS

# 🔹 Load API key from .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("❌ GEMINI_API_KEY not found in environment variables.")

# 🔹 Configure Gemini API
genai.configure(api_key=api_key)

# ✅ Check available models and use the correct one
AVAILABLE_MODELS = [m.name for m in genai.list_models()]
MODEL_NAME = "gemini-pro-1.0" if "gemini-pro-1.0" in AVAILABLE_MODELS else "gemini-1.5-pro"
model = genai.GenerativeModel(MODEL_NAME)

# 🔹 Initialize Flask app
app = Flask(__name__)

# 🔹 Enable CORS for all domains
CORS(app)  # This will allow all domains to make requests to this API

# 🔹 Load context from JSON file
CONTEXT_FILE = "vit_context.json"

def load_context():
    if os.path.exists(CONTEXT_FILE):
        try:
            with open(CONTEXT_FILE, "r") as file:
                return json.load(file)
        except json.JSONDecodeError as e:
            print(f"❌ Error loading JSON: {e}")  # Debugging
            return {"courses": [], "facilities": [], "contacts": {}, "faqs": []}
    return {"courses": [], "facilities": [], "contacts": {}, "faqs": []}

vit_context = load_context()

# ✅ Homepage to check if API is running
@app.route('/')
def home():
    return "🚀 Flask API is running! Use the /chat endpoint for AI responses."

# ✅ Chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '').strip()
    if not user_input:
        return jsonify({"error": "❌ No message provided."}), 400

    # 🔹 Create prompt using context
    prompt = f"Context: {json.dumps(vit_context, indent=2)}\nUser: {user_input}\nAssistant:"

    try:
        # ✅ Generate content
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"❌ Error generating response: {e}")  # Debugging
        return jsonify({"error": str(e)}), 500

# ✅ Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
