export type User = {
    username: string;
    email: string;
};

export type LoginResponse = {
    user: User;
};

export type LogoutResponse = {
    status: string;
};

export type RegisterResponse = {
    status: string;
};

export type RegisterCodeResponse = {
    status: string;
};

export type RegisterVerifyResponse = {
    status: string;
};

export type PasswordCodeResponse = {
    status: string;
};

export type PasswordResetResponse = {
    status: string;
};

export type UserInfoResponse = {
    user: User;
};
