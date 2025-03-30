import requests


# API endpoint
api_url = "http://127.0.0.1:8000/chatt"

while True:
    # Ask for user input
    user_question = input("\nEnter your math question (or type 'exit' to quit): ")

    # Allow the user to exit
    if user_question.lower() == "exit":
        print("\nExiting the chatbot. See you next time!")
        break

    # Create the request payload
    data = {"user_id": "user123", "question": user_question}

    # Send the request to the API
    response = requests.post(api_url, json=data)

    # Print the chatbot's response without formatting
    chat_history = response.json().get("chat_history", [])
    bot_response = chat_history[-1] if chat_history else "No response received."

    print("\nChatbot Response:")
    print(bot_response)

# python3.10 api_test.py


