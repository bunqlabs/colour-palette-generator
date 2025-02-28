// This file contains the main plugin code that runs in Figma
figma.showUI(__html__, { width: 600, height: 400 });

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-rectangles') {
    // Create a new page if needed
    const nodes = [];
    
    // For each color in the palette
    for (let i = 0; i < msg.colors.length; i++) {
      // Create a rectangle
      const rect = figma.createRectangle();
      
      // Set position (horizontal layout)
      rect.x = i * 150;
      rect.y = 0;
      
      // Set size
      rect.resize(100, 100);
      
      // Set fill color from hex
      const color = hexToRgb(msg.colors[i]);
      const paint = {
        type: 'SOLID',
        color: {
          r: color.r / 255,
          g: color.g / 255,
          b: color.b / 255
        }
      };
      rect.fills = [paint];
      
      // Add to document
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    
    // Select all created nodes
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    
    // Notify the UI
    figma.ui.postMessage({
      type: 'creation-complete',
      message: `Created ${msg.colors.length} color rectangles`
    });
  }
  
  // Close the plugin when requested
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
}