import json
from openai import OpenAI
from django.conf import settings


def generate_flashcards(questions) -> list[dict]:
    api_key = settings.GROQ_API_KEY # Gets the api from settings.py file.
    if not api_key:
        return []

    qa_pairs = []
    for q in questions:
        qa_pairs.append({
            'question': q.question_text,
            'answer': q.answer,
        })

    prompt = (
        "Given the following exam questions and answers, generate concise flashcards for studying. "
        "Each flashcard should have a 'front' (a key concept, term, or question) and a 'back' (a clear, concise answer or explanation). "
        "Create multiple flashcards per Q&A pair if it covers multiple concepts. "
        "Return ONLY a JSON array of objects with 'front' and 'back' keys, no other text.\n\n"
        f"{json.dumps(qa_pairs)}"
    ) # json.dumps() -> converts Python to JSON string.

    try:
        client = OpenAI(
            api_key=api_key,
            base_url='https://api.groq.com/openai/v1',
        )
        response = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{'role': 'user', 'content': prompt}],
        ) # Calls the chat model.
        content = response.choices[0].message.content
        # Extract JSON from response
        start = content.index('[')
        end = content.rindex(']') + 1
        return json.loads(content[start:end]) # Converts JSON to Python.
    except Exception:
        return []
