import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

// Function to get data from LocalStorage
  getData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Function to save data to LocalStorage
  setData<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
