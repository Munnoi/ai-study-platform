from apps.papers.models import Question
from .ocr.extract_text import extract_text_from_pdf
from .question_parser.detect_questions import extract_questions
from .ai.generate_answers import generate_answer


def process_question_paper(paper):
    file_path = paper.file.path # The physical file location on the server.
    text = extract_text_from_pdf(file_path) # Extracts the text from pdf.
    questions = extract_questions(text) # Extracts the questions from the extracted text.

    for q in questions:
        answer = generate_answer(q["text"], q["marks"])
        Question.objects.create(
            question_paper=paper,
            question_number=q["number"],
            question_text=q["text"],
            marks=q["marks"],
            answer=answer,
        )

    paper.status = "processed" # For indicating the paper has finished processing.
    paper.save() # Saves the paper in the db.