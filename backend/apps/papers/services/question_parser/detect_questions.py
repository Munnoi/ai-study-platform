import re

def extract_questions(text):
    questions = []

    # Split text into sections by "Part" headers
    sections = re.split(r'(Part\s+[A-Z])', text, flags=re.IGNORECASE)

    # Combine headers with their content
    parts = []
    for i in range(1, len(sections), 2):
        header = sections[i]
        content = sections[i + 1] if i + 1 < len(sections) else ""
        parts.append((header, content))

    # If no parts found, treat entire text as one section
    if not parts:
        parts = [("", text)]

    for _, content in parts:
        # Extract section marks from "Each question carries X marks"
        marks_match = re.search(
            r'each\s+question\s+carries\s+(\d+)\s+marks?',
            content, re.IGNORECASE
        )
        section_marks = int(marks_match.group(1)) if marks_match else None

        # Match numbered questions: "1. ..." or "1) ..."
        # Capture question number and text up to the next question or end
        q_pattern = r'(\d+)[.\)]\s*(.*?)(?=\n\d+[.\)]\s|\n\(\d+|\nPage\s|\Z)'
        matches = re.findall(q_pattern, content, re.DOTALL)

        for number, q_text in matches:
            q_text = q_text.strip()
            # Skip non-question lines (e.g., page numbers, headers)
            if not q_text or q_text.lower().startswith('page'):
                continue

            # Check for inline marks like "(5 marks)"
            inline = re.search(r'\((\d+)\s*marks?\)', q_text, re.IGNORECASE)
            if inline:
                marks = int(inline.group(1))
                q_text = re.sub(r'\(\d+\s*marks?\)', '', q_text).strip()
            else:
                marks = section_marks or 0

            questions.append({
                "number": int(number),
                "text": q_text,
                "marks": marks,
            })

    return questions
