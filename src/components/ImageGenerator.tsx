import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from 'sonner';
import { Loader2, Github } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    if (!apiKey.trim()) {
      toast.error('Please enter your Runware API key');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            taskType: "authentication",
            apiKey: apiKey
          },
          {
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            positivePrompt: prompt,
            model: "runware:100@1",
            width: 1024,
            height: 1024,
            numberResults: 1,
            outputFormat: "WEBP",
          }
        ]),
      });

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message || 'Failed to generate image');
      }

      const imageData = data.data.find(item => item.taskType === "imageInference");
      if (imageData && imageData.imageURL) {
        setImage(imageData.imageURL);
        toast.success('Image generated successfully!');
        
        // Save API key to localStorage for future use
        localStorage.setItem('runwareApiKey', apiKey);
      } else {
        throw new Error('No image was generated');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate image. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('runwareApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Text to Image Generator</h1>
          <p className="text-gray-600">Transform your imagination into reality</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Create your image</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowApiKey(!showApiKey)}
                size="sm"
              >
                {showApiKey ? "Hide API Key" : "Show API Key"}
              </Button>
            </div>

            {showApiKey && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Get your API key from <a href="https://runware.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Runware.ai</a>
                </p>
                <Input
                  placeholder="Enter your Runware API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                  className="font-mono"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={generateImage}
                disabled={isLoading || !prompt.trim() || !apiKey.trim()}
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

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-4">How to Use</h2>
          <ol className="space-y-3 list-decimal pl-4">
            <li>Visit <a href="https://runware.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Runware.ai</a> and create an account</li>
            <li>Get your API key from the Runware dashboard</li>
            <li>Click "Show API Key" above and enter your API key</li>
            <li>Enter your prompt describing the image you want to generate</li>
            <li>Click "Generate" and watch your imagination come to life!</li>
          </ol>
        </Card>

        <footer className="text-center py-6">
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/Imranimmu-max"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Github className="w-5 h-5" />
              <span>GitHub Profile</span>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Powered by Runware.ai
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ImageGenerator;
