# Tree vizualiser

# Object Tree Visualizer - Code Description
## Overview
This is a comprehensive web-based tree visualization tool that renders JSON objects as interactive hierarchical tree structures. The application allows users to input custom JSON data or generate random tree structures, then displays them as a visual tree with drag, zoom, and pan capabilities.
## Architecture
### Core Classes
1. Node Class
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
2. Tree Class
Purpose: Manages the tree structure and layout algorithms
Key Properties:
root: Root node of the tree
levelHeight: Vertical spacing between levels (dynamically calculated)
nodeSpacing: Horizontal spacing between nodes (400px)
maxDepth: Maximum depth found in the tree
### Key Methods:
findLongestPath(): DFS algorithm to find maximum tree depth
calculateOptimalLevelHeight(): Dynamically calculates level spacing based on tree depth
buildFromObject(): Constructs tree from JSON data with proper positioning
calculateChildPositions(): Determines optimal horizontal positioning to prevent overlap
generateRandomTree(): Creates random nested object structures
3. TreeVisualizer Class
Purpose: Handles rendering, user interactions, and UI management
Key Properties:
canvas: HTML5 canvas element for rendering
ctx: Canvas 2D context
zoom: Current zoom level
offsetX, offsetY: Pan offset coordinates
colors: Array of colors for different tree levels
Key Methods:
drawNode(): Renders individual nodes with colors, text, and connections
draw(): Main rendering loop with background
setupEventListeners(): Handles mouse, touch, and button interactions
loadJsonFromInput(): Parses and validates JSON input
showMessage(): Displays success/error feedback
### Key Features
1. Dynamic Layout System
DFS-based depth calculation: Automatically determines optimal vertical spacing
Overlap prevention: Sophisticated positioning algorithm prevents node overlap
Responsive sizing: Adapts to different tree depths and complexities
2. Interactive Controls
Drag and Pan: Click and drag to move around the tree
Zoom: Mouse wheel or buttons to zoom in/out (0.1x to 3x)
Touch Support: Mobile-friendly touch interactions
Reset View: Button to return to default view
3. Data Input Methods
JSON Input: Textarea for custom JSON data with validation
Random Generation: Creates random nested object structures
Error Handling: User-friendly error messages for invalid JSON
4. Visual Design
Color Coding:
Red for primitive values
Teal for arrays
Multi-color palette for objects (based on depth level)
Large Nodes: 200px radius nodes with 100px font size
Connection Lines: Dark lines connecting parent to child nodes
Gray Background: Canvas background for better contrast
5. Performance Optimizations
Efficient Rendering: Draws nodes from bottom to top for proper layering
Smart Spacing: Calculates minimum required space for each subtree
Dynamic Adjustment: Automatically adjusts spacing based on tree complexity
Technical Implementation Details
Layout Algorithm
Depth-First Search: Finds maximum tree depth
Optimal Height Calculation: availableHeight / (maxDepth + 1)
Recursive Positioning: Each parent positions children based on their space requirements
Overlap Prevention: Uses calculated widths to ensure proper spacing
Rendering Pipeline
Background Fill: Gray background (#999)
Node Sorting: Sort by level (bottom to top)
Connection Drawing: Lines between parent and child nodes
Node Rendering: Circles with colors, text, and borders
User Interaction System
Event Delegation: Centralized event handling
State Management: Tracks drag state, zoom level, and pan offset
Responsive Design: Adapts to different screen sizes

Project generated mostly by cursor as a test
