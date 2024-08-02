# LinkedIn Company Profile Finder

This project is a Node.js application that automates the process of finding LinkedIn company profiles for a list of companies. It uses various technologies and APIs to efficiently search and retrieve LinkedIn URLs.

## Demo

https://github.com/user-attachments/assets/233568eb-c02c-49df-9bca-f44aa2b454b0

## Technologies and Frameworks Used

- **Node.js**: The runtime environment for executing the JavaScript code.
- **ES Modules**: The project uses ECMAScript modules (import/export syntax).

### Libraries and Packages

- **fs/promises**: For asynchronous file system operations.
- **p-limit**: To limit the number of concurrent operations.
- **dotenv**: For loading environment variables from a .env file.
- **@langchain/openai**: To interact with OpenAI's language models.
- **@langchain/community**: For document loaders and tools.
- **langchain/agents**: To create and execute AI agents.

### APIs and External Services

- **OpenAI API**: Used for natural language processing tasks.
- **Google Custom Search API**: For performing web searches to find LinkedIn profiles.

## Key Concepts and Features

1. **CSV Data Loading**: The application reads company data from a CSV file.
2. **Concurrent Processing**: Uses `p-limit` to manage concurrent API requests.
3. **AI-powered Search**: Utilizes OpenAI's GPT-4 model to interpret search results and extract LinkedIn URLs.
4. **Custom Search Integration**: Implements Google Custom Search to find company profiles on LinkedIn.
5. **Error Handling**: Includes basic error handling for individual company processing.
6. **Output Generation**: Writes the results to a CSV file.

## Setup and Configuration

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Create a `.env` file with the following variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `GOOGLE_API_KEY`: Your Google API key
   - `GOOGLE_CSE_ID`: Your Google Custom Search Engine ID
4. Ensure you have a `data/companies.csv` file with company names.

	The CSV file should have the following structure:

	- It must have a header row.
	- The first column should contain the company names.

## Usage

Run the script with:

`node index.js`

The script will process the companies and output the results to `output.csv`.

