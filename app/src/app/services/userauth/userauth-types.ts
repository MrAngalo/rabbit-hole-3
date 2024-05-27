export type User = {
    username: string;
    email: string;
};

export type UserToken = {
    user: User;
    token: string;
};
