// src/plugin-config.ts

export const pluginConfig = {
    schema_version: 'v1',
    name_for_model: 'googleSearch',
    name_for_human: 'Google Search Plugin',
    description_for_model:
        'Plugin for searching using Google Custom Search Engine and fetching the inner text of the first link in the search results.',
    description_for_human: 'Search using Google Custom Search Engine.',
    auth: {
        type: 'none',
    },
    api: {
        type: 'openapi',
        url: 'https://plugins.maila.ai/.well-known/openapi.yaml',
        has_user_authentication: false,
    },
    logo_url: 'https://plugins.maila.ai/.well-known/icon.png',
    contact_email: 'hello@contact.com',
    legal_info_url: 'https://plugins.maila.ai/legal',
};
