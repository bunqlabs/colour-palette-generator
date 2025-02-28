import React, { useState, useEffect } from 'react';
import { Copy, Lock, Unlock, X, Moon, Sun } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [numColors, setNumColors] = useState(4);
  const [colors, setColors] = useState<string[]>([]);
  const [lockedColors, setLockedColors] = useState<boolean[]>([]);

  // Generate random hex color
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  };

  // Generate palette
  const generatePalette = () => {
    const newColors = [...colors];
    for (let i = 0; i < numColors; i++) {
      if (!lockedColors[i]) {
        newColors[i] = generateRandomColor();
      }
    }
    setColors(newColors);
  };

  // Initialize colors
  useEffect(() => {
    // Adjust arrays when numColors changes
    if (colors.length < numColors) {
      // Add new colors
      const newColors = [...colors];
      const newLocked = [...lockedColors];
      
      for (let i = colors.length; i < numColors; i++) {
        newColors.push(generateRandomColor());
        newLocked.push(false);
      }
      
      setColors(newColors);
      setLockedColors(newLocked);
    } else if (colors.length > numColors) {
      // Remove excess colors
      setColors(colors.slice(0, numColors));
      setLockedColors(lockedColors.slice(0, numColors));
    }
  }, [numColors]);

  // Initialize on first load
  useEffect(() => {
    if (colors.length === 0) {
      const initialColors = Array(numColors).fill('').map(() => generateRandomColor());
      const initialLocked = Array(numColors).fill(false);
      setColors(initialColors);
      setLockedColors(initialLocked);
    }
    
    // Add spacebar event listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        generatePalette();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Only run on first load

  // Copy color to clipboard
  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    // Could add a toast notification here
  };

  // Toggle lock for a color
  const toggleLock = (index: number) => {
    const newLocked = [...lockedColors];
    newLocked[index] = !newLocked[index];
    setLockedColors(newLocked);
  };

  // Remove a color panel
  const removePanel = (index: number) => {
    if (numColors > 2) {
      const newColors = [...colors];
      const newLocked = [...lockedColors];
      
      newColors.splice(index, 1);
      newLocked.splice(index, 1);
      
      setColors(newColors);
      setLockedColors(newLocked);
      setNumColors(numColors - 1);
    }
  };

  // Update color manually
  const updateColor = (index: number, value: string) => {
    // Validate hex code
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const newColors = [...colors];
      newColors[index] = value;
      setColors(newColors);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="max-w-[600px] mx-auto p-4 h-[400px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold font-['Inter_Tight']">Colour Palette Generator</h1>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`ml-4 p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 font-['Inter_Tight']">Number of colours:</label>
            <input 
              type="range" 
              min="2" 
              max="6" 
              value={numColors} 
              onChange={(e) => setNumColors(parseInt(e.target.value))}
              className="w-24"
              step="1"
            />
            <span className="ml-2 font-['Inter_Tight']">{numColors}</span>
          </div>
        </div>
        
        {/* Color Panels */}
        <div 
          className="grid gap-2 flex-grow"
          style={{ 
            gridTemplateColumns: `repeat(${numColors}, 1fr)`,
          }}
        >
          {colors.map((color, index) => (
            <div 
              key={index} 
              className="panels relative rounded-md flex flex-col items-center justify-center transition-all duration-300 group"
              style={{ backgroundColor: color }}
            >
              {/* Control buttons - visible on hover */}
              <div className="absolute top-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                <button 
                  onClick={() => removePanel(index)}
                  className="p-1 mb-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 text-white"
                >
                  <X size={16} />
                </button>
                
                <button 
                  onClick={() => copyColor(color)}
                  className="p-1 mb-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 text-white"
                >
                  <Copy size={16} />
                </button>
                
                <button 
                  onClick={() => toggleLock(index)}
                  className="p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 text-white"
                >
                  {lockedColors[index] ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
              </div>
              
              {/* Color input */}
              <input 
                type="text" 
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="mt-auto mb-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded w-24 text-center opacity-0 group-hover:opacity-100 transition-opacity font-['Inter_Tight']"
                placeholder={color}
              />
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button 
            onClick={generatePalette}
            className={`${darkMode ? 'bg-white text-black' : 'bg-black text-white'} px-4 py-2 rounded-md hover:opacity-90 transition-colors font-['Inter_Tight']`}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;