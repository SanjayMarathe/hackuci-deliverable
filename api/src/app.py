import json
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import AsyncIterator, Optional
from fastapi import FastAPI, Form, Query, status
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_201_CREATED)


@app.get("/quotes")
def get_quotes(max_age: Optional[str] = Query(None, description="Maximum age filter: week, month, year, or all")):
    all_quotes = database.get("quotes", [])
    
    now = datetime.now()

    if max_age is None or max_age == "all":
        return {"quotes": all_quotes}
    
    cutoff_date = None
    if max_age == "week":
        cutoff_date = now - timedelta(weeks=1)
    elif max_age == "month":
        cutoff_date = now - timedelta(days=30)
    elif max_age == "year":
        cutoff_date = now - timedelta(days=365)
    else:
        return {"quotes": all_quotes}
    
    filtered_quotes = []
    for quote in all_quotes:
        quote_time = datetime.fromisoformat(quote["time"])
        if quote_time >= cutoff_date:
            filtered_quotes.append(quote)
    
    return {"quotes": filtered_quotes}