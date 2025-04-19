
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          taskType: "imageInference",
          taskUUID: crypto.randomUUID(),
          positivePrompt: prompt,
          model: "runware:100@1",
          width: 1024,
          height: 1024,
          numberResults: 1,
          outputFormat: "WEBP",
        }]),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setImage(data.data[0].imageURL);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Text to Image Generator</h1>
          <p className="text-gray-600">Transform your imagination into reality</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={generateImage}
                disabled={isLoading || !prompt.trim()}
                className="w-24"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Generate'
                )}
              </Button>
            </div>

            {image && (
              <div className="mt-6 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={image}
                  alt="Generated"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageGenerator;
