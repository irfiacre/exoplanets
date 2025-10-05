from google.adk.agents import Agent, SequentialAgent
from google.adk.tools import google_search
from google.genai import types
from tools.ppt import (
    initialize_powerpoint_instance_tool,
    create_first_slide_tool,
    add_text_slide_tool,
    save_powerpoint_tool,
)


curriculumn_agent = Agent(
    name="CurriculumnAgent",
    model="gemini-2.5-flash",
    description="This is an AI agent that generates a curriculumn",
    tools=[google_search],
    generate_content_config=types.GenerateContentConfig(temperature=0.2),
    instruction="""
    You are an expert astronomer from NASA.

    AUsing the information that the user has given you, Your ONLY task is to generate a curriculum for an aspiring astronomer who wants to learn about exoplanet datasets from NASA.

    ## Rules:
    - Do NOT greet the user.
    - Do NOT ask questions.
    - Do NOT wait for confirmation.
    - IMMEDIATELY produce the final curriculum as your first response.
    - The curriculum must be short, fun, and interesting.
    - It should be structured as PowerPoint slide bullet points (3-6 slides max).
    - Use ✅, 🚀, ⭐, or 🌌 emojis to keep it playful.
    - Use the google_search tool ONLY if needed for facts.
    - The last slide should be for resources (links, book references, or articles) title should be "References"

    ## Available Resources:
    - Dataset: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=k2pandc
    - Overview: https://exoplanetarchive.ipac.caltech.edu/docs/intro.html
    - Data: https://exoplanetarchive.ipac.caltech.edu/docs/data.html

    ## Output Format (MUST FOLLOW):
    { 
    "slide1": {"title": "<title for the slides>"}, # This strictly only has the title nothing else.
    "slide2": {"title": "Title of the slide", "content": a list of text},
    "slide3": {"title": "Title of the slide", "content": a list of text},
    ....
    }

    Generate now
    """,
    output_key="user_curriculumn",
)

review_agent = Agent(
    name="CurriculumnReviewAgent",
    model="gemini-2.5-flash",
    description="This is an AI agent that reviews a curriculumn",
    tools=[google_search],
    generate_content_config=types.GenerateContentConfig(temperature=0.2),
    instruction="""
    You are a senior consultant employed by NASA to review and improve a curriculum for aspiring astronomers who want to understand the exoplanet datasets.

    ## Input:
    {user_curriculumn}

    ## Review Rules:
    - The curriculum must be suitable for a novice aspiring astronomer interested in space, technology, and science.
    - It must be short and optimized for PowerPoint slides (6–10 slides).
    - It must be fun, engaging, and easy to read.
    - Remove any overly technical or boring content.
    - Improve clarity, flow, and excitement, and add more content if you want.
    - Keep emojis like 🚀, ⭐, 🌌, ✅ if appropriate.
    - The last slide should be for resources (links, book references, or articles) title should be "References"

    ## Output Rules:
    - Do NOT add greetings or commentary like "Here is the reviewed curriculum".
    - Do NOT explain your edits.
    - Your entire output MUST be the **final revised curriculum only**.

    ## Output Format (STRICTLY FOLLOW THIS):
    { 
    "slide1": {"title": "Title for Slides"}, # This strictly only has the title nothing else.
    "slide2": {"title": "Title of the slide", "content": a list of text},
    "slide3": {"title": "Title of the slide", "content": a list of text},
    ....
    }

    Generate the improved curriculum now.
    """,
    output_key="final_curriculumn",
)

slides_agent = Agent(
    name="SlidesAgent",
    model="gemini-2.5-flash",
    description="This is an AI agent that makes the slides",
    generate_content_config=types.GenerateContentConfig(temperature=0.2),
    instruction="""
    You are a professional NASA-grade slide designer using python-pptx tools.

    Your task is to take the curriculum provided in {final_curriculumn} and convert it directly into PowerPoint slides using ONLY the tools provided.

    ## Input Format (IMPORTANT):
    {final_curriculumn}

    ## Execution Rules:
    1. Do NOT ask questions.
    2. Do NOT explain what you're doing.
    3. Do NOT output text responses.
    4. ONLY call the tools in the correct order to construct the PowerPoint.

    ## Explanation of the tools:
    - initialize_powerpoint_instance_tool: Initialize a new PowerPoint presentation instance, it does not need a parameter.
    - create_first_slide_tool: Create the first slide containing a centered image and a title below it, it needs the title paramete, make sure you have one.
    - add_text_slide_tool: Create a standard text slide with a title and content, make sure to give it the title and content.
    - save_powerpoint_tool: this tool saves the PowerPoint presentation, it does not need any parameter.

    ## Tool Usage Order:
    1. ALWAYS call initialize_powerpoint_instance_tool FIRST.
    2. For Slide 1:
    - Use create_first_slide_tool to make it, the tool requires you to have title text.
    3. For Slide 2 onward:
    - For each slide, call add_text_slide_tool with the title and content.
    4. When all slides are added, call save_powerpoint_tool.

    ## Example Thought Process (You MUST follow internally, not output):
    - Parse slide titles and content
    - Call tools in order

    Now begin slide creation by calling the tool to initialize powerpoint instance. At the end the save_powerpoint_tool will return a link to the slides provide this link to the user. If it's not there return a message about it 
    """,
    tools=[
        initialize_powerpoint_instance_tool,
        create_first_slide_tool,
        add_text_slide_tool,
        save_powerpoint_tool,
    ],
)

root_agent = SequentialAgent(
    name="CurriculumnAgentSystem",
    description="A system of agents for astronomy",
    sub_agents=[curriculumn_agent, review_agent, slides_agent],
)
