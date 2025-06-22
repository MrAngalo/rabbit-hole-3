export enum UserPremission {
    VISITOR = 5,
    TRUSTED = 10,
    DONOR = 15,
    MODERATOR = 80,
    ADMINISTRATOR = 90,
    OWNER = 100
}

export type FetchUserResponse = {
    id: string;
    username: string;
    permission: UserPremission;
    created: string;
    bio: string;
    ppf_gifId: string;
    scenes: {
        id: string;
        title: string;
        gifId: string;
    }[];
};

export type FetchSettingsResponse = {
    id: string;
    username: string;
    permission: UserPremission;
    created: string;
    bio: string;
    ppf_gifId: string;
    view_await_review: string;
};
