import { Deal, Project, Transaction, User } from '../types';
import { INITIAL_DEALS, INITIAL_PROJECTS, INITIAL_TRANSACTIONS } from './data';

const USERS_KEY = 'reachmora_users_db';
const DATA_PREFIX = 'reachmora_data_';

export interface UserData {
  deals: Deal[];
  projects: Project[];
  transactions: Transaction[];
}

export const StorageService = {
  // --- Auth Methods ---

  getUsers: (): Record<string, User & { password: string }> => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : {};
  },

  register: (user: User, password: string): User => {
    const users = StorageService.getUsers();
    
    // Check if email exists
    const existingUser = Object.values(users).find(u => u.email === user.email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    // Save User
    const newUser = { ...user, password };
    users[user.id] = newUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Initialize Empty Data for new user
    StorageService.saveUserData(user.id, {
        deals: [],
        projects: [],
        transactions: []
    });

    // Remove password before returning
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  login: (email: string, password: string): User => {
    const users = StorageService.getUsers();
    const foundUser = Object.values(users).find(u => u.email === email);

    if (!foundUser) {
      throw new Error('User not found.');
    }

    if (foundUser.password !== password) {
      throw new Error('Invalid password.');
    }

    const { password: _, ...safeUser } = foundUser;
    return safeUser;
  },

  // --- Data Methods ---

  getUserData: (userId: string): UserData => {
    const dataJson = localStorage.getItem(`${DATA_PREFIX}${userId}`);
    if (dataJson) {
      return JSON.parse(dataJson);
    }
    // Return empty structure if no data exists yet
    return { deals: [], projects: [], transactions: [] };
  },

  saveUserData: (userId: string, data: UserData) => {
    localStorage.setItem(`${DATA_PREFIX}${userId}`, JSON.stringify(data));
  },

  resetUserData: (userId: string) => {
    const emptyData = { deals: [], projects: [], transactions: [] };
    localStorage.setItem(`${DATA_PREFIX}${userId}`, JSON.stringify(emptyData));
    return emptyData;
  },

  loadSampleData: (userId: string) => {
      const sampleData = {
          deals: INITIAL_DEALS,
          projects: INITIAL_PROJECTS,
          transactions: INITIAL_TRANSACTIONS
      };
      localStorage.setItem(`${DATA_PREFIX}${userId}`, JSON.stringify(sampleData));
      return sampleData;
  }
};