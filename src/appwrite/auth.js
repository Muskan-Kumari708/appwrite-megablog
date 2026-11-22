import conf from '../conf/conf.js'
import { Client, Account, ID } from "appwrite";

let currentUserRequest = null;

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        const userAccount = await this.account.create({
            userId: ID.unique(),
            email,
            password,
            name,
        });

        if (userAccount) {
            return this.login({ email, password });
        }
        return userAccount;
    }

    async login({ email, password }) {
        return this.account.createEmailPasswordSession({ email, password });
    }

    async getCurrentUser() {
        if (!currentUserRequest) {
            currentUserRequest = this.account.get().finally(() => {
                currentUserRequest = null;
            });
        }

        return currentUserRequest;
    }

    async logout() {
        return this.account.deleteSession({ sessionId: 'current' });
    }

    // Agar user ke saare devices se logout karwana ho
    async logoutAll() {
        return this.account.deleteSessions();
    }
}

const authService = new AuthService();

export default authService;
