export type TenorSearchResponse = {
    next: string;
    results: TenorResponseObject[];
};

export type TenorFeaturedResponse = {
    next: string;
    results: TenorResponseObject[];
};

export type TenorCategoryResponse = {
    tags: TenorCategoryObject[];
};

export type TenorSearchSuggestionsResponse = {
    results: string[];
};

export type TenorAutocompleteResponse = {
    results: string[];
};

export type TenorTrendingSearchTermsResponse = {
    results: string[];
};

export type TenorRegisterShareResponse = {};

export type TenorPostsResponse = {
    results: TenorResponseObject[];
};

export type TenorResponseObject = {
    created: number;
    hasaudio: boolean;
    id: string;
    media_formats: TenorContentFormat;
    tags: string[];
    title: string;
    content_description: string;
    itemurl: string;
    hascaption: boolean;
    flags: string;
    bg_color: string;
    url: string;
};

export type TenorCategoryObject = {
    searchterm: string;
    path: string;
    image: string;
    name: string;
};

export type TenorContentFormat = {
    preview: TenorMediaObject;
    gif: TenorMediaObject;
    mediumgif: TenorMediaObject;
    tinygif: TenorMediaObject;
    nanogif: TenorMediaObject;
    mp4: TenorMediaObject;
    loopedmp4: TenorMediaObject;
    tinymp4: TenorMediaObject;
    nanomp4: TenorMediaObject;
    webm: TenorMediaObject;
    tinywebm: TenorMediaObject;
    nanowebm: TenorMediaObject;
    webp_transparent: TenorMediaObject;
    tinywebp_transparent: TenorMediaObject;
    nanowebp_transparent: TenorMediaObject;
    gif_transparent: TenorMediaObject;
    tinygif_transparent: TenorMediaObject;
    nanogif_transparent: TenorMediaObject;
};

export type TenorMediaObject = {
    url: string;
    dims: number[];
    duration: number;
    size: number;
};
