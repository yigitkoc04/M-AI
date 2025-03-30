import re
from sympy import parse_expr

""" def extract_math_expression(user_input: str):
   
    try:
        # Updated regular expression to capture the entire math expression
        expression_match = re.search(r"([0-9x+\-*/().^= ]+)", user_input)
        if expression_match:
            expression = expression_match.group(1)
            expression = expression.replace('^', '**')
            
            # Parse the expression using SymPy
            sympy_expr = parse_expr(expression, transformations="all")
            return sympy_expr
    except Exception as e:
        print(f"Error: {e}")
        return None
    return None

# Test the function """

import re
from sympy import symbols, Eq, parse_expr

def extract_math_expression(text):
    """ Extracts a mathematical expression from text and formats it for SymPy. """
    try:
        # Ensure variables are explicitly defined
        x = symbols('x')

        # Enhanced regex to capture complete mathematical expressions
        match = re.search(r"([0-9a-zA-Z+\-*/().^= ]+)", text)

        if match:
            expression = match.group(1).strip()

            # Ensure expression is valid before parsing
            if not expression or expression.isspace():
                return None  # Skip if empty or invalid

            # Replace exponentiation symbol ^ → ** for Python compatibility
            expression = expression.replace("^", "**")

            # Convert implicit multiplication (e.g., 2x → 2*x)
            expression = re.sub(r"(\d)([a-zA-Z])", r"\1*\2", expression)

            # Handle equations separately
            if "=" in expression:
                left, right = expression.split("=")
                return Eq(parse_expr(left.strip(), transformations="all"), parse_expr(right.strip(), transformations="all"))
            else:
                return parse_expr(expression, transformations="all")

        return None  # No valid math expression found

    except Exception as e:
        print(f"Error extracting math expression: {e}")
        return None

# 🔥 Test Cases
print(extract_math_expression("Solve for x: 2x + 3 = 13"))  # ✅ Expected: Eq(2*x + 3, 13)
print(extract_math_expression("Factorize x^2 + 5x + 6"))  # ✅ Expected: x**2 + 5*x + 6
print(extract_math_expression("Expand (x+3)(x-2)"))  # ✅ Expected: (x+3)*(x-2)
print(extract_math_expression("Find x in 5x - 7 = 3x + 4"))  # ✅ Expected: Eq(5*x - 7, 3*x + 4)
print(extract_math_expression("This isn't a math question"))  # ✅ Expected: None



""" expression = (extract_math_expression("2x^2 + 5x + 6")) # 2x^2 + 5x + 6
from sympy import symbols, Eq, solve, diff

# Define the symbol 'x'
x = symbols('x')

# 1. Simplifying the expression (though it's already simplified)
simplified_expr = expression.simplify()
print(f"Simplified Expression: {simplified_expr}")

# 2. Solving the equation 2x^2 + 3x + 1 = 0
equation = Eq(expression, 0)
solutions = solve(equation, x)
print(f"Solutions for x: {solutions}")

# 3. Finding the derivative of the expression
derivative = diff(expression, x)
print(f"Derivative with respect to x: {derivative}")

# 4. Evaluating the expression at x = 1
value_at_1 = expression.subs(x, 0)
print(f"Value of expression at x = 1: {value_at_1}")
 """

