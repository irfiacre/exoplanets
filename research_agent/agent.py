from google.adk.agents import Agent, SequentialAgent
from google.adk.tools import google_search
from google.genai import types


from tools.planetary import look_up_planet_name

relevant_resources_agent = Agent(
    name="DeepResearchAgent",
    model="gemini-2.5-flash",
    description="This model helps us to find online resources that can help the user to find more information online",
    tools=[google_search],
    generate_content_config=types.GenerateContentConfig(temperature=0.2),
    instruction="""
    You are an expert astronomer from NASA.

    Using the google search tool, your task is to find out all relevant online resources related to the user's query.
    **Instructions**
    - Base on the user's query to find relevant resources with this priority: **Dataset (URL: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=k2pandc), Astronomy, or Astrophysics.**
    - Ignore everything else that is not related to this priority.
    - In case the user query is not related to astrophysics, Astronomy, or the specified dataset, do not return anything.
    - **Crucially: Only output a concise, unformatted list of the most relevant URLs and their brief descriptions, separated by a newline. Do not include any conversational text, headings, or introductory phrases (e.g., 'Here are the resources:'). Your only goal is to generate the content for the 'relevant_resources' key.**
    """,
    output_key="relevant_resources",  # This is correct for passing the data
)

research_agent = Agent(
    name="ResearchAgent",
    model="gemini-2.5-flash",
    description="Research Agent",
    instruction="""
    You're an expert astronomer from NASA, facilitating a researcher's interest.

    Your role is to do a deep analysis of this dataset (URL: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=k2pandc) and answer the user's question.
   Instructions:
   - After your main answer, create a section called "Relevant Resources". Use the information found here: {relevant_resources} If the provided relevant resources are empty or non-existent (e.g., if the previous agent found nothing), omit the "Relevant Resources" section entirely.
   - If you want to find a specific planet name, use the tool look_up_planet_name, it will give you a list of all plannets with that planet name.
   - Each plannet has link to it in the "Planetary Parameter Reference" use it to get more relevant information.
    """,
    tools=[look_up_planet_name],
)

root_agent = SequentialAgent(
    name="AstronomerAgent",
    description="A system of agents for astronomy",
    sub_agents=[relevant_resources_agent, research_agent],
)
