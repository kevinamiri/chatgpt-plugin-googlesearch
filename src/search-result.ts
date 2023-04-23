// src/search-result.ts

class SearchResult {
    constructor(public title: string, public link: string, public content_chunk: string) { }

    toDict() {
        return {
            title: this.title,
            link: this.link,
            content_chunk: this.content_chunk
        };
    }
}

export default SearchResult;
