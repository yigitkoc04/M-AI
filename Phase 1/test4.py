import re
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List
from sympy import symbols, Eq, solve, parse_expr
from llama_cpp import Llama  # Using llama-cpp for Mistral GGUF

# Initialize FastAPI
app = FastAPI()

# Load Mistral GGUF Model
MODEL_PATH = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"  # Update if using a different version
llm = Llama(model_path=MODEL_PATH, n_ctx=2048)

# Store chat history (per user)
chat_histories: Dict[str, List[str]] = {}

# Define request model
class ChatMessage(BaseModel):
    user_id: str
    question: str



import re
from sympy import parse_expr, Eq, symbols

x = symbols('x')

def extract_math_expression(user_input: str):
    """Extracts and properly formats math expressions from user input."""
    try:
        # Extracts only valid math expressions (numbers, variables, operators)
        equation_match = re.search(r"([0-9x+\-*/().^= ]+)", user_input)
        if equation_match:
            expression = equation_match.group(1).replace("^", "**").strip()

            # If there's an '=', it's an equation
            if "=" in expression:
                lhs, rhs = expression.split("=")
                lhs = parse_expr(lhs, transformations="all")
                rhs = parse_expr(rhs, transformations="all")
                return Eq(lhs, rhs)  # Return as an equation

            # Otherwise, assume it's a polynomial expression
            parsed_expr = parse_expr(expression, transformations="all")

            # Ensure it's a polynomial for factorization
            if parsed_expr.is_polynomial(x):
                return parsed_expr

    except Exception as e:
        print(f"Error parsing expression: {e}")

    return None




# Function to solve an equation using SymPy
def solve_equation(expression):
    """Solves the given equation using SymPy."""
    try:
        equation = Eq(expression, 0)  # Convert to equation format
        solutions = solve(equation, x)
        return solutions
    except Exception as e:
        print(f"Error solving equation: {e}")
        return None

# Function to generate an AI response with step-by-step explanation
def generate_math_explanation(user_question, computed_solution):
    """Passes the math problem and solution to Mistral for explanation."""
    prompt = f"""You are a math tutor. Explain how to solve this problem step-by-step:
    
    **Problem:** {user_question}
    **Solution:** {computed_solution}

    Provide a detailed, clear, and structured explanation.
    """

    response = llm(prompt, max_tokens=300)["choices"][0]["text"].strip()
    return response

# FastAPI endpoint for chatting with the math chatbot


from sympy import factor, solve

@app.post("/chat")


def chat_math(chat: ChatMessage):
    user_id = chat.user_id
    question = chat.question
    
    # Extract math expression or equation
    math_expression = extract_math_expression(question)

    if math_expression is not None:
        if isinstance(math_expression, Eq):  # ✅ If it's an equation, solve it
            solution = solve(math_expression, x)
            response = generate_math_explanation(question, solution)

        elif math_expression.is_polynomial(x):  # ✅ If it's a polynomial, factorize it
            factored_expression = factor(math_expression)
            response = f"The factored form of {math_expression} is {factored_expression}."

        else:
            response = "I can only solve equations or factorize polynomials."

    else:
        response = "I only handle math-related questions. Please ask a math problem."

    # Store chat history
    if user_id not in chat_histories:
        chat_histories[user_id] = []
    chat_histories[user_id].append(f"User: {question}")
    chat_histories[user_id].append(f"Bot: {response}")

    return {"chat_history": chat_histories[user_id]}




'''
python3.10 -m uvicorn test4:app --reload
'''