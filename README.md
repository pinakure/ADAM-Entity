# ADAM-Entity

ADAM Entity Simulation / AI Agent Integration

Live Demo (Expect high latencies, the LLM model is running on a GPUless server): @ https://adam.iskarion.ddns.net/

![snapshot](./snapshot.png)

## Available commands
  /smile
  /cry
  /love
  /sleep
  /smoke
  /talk

Any other input will force ADAM to make a request to a LLM model running under a ollama server, located in the docker network **ollama:11434**
