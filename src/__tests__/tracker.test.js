import { describe, it, expect, vi } from 'vitest';
import { getSavedAuth, saveAuth, clearAuth } from '../tracker_v2';

describe('Tracker Auth', () => {
  it('should return false when no auth is saved', () => {
    window.localStorage.clear();
    expect(getSavedAuth()).toBe(false);
  });

  it('should save and retrieve auth', () => {
    window.localStorage.clear();
    saveAuth();
    expect(getSavedAuth()).toBe(true);
  });

  it('should clear auth', () => {
    saveAuth();
    clearAuth();
    expect(getSavedAuth()).toBe(false);
  });
});
