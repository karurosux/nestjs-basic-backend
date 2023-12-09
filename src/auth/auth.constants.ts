export class AuthConstants {
    static readonly JWT_SECRET = process.env.JWT_SECRET || 'dummy';
    static readonly JWT_EXPIRATION_TIME = '24h';
}