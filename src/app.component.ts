import { ChangeDetectionStrategy, Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService, CameraSettings } from './services/gemini.service';

interface Scene {
  id: string;
  name: string;
  icon: string;
}

interface Theme {
  id:string;
  name: string;
  iconColors: { from: string; to: string; };
  colors: { [key: string]: string };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class AppComponent {
    resetApiKey(): void {
      this.apiKey.set('');
      this.apiKeyError.set(null);
      this.apiKeySaved.set(false);
    }
  private readonly geminiService = inject(GeminiService);

  // API Provider selection
  selectedProvider = 'google';

  // API Key state
  readonly apiKey = signal('');
  readonly apiKeyError = signal<string|null>(null);
  readonly apiKeySaved = signal(false);

  providerLabel(): string {
    switch (this.selectedProvider) {
      case 'google': return 'Google Gemini API Key';
      case 'openai': return 'OpenAI API Key';
      default: return 'API Key';
    }
  }

  providerPlaceholder(): string {
    switch (this.selectedProvider) {
      case 'google': return 'Enter your Gemini API key';
      case 'openai': return 'Enter your OpenAI API key';
      default: return 'Enter your API key';
    }
  }

  onProviderChange(event: Event): void {
    this.selectedProvider = (event.target as HTMLSelectElement).value;
    this.apiKey.set('');
    this.apiKeyError.set(null);
    this.apiKeySaved.set(false);
  }

  onApiKeyInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.apiKey.set(value);
    // Provider-specific validation
    if (!value) {
      this.apiKeyError.set('API key is required.');
    } else if (this.selectedProvider === 'google' && !/^AIza[0-9A-Za-z-_]{30,}$/.test(value)) {
      this.apiKeyError.set('Invalid Google Gemini API key format.');
    } else if (this.selectedProvider === 'openai' && !/^sk-[A-Za-z0-9-]{20,300}$/.test(value)) {
      this.apiKeyError.set('Invalid OpenAI API key format.');
    } else {
      this.apiKeyError.set(null);
    }
    this.apiKeySaved.set(false);
  }

  saveApiKey(): void {
    if (!this.apiKeyError() && this.apiKey()) {
      this.geminiService.setApiKey(this.apiKey(), this.selectedProvider);
      this.apiKeySaved.set(true);
    }
  }
  readonly currentYear = new Date().getFullYear();

  readonly themes: Theme[] = [
    {
      id: 'sky-dark',
      name: 'Sky',
      iconColors: { from: '#38bdf8', to: '#3b82f6' },
      colors: {
        '--background-primary': '#111827',
        '--text-primary': '#f9fafb',
        '--text-secondary': '#9ca3af',
        '--accent-primary': '#7dd3fc',
        '--accent-ring': '#38bdf8',
        '--accent-focus': '#0ea5e9',
        '--accent-button-text': '#ffffff',
        '--accent-gradient-from': '#38bdf8',
        '--accent-gradient-to': '#3b82f6',
        '--error': '#f87171',
        '--background-secondary-rgb': '31 41 55',
        '--background-tertiary-rgb': '55 65 81',
        '--background-hover-rgb': '75 85 99',
        '--accent-bg-hover-rgb': '2 132 199',
        '--accent-active-bg-rgb': '12 74 110',
        '--border-primary-rgb': '75 85 99',
        '--background-primary-rgb': '17 24 39',
      }
    },
    {
      id: 'sunset-dark',
      name: 'Sunset',
      iconColors: { from: '#fb923c', to: '#f43f5e' },
      colors: {
        '--background-primary': '#1c1917',
        '--text-primary': '#fef3c7',
        '--text-secondary': '#a8a29e',
        '--accent-primary': '#fb923c',
        '--accent-ring': '#f97316',
        '--accent-focus': '#ea580c',
        '--accent-button-text': '#ffffff',
        '--accent-gradient-from': '#fb923c',
        '--accent-gradient-to': '#f43f5e',
        '--error': '#fca5a5',
        '--background-secondary-rgb': '41 37 36',
        '--background-tertiary-rgb': '68 64 60',
        '--background-hover-rgb': '87 83 78',
        '--accent-bg-hover-rgb': '234 88 12',
        '--accent-active-bg-rgb': '124 45 18',
        '--border-primary-rgb': '87 83 78',
        '--background-primary-rgb': '28 25 23',
      }
    },
    {
      id: 'forest-dark',
      name: 'Forest',
      iconColors: { from: '#4ade80', to: '#16a34a' },
      colors: {
        '--background-primary': '#1a2e05',
        '--text-primary': '#ecfccb',
        '--text-secondary': '#a3e635',
        '--accent-primary': '#86efac',
        '--accent-ring': '#4ade80',
        '--accent-focus': '#22c55e',
        '--accent-button-text': '#052e16',
        '--accent-gradient-from': '#4ade80',
        '--accent-gradient-to': '#16a34a',
        '--error': '#f87171',
        '--background-secondary-rgb': '20 83 45',
        '--background-tertiary-rgb': '21 128 61',
        '--background-hover-rgb': '22 163 74',
        '--accent-bg-hover-rgb': '22 101 52',
        '--accent-active-bg-rgb': '20 83 45',
        '--border-primary-rgb': '22 101 52',
        '--background-primary-rgb': '26 46 5',
      }
    },
    {
      id: 'classic-light',
      name: 'Classic',
      iconColors: { from: '#a5b4fc', to: '#6366f1' },
      colors: {
        '--background-primary': '#f1f5f9',
        '--text-primary': '#0f172a',
        '--text-secondary': '#475569',
        '--accent-primary': '#4f46e5',
        '--accent-ring': '#6366f1',
        '--accent-focus': '#4338ca',
        '--accent-button-text': '#ffffff',
        '--accent-gradient-from': '#a5b4fc',
        '--accent-gradient-to': '#6366f1',
        '--error': '#ef4444',
        '--background-secondary-rgb': '226 232 240',
        '--background-tertiary-rgb': '203 213 225',
        '--background-hover-rgb': '148 163 184',
        '--accent-bg-hover-rgb': '79 70 229',
        '--accent-active-bg-rgb': '224 231 255',
        '--border-primary-rgb': '203 213 225',
        '--background-primary-rgb': '241 245 249',
      }
    },
     {
      id: 'sakura-light',
      name: 'Sakura',
      iconColors: { from: '#f9a8d4', to: '#ec4899' },
      colors: {
        '--background-primary': '#fff1f2',
        '--text-primary': '#831843',
        '--text-secondary': '#be185d',
        '--accent-primary': '#ec4899',
        '--accent-ring': '#f472b6',
        '--accent-focus': '#db2777',
        '--accent-button-text': '#ffffff',
        '--accent-gradient-from': '#f9a8d4',
        '--accent-gradient-to': '#ec4899',
        '--error': '#e11d48',
        '--background-secondary-rgb': '253 232 248',
        '--background-tertiary-rgb': '252 211 240',
        '--background-hover-rgb': '251 182 225',
        '--accent-bg-hover-rgb': '219 39 119',
        '--accent-active-bg-rgb': '253 242 248',
        '--border-primary-rgb': '251 182 225',
        '--background-primary-rgb': '255 241 242',
      }
    },
  ];

  readonly scenes: Scene[] = [
    { id: 'portrait_outdoor_daylight', name: 'Outdoor Portrait', icon: 'M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 19v-2c0-2.21 3.13-4 7-4s7 1.79 7 4v2H5zm17-7h-2v-2h2v2zm-2-4l1.41-1.41-1.41-1.41L18 6.59V8h2V6.59l1.41 1.41 1.41-1.41L21.41 5.2zM18 2h-2v2h2V2z' },
    { id: 'portrait_indoor_lowlight', name: 'Indoor Portrait', icon: 'M20 18v2H4v-2c0-1.65 3.33-3 5-3 .39 0 .78.04 1.16.11A4.012 4.012 0 0 1 12 14c1.23 0 2.34.56 3.07 1.44.33-.06.66-.09 1-.09 1.67 0 5 1.35 5 3zm-8-6c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8-10H4v16h16V2zm2-2H2v20h20V0z' },
    { id: 'night_portrait', name: 'Night Portrait', icon: 'M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,19V17C5,14.79 8.13,13 12,13C15.87,13 19,14.79 19,17V19H5M19.5,9.5L21,8L19.5,6.5L18,8L19.5,9.5M17,6L16,4L15,6L16,8L17,6M22,12L21,14L22,16L24,15L22,12Z' },
    { id: 'portrait_lighting', name: 'Portrait Lighting', icon: 'M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 19v-2c0-2.21 3.13-4 7-4s7 1.79 7 4v2H5zm14-7h-2v-2h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2zM17 3v2h2V3h-2zm-2 2h-2V3h2v2z' },
    { id: 'landscape_daylight', name: 'Landscape', icon: 'M6.5,15.5L9.5,11.5L12.5,15.5L15.5,10.5L19,15.5H5.5L6.5,15.5M21,19.5H3V4.5H21V19.5Z' },
    { id: 'group_photo_outdoor', name: 'Outdoor Group Photo', icon: 'M16,13C17.66,13 19,11.66 19,10C19,8.34 17.66,7 16,7C14.34,7 13,8.34 13,10C13,11.66 14.34,13 16,13M16,14C13.33,14 8,15.33 8,18V21H24V18C24,15.33 18.67,14 16,14M8,13C9.66,13 11,11.66 11,10C11,8.34 9.66,7 8,7C6.34,7 5,8.34 5,10C5,11.66 6.34,13 8,13M8,14C7.3,14 6.62,14.07 5.97,14.21C6.91,15.27 7.5,16.5 7.5,18V21H13V18C13,15.33 12.67,14 8,14Z' },
    { id: 'family_portrait_indoor', name: 'Indoor Family Photo', icon: 'M22 10.5V19c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8.5c0-.82.52-1.56 1.26-1.88l8-4.5c.48-.27 1.04-.27 1.52 0l8 4.5c.74.32 1.22 1.06 1.22 1.88zM12 6c-1.93 0-3.5 1.57-3.5 3.5S10.07 13 12 13s3.5-1.57 3.5-3.5S13.93 6 12 6zm-5 13c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5v1H7v-1z' },
    { id: 'sports_action_daylight', name: 'Action/Sports', icon: 'M9.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm2.5 1.5h-5c-1.1 0-2 .9-2 2v6h2v-5h1v6h2v-4h1v4h2v-6c0-1.1-.9-2-2-2z' },
    { id: 'street_photography', name: 'Street Photography', icon: 'M14.5,9.5A2.5,2.5 0 0,0 12,7A2.5,2.5 0 0,0 9.5,9.5A2.5,2.5 0 0,0 12,12A2.5,2.5 0 0,0 14.5,9.5M8,21V12.5C8,11.12 9.12,10 10.5,10H13.5C14.88,10 16,11.12 16,12.5V21H14V16H10V21H8M6,21H2V9L6,5V21M18,21V5L22,9V21H18Z' },
    { id: 'night_sky_astrophotography', name: 'Night Sky', icon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.67 0-4.85-2.18-4.85-4.85 0-1.82.89-3.42 2.26-4.4C12.92 3.04 12.46 3 12 3zm4.5 9.5l-1.06 1.06-1.44-1.44-1.44 1.44-1.06-1.06L12.94 13l-1.44-1.44 1.06-1.06L14 11.56l1.44-1.44 1.06 1.06L14.06 13l1.44 1.44z' },
    { id: 'macro_photography', name: 'Macro Photography', icon: 'M17.5 15c-1.2 0-2.3.5-3.1 1.3L5.8 7.7c.3-1 .2-2.1-.3-3s-1.4-1.5-2.5-1.7c-1.1-.2-2.2.2-2.8 1s-.8 1.7-.5 2.8.9 1.9 2 2.3l8.6 8.6c-.7.8-1.2 1.9-1.2 3 0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4zm-14-8c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zm3 3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm3 3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm-3 3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z' },
    { id: 'product_photography', name: 'Product Photography', icon: 'M16,5V4H8V5H16M16.4,7H7.6C7.05,7 6.6,7.45 6.6,8V18.4C6.6,18.95 7.05,19.4 7.6,19.4H16.4C16.95,19.4 17.4,18.95 17.4,18.4V8C17.4,7.45 16.95,7 16.4,7Z' },
    { id: 'wildlife_photography', name: 'Wildlife Photography', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-4.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
    { id: 'fireworks_photography', name: 'Fireworks', icon: 'M12 2C12 2 11 4 9 4C7 4 7 2 7 2S8 0 10 0C12 0 12 2 12 2M5.5 4.5C5.5 4.5 4.5 5.5 4.5 7.5S5.5 10.5 5.5 10.5S6.5 9.5 6.5 7.5S5.5 4.5 5.5 4.5M18.5 4.5C18.5 4.5 17.5 5.5 17.5 7.5S18.5 10.5 18.5 10.5S19.5 9.5 19.5 7.5S18.5 4.5 18.5 4.5M12 12C12 12 11 14 9 14C7 14 7 12 7 12S8 10 10 10C12 10 12 12 12 12M14 22H10V15H14V22Z' },
    { id: 'long_exposure', name: 'Long Exposure', icon: 'M13 3.05V1h-2v2.05A9 9 0 0 0 3.05 11H1v2h2.05A9 9 0 0 0 11 20.95V23h2v-2.05A9 9 0 0 0 20.95 13H23v-2h-2.05A9 9 0 0 0 13 3.05zM12 19a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm1-8h2.55A5.52 5.52 0 0 0 12 6.45V9h1zm-4.45 4L9.5 13h1.05l-1.9 1.9A5.52 5.52 0 0 0 6.45 12H9v1z' },
    { id: 'light_painting', name: 'Light Painting', icon: 'M7 14c.83 0 1.5.67 1.5 1.5S7.83 17 7 17s-1.5-.67-1.5-1.5S6.17 14 7 14zm3 2c0-1.66-1.34-3-3-3s-3 1.34-3 3h2c0-.55.45-1 1-1s1 .45 1 1h2zm10.25-3.5-.71-.71c-.38-.38-.89-.59-1.42-.59H17v-2h-2v3.42l1.44 1.44c.31.32.72.54 1.16.64l.1.02c.82 0 1.5-.67 1.5-1.5 0-.25-.06-.48-.18-.69zm-1.89 3.33L17 14.42V17h-2v-4h-1.17l-1-1H11v-2h2.17l2-2H13v-2h2v1.17l4.42 4.42c.39.39.39 1.02 0 1.41zM3 14c.55 0 1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1H4v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H0c-.55 0-1-.45-1-1s.45-1 1-1h2v-2c0-.55.45-1 1-1z' },
    { id: 'panning_photography', name: 'Panning', icon: 'M8.5 14.5L4 19l1.5 1.5L10 16l-1.5-1.5zM19 4l-1.5-1.5L13 7l1.5 1.5L19 4zm-6.5 2.5l-1-1L1 15.5l1 1L12.5 6.5z' },
    { id: '50mm_walkaround', name: '50mm Walk-around', icon: 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z' },
    { id: '85mm_bokeh_portrait', name: '85mm Bokeh Portrait', icon: 'M20 18v2H4v-2c0-1.65 3.33-3 5-3 .39 0 .78.04 1.16.11A4.012 4.012 0 0 1 12 14c1.23 0 2.34.56 3.07 1.44.33-.06.66-.09 1-.09 1.67 0 5 1.35 5 3zm-8-6c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8-10H4v16h16V2zm2-2H2v20h20V0z' },
    { id: '70-200mm_sports_action', name: '70-200mm Sports', icon: 'M9.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm2.5 1.5h-5c-1.1 0-2 .9-2 2v6h2v-5h1v6h2v-4h1v4h2v-6c0-1.1-.9-2-2-2z' },
    { id: '70-200mm_compressed_landscape', name: '70-200mm Landscape', icon: 'M17,2H14L12,4H8L6,2H3A1,1 0 0,0 2,3V21A1,1 0 0,0 3,22H17A1,1 0 0,0 18,21V3A1,1 0 0,0 17,2M12.5,17A2.5,2.5 0 0,1 10,14.5A2.5,2.5 0 0,1 12.5,12A2.5,2.5 0 0,1 15,14.5A2.5,2.5 0 0,1 12.5,17M12.5,7.5A1,1 0 0,1 11.5,8.5V11.5A1,1 0 0,1 12.5,12.5A1,1 0 0,1 13.5,11.5V8.5A1,1 0 0,1 12.5,7.5M22,6V18H20V6H22Z' },
  ];

  readonly cameraBrands = ['Any', 'Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic'];

  activeTheme = signal<Theme>(this.themes[0]);
  selectedScene: WritableSignal<Scene | null> = signal(null);
  settings: WritableSignal<CameraSettings | null> = signal(null);
  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);
  isSettingsPanelOpen = signal(false);
  exampleImages: WritableSignal<string[] | null> = signal(null);
  imageLoading: WritableSignal<boolean> = signal(false);
  isExplanationsOpen = signal(false);

  // Signals for advanced settings
  cameraBrand: WritableSignal<string> = signal('Any');
  cameraModel: WritableSignal<string> = signal('');
  cameraModelError: WritableSignal<string | null> = signal(null);

  constructor() {
    this.applyTheme(this.activeTheme()); // Set initial theme
    effect(() => {
      this.applyTheme(this.activeTheme()); // Update theme on signal change
    });
  }

  applyTheme(theme: Theme): void {
    for (const [key, value] of Object.entries(theme.colors)) {
      document.documentElement.style.setProperty(key, value);
    }
  }
  
  setTheme(theme: Theme): void {
    this.activeTheme.set(theme);
  }

  async getSettings(scene: Scene): Promise<void> {
    if (this.loading() && this.imageLoading()) {
      return;
    }

    this.isExplanationsOpen.set(false);
    this.isSettingsPanelOpen.set(true);
    this.selectedScene.set(scene);
    this.settings.set(null);
    this.exampleImages.set(null);
    this.error.set(null);
    this.loading.set(true);
    this.imageLoading.set(true);

    // Always set the latest API key and provider before making requests
    this.geminiService.setApiKey(this.apiKey(), this.selectedProvider);
    const settingsPromise = this.geminiService.generateCameraSettings(scene.name, this.cameraBrand(), this.cameraModel());
    const imagesPromise = this.geminiService.generateExampleImages(scene.name);

    settingsPromise.then(result => {
      this.settings.set(result);
    }).catch(e => {
      this.error.set('Failed to generate camera settings. Please try again.');
      console.error('Settings Error:', e);
    }).finally(() => {
      this.loading.set(false);
    });

    imagesPromise.then(result => {
      this.exampleImages.set(result);
    }).catch(e => {
      console.error('Image Generation Error:', e);
       this.exampleImages.set([]); // Set to empty array on failure
    }).finally(() => {
      this.imageLoading.set(false);
    });
  }

  closeSettingsPanel(): void {
    this.isSettingsPanelOpen.set(false);
  }

  setBrand(brand: string): void {
    this.cameraBrand.set(brand);
  }

  onModelInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.cameraModel.set(value);

    if (!value) {
      this.cameraModelError.set(null);
      return;
    }

    // Must contain at least one letter and one number. Allows spaces and hyphens. Length 2-20.
    const validModelRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9\s-]{2,20}$/;

    if (!validModelRegex.test(value)) {
      this.cameraModelError.set('Invalid format. Use letters and numbers (e.g., A7 IV, R5).');
    } else {
      this.cameraModelError.set(null);
    }
  }

  toggleExplanations(): void {
    this.isExplanationsOpen.update(value => !value);
  }
}