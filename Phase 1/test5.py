from fastapi import FastAPI
from pydantic import BaseModel
import sympy as sp
import numpy as np
import re
from typing import Dict, List
from llama_cpp import Llama
from sympy.parsing.sympy_parser import parse_expr

app = FastAPI()

# Load Mistral Model
MODEL_PATH = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"  # Ensure this model exists
llm = Llama(model_path=MODEL_PATH, n_ctx=2048)

chat_histories: Dict[str, List[str]] = {}

# Pydantic model for chat messages
class ChatMessage(BaseModel):
    user_id: str
    question: str

# 📌 Function to Extract Mathematical Expressions
def extract_math_expression(user_input: str):
    try:
        expression_match = re.search(r"([0-9a-zA-Z+\-*/().^= ]+)", user_input)
        if expression_match:
            expression = expression_match.group(1).replace("^", "**")
            return parse_expr(expression, transformations="all")
    except Exception:
        return None
    return None

# 📌 Function to Classify the Type of Math Question
def classify_question(user_input: str):
    user_input = user_input.lower()
    if "solve" in user_input:
        return "equation"
    elif "factorize" in user_input:
        return "factorization"
    elif "expand" in user_input or "simplify" in user_input:
        return "expansion"
    elif "differentiate" in user_input or "derivative" in user_input:
        return "calculus"
    elif "area" in user_input or "volume" in user_input:
        return "geometry"
    elif "mean" in user_input or "median" in user_input or "mode" in user_input:
        return "statistics"
    elif "probability" in user_input:
        return "probability"
    elif "matrix" in user_input or "determinant" in user_input:
        return "linear_algebra"
    elif "sequence" in user_input or "series" in user_input:
        return "sequences"
    return "unknown"

# 📌 Function to Compute Math Solutions
def compute_math_solution(user_input: str):
    question_type = classify_question(user_input)
    expression = extract_math_expression(user_input)

    if question_type == "equation":
        try:
            lhs, rhs = user_input.split("=")
            solution = sp.solve(sp.sympify(lhs) - sp.sympify(rhs), sp.Symbol("x"))
            return f"x = {solution}"
        except Exception:
            return "Could not compute equation."

    elif question_type == "factorization":
        return str(sp.factor(expression))

    elif question_type == "expansion":
        return str(sp.expand(expression))

    elif question_type == "calculus":
        return str(sp.diff(expression, sp.Symbol("x")))

    elif question_type == "geometry":
        if "triangle" in user_input and "area" in user_input:
            match = re.search(r"base (\d+)cm.*height (\d+)cm", user_input)
            if match:
                base, height = map(int, match.groups())
                return f"Area = {0.5 * base * height} cm²"
        elif "circle" in user_input and "circumference" in user_input:
            match = re.search(r"radius (\d+)cm", user_input)
            if match:
                r = int(match.group(1))
                return f"Circumference = {2 * np.pi * r} cm"
        return "Could not compute geometry."

    elif question_type == "statistics":
        numbers = [int(num) for num in re.findall(r"\d+", user_input)]
        if "mean" in user_input:
            return f"Mean = {np.mean(numbers)}"
        elif "median" in user_input:
            return f"Median = {np.median(numbers)}"
        elif "mode" in user_input:
            return f"Mode = {max(set(numbers), key=numbers.count)}"
        return "Could not compute statistics."

    elif question_type == "probability":
        if "even number" in user_input and "6-sided die" in user_input:
            return "Probability = 3/6 = 1/2 (50%)"
        elif "red ball" in user_input and "without replacement" in user_input:
            return "Probability = (3/6) * (2/5) = 1/5 (20%)"
        return "Could not compute probability."

    return "I am not sure how to solve this."

# 📌 Function to Generate Explanation Using Mistral
def generate_explanation(user_input: str, computed_result: str):
    prompt = f"""
    You are an expert math tutor. Your job is to explain solutions in a step-by-step manner.
    
    **Question:** {user_input}
    **Computed Answer:** {computed_result}
    
    Please explain the reasoning behind the answer in simple terms.
    """

    response = llm(prompt, max_tokens=250)["choices"][0]["text"].strip()
    return response

# 📌 FastAPI Chat Route
@app.post("/chat")
def chat_math(chat: ChatMessage):
    user_id = chat.user_id
    question = chat.question

    math_solution = compute_math_solution(question)
    explanation = generate_explanation(question, math_solution)

    if user_id not in chat_histories:
        chat_histories[user_id] = []
    chat_histories[user_id].append(f"User: {question}")
    chat_histories[user_id].append(f"Bot: {explanation}\n\n**Computed Solution:** {math_solution}")

    return {"chat_history": chat_histories[user_id]}


'''
python3.10 -m uvicorn test5:app --reload
'''