import re
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List
from sympy import symbols, Eq, solve, parse_expr
from sympy import factor, solve
from llama_cpp import Llama  # Using llama-cpp for Mistral GGUF

# Initialize FastAPI
app = FastAPI()

# Load Mistral GGUF Model
MODEL_PATH = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
llm = Llama(model_path=MODEL_PATH, n_ctx=2048)

# Store chat history (per user)
chat_histories: Dict[str, List[str]] = {}

class ChatMessage(BaseModel):
    user_id: str
    question: str

x = symbols('x')

def extract_math_expression(user_input: str):
    """Extracts and properly formats math expressions from user input."""
    try:
        # Extracts only valid math expressions (numbers, variables, operators)
        equation_match = re.search(r"([0-9x+\-*/().^= ]+)", user_input)
        if equation_match:
            expression = equation_match.group(1).replace("^", "**").strip()

            if "=" in expression:
                lhs, rhs = expression.split("=")
                lhs = parse_expr(lhs, transformations="all")
                rhs = parse_expr(rhs, transformations="all")
                return Eq(lhs, rhs)  # Return as an equation

            parsed_expr = parse_expr(expression, transformations="all")
            if parsed_expr.is_polynomial(x):
                return parsed_expr

    except Exception as e:
        print(f"Error parsing expression: {e}")

    return None

def solve_equation(expression):
    """Solves the given equation using SymPy."""
    try:
        equation = Eq(expression, 0)  
        solutions = solve(equation, x)
        return solutions
    except Exception as e:
        print(f"Error solving equation: {e}")
        return None


### Generate Explanation
def generate_explanation(user_question):
    """Passes the math problem to Mistral for step-by-step explanation."""

    prompt = f"""
        You are an expert math tutor for secondary school students. 
        Your task is to explain the solution to the following math problem step-by-step.

        **Problem:** {user_question}

        📌 **Strict AI Guidelines**:
        - **Identify the correct math method** (Equation solving, Expansion, Factorization, Geometry, Probability, Calculus).
        - **Show calculations in a clear, structured format.**
        - **Use the correct order of operations and signs.**
        - **Do NOT introduce unnecessary steps.**
        - **Clearly highlight the final correct answer in a clean format.**

        📌 **Math-Specific Rules**:
        - **Expanding:** Use FOIL exactly ONCE, combine like terms at the END.
        - **Factorizing:** Break into two binomials OR use the quadratic formula.
        - **Geometry:** Apply the correct formula with proper units.
        - **Statistics:** Clearly show mean, median, and mode with correct formulas.
        - **Probability:** Use (Favorable outcomes / Total outcomes) and simplify properly.
        - **Calculus:** Show differentiation or integration using the power rule.

        Now, solve the problem step by step:
        """

    try:
        response = llm(prompt, max_tokens=400)
        explanation = response["choices"][0]["text"].strip()
        return explanation

    except Exception as e:
        return f"Error generating explanation: {str(e)}"


@app.post("/chat")


def chat_math(chat: ChatMessage):
    user_id = chat.user_id
    question = chat.question
    
    # Extract math expression or equation
    math_expression = extract_math_expression(question)

    if math_expression is not None:
        if isinstance(math_expression, Eq):  #if math equation
            solution = solve(math_expression, x)
            response = generate_explanation(question, solution)

        elif math_expression.is_polynomial(x): #if polynomial
            factored_expression = factor(math_expression)
            response = f"The factored form of {math_expression} is {factored_expression}."

        else:
            response = "I can only solve equations or factorize polynomials."

    else:
        response = generate_explanation(question) # Generate explanation using Mistral GGUF

    # Store chat history
    if user_id not in chat_histories:
        chat_histories[user_id] = []
    chat_histories[user_id].append(f"User: {question}")
    chat_histories[user_id].append(f"Bot: {response}")

    return {"chat_history": chat_histories[user_id]}



'''
python3.10 -m uvicorn test6:app --reload
'''