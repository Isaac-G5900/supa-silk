import os
import sys

import vertexai
from absl import app, flags
from dotenv import load_dotenv
from vertexai.preview import reasoning_engines

from adk_silk_bot.agent import root_agent

FLAGS = flags.FLAGS
flags.DEFINE_string("project_id", None, "GCP project ID.")
flags.DEFINE_string("location", None, "GCP location.")
flags.DEFINE_string("user_id", "test_user", "User ID for session operations.")
flags.DEFINE_string("session_id", None, "Session ID for operations.")
flags.DEFINE_bool("create_session", False, "Creates a new session.")
flags.DEFINE_bool("list_sessions", False, "Lists all sessions for a user.")
flags.DEFINE_bool("send", False, "Sends a message to the local agent.")
flags.DEFINE_string(
    "message",
    "Hello, Silk!",
    "Message to send to the agent.",
)
flags.mark_bool_flags_as_mutual_exclusive(
    ["create_session", "list_sessions", "send"]
)

def main(argv=None):

    if argv is None:
        _ = FLAGS(sys.argv)
    else:
        _ = FLAGS(argv)

    load_dotenv()

    # openai_key = os.getenv("OPENAI_API_KEY")
    # if not openai_key:
    #     print("Missing OPENAI_API_KEY in your environemnt\n")
    #     sys.exit(1)
    # os.environ["OPENAI_API_KEY"] = openai_key
    

    project_id = FLAGS.project_id or os.getenv("GOOGLE_CLOUD_PROJECT")
    location = FLAGS.location or os.getenv("GOOGLE_CLOUD_LOCATION")
    if not project_id:
        print("Missing GOOGLE_CLOUD_PROJECT")
        sys.exit(1)
    if not location:
        print("Missing GOOGLE_CLOUD_LOCATION")
        sys.exit(1)

    vertexai.init(project=project_id, location=location)
    app_local = reasoning_engines.AdkApp(agent=root_agent, enable_tracing=True)

    # MODE 1: create a new session
    if FLAGS.create_session:
        sess = app_local.create_session(user_id=FLAGS.user_id)
        print("Created local session:")
        print(f"  ID:   {sess.id}")
        print(f"  User: {sess.user_id}")
        return

    # MODE 2: list existing sessions
    if FLAGS.list_sessions:
        result = app_local.list_sessions(user_id=FLAGS.user_id)
        ids = getattr(result, "session_ids", getattr(result, "sessions", None))
        print(f"Sessions for '{FLAGS.user_id}': {ids}")
        return

    # MODE 3: send one message
    if FLAGS.send:
        if not FLAGS.session_id:
            print("Error: --session_id is required for send")
            sys.exit(1)
        print(f"Sending to session {FLAGS.session_id}: {FLAGS.message}")
        for event in app_local.stream_query(
            user_id=FLAGS.user_id,
            session_id=FLAGS.session_id,
            message=FLAGS.message,
        ):
            text = getattr(event, "text", None)
            if text:
                print(text, end="")
            elif isinstance(event, dict) and event.get("parts"):
                print("".join(p.get("content", "") for p in event["parts"]), end="")
        print()
        return
    
    print("Entering interactive mode (type 'exit' to quit')")
    sess = app_local.create_session(user_id=FLAGS.user_id)
    print(f"Session ID: {sess.id}")

    while True:
        msg = input("You: ")
        if msg.strip().lower() == "exit":
            print("Goodbye!")
            break

        # Send the message and print out every event
        for event in app_local.stream_query(
            user_id=FLAGS.user_id,
            session_id=sess.id,
            message=msg,
        ):
            # 1) Tool response (newer ADK)
            if hasattr(event, "tool_response"):
                print(event.tool_response, end="")
                continue
            
            # 2) Tool result (older ADK)
            if hasattr(event, "result"):
                print(event.result, end="")
                continue

            # 3) LLM text output
            if getattr(event, "text", None):
                print(event.text, end="")
                continue

            # 4) Raw dict with content.parts
            if isinstance(event, dict):
                content = event.get("content") or {}
                parts = content.get("parts") or []
                for part in parts:
                    # Docling tool emits under part["text"]
                    txt = part.get("text") or part.get("content")
                    if txt:
                        print(txt, end="")
                        # don’t continue outer loop yet—could be more parts
                continue
            print(event, end="") # 5) last resort: print the raw event
        print()  # newline
