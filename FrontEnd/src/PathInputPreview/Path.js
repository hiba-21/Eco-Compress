import axios from 'axios';
import React, { useState } from 'react';

const Path = () => {
  const [url, setUrl] = useState('');
  const [mediaType, setMediaType] = useState('image'); // Default to 'image'

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputSize, setInputSize] = useState(null);

  const handleCompress = async () => {
    try {
      setLoading(true);

      let response;

      if (mediaType === 'image') {
        response = await axios.post('http://localhost:3002/api/compress-image', { url });
      } else if (mediaType === 'video') {
        // You can modify the video API endpoint and parameters as needed
        response = await axios.post('http://localhost:3002/api/compress-video', { url });
      }

      setResult(response.data);
      setInputSize(response.data.inputSize); // Set input size
      setError(null);
    } catch (error) {
      console.error(`Error compressing ${mediaType}:`, error);
      setResult(null);
      setInputSize(null); // Reset input size on error
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (fileUrl) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'compressed-file'; // You can set a custom file name here
    link.click();
  };

  return (
    <div className="flex flex-col justify-center items-center w-[60%]">
      <div className="relative w-full tracking-wider border-raduis">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          id="hs-inline-add-on"
          name="hs-inline-add-on"
          className="py-5 px-4 ps-32 block w-full bg-[#526D82] shadow-sm rounded-lg text-md"
          placeholder="Image Or Video URL"
        />
        <div className="absolute inset-y-0 start-0 flex items-center z-20 border-r border-gray-800 bg-[#3b4e5d] rounded-l-lg">
          <select
            id="mediaType"
            name="mediaType"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="py-2 px-6 bg-transparent text-white h-[100%]"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>
      <div className="py-4">
        <button
          onClick={handleCompress}
          className="bg-[#79d429] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-[150px]"
          disabled={loading}
        >
          {loading ? 'Compressing...' : 'Compress'}
        </button>
      </div>
      {loading && <progress className="w-full" value="50" max="100" />}
      {error && <p className="text-red-500">Error: {error}</p>}
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Compressed File:</h2>
          <div>
            {mediaType === 'image' ? (
              <img
                src={result.compressedUrl}
                alt="Compressed Image"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            ) : (
              <video
                controls
                width="100%"
                height="auto"
                src={result.compressedUrl}
                type="video/mp4"
              />
            )}
            <p>Input Size: {inputSize} KB</p>
            <p>Output Size: {result.outputSize} KB</p>
            <button
              onClick={() => downloadFile(result.compressedUrl)}
              className="bg-[#79d429] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Download Compressed File
            </button>
            {/* Display other compressed image or video info */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Path;
