// src/utils.ts

import axios from 'axios';
import cheerio from 'cheerio';
import SearchResult from './search-result';

// This function splits the content into chunks of words
function splitContentByWords(
    content: string,
    chunkSize: number = 2000
): string[] {
    const words = content ? content?.split(/\s+/) : [];
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        chunks.push(chunk);
    }

    return chunks;
}

// This function fetches the content from a given URL
async function fetchContent(url: string): Promise<string | null> {
    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            return null;
        }

        const $ = cheerio.load(response.data);

        let plainTextSummary = '';

    // Due to limited context window, I selected the most important part of the document.
        $('h1').each((_, elem) => {
            const text = $(elem).text().trim();
            plainTextSummary += `${text}:\n`;
        });

        $('h2').each((_, elem) => {
            const text = $(elem).text().trim();
            plainTextSummary += `    ${text}: `;
        });

        $('p, ul').each((_, elem) => {
            const text = $(elem).text().trim()
                .replace(/\r?\n|\r/g, ' ')
                .replace(/\t+/g, ' ')
                .replace(/ {2,}/g, ' ');
            plainTextSummary += `${text}\n`;
        });

        // Remove trailing comma and add a newline
        plainTextSummary = plainTextSummary.replace(/, $/, '\n');

        return plainTextSummary || null;
    } catch (error) {
        console.error(`Error fetching content: ${error}`);
        return null;
    }
}

// This function processes the results by fetching the content of each link, splitting it into chunks, and creating a new SearchResult for each chunk
export async function processResults(links: any[]): Promise<object[]> {
    const chunks_: SearchResult[] = [];

    // Use Promise.all to fetch all contents concurrently
    const fetchPromises = links.map(async (link_: any) => {
        const { title, link } = link_;
        const content = await fetchContent(link);

        // If content is null, skip this link
        if (!content) {
            return;
        }

        // Split the content into chunks
        const chunks = splitContentByWords(content, 200);

        // For each chunk, create a new SearchResult and add it to the array
        chunks.forEach(chunk => {
            const searchResult = new SearchResult(title, link, chunk);
            console.log(searchResult);
            chunks_.push(searchResult);
        });
    });

    await Promise.all(fetchPromises);

    // Return the first 30 results
    return chunks_.slice(0, 30);
}
