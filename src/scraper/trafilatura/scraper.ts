import { spawnSync } from 'node:child_process';

export interface Article {
  id: string;
  url: string;
  title: string;
  text?: string;
  htmlContent?: string;
  summary?: string;
  topics?: string[];
}

export async function scrape(bookmarks: {[key: string]: any}) {
  const articles: Article[] = [];

  for (const { resolved_url } of Object.values(bookmarks)) {
    console.log(`Scraping: ${resolved_url} ...`);

    const pythonCode = ''
    + `import trafilatura\n`
    + `downloaded = trafilatura.fetch_url("${resolved_url}")\n`
    + `print(trafilatura.extract(downloaded, output_format='json', output_format='xml', include_comments=True, include_tables=True, include_links=True, include_formatting=True, include_images=True))`;
    
    const result = spawnSync('python3', ['-c', pythonCode]);
    console.log(result.stdout.toString());
    
    // articles.push(JSON.parse(result.stdout.toString()));
  }

  return articles;
}