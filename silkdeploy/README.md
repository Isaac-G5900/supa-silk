# Silk Agent

An agent built upon Google's Python based Agent Development Kit (ADK) and Vertex AI cloud engine.

## Prerequisites

- Python 3.12+
- Poetry (Python package manager)
- Google Cloud account with Vertex AI API enabled
- Google Cloud CLI (`gcloud`) installed and authenticated
  - Follow the [official installation guide](https://cloud.google.com/sdk/docs/install) to install gcloud
  - After installation, run `gcloud init` and `gcloud auth login`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bhancockio/deploy-adk-agent-engine.git](https://github.com/Isaac-G5900/supa-silk.git
cd supa-silk/silkdeploy
```

2. Install Poetry if you haven't already:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

3. Install project dependencies:
```bash
poetry install
```

4. Activate the virtual environment:
```bash
source $(poetry env info --path)/bin/activate
```

## Configuration

1. Create a `.env` file in the project root with the following variables:
```bash
Note: 
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=your-location  # e.g., us-central1
GOOGLE_CLOUD_STAGING_BUCKET=gs://your-bucket-name
```

2. Set up Google Cloud authentication:
```bash
gcloud auth login
gcloud config set project your-project-id
```

3. Enable required APIs:
```bash
gcloud services enable aiplatform.googleapis.com
```

## Usage

### Local Testing

1. Create a new session:
```bash
poetry run deploy-local --create_session
```

2. List all sessions:
```bash
poetry run deploy-local --list_sessions
```

3. Get details of a specific session:
```bash
poetry run deploy-local --get_session --session_id=your-session-id
```

4. For locally testing agent behavior:
```bash
poetry run deploy-local --send --session_id=your-session-id --message="<your message here>"
```

### Remote Deployment

1. Deploy the agent:
```bash
poetry run deploy-remote --create
```

2. Create a session:
```bash
poetry run deploy-remote --create_session --resource_id=your-resource-id
```

3. List sessions:
```bash
poetry run deploy-remote --list_sessions --resource_id=your-resource-id
```

4. Send a message:
```bash
poetry run deploy-remote --send --resource_id=your-resource-id --session_id=your-session-id --message="<your message here>"
```

5. Clean up (delete deployment):
```bash
poetry run deploy-remote --delete --resource_id=your-resource-id
```

## Project Structure

```
silkdeploy/
├── adk_silk_bot/          # Main package directory
│   ├── __init__.py
│   ├── agent.py           # Agent implementation
│   └── prompt.py          # Prompt template
├── deployment/            # Deployment scripts
│   ├── local.py          # Local testing script
│   └── remote.py         # Remote deployment script
├── .env                  # Environment variables
├── poetry.lock          # Poetry lock file
└── pyproject.toml       # Project configuration
```

## Development

To add new features or modify existing ones:

1. Make your changes in the relevant files
2. Test locally using the local deployment script
3. Deploy to remote using the remote deployment script
4. Update documentation as needed
