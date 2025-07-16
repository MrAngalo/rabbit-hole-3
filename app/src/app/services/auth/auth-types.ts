export type User = {
    username: string;
    email: string;
};

export type LoginResponse = {
    user: User;
};

export type RegisterResponse = {
    status: string;
};

export type PasswordCodeResponse = {
    status: string;
};

export type PasswordNewResponse = {
    status: string;
};

export type UserInfoResponse = {
    user: User;
};
