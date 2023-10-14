import { Article } from "./scraper/trafilatura/scraper";

export async function summarize({title, text}: Article) {
  console.log(`Summarizing: ${title} ...`);
  
	const response = await fetch(
		"https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
		{
			headers: { Authorization: "Bearer xxx" },
			method: "POST",
			body: JSON.stringify({
        inputs: text,
				wait_for_model: true
        // parameters: { min_length: 142 }
      }),
		}
	);
	
	const result = await response.json();
	
	if (!result.error) {
		return result[0].summary_text;
	} else {
		throw new Error(JSON.stringify(result, null, 2));
	}
}

export async function classify({title, summary}: Article) {
  console.log(`Classifying: ${title} ...`);
	const response = await fetch(
		"https://api-inference.huggingface.co/models/jonaskoenig/topic_classification_04",
		{
			headers: { Authorization: "Bearer xxx" },
			method: "POST",
			body: JSON.stringify({
				inputs: summary,
				wait_for_model: true
			}),
		}
	);
	
	const result = await response.json();
	
	if (!result.error) {
		return result[0].slice(0, 3).map((topic: any) => topic.label);
	} else {
		throw new Error(JSON.stringify(result, null, 2));
	}
}
