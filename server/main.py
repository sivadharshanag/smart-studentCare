from fastapi import FastAPI, UploadFile, File
import fitz  # PyMuPDF
import docx2txt
import re
import spacy

app = FastAPI()

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_path):
    return docx2txt.process(file_path)

def parse_resume(text):
    data = {}

    # Extract email
    email = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    data["email"] = email[0] if email else None

    # Extract phone
    phone = re.findall(r"\+?\d[\d\s-]{8,}\d", text)
    data["phone"] = phone[0] if phone else None

    # Use spaCy for names & organizations
    doc = nlp(text)
    names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    orgs = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    data["name"] = names[0] if names else None
    data["organizations"] = orgs

    return data

@app.post("/extract/")
async def extract(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_location)
    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(file_location)
    else:
        return {"error": "Unsupported file format"}

    result = parse_resume(text)
    result["raw_text"] = text  # keep full text also
    return result
