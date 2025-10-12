## A World Away: Hunting for Exoplanets with AI.

### Overview
Exogent AI is an intelligent agent that is based on the information collected by the K2 satellite (specifically the K2 planets and candidate dataset) and is designed to bridge exoplanet research with public engagement. For research, it analyzes the dataset and helps the researcher to classify and/or interpret data. Not only this but it also finds relevant links online for further research. In parallel, the agent transforms complex scientific topics into personalized learning experiences. Where —whether students, educators, or space enthusiasts—can input their age and interests to receive a tailored, engaging mini-course on exoplanets, or related topics. Exogent AI is important because it tackles two critical bottlenecks in the field: research speed and public participation. Reducing manual analysis saves valuable time for scientists. By making space science approachable, it lowers the entry barrier for newcomers. Ultimately, Exogent AI not only accelerates our understanding of distant worlds—it helps inspire the next generation of people who will explore them.

## Solution:
Design Diagram can be found here ([Exogents](https://docs.google.com/presentation/d/1DATbYEG1J58fNOUx8olwhF2mn6B9-Wr2uNuPTxBgXss/edit?usp=sharing))

### Features
*Research Assistant Mode:* It functions as a conversational chatbot that analyzes K2 satellite data and answers scientific queries. Researchers can ask about specific planets or candidate signals, and the agent helps classify or interpret the data.
*Learning Mode:* It generates personalized learning courses by analyzing a user’s age, interests, and background. The resulting lessons are designed to be fun, accessible, and interactive for beginners.

### Technical Stack & Architecture

- *Backend:* FastAPI + Google ADK to orchestrate agent workflows
- *Data Layer:* Exoplanet Archive TAP API + caching layer using Redis
- *AI Logic:* LLM prompt templates for data interpretation and curriculum generation
- *Frontend:* Next.js with a conversational UI for interactive exploration

## Getting Started
### Prerequizite:
**Python, Nodejs, Make**
## Running the project:
```:bash
make frontend-install && make backend-install
```
Before you start the project check the file `.env.example` to create your own .env file.
```:bash
make dev
```

Enjoy!!

## Contributors (exogents):
> Iradukunda Allelua Fiacre ([Linkedin](https://www.linkedin.com/in/irfiacre))
