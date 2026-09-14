type StorageAreaName = 'local' | 'sync' | 'managed' | 'session';
type StorageChange = { oldValue?: unknown; newValue?: unknown };
type StorageListener = (changes: Record<string, StorageChange>, areaName: StorageAreaName) => void;

interface ChromeApi {
  runtime: {
    getURL(path: string): string;
    onStartup: { addListener(listener: () => void): void };
  };
  action: {
    onClicked: { addListener(listener: () => void): void };
    setBadgeText(details: { text: string }): Promise<void>;
    setBadgeBackgroundColor(details: { color: string }): Promise<void>;
  };
  storage: {
    local: {
      get(keys?: string): Promise<Record<string, unknown>>;
      set(items: object): Promise<void>;
      clear(): Promise<void>;
    };
    onChanged: {
      addListener(listener: StorageListener): void;
      removeListener(listener: StorageListener): void;
    };
  };
  downloads: {
    download(options: { url: string; filename: string; saveAs: boolean }): Promise<number>;
  };
  notifications: {
    create(id: string, options: { type: 'basic'; title: string; message: string; iconUrl: string }): Promise<string>;
    clear(id: string): Promise<boolean>;
  };
  i18n: { getMessage(name: string): string };
}

declare const chrome: ChromeApi;

export const browser = chrome;
