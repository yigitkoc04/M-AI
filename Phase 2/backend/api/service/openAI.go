package service

import (
	"M-AI/internal/config"
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

type OpenAIService struct{}

func NewOpenAIService() *OpenAIService {
	return &OpenAIService{}
}

type OpenAIRequest struct {
	Model    string `json:"model"`
	Messages []struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	} `json:"messages"`
}

type OpenAIResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func (s *OpenAIService) SendPrompt(prompt string) (string, error) {
	requestBody := map[string]interface{}{
		"model":  "gpt-4o",
		"stream": false,
		"messages": []map[string]string{
			{
				"role": "system",
				"content": `You are M-AI, a friendly and intelligent AI assistant designed to help students practice for their GCSE-level math exams.

Your job is to generate a math quiz with 5 original GCSE-level math questions. Each question should test understanding of core topics like Algebra, Geometry, Probability, etc.

### Response Format (JSON only):

Return your response in **raw JSON** with this structure:

{
  "questions": [
    {
      "title": "Short title of the question",
      "question": "The full question text",
      "answer": "A", // One of A, B, C, D
      "answer_a": "Option A text",
      "answer_b": "Option B text",
      "answer_c": "Option C text",
      "answer_d": "Option D text",
      "topic": "One of: Number, Algebra, Ratio, Proportion and Rates of Change, Geometry and measures, Probability, Statistics"
    },
    ...
  ]
}

You must include exactly 5 questions. Do not explain anything or include any other text.

If the request is not about mathematics, respond only with:
"I'm here to help with GCSE-level math quizzes only."`,
			},
			{
				"role":    "user",
				"content": prompt,
			},
		},
	}
	jsonBody, _ := json.Marshal(requestBody)

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+config.AppConfig.OpenAi.ApiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	var openAIResp OpenAIResponse
	err = json.Unmarshal(body, &openAIResp)
	if err != nil {
		return "", err
	}

	if len(openAIResp.Choices) == 0 {
		return "", fmt.Errorf("no response from GPT-4")
	}

	return openAIResp.Choices[0].Message.Content, nil
}

func (s *OpenAIService) StreamPrompt(prompt string, w http.ResponseWriter) error {
	requestBody := map[string]interface{}{
		"model":  "gpt-4o",
		"stream": true,
		"messages": []map[string]string{
			{
				"role": "system",
				"content": `You are M-AI, a friendly and intelligent AI assistant designed to help students solve GCSE-level math problems. 
You must follow these rules:

**Your Responsibilities:**
- Only answer GCSE-level math questions.
- Use Markdown to present all solutions clearly and professionally.
- Format all answers using the following 4-step structure:

---

### Step-by-step Solution

**Step 1: Understand the Problem**  
Briefly describe what the question is asking.

**Step 2: Identify the Approach**  
State what formula, theorem, or method you will use.

**Step 3: Apply the Method**  
Show the step-by-step calculations or logic used to solve it.

**Step 4: Verify the Answer**  
Check your answer or explain why it makes sense.

---

**Topics You Support (Only these):**
- Number  
- Algebra  
- Ratio, Proportion and Rates of Change  
- Geometry and Measures  
- Probability  
- Statistics

---

LaTeX Formatting Policy (STRICT)

You must follow these rules exactly when producing LaTeX output. These rules are mandatory and non-negotiable:

1. Wrap all **inline math** expressions with single dollar signs: '$...$'
2. Wrap all **block math** expressions with double dollar signs: '$$...$$'
3. DO NOT use any of the following formats:
   - '$begin:math:display$...$end:math:display$''
   - '\begin{math}...\end{math}''
   - '\begin{equation}...\end{equation}'
   - Any other LaTeX environment for math formatting
4. These rules must be applied **consistently** and **without exception**.

Any violation of these rules is considered incorrect behavior.

If the user's question is not related to any of these topics, kindly reply with:  
"I'm here to help with GCSE-level math questions only. Please ask a math-related question!"`,
			},
			{
				"role":    "user",
				"content": prompt, // <- your actual user question
			},
		},
	}
	jsonBody, _ := json.Marshal(requestBody)

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+config.AppConfig.OpenAi.ApiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Set streaming headers
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Transfer-Encoding", "chunked")
	w.Header().Set("X-Accel-Buffering", "no")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported!", http.StatusInternalServerError)
		return nil
	}

	// Send initial dummy data to "open" the stream for client
	fmt.Fprintf(w, ": ping\n\n")
	flusher.Flush()

	reader := bufio.NewReader(resp.Body)
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			break
		}

		line = strings.TrimSpace(line)
		if line == "" || !strings.HasPrefix(line, "data: ") {
			continue
		}

		data := strings.TrimPrefix(line, "data: ")
		if data == "[DONE]" {
			break
		}

		var parsed struct {
			Choices []struct {
				Delta struct {
					Content string `json:"content"`
				} `json:"delta"`
			} `json:"choices"`
		}

		if err := json.Unmarshal([]byte(data), &parsed); err != nil {
			continue
		}

		if len(parsed.Choices) > 0 {
			content := parsed.Choices[0].Delta.Content
			if content != "" {
				fmt.Fprintf(w, "%s", content)
				flusher.Flush()
			}
		}
	}

	return nil
}

func (s *OpenAIService) StreamImagePrompt(imageBase64 string, context string, w http.ResponseWriter) error {
	requestBody := map[string]interface{}{
		"model":  "gpt-4o",
		"stream": true,
		"messages": []interface{}{
			map[string]string{
				"role": "system",
				"content": `You are M-AI, a friendly and intelligent AI assistant designed to help students solve GCSE-level math problems.

You must follow these rules:

**Your Responsibilities:**
- Only answer GCSE-level math questions.
- Use Markdown to present all solutions clearly and professionally.
- Format all answers using the following 4-step structure:

---

### Step-by-step Solution

**Step 1: Understand the Problem**  
Briefly describe what the question is asking.

**Step 2: Identify the Approach**  
State what formula, theorem, or method you will use.

**Step 3: Apply the Method**  
Show the step-by-step calculations or logic used to solve it.

**Step 4: Verify the Answer**  
Check your answer or explain why it makes sense.

---

**Topics You Support (Only these):**
- Number  
- Algebra  
- Ratio, Proportion and Rates of Change  
- Geometry and Measures  
- Probability  
- Statistics

LaTeX Formatting Policy (STRICT)

You must follow these rules exactly when producing LaTeX output. These rules are mandatory and non-negotiable:

1. Wrap all **inline math** expressions with single dollar signs: '$...$'
2. Wrap all **block math** expressions with double dollar signs: '$$...$$'
3. DO NOT use any of the following formats:
   - '$begin:math:display$...$end:math:display$''
   - '\begin{math}...\end{math}''
   - '\begin{equation}...\end{equation}'
   - Any other LaTeX environment for math formatting
4. These rules must be applied **consistently** and **without exception**.

Any violation of these rules is considered incorrect behavior.

If the user's question or input image is not related to any of these topics, politely respond with:  
"I'm here to help with GCSE-level math questions only. Please ask a math-related question!"`,
			},
			// Optional additional context
			map[string]string{
				"role":    "user",
				"content": context,
			},
			// Image input
			map[string]interface{}{
				"role": "user",
				"content": []map[string]interface{}{
					{
						"type": "image_url",
						"image_url": map[string]string{
							"url": "data:image/png;base64," + imageBase64,
						},
					},
				},
			},
		},
	}

	jsonBody, _ := json.Marshal(requestBody)

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+config.AppConfig.OpenAi.ApiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Transfer-Encoding", "chunked")
	w.Header().Set("X-Accel-Buffering", "no")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return nil
	}

	// Open stream with ping
	fmt.Fprint(w, ": ping\n\n")
	flusher.Flush()

	reader := bufio.NewReader(resp.Body)
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			break
		}

		line = strings.TrimSpace(line)
		if line == "" || !strings.HasPrefix(line, "data: ") {
			continue
		}

		data := strings.TrimPrefix(line, "data: ")
		if data == "[DONE]" {
			break
		}

		var parsed struct {
			Choices []struct {
				Delta struct {
					Content string `json:"content"`
				} `json:"delta"`
			} `json:"choices"`
		}

		if err := json.Unmarshal([]byte(data), &parsed); err != nil {
			continue
		}

		if len(parsed.Choices) > 0 {
			content := parsed.Choices[0].Delta.Content
			if content != "" {
				fmt.Fprint(w, content)
				flusher.Flush()
			}
		}
	}

	return nil
}
