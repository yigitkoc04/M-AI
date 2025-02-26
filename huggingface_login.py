from huggingface_hub import login

# Enter your Hugging Face token here
token = "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"
login(token=token)

print("✅ Successfully logged into Hugging Face!")

# token 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

'''
echo 'export PATH=$HOME/Library/Python/3.10/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
huggingface-cli login
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
huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.1-GGUF mistral-7b-instruct-v0.1.Q4_K_M.gguf --local-dir models --local-dir-use-symlinks False

'''