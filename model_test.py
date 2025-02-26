from llama_cpp import Llama

MODEL_PATH = "models/vicuna-7b-v1.5.Q3_K_M.gguf" 

try:
    llm = Llama(model_path=MODEL_PATH, n_ctx=1024, n_gpu_layers=0)
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Model failed to load:", e)
