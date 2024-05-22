export enum SceneStatus {
    HIDDEN = 10,
    AWAITING_REVIEW = 20,
    PUBLIC = 30
}

export type Badge = {
    id: number;
    name: string;
    bg_color: string;
    description: string;
    data_uri: string;
};

export type SceneChildren = {
    id: number;
    creator: number;
    title: string;
    likes: number;
    dislikes: number;
    status: number;
    badges: Badge[];
};

export type Scene = {
    id: number;
    creator: number;
    creator_name: string;
    parent: number;
    children: SceneChildren[];
    title: string;
    description: string;
    gifId: string;
    created: string;
    likes: number;
    dislikes: number;
    status: number;
    badges: Badge[];
};
