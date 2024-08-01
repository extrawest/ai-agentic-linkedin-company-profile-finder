import fs from 'fs/promises';
import pLimit from 'p-limit';
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { GoogleCustomSearch } from "@langchain/community/tools/google_custom_search";
import {
	MessagesPlaceholder,
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate
} from "@langchain/core/prompts";

dotenv.config();

const limit = pLimit(5);

const llm = new ChatOpenAI({
	model: "gpt-4",
	openAIApiKey: process.env.OPENAI_API_KEY,
});

const googleCustomSearch = new GoogleCustomSearch({
  apiKey: process.env.GOOGLE_API_KEY,
  googleCSEId: process.env.GOOGLE_CSE_ID,
});

async function loadCSVData() {
  const loader = new CSVLoader("data/companies.csv");
  const docs = await loader.load();
  
  return docs.map((doc) => {
    const [name] = doc.pageContent.split("\n");
    return {
      name: name.split(":")[1].trim(),
    };
  });
}

async function searchLinkedInProfile(companyName) {
	const prompt = ChatPromptTemplate.fromMessages([
		SystemMessagePromptTemplate.fromTemplate(
			"You are a helpful assistant that finds LinkedIn company profiles. Always use the provided search tool to find information."
		),
		HumanMessagePromptTemplate.fromTemplate(
			"Find the most relevant LinkedIn company profile for {companyName}. Return only the LinkedIn URL in the format https://www.linkedin.com/company/COMPANY_NAME_HERE/people/. If not found, return 'Not found'."
		),
		new MessagesPlaceholder("agent_scratchpad")
	]);

	const tools = [googleCustomSearch];

	const agent = await createOpenAIFunctionsAgent({
		llm,
		tools,
		prompt
	});
	
	const executor = new AgentExecutor({
		agent,
		tools,
	});

	const result = await executor.invoke({ companyName: companyName });

	const linkedInUrl = result.output.match(/(https:\/\/www\.linkedin\.com\/company\/[^\/]+\/people\/)/);
	return linkedInUrl ? linkedInUrl[0] : 'Not found';
}

async function processCompany(company) {
	try {
		const linkedInUrl = await searchLinkedInProfile(company.name);
		console.log({
			name: company.name,
			linkedin: linkedInUrl,
		})
		return {
			name: company.name,
			linkedin: linkedInUrl,
		};
	} catch (error) {
		// console.error(`Error processing ${company.name}:`, error);
		return {
			name: company.name,
			linkedin: 'Error',
		};
	}
}

async function main() {
	const csvData = await loadCSVData();
	console.log("CSV data loaded:", csvData.length, "companies");

	const processedData = await Promise.all(
		csvData.map(company => limit(() => processCompany(company)))
	);

	console.log("Processing complete. Writing results to file...");

	// Write results to a file
	const output = processedData.map(company => 
		`${company.name},${company.linkedin}`
	).join('\n');

	await fs.writeFile('output.csv', 'name,linkedin\n' + output);

	console.log("Results written to output.csv");
}

main().catch(console.error);

