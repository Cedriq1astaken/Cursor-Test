# Tree vizualiser

# Object Tree Visualizer - Code Description
## Overview
This is a comprehensive web-based tree visualization tool that renders JSON objects as interactive hierarchical tree structures. The application allows users to input custom JSON data or generate random tree structures, then displays them as a visual tree with drag, zoom, and pan capabilities.
## Architecture
### Core Classes
## 1. Node Class
Purpose: Represents individual nodes in the tree structure
Key Properties:
key: Node identifier (property name or array index)
value: Actual data value
x, y: Position coordinates
level: Depth level in the tree
radius: Visual size of the node (200px)
children: Array of child nodes
Type flags: isObject, isArray, isPrimitive
Key Methods:
getValueString(): Returns appropriate display text ('{}', '[]', or primitive value)
getColor(colors): Returns color based on node type and level
## 2. Tree Class
Purpose: Manages the tree structure and layout algorithms
Key Properties:
root: Root node of the tree
levelHeight: Vertical spacing between levels (dynamically calculated)
nodeSpacing: Horizontal spacing between nodes (400px)
maxDepth: Maximum depth found in the tree
### Key Methods:
findLongestPath(): DFS algorithm to find maximum tree depth <br>
calculateOptimalLevelHeight(): Dynamically calculates level spacing based on tree depth<br>
buildFromObject(): Constructs tree from JSON data with proper positioning<br>
calculateChildPositions(): Determines optimal horizontal positioning to prevent overlap<br>
generateRandomTree(): Creates random nested object structures<br>
## 3. TreeVisualizer Class<br>
Purpose: Handles rendering, user interactions, and UI management<br>
Key Properties:<br>
canvas: HTML5 canvas element for rendering<br>
ctx: Canvas 2D context<br>
zoom: Current zoom level<br>
offsetX, offsetY: Pan offset coordinates<br>
colors: Array of colors for different tree levels<br>
Key Methods:<br>
drawNode(): Renders individual nodes with colors, text, and connections<br>
draw(): Main rendering loop with background<br>
setupEventListeners(): Handles mouse, touch, and button interactions<br>
loadJsonFromInput(): Parses and validates JSON input<br>
showMessage(): Displays success/error feedback<br>
### Key Features
## 1. Dynamic Layout System<br>
DFS-based depth calculation: Automatically determines optimal vertical spacing<br>
Overlap prevention: Sophisticated positioning algorithm prevents node overlap<br>
Responsive sizing: Adapts to different tree depths and complexities<br>
## 2. Interactive Controls<br>
Drag and Pan: Click and drag to move around the tree<br>
Zoom: Mouse wheel or buttons to zoom in/out (0.1x to 3x)<br>
Touch Support: Mobile-friendly touch interactions<br>
Reset View: Button to return to default view<br>
## 3. Data Input Methods<br>
JSON Input: Textarea for custom JSON data with validation<br>
Random Generation: Creates random nested object structures<br>
Error Handling: User-friendly error messages for invalid JSON<br>
## 4. Visual Design<br>
Color Coding:<br>
Red for primitive values<br>
Teal for arrays<br>
Multi-color palette for objects (based on depth level)<br>
Large Nodes: 200px radius nodes with 100px font size<br>
Connection Lines: Dark lines connecting parent to child nodes<br>
Gray Background: Canvas background for better contrast<br>
## 5. Performance Optimizations<br>
Efficient Rendering: Draws nodes from bottom to top for proper layering<br>
Smart Spacing: Calculates minimum required space for each subtree<br>
Dynamic Adjustment: Automatically adjusts spacing based on tree complexity<br>
Technical Implementation Details<br>
Layout Algorithm<br>
Depth-First Search: Finds maximum tree depth<br>
Optimal Height Calculation: availableHeight / (maxDepth + 1)<br>
Recursive Positioning: Each parent positions children based on their space requirements<br>
Overlap Prevention: Uses calculated widths to ensure proper spacing<br>
Rendering Pipeline<br>
Background Fill: Gray background (#999)<br>
Node Sorting: Sort by level (bottom to top)<br>
Connection Drawing: Lines between parent and child nodes<br>
Node Rendering: Circles with colors, text, and borders<br>
User Interaction System<br>
Event Delegation: Centralized event handling<br>
State Management: Tracks drag state, zoom level, and pan offset<br>
Responsive Design: Adapts to different screen sizes<br>

Project generated mostly by cursor as a test
