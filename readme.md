# Google Search Integration for ChatGPT (Plugin)

A Typescript Express.js App

## Overview

Google Search Integration for ChatGPT is a plugin that allows you to seamlessly perform Google searches and retrieve information from search results directly within the ChatGPT environment. This enhances your ChatGPT experience by providing relevant information at your fingertips.

**Requirements:**

- Access to ChatGPT plugins
- A ChatGPT Plus account
- Google search API key

**Dependencies:**

```json
{
  "axios": "^1.3.6",
  "cheerio": "^1.0.0-rc.12",
  "dotenv": "^16.0.3",
  "express": "^4.18.2"
}
```

## Features

- Perform Google searches right from ChatGPT
- Retrieve top search results

## Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/google-search-integration-chatgpt.git
```

2. Navigate to the project directory:

```bash
cd google-search-integration-chatgpt
```

3. Install dependencies:

```bash
npm install
```

4. Start the Express server:

```bash
npx ts-node index.ts
```

## Usage and reference

This project depends on **OpenAI plugins** and **Google Search API**. To set up your plugin correctly, please follow these steps:

1. Read the documentation for both dependencies:
   - [OpenAI Documentation](https://platform.openai.com/docs/plugins/introduction)
   - [Google Search API Documentation](https://developers.google.com/custom-search/v1/introduction)

2. Ensure you have proper authentication in place, as this example does not provide it.

3. Verify that your plugin meets all the requirements specified in the OpenAI and Google Search API documentation.



## Contributing

1. Fork the repository on GitHub
2. Create a new branch with a descriptive name, e.g., `git checkout -b my-new-feature`
3. Make changes to the code, ensuring that it follows the existing style and conventions
4. Commit your changes, using clear and informative commit messages
5. Push your changes to your forked repository
6. Open a pull request against the main repository, describing your changes and how they improve the project
7. Wait for a review and respond to any feedback or requested changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.