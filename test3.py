from fastapi import FastAPI
from pydantic import BaseModel
import sympy as sp
import re
from typing import Dict, List, Union
from llama_cpp import Llama
from sympy.parsing.sympy_parser import parse_expr

app = FastAPI()

# Load model
MODEL_PATH = "models/vicuna-7b-v1.5.Q5_K_M.gguf"
llm = Llama(model_path=MODEL_PATH, n_ctx=2048)

chat_histories: Dict[str, List[str]] = {}

# Pydantic model for chat messages
class ChatMessage(BaseModel):
    user_id: str
    question: str

# Function to extract and process math expressions
def extract_math_expression(user_input: str):
    """ Extracts math expressions and converts them to SymPy format """
    try:
        expression_match = re.search(r"([0-9x+\-*/().^= ]+)", user_input)
        if expression_match:
            expression = expression_match.group(1).replace('^', '**')  # Ensure correct exponentiation
            if "=" in expression:
                return sp.Eq(*map(sp.sympify, expression.split("=")))  # Convert to SymPy equation
            else:
                return parse_expr(expression, transformations="all")  # Convert to SymPy expression
    except Exception as e:
        print(f"Error extracting math expression: {e}")
        return None
    return None

# Function to compute solutions using SymPy
def compute_math_solution(expression: Union[sp.Expr, sp.Equality]):
    """ Solves equations if '=', otherwise simplifies/expands """
    try:
        if isinstance(expression, sp.Equality):  # If equation (e.g., 2x + 3 = 13)
            solution = sp.solve(expression, sp.Symbol('x'))
            return f"x = {solution}" if solution else "No solution found."
        else:
            return str(sp.simplify(expression))  # Simplify algebraic expression
    except Exception as e:
        return f"Could not compute: {e}"

# Function to generate AI explanation
def generate_math_response(user_id: str, question: str, computed_result: str):
    """ Uses Llama model to generate step-by-step explanations """
    chat_history = chat_histories.get(user_id, [])
    context = "\n".join(chat_history[-3:])

    prompt = f"""
    You are a math tutor. Explain the math problem step by step.
    - Do NOT compute answers, only explain.
    - Assume the computation result has already been found.
    - The computed solution is: {computed_result}

    **Question:** {question}
    **Context:** {context}

    **Explanation:**
    """

    response = llm(prompt, max_tokens=250)["choices"][0]["text"].strip()
    return response

# FastAPI route for chat
@app.post("/chat")
def chat_math(chat: ChatMessage):
    user_id = chat.user_id
    question = chat.question

    # Extract math from input
    math_expression = extract_math_expression(question)

    if math_expression:
        computed_result = compute_math_solution(math_expression)
    else:
        computed_result = "No valid math expression found."

    # Generate AI response + explanation
    response = generate_math_response(user_id, question, computed_result)

    # Store chat history
    if user_id not in chat_histories:
        chat_histories[user_id] = []
    chat_histories[user_id].append(f"User: {question}")
    chat_histories[user_id].append(f"Bot: {response}\n\n**Computed Solution:** {computed_result}")

    return {"chat_history": chat_histories[user_id]}




# python3.10 -m uvicorn test3:app --reload
