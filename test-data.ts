type Credentials = {
    email: string;
    password: string;
    role ? : string;
}

export const validUser: Credentials = {
    email: 'user@example.com',
    password: 'password123',
    role: 'admin'
}

export function getLoginUrl (env: string): string {
    return `https://${env}.example.com/login`;
}