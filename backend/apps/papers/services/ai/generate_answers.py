from openai import OpenAI
from django.conf import settings


def generate_answer(question_text: str, marks: int | None = None) -> str:
    api_key = settings.GROQ_API_KEY
    if not api_key:
        return ''

    if marks and marks <= 2:
        length_hint = 'Answer in 2-3 sentences.'
    elif marks and marks <= 5:
        length_hint = 'Answer in a short paragraph (5-8 sentences).'
    elif marks and marks >= 10:
        length_hint = 'Answer in detail with multiple paragraphs, examples, and explanations.'
    else:
        length_hint = 'Answer in a medium-length paragraph.'

    try:
        client = OpenAI(
            api_key=api_key,
            base_url='https://api.groq.com/openai/v1',
        )
        response = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[
                {'role': 'user', 'content': f'{length_hint}\n\n{question_text}'},
            ],
        )
        return response.choices[0].message.content # Ensures the func only returns the answer.
    except Exception:
        return ''
