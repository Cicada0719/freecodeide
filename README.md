# Free Code VS Code Extension

This is a VS Code extension that integrates [free-code](https://github.com/paoloanzn/free-code) (the free build of Claude Code) into VS Code.

## Features

- **Free Code: Start** - Launches the `free-code` CLI inside the VS Code Integrated Terminal.
- **Free Code: Install / Update** - Installs or updates the `free-code` CLI locally via the official quick install script.

## Requirements

- macOS or Linux (Windows via WSL)
- [Bun](https://bun.sh/) is required and will be installed by the quick-install script if not present.
- An API key or OAuth login for your chosen provider (Anthropic, OpenAI, AWS Bedrock, Vertex AI, or Foundry).

## Getting Started

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Type **Free Code: Start** to launch the CLI.
3. If it's your first time, it will prompt you to install it. Alternatively, run **Free Code: Install / Update**.

## License

MIT
