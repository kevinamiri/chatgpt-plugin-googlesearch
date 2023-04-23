// src/plugin-info.ts

export const pluginInfo = {
    name: 'Google Search Plugin',
    description:
        'An Express app that uses the Google Custom Search API to search the web and fetch the summary for five first links in the search results as well as inner text of the first three links.',
    repository: 'https://github.com/kevinamiri/google-search-plugin',
    keywords: ['gpt plugin', 'google search'],
    env: {
        GOOGLE_API_KEY: {
            description:
                'Your Google API key. Create one at https://console.cloud.google.com/apis/credentials',
        },
        CUSTOM_SEARCH_ENGINE_ID: {
            description: 'Your Google Search Engine ID. Create one at https://cse.google.com/cse/create/new',
        },
    },
};
