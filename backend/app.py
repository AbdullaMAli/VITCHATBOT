from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv(dotenv_path=".env")
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")
print("API Key Loaded:", api_key)

# Initialize Flask app
app = Flask(__name__)

# Configure Gemini API
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')

# File to store VIT-specific context
CONTEXT_FILE = "vit_context.json"

# Load VIT-specific context from file with error handling
def load_context():
    if os.path.exists(CONTEXT_FILE):
        try:
            with open(CONTEXT_FILE, "r") as file:
                return json.load(file)
        except json.JSONDecodeError as e:
            print(f"Error loading JSON: {e}")
            return {"courses": [], "facilities": [], "contacts": {}, "faqs": []}  # Default values
    return {"courses": [], "facilities": [], "contacts": {}, "faqs": []}

# Save updated VIT-specific context to file
def save_context(context):
    with open(CONTEXT_FILE, "w") as file:
        json.dump(context, file, indent=4)

# Initialize context
vit_context = load_context()

# System instructions to guide chatbot behavior
system_instructions = (
    "You are a helpful assistant capable of answering general questions and specific queries about VIT Chennai."
)

# Chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '').strip()
    if not user_input:
        return jsonify({"error": "No message provided."}), 400

    context_str = json.dumps(vit_context, indent=2)
    
    # Construct the prompt
    prompt = f"""
    {system_instructions}
    
    Context:
    {context_str}
    
    User: {user_input}
    
    Assistant:
    """
    
    try:
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin endpoint to update context
@app.route('/admin/update', methods=['POST'])
def update_context():
    global vit_context
    new_data = request.json
    vit_context.update(new_data)
    save_context(vit_context)
    return jsonify({"message": "Context updated successfully!"})

# Homepage
@app.route('/')
def home():
    return render_template('index.html')

# Admin page
@app.route('/admin')
def admin():
    return render_template('admin.html')

# Run the app
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)  # Disable auto-reload