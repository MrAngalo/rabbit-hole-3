export type User = {
    username: string;
    email: string;
};

export type LoginResponse = {
    user: User;
    token: string;
};

export type RegisterResponse = {
    user: User;
    token: string;
};

export type UserInfoResponse = {
    user: User;
};
