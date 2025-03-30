
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List
from sympy import symbols, Eq, solve, parse_expr
from llama_cpp import Llama  # Using llama-cpp for Mistral GGUF


MODEL_PATH = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf" 
from llama_cpp import Llama

# Load the model
llm = Llama(model_path=MODEL_PATH, n_ctx=2048)

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


#github check

# Run an interactive loop to test the model
while True:
    userInput = input("Enter a math question (or type 'exit' to quit): ")
    if userInput.lower() == "exit":
        break
    explanation = generate_explanation(userInput)
    print("\nAI Explanation:\n", explanation, "\n")
