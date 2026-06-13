# ADAM-Entity
![STATUS: WIP](https://img.shields.io/badge/status-WIP-yellow)
![Python](https://img.shields.io/badge/Python-brown?logo=python)
![CSS](https://img.shields.io/badge/css-brown?logo=css)
![JS](https://img.shields.io/badge/javascript-brown?logo=javascript)
![Docker](https://img.shields.io/badge/Docker-brown?logo=docker)

## Project Description
ADAM Entity Simulation / AI Agent Integration, inspired in the Commodore Amiga Alan-1 chatbot software.

Live Demo (Expect high latencies, the LLM model is running on a GPUless server): @ https://adam.iskarion.ddns.net/

![snapshot](./snapshot.png)

## Install / Deploy Instructions
 1. Clone Repository
    ```bash
    git clone git@github.com:pinakure/ADAM-Entity.git /src/adam
    ```
 2. Get up the container
    ```bash
    cd /src/adam
    docker compose up --build -d
    ```
    
## Available commands
    /smile
    /cry
    /love
    /sleep
    /smoke
    /talk

## Dependencies
### LLM 
Any non-command input will cause ADAM to make a request to a third party LLM model running under the same docker network. Such container must use the hostname **'ollama'** and must listen port **11434**. You can easily fulfill this dependency by deploying [this](https://github.com/pinakure/AI-Ollama-Custom) container first, then deploying ADAM, ensuring both containers are in the same network.
### TTS 
Once ADAM gets a response from the LLM, it sends a TTS request to a LapisTTS server, this time running on https://tts.iskarion.ddns.net
