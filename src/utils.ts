// src/utils.ts

import axios from 'axios';
import cheerio from 'cheerio';
import SearchResult from './search-result';


// Modify this page to handle the content extraction


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


async function fetchContent(url: string): Promise<string | null> {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            let plainTextSummary = '';

            // Extract text differently for each tag to create a clean summary
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
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching content: ${error}`);
        return null;
    }
}

export async function processResults(links: any[]): Promise<object[]> {

    const chunks_ = [];
    await Promise.all(links.map(async (link_: any) => {
        const { title, link } = link_;
        const content = await fetchContent(link);
        // turn it into small chunks
        const chunks = splitContentByWords(content, 200);
        // for each chunk create a new search result
        for (const chunk of chunks) {
            const searchResult = new SearchResult(title, link, chunk);
            console.log(searchResult);
            chunks_.push(searchResult);
        }
    }));
    // Due to the maximum length limit, we cannot return much data. Just returning some of the chunks for the model to get the point.
    return [...chunks_.slice(0, 30)];
}
