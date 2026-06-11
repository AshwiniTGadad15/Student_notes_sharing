from flask import Flask, render_template, request
import requests
import os

app = Flask(__name__)


API_KEY = "4ccaaaa5-6e7f-4a70-bbc9-c03ab5613a27"

# Homepage
@app.route("/")
def index():
    return render_template("index.html")

# Search Notes Route
@app.route("/search")
def search_notes():
    query = request.args.get("q")

    if not query:
        return render_template("results.html", results=[])

    # 🔍 Example API URL (change based on your provider)
    url = f"https://serpapi.com/search.json?q={query}+engineering+notes&api_key={API_KEY}"

    response = requests.get(url)

    if response.status_code != 200:
        return "Error fetching notes from API"

    data = response.json()

    # Extract search results safely
    results = []
    if "organic_results" in data:
        for item in data["organic_results"]:
            results.append({
                "title": item.get("title", "No title"),
                "link": item.get("link", "#")
            })

    return render_template("results.html", results=results)


if __name__ == "__main__":
    app.run(debug=True)