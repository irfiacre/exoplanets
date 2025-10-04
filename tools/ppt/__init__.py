from google.adk.tools import FunctionTool

from .implementation import PPTTool


pptTool = PPTTool()

initialize_powerpoint_instance_tool = FunctionTool(func=pptTool.initialize_powerpoint_instance)
create_first_slide_tool = FunctionTool(func=pptTool.create_first_slide)
add_text_slide_tool = FunctionTool(func=pptTool.add_text_slide)
save_powerpoint_tool = FunctionTool(func=pptTool.save_slide)
