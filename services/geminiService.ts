import { GoogleGenAI, Modality } from "@google/genai";
import { ProcessMode } from '../types';

// অনুগ্রহ করে এখানে আপনার জেমিনি এপিআই কী (Gemini API Key) যোগ করুন।
// Please paste your Gemini API key here.
export const API_KEY = "AIzaSyCr3kPAesgcw9YfsDSs1dWC7ol7xaLXf_A";


const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getPromptForMode = (mode: ProcessMode): string => {
  switch (mode) {
    case ProcessMode.REMOVE_WATERMARK:
      return "Remove any and all watermarks, logos, text overlays, or other distracting objects from this image. The result should be a clean version of the image with the removed areas seamlessly filled in.";
    case ProcessMode.ENHANCE_QUALITY:
      return "Enhance the overall quality of this image. Improve sharpness, clarity, and detail. Correct any noise or artifacts. Adjust lighting and contrast for a more vibrant and clear picture.";
    case ProcessMode.UPSCALE_4K:
      return "Upscale this image to a higher resolution, approximating 4K quality. Enhance details and sharpness so it looks clear and crisp on a high-resolution display. Maintain the original aspect ratio.";
    case ProcessMode.RESTORE_COLOR:
      return "Restore the colors in this image. If it's faded, correct the colors to be vibrant and natural. If it's black and white, colorize it realistically.";
    case ProcessMode.REMOVE_BACKGROUND:
      return "Remove the background from this image, leaving only the main subject. The output should have a transparent background.";
    default:
      throw new Error("Invalid processing mode selected.");
  }
};


export const processImageWithGemini = async (file: File, mode: ProcessMode): Promise<string> => {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    throw new Error("API Key not found. Please add your Gemini API Key in 'services/geminiService.ts'.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const imagePart = await fileToGenerativePart(file);
  const textPart = { text: getPromptForMode(mode) };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
        parts: [imagePart, textPart],
    },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];

  if (!candidate) {
    const blockReason = response.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Request was blocked: ${blockReason}. Please try a different image or transformation.`);
    }
    throw new Error("Failed to process the image. The model provided no response candidate.");
  }

  if (candidate.finishReason && ['SAFETY', 'RECITATION', 'OTHER'].includes(candidate.finishReason)) {
     throw new Error(`Processing failed due to: ${candidate.finishReason}. Please try a different image or transformation.`);
  }

  // FIX: Renamed variable to avoid redeclaration error.
  const resultImagePart = candidate.content.parts.find(p => p.inlineData);

  if (resultImagePart?.inlineData) {
    return resultImagePart.inlineData.data;
  }
  
  throw new Error("Failed to process the image. The model did not return a valid image.");
};