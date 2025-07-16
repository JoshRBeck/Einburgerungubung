import PyPDF2
import json
import re

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ''
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    return text

def parse_text_to_qa(text):
    qa_list = []
    
    # Adjust the split pattern to better match the PDF's format
    questions = re.split(r'\bAufgabe\s*\d+', text)[1:]  # Skip the first empty element
    
    for question in questions:
        parts = re.split(r'\n+', question.strip())
        
        # Correctly identify the question text
        question_text = parts[0].strip()
        
        # Combine multiline answers
        answers = []
        temp_answer = ""
        for part in parts[1:]:
            if re.match(r'^\s*', part):
                if temp_answer:
                    answers.append(temp_answer.strip())
                temp_answer = part
            else:
                temp_answer += " " + part
        if temp_answer:
            answers.append(temp_answer.strip())

        # Placeholder for correct answer
        correct_answer = "PLACEHOLDER"  # Placeholder to be manually updated
        
        qa_list.append({
            "question": question_text,
            "answers": answers,
            "correct_answer": correct_answer
        })
    
    return qa_list

def save_to_json(data, json_path):
    with open(json_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

def main():
    pdf_path = 'C:/Users/Josh Beck/Documents/Coding/bamfclone/src/fragenkatalog.pdf'  # Adjust the path to your local PDF file
    json_path = 'C:/Users/Josh Beck/Documents/Coding/bamfclone/src/questions.json'  # Adjust the path to your local JSON file

    # Extract text from PDF
    text = extract_text_from_pdf(pdf_path)

    # Parse text into questions and answers
    questions = parse_text_to_qa(text)

    # Save to JSON
    save_to_json(questions, json_path)

if __name__ == '__main__':
    main()
