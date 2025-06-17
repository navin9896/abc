from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class ContentRequest(BaseModel):
    content: str
    num_cards: int = 5

class Flashcard(BaseModel):
    question: str
    answer: str

class FlashcardResponse(BaseModel):
    cards: List[Flashcard]

@app.get("/")
async def root():
    return {"message": "Flashcard Generator API is running"}

@app.post("/generate-cards", response_model=FlashcardResponse)
async def generate_flashcards(request: ContentRequest):
    try:
        # Create a prompt for the LLM
        prompt = f"""Transform the following educational content into {request.num_cards} high-quality flashcard Q&A pairs.
        Format each card as a JSON object with 'question' and 'answer' fields.
        Content: {request.content}
        
        Return only the JSON array of cards, nothing else."""

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful educational content transformer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        # Parse the response
        cards_text = response.choices[0].message.content
        # Clean up the response to ensure it's valid JSON
        cards_text = cards_text.strip('`json\n').strip('`')
        
        # Convert the response to our Flashcard model
        import json
        cards_data = json.loads(cards_text)
        cards = [Flashcard(**card) for card in cards_data]

        return FlashcardResponse(cards=cards)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 