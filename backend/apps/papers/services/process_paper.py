from apps.papers.models import Question
from .ocr.extract_text import extract_text_from_pdf
from .question_parser.detect_questions import extract_questions


def process_question_paper(paper):
    file_path = paper.file.path
    text = extract_text_from_pdf(file_path)
    questions = extract_questions(text)

    for q in questions:
        Question.objects.create(
            paper=paper,
            number=q["number"],
            text=q["text"],
            marks=q["marks"]
        )

    paper.status = "processing"
    paper.save()