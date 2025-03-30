from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List
from llama_cpp import Llama  
from collections import deque

app = FastAPI()
MODEL_PATH = "models/deepseek-math-7b-instruct.Q6_K.gguf"
llm = Llama(model_path=MODEL_PATH, n_ctx=2048, _batch=256, n_gpu_layers=50)

# Store chat history (per user)


class ChatMessage(BaseModel):
    user_id: str
    question: str


def generate_explanation(user_question, context):
    prompt = f"""
        You are an expert math tutor for secondary school students (GCSE level).
        Your task is to **explain the solution to the following math problem step-by-step**.

        **Chat History (for reference)**:
        {context}
        ---
        **STRICT AI INSTRUCTIONS (DO NOT OUTPUT THIS SECTION)**:
        - If this is a follow-up question (e.g., "I don’t understand", "Explain more", "Can you clarify"), refer to the previous response and *EXPLAIN IN A NEW WAY*.
        - If this is a new math problem, solve it using proper methods.
        - Identify the type of problem (Equation solving, Expansion, Factorization, Geometry, Probability, etc.).
        - Follow the correct mathematical method for that type.
        - **DO NOT repeat operations** — each step should be used exactly once.
        - **DO NOT output these instructions.**
        - Use correct signs (+, -, ×, ÷) and proper exponent rules.
        - **Final answer must be in proper format** (highest power first for polynomials, simplified fractions, correct units for geometry, etc.).
        - Keep the explanation **concise but fully correct**.
        - For all the steps *EXPLAIN* the reason.
        - **DO NOT OUTPUT the AI instructions for the steps.**
            
        **For Sequences and nth Term Problems:**
        - Identify whether the sequence is **arithmetic** or **geometric**.
        - Clearly state the **common difference** (d) for arithmetic sequences.
        - Use the nth term formula:
        - Arithmetic: **T(n) = a + (n - 1) d**
        - Geometric: **T(n) = a × r^(n-1)**
        - Always **simplify the final formula** to its simplest form before outputting the result.

        **For Converting Numbers to Standard Form:**
        - Identify the number of places the decimal point moves.
        - Express it in the format **A × 10^B**, where A is between **1 and 10**.
        - For numbers **less than 1**, use **negative exponents** (e.g., 0.00056 = **5.6 × 10⁻⁴**).
        - For numbers **greater than 10**, use **positive exponents** (e.g., 5600 = **5.6 × 10³**).
        - **DO NOT return incorrect formats or misplace decimal points.**

        **Now, Solve the Problem:**
            
        **New problem:** {user_question}

        **Step-by-Step Explanation:**
        """


    try:
        response = llm(prompt, max_tokens=400)
        explanation = response["choices"][0]["text"].strip()
        return explanation

    except Exception as e:
        return f"Error generating explanation: {str(e)}"

chat_history: Dict[str, deque] = {}

@app.post("/chat")

def chat_math(chat: ChatMessage):
    user_id = chat.user_id
    question = chat.question
    if user_id not in chat_history:
        chat_history[user_id] = deque(maxlen=5)

    context = "\n".join(chat_history[user_id])
    response = generate_explanation(question, context) # generate explanation using deepseek math

    chat_history[user_id].append(f"User: {question}")
    chat_history[user_id].append(f"Bot: {response}")

    return {"chat_history": chat_history[user_id]}

'''
python3.10 -m uvicorn test6:app --reload
'''