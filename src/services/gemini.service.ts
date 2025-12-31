import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

export interface CameraSettings {
  aperture: string;
  apertureExplanation: string;
  iso: string;
  isoExplanation: string;
  shutterSpeed: string;
  shutterSpeedExplanation: string;
  whiteBalance: string;
  whiteBalanceExplanation: string;
  focusMode: string;
  focusModeExplanation: string;
  driveMode: string;
  driveModeExplanation: string;
  meteringMode: string;
  meteringModeExplanation: string;
  lensRecommendation: string;
  generalTip: string;
  brandSpecificTip?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string | null = null;
  private provider: string = 'google';

  setApiKey(apiKey: string, provider: string = 'google') {
    this.apiKey = apiKey;
    this.provider = provider;
    if (provider === 'google') {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      this.ai = null; // Placeholder for other providers
      // TODO: Add OpenAI and other provider support here
    }
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async generateExampleImages(scene: string): Promise<string[]> {
    const descriptivePrompt = `A high-quality, professional, photorealistic photograph representing the scene: "${scene}". Sharp focus, beautiful lighting, vivid colors, shot on a professional camera.`;
    if (this.provider === 'google') {
      try {
        if (!this.ai) throw new Error('API key not set.');
        const response = await this.ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: descriptivePrompt,
          config: {
            numberOfImages: 4,
            outputMimeType: 'image/jpeg',
            aspectRatio: '4:3',
          },
        });
        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
      } catch (error) {
        console.error('Error calling Gemini Image Generation API:', error);
        return [];
      }
    } else if (this.provider === 'openai') {
      // OpenAI DALL-E 3 image generation
      try {
        if (!this.apiKey) throw new Error('API key not set.');
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            prompt: descriptivePrompt,
            n: 4,
            size: '1024x768',
            response_format: 'b64_json'
          })
        });
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          return data.data.map((img: any) => `data:image/png;base64,${img.b64_json}`);
        }
        return [];
      } catch (error) {
        console.error('Error calling OpenAI Image Generation API:', error);
        return [];
      }
    } else {
      return [];
    }
  }

  async generateCameraSettings(scene: string, brand: string, model: string): Promise<CameraSettings> {
    const brandInfo = brand !== 'Any' ? `The user is using a ${brand} camera.` : '';
    const modelInfo = model ? `Specifically, the camera model is ${model}.` : '';
    let prompt: string;
    const explanationInstruction = "For each setting, also provide a concise explanation (in the corresponding 'Explanation' field) of why this specific value or range is recommended for the scene.";
    if (scene.toLowerCase().includes('long exposure')) {
      prompt = `\nAs a professional photography assistant, provide the ideal camera settings for a \"Long Exposure\" shot. The goal is to capture motion blur, such as silky water, light trails, or blurred clouds.\n${brandInfo}\n${modelInfo}\n\nGive a specific value or a small, specific range for the core settings.\n- Shutter Speed: Recommend a very slow speed, likely multiple seconds (e.g., 5-30 seconds) or Bulb mode.\n- ISO: Recommend the lowest possible native setting (e.g., ISO 100, ISO 64).\n- Aperture: Suggest a mid-range aperture for sharpness (e.g., f/8 - f/16).\n- Focus Mode: Heavily recommend Manual Focus (MF) and explain the user should focus before starting the exposure.\n- General Tip: The general tip MUST explain the absolute necessity of a sturdy tripod and using a remote shutter release or the camera's self-timer to prevent camera shake.\n- Brand Specific Tip: If a brand is specified, provide a relevant tip (like Long Exposure Noise Reduction). If no brand is specified, use this tip to explain what a Neutral Density (ND) filter is and why it's essential for long exposures during the day.\n\n${explanationInstruction}\n`;
    } else {
      prompt = `\nAs a professional photography assistant, provide the ideal camera settings for the following scene: \"${scene}\".\n${brandInfo}\n${modelInfo}\n\nGive a specific value or a small, specific range for the core settings.\nFor brand-specific settings like Focus Mode, Metering Mode, and Drive Mode, use terminology common to the specified brand if possible. If no brand is specified, use generic terms.\nProvide a recommendation for a type of lens that would be suitable for this shot.\nAlso, provide a concise, actionable 'general tip' to improve the shot.\nIf a camera brand is specified, add a 'brand specific tip' that leverages a feature or setting of that brand. If no brand is specified, this field can be omitted or left empty.\n\n${explanationInstruction}\n`;
    }
    if (this.provider === 'google') {
      if (!this.ai) throw new Error('API key not set.');
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          aperture: { type: Type.STRING, description: 'e.g., f/1.8, f/8-f/11' },
          apertureExplanation: { type: Type.STRING, description: 'Explain why this aperture is recommended for the scene.' },
          iso: { type: Type.STRING, description: 'e.g., 100, 400-800' },
          isoExplanation: { type: Type.STRING, description: 'Explain why this ISO is recommended for the scene.' },
          shutterSpeed: { type: Type.STRING, description: 'e.g., 1/125s, 30s' },
          shutterSpeedExplanation: { type: Type.STRING, description: 'Explain why this shutter speed is recommended for the scene.' },
          whiteBalance: { type: Type.STRING, description: 'e.g., Auto, Daylight, 5500K' },
          whiteBalanceExplanation: { type: Type.STRING, description: 'Explain why this white balance is recommended for the scene.' },
          focusMode: { type: Type.STRING, description: 'e.g., AF-C, Eye AF, Manual Focus' },
          focusModeExplanation: { type: Type.STRING, description: 'Explain why this focus mode is recommended for the scene.' },
          driveMode: { type: Type.STRING, description: 'e.g., Single Shot, Continuous High' },
          driveModeExplanation: { type: Type.STRING, description: 'Explain why this drive mode is recommended for the scene.' },
          meteringMode: { type: Type.STRING, description: 'e.g., Matrix, Center-Weighted' },
          meteringModeExplanation: { type: Type.STRING, description: 'Explain why this metering mode is recommended for the scene.' },
          lensRecommendation: { type: Type.STRING, description: 'A recommendation for a suitable lens.' },
          generalTip: { type: Type.STRING, description: 'A short, helpful tip for any camera.' },
          brandSpecificTip: { type: Type.STRING, description: 'A tip specific to the user\'s camera brand or a key technique like using ND filters.' }
        },
        required: [
          'aperture', 'apertureExplanation',
          'iso', 'isoExplanation',
          'shutterSpeed', 'shutterSpeedExplanation',
          'whiteBalance', 'whiteBalanceExplanation',
          'focusMode', 'focusModeExplanation',
          'driveMode', 'driveModeExplanation',
          'meteringMode', 'meteringModeExplanation',
          'lensRecommendation', 'generalTip'
        ]
      };
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.5,
          }
        });
        const jsonString = response.text.trim();
        const parsedResponse = JSON.parse(jsonString);
        // Basic validation
        if (
          !parsedResponse.aperture || !parsedResponse.apertureExplanation ||
          !parsedResponse.iso || !parsedResponse.isoExplanation ||
          !parsedResponse.shutterSpeed || !parsedResponse.shutterSpeedExplanation ||
          !parsedResponse.whiteBalance || !parsedResponse.whiteBalanceExplanation ||
          !parsedResponse.focusMode || !parsedResponse.focusModeExplanation ||
          !parsedResponse.driveMode || !parsedResponse.driveModeExplanation ||
          !parsedResponse.meteringMode || !parsedResponse.meteringModeExplanation ||
          !parsedResponse.lensRecommendation ||
          !parsedResponse.generalTip
        ) {
          throw new Error('Invalid response structure from AI model.');
        }
        return parsedResponse as CameraSettings;
      } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error('Failed to communicate with the AI model.');
      }
    } else if (this.provider === 'openai') {
      // OpenAI GPT-4/3.5 for camera settings
      try {
        if (!this.apiKey) throw new Error('API key not set.');
        const openaiPrompt = prompt + '\nRespond ONLY with a valid JSON object with the following keys: aperture, apertureExplanation, iso, isoExplanation, shutterSpeed, shutterSpeedExplanation, whiteBalance, whiteBalanceExplanation, focusMode, focusModeExplanation, driveMode, driveModeExplanation, meteringMode, meteringModeExplanation, lensRecommendation, generalTip, brandSpecificTip.';
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: 'You are a professional photography assistant AI.' },
              { role: 'user', content: openaiPrompt }
            ],
            temperature: 0.5,
            max_tokens: 800
          })
        });
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) throw new Error('No response from OpenAI.');
        // Try to extract JSON from the response
        let jsonString = text;
        // If the response is wrapped in markdown, remove it
        if (jsonString.startsWith('```json')) {
          jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (jsonString.startsWith('```')) {
          jsonString = jsonString.replace(/^```/, '').replace(/```$/, '').trim();
        }
        const parsedResponse = JSON.parse(jsonString);
        return parsedResponse as CameraSettings;
      } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw new Error('Failed to communicate with the OpenAI model.');
      }
    } else {
      throw new Error('Provider not supported.');
    }
  }
}