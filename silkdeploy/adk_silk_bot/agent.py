# from google.adk.agents import LlmAgent
# from google.adk.models.lite_llm import LiteLlm
from google.adk.agents import Agent
from adk_silk_bot.prompt import ROOT_AGENT_INSTRUCTION
from adk_silk_bot.tools import count_characters
from adk_silk_bot.tools import extract_to_markdown

# Llm
root_agent = Agent(
    name="adk_silk_bot",
    model = "gemini-2.0-flash",
    # model=LiteLlm(model="openai/gpt-4o"),
    description="A bot that aids the backend services tokenize input and populate filters.",
    instruction=ROOT_AGENT_INSTRUCTION,
    tools=[count_characters, extract_to_markdown],
)


