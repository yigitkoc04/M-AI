from llama_cpp import Llama

MODEL_PATH = "/Users/dashag/Desktop/test/models/vicuna-7b-v1.5.Q3_K_M.gguf"  # Update if using Q2_K

import traceback

try:
    print("🚀 Attempting to load the model...")
    llm = Llama(model_path=MODEL_PATH, n_ctx=1024, n_gpu_layers=0)  # Use smaller n_ctx

    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Model failed to load:", e)
    traceback.print_exc()  # This will provide the full traceback for better debugging.

# 