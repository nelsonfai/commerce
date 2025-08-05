// lib/game/storage.ts
export interface StorageInterface {
  saveGameState(sessionId: string, gameState: any): Promise<void>;
  loadGameState(sessionId: string): Promise<any | null>;
  clearGameState(sessionId: string): Promise<void>;
  getAllSessions(): Promise<string[]>;
  
  // New methods for email-based session management
  getActiveSessionByEmail(email: string): Promise<string | null>;
  getUserSessions(email: string): Promise<string[]>;
  markSessionAsActive(email: string, sessionId: string): Promise<void>;
  clearUserActiveSessions(email: string): Promise<void>;
}

// Local Storage Implementation
export class LocalStorageAdapter implements StorageInterface {
  private getKey(sessionId: string): string {
      return `nyumly_game_${sessionId}`;
  }

  private getEmailSessionKey(email: string): string {
      return `nyumly_email_session_${email}`;
  }

  private getUserSessionsKey(email: string): string {
      return `nyumly_user_sessions_${email}`;
  }

  async saveGameState(sessionId: string, gameState: any): Promise<void> {
      try {
          const data = {
              ...gameState,
              lastUpdated: Date.now()
          };
          localStorage.setItem(this.getKey(sessionId), JSON.stringify(data));
          
          // If there's an email, update user sessions list
          if (gameState.email) {
              await this.updateUserSessionsList(gameState.email, sessionId);
          }
      } catch (error) {
          console.warn('Failed to save game state to localStorage:', error);
      }
  }

  async loadGameState(sessionId: string): Promise<any | null> {
      try {
          const data = localStorage.getItem(this.getKey(sessionId));
          if (!data) return null;
          
          const parsed = JSON.parse(data);
          // Check if data is less than 24 hours old
          const isRecent = Date.now() - parsed.lastUpdated < 24 * 60 * 60 * 1000;
          
          return isRecent ? parsed : null;
      } catch (error) {
          console.warn('Failed to load game state from localStorage:', error);
          return null;
      }
  }

  async clearGameState(sessionId: string): Promise<void> {
      try {
          // Get the game state to extract email before deletion
          const gameState = await this.loadGameState(sessionId);
          
          localStorage.removeItem(this.getKey(sessionId));
          
          // If there was an email, clean up email-session mapping
          if (gameState?.email) {
              const activeSession = await this.getActiveSessionByEmail(gameState.email);
              if (activeSession === sessionId) {
                  localStorage.removeItem(this.getEmailSessionKey(gameState.email));
              }
              await this.removeFromUserSessionsList(gameState.email, sessionId);
          }
      } catch (error) {
          console.warn('Failed to clear game state from localStorage:', error);
      }
  }

  async getAllSessions(): Promise<string[]> {
      try {
          const sessions: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key?.startsWith('nyumly_game_')) {
                  sessions.push(key.replace('nyumly_game_', ''));
              }
          }
          return sessions;
      } catch (error) {
          console.warn('Failed to get all sessions:', error);
          return [];
      }
  }

  async getActiveSessionByEmail(email: string): Promise<string | null> {
      try {
          const activeSessionId = localStorage.getItem(this.getEmailSessionKey(email));
          if (!activeSessionId) return null;

          // Verify the session still exists and is valid
          const gameState = await this.loadGameState(activeSessionId);
          if (!gameState || gameState.status === 'completed' || gameState.status === 'failed') {
              // Clean up stale active session
              localStorage.removeItem(this.getEmailSessionKey(email));
              return null;
          }

          return activeSessionId;
      } catch (error) {
          console.warn('Failed to get active session by email:', error);
          return null;
      }
  }

  async getUserSessions(email: string): Promise<string[]> {
      try {
          const sessionsData = localStorage.getItem(this.getUserSessionsKey(email));
          if (!sessionsData) return [];
          
          const sessions = JSON.parse(sessionsData);
          
          // Filter out expired or invalid sessions
          const validSessions: string[] = [];
          for (const sessionId of sessions) {
              const gameState = await this.loadGameState(sessionId);
              if (gameState) {
                  validSessions.push(sessionId);
              }
          }
          
          // Update the stored list with only valid sessions
          if (validSessions.length !== sessions.length) {
              localStorage.setItem(this.getUserSessionsKey(email), JSON.stringify(validSessions));
          }
          
          return validSessions;
      } catch (error) {
          console.warn('Failed to get user sessions:', error);
          return [];
      }
  }

  async markSessionAsActive(email: string, sessionId: string): Promise<void> {
      try {
          localStorage.setItem(this.getEmailSessionKey(email), sessionId);
      } catch (error) {
          console.warn('Failed to mark session as active:', error);
      }
  }

  async clearUserActiveSessions(email: string): Promise<void> {
      try {
          localStorage.removeItem(this.getEmailSessionKey(email));
      } catch (error) {
          console.warn('Failed to clear user active sessions:', error);
      }
  }

  private async updateUserSessionsList(email: string, sessionId: string): Promise<void> {
      try {
          const existingSessions = await this.getUserSessions(email);
          if (!existingSessions.includes(sessionId)) {
              existingSessions.push(sessionId);
              localStorage.setItem(this.getUserSessionsKey(email), JSON.stringify(existingSessions));
          }
      } catch (error) {
          console.warn('Failed to update user sessions list:', error);
      }
  }

  private async removeFromUserSessionsList(email: string, sessionId: string): Promise<void> {
      try {
          const existingSessions = await this.getUserSessions(email);
          const updatedSessions = existingSessions.filter(id => id !== sessionId);
          if (updatedSessions.length !== existingSessions.length) {
              localStorage.setItem(this.getUserSessionsKey(email), JSON.stringify(updatedSessions));
          }
      } catch (error) {
          console.warn('Failed to remove from user sessions list:', error);
      }
  }
}

// Future Database Implementation (placeholder)
export class DatabaseAdapter implements StorageInterface {
  async saveGameState(sessionId: string, gameState: any): Promise<void> {
      // TODO: Implement database save
      console.log('Saving to database:', sessionId, gameState);
  }

  async loadGameState(sessionId: string): Promise<any | null> {
      // TODO: Implement database load
      console.log('Loading from database:', sessionId);
      return null;
  }

  async clearGameState(sessionId: string): Promise<void> {
      // TODO: Implement database clear
      console.log('Clearing from database:', sessionId);
  }

  async getAllSessions(): Promise<string[]> {
      // TODO: Implement get all sessions
      return [];
  }

  async getActiveSessionByEmail(email: string): Promise<string | null> {
      // TODO: Implement get active session by email
      console.log('Getting active session for email:', email);
      return null;
  }

  async getUserSessions(email: string): Promise<string[]> {
      // TODO: Implement get user sessions
      console.log('Getting user sessions for email:', email);
      return [];
  }

  async markSessionAsActive(email: string, sessionId: string): Promise<void> {
      // TODO: Implement mark session as active
      console.log('Marking session as active:', email, sessionId);
  }

  async clearUserActiveSessions(email: string): Promise<void> {
      // TODO: Implement clear user active sessions
      console.log('Clearing user active sessions for email:', email);
  }
}

// Storage Manager - Singleton pattern
export class StorageManager {
  private static instance: StorageManager;
  private adapter: StorageInterface;

  private constructor() {
      // Default to localStorage, can be changed
      this.adapter = new LocalStorageAdapter();
  }

  public static getInstance(): StorageManager {
      if (!StorageManager.instance) {
          StorageManager.instance = new StorageManager();
      }
      return StorageManager.instance;
  }

  public setAdapter(adapter: StorageInterface): void {
      this.adapter = adapter;
  }

  public async saveGame(sessionId: string, gameState: any): Promise<void> {
      return this.adapter.saveGameState(sessionId, gameState);
  }

  public async loadGame(sessionId: string): Promise<any | null> {
      return this.adapter.loadGameState(sessionId);
  }

  public async clearGame(sessionId: string): Promise<void> {
      return this.adapter.clearGameState(sessionId);
  }

  public async getAllSessions(): Promise<string[]> {
      return this.adapter.getAllSessions();
  }

  // New methods for email-based session management
  public async getActiveSessionByEmail(email: string): Promise<string | null> {
      return this.adapter.getActiveSessionByEmail(email);
  }

  public async getUserSessions(email: string): Promise<string[]> {
      return this.adapter.getUserSessions(email);
  }

  public async markSessionAsActive(email: string, sessionId: string): Promise<void> {
      return this.adapter.markSessionAsActive(email, sessionId);
  }

  public async clearUserActiveSessions(email: string): Promise<void> {
      return this.adapter.clearUserActiveSessions(email);
  }
}