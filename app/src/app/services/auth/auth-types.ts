export type User = {
    username: string;
    email: string;
};

export type LoginResponse = {
    user: User;
};

export type RegisterResponse = {
    user: User;
};

export type UserInfoResponse = {
    user: User;
};
