#!/usr/bin/env python3
from flask import Flask, make_response, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource
from flask_migrate import Migrate
from config import app, db, api
import openai
from openai import OpenAI
import os

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')



@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5502')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

'''
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key="My API Key",
    )

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Say this is a test",
                }
            ],
            model="gpt-3.5-turbo",
)

'''
@app.post("/storyGenerator")
def storyGenerator():
    prompt = 'no update'
    data = request.get_json()
    prompt = data.get("prompt")
    print(prompt)
    client = OpenAI(
        api_key='place key here',
    )
    if not prompt:
        return make_response(jsonify({"error": "need a prompt"}), 400)
    try:
        stream = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": f"In a sarcastic manner write a story about {prompt} in less than 80 words"}],
            stream=True,
        )
        data = []
        for part in stream:
            print(part.choices[0].delta.content or "")
            data.append(part.choices[0].delta.content)

        messages = [
            {
                "role": "user",
                "content": f"write test complete",
            }
        ]
        response = jsonify({'data': data})
        return response

    except Exception as e:
        print(e)
        return make_response(jsonify({"error": "cannot generate story"}), 500)


if __name__ == '__main__':
    app.run(port=5555, debug=True)

