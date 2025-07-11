// Node class to represent individual nodes in the tree
class Node {
    constructor(key, value, x = 0, y = 0, level = 0) {
        this.key = key;
        this.value = value;
        this.x = x;
        this.y = y;
        this.level = level;
        this.children = [];
        this.isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
        this.isArray = Array.isArray(value);
        this.isPrimitive = !this.isObject && !this.isArray;
        this.radius = 200; // Node radius property
    }
    
    addChild(child) {
        this.children.push(child);
    }
    
    getValueString() {
        if (this.isObject) return '{}';
        if (this.isArray) return '[]';
        return String(this.value);
    }
    
    getColor(colors) {
        if (this.isPrimitive) {
            return '#FF6B6B'; // Red for primitives
        } else if (this.isArray) {
            return '#4ECDC4'; // Teal for arrays
        } else if (this.isObject) {
            return colors[this.level % colors.length]; // Color by level for objects
        } else {
            return '#FF6B6B'; // Default red
        }
    }
}

// Tree class to manage the tree structure
class Tree {
    constructor() {
        this.root = null;
        this.levelHeight = 1000; // Will be adjusted dynamically
        this.nodeSpacing = 400; // Decreased for narrower tree
        this.maxDepth = 0; // Track the maximum depth found
    }
    
    // DFS to find the longest path (maximum depth)
    findLongestPath(node = null, currentDepth = 0) {
        if (node === null) {
            node = this.root;
            this.maxDepth = 0;
        }
        
        if (!node) return 0;
        
        // Update max depth if current depth is greater
        this.maxDepth = Math.max(this.maxDepth, currentDepth);
        
        // Recursively check all children
        let maxChildDepth = currentDepth;
        node.children.forEach(child => {
            maxChildDepth = Math.max(maxChildDepth, this.findLongestPath(child, currentDepth + 1));
        });
        
        return maxChildDepth;
    }
    
    // Calculate optimal level height based on tree depth and canvas height
    calculateOptimalLevelHeight() {
        if (!this.root) return this.levelHeight;
        
        // Find the longest path
        this.findLongestPath();
        
        // Canvas height is 800px, leave some margin
        const availableHeight = 4000;
        const optimalHeight = Math.max(200, availableHeight / (this.maxDepth + 1));
        
        return optimalHeight;
    }
    
    buildFromObject(obj, parentKey = 'root', level = 0, x = 0) {
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
            // Object node
            const keys = Object.keys(obj);
            const node = new Node(parentKey, obj, x, level * this.levelHeight, level);
            
            if (keys.length > 0) {
                // Calculate positions for children
                const childPositions = this.calculateChildPositions(obj, level + 1);
                const totalWidth = childPositions.totalWidth;
                const startX = x - totalWidth / 2;
                
                keys.forEach((key, index) => {
                    const childNode = this.buildFromObject(obj[key], key, level + 1, startX + childPositions.positions[index]);
                    node.addChild(childNode);
                });
            }
            
            return node;
        } else if (Array.isArray(obj)) {
            // Array node
            const node = new Node(parentKey, obj, x, level * this.levelHeight, level);
            
            if (obj.length > 0) {
                // Calculate positions for array elements
                const childPositions = this.calculateChildPositions(obj, level + 1);
                const totalWidth = childPositions.totalWidth;
                const startX = x - totalWidth / 2;
                
                obj.forEach((item, index) => {
                    const childNode = this.buildFromObject(item, `[${index}]`, level + 1, startX + childPositions.positions[index]);
                    node.addChild(childNode);
                });
            }
            
            return node;
        } else {
            // Primitive value node
            return new Node(parentKey, obj, x, level * this.levelHeight, level);
        }
    }
    
    calculateChildPositions(obj, level) {
        const items = Array.isArray(obj) ? obj : Object.values(obj);
        const positions = [];
        
        if (items.length === 0) {
            return { positions: [], totalWidth: this.nodeSpacing };
        }
        
        // First pass: calculate minimum width needed for each child
        const childWidths = items.map(item => {
            if (typeof item === 'object' && item !== null) {
                // For objects/arrays, calculate recursively
                const childPositions = this.calculateChildPositions(item, level + 1);
                return Math.max(childPositions.totalWidth, this.nodeSpacing);
            } else {
                // For primitives, use minimum spacing
                return this.nodeSpacing;
            }
        });
        
        // Second pass: position children with proper spacing
        let currentX = 0;
        childWidths.forEach((width, index) => {
            positions.push(currentX + width / 2);
            currentX += width + this.nodeSpacing * 0.1; // Minimal extra spacing for large values
        });
        
        const totalWidth = Math.max(currentX - this.nodeSpacing * 0.1, this.nodeSpacing); // Ensure minimum width
        
        return { positions, totalWidth };
    }
    
    generateRandomTree(depth = 0, maxDepth = 4) {
        if (depth >= maxDepth) {
            return Math.floor(Math.random() * 100);
        }
        
        const obj = {};
        const numKeys = Math.floor(Math.random() * 5) + 1; // 1-5 keys
        
        for (let i = 0; i < numKeys; i++) {
            const key = `key${i + 1}`;
            if (Math.random() < 0.7 && depth < maxDepth - 1) {
                obj[key] = this.generateRandomTree(depth + 1, maxDepth);
            } else {
                obj[key] = Math.floor(Math.random() * 100);
            }
        }
        
        return obj;
    }
    
    setData(data) {
        // Calculate optimal level height before building the tree
        this.levelHeight = this.calculateOptimalLevelHeight();
        console.log(`Tree depth: ${this.maxDepth}, Optimal level height: ${this.levelHeight}`);
        
        this.root = this.buildFromObject(data);
        // this.adjustSpacing(); // Disabled to respect manual spacing values
    }
    
    adjustSpacing() {
        if (!this.root) return;
        
        // Calculate tree width to determine if we need to adjust spacing
        const treeWidth = this.calculateTreeWidth(this.root);
        const canvasWidth = 1200; // Canvas width
        
        // For large spacing values, use different thresholds
        const maxSpacing = Math.max(1000, this.nodeSpacing);
        const minSpacing = Math.max(500, this.nodeSpacing * 0.5);
        
        if (treeWidth > canvasWidth * 0.8) {
            // Increase spacing if tree is too wide
            const newSpacing = Math.max(minSpacing, (canvasWidth * 0.8) / this.countNodes(this.root));
            if (newSpacing !== this.nodeSpacing) {
                this.nodeSpacing = newSpacing;
                // Rebuild tree with adjusted spacing
                this.root = this.buildFromObject(this.getOriginalData(this.root));
            }
        } else if (treeWidth < canvasWidth * 0.3) {
            // Decrease spacing if tree is too narrow
            const newSpacing = Math.min(maxSpacing, (canvasWidth * 0.3) / this.countNodes(this.root));
            if (newSpacing !== this.nodeSpacing) {
                this.nodeSpacing = newSpacing;
                // Rebuild tree with adjusted spacing
                this.root = this.buildFromObject(this.getOriginalData(this.root));
            }
        }
    }
    
    calculateTreeWidth(node) {
        if (!node.children.length) return this.nodeSpacing;
        
        let totalWidth = 0;
        node.children.forEach(child => {
            totalWidth += this.calculateTreeWidth(child);
        });
        return Math.max(totalWidth, this.nodeSpacing);
    }
    
    countNodes(node) {
        let count = 1;
        node.children.forEach(child => {
            count += this.countNodes(child);
        });
        return count;
    }
    
    getOriginalData(node) {
        if (node.isPrimitive) {
            return node.value;
        } else if (node.isArray) {
            return node.children.map(child => this.getOriginalData(child));
        } else {
            const obj = {};
            node.children.forEach(child => {
                obj[child.key] = this.getOriginalData(child);
            });
            return obj;
        }
    }
    
    generateRandom() {
        const data = this.generateRandomTree(0, 4);
        this.setData(data);
        return data;
    }
    
    getAllNodes() {
        const nodes = [];
        this.traverse(this.root, nodes);
        return nodes;
    }
    
    traverse(node, nodes) {
        if (!node) return;
        nodes.push(node);
        node.children.forEach(child => this.traverse(child, nodes));
    }
}

// TreeVisualizer class to handle rendering and interactions
class TreeVisualizer {
    constructor() {
        this.canvas = document.getElementById('treeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tree = new Tree();
        
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
            '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
        ];
        
        this.setupEventListeners();
        this.tree.generateRandom();
        this.draw();
    }
    
    setupEventListeners() {
        // Mouse events for dragging
        this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
        this.canvas.addEventListener('mousemove', (e) => this.drag(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrag());
        this.canvas.addEventListener('mouseleave', () => this.stopDrag());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrag(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.drag(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.stopDrag());
        
        // Button events
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.tree.generateRandom();
            this.draw();
            this.showMessage('Random tree generated successfully!', 'success');
        });
        
        document.getElementById('loadJsonBtn').addEventListener('click', () => {
            this.loadJsonFromInput();
        });
        
        document.getElementById('clearJsonBtn').addEventListener('click', () => {
            document.getElementById('jsonInput').value = '';
            this.showMessage('JSON input cleared!', 'success');
        });
        
        document.getElementById('zoomInBtn').addEventListener('click', () => {
            this.zoom *= 1.2;
            this.draw();
        });
        
        document.getElementById('zoomOutBtn').addEventListener('click', () => {
            this.zoom /= 1.2;
            this.draw();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.zoom = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            this.draw();
        });
        
        // Wheel zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom *= zoomFactor;
            this.zoom = Math.max(0.1, Math.min(3, this.zoom));
            
            this.draw();
        });
    }
    
    loadJsonFromInput() {
        const jsonInput = document.getElementById('jsonInput').value.trim();
        
        if (!jsonInput) {
            this.showMessage('Please enter JSON data first!', 'error');
            return;
        }
        
        try {
            const data = JSON.parse(jsonInput);
            this.tree.setData(data);
            this.draw();
            this.showMessage('JSON loaded successfully!', 'success');
        } catch (error) {
            this.showMessage(`Invalid JSON: ${error.message}`, 'error');
        }
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.error, .success');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;
        
        // Insert after input section
        const inputSection = document.querySelector('.input-section');
        inputSection.appendChild(messageDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        this.offsetX += deltaX;
        this.offsetY += deltaY;
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        this.draw();
    }
    
    stopDrag() {
        this.isDragging = false;
    }
    
    drawNode(node) {
        const x = node.x * this.zoom + this.offsetX + this.canvas.width / 2;
        const y = node.y * this.zoom + this.offsetY + 50;
        const radius = node.radius * this.zoom;
        
        // Draw connection lines to children
        node.children.forEach(child => {
            const childX = child.x * this.zoom + this.offsetX + this.canvas.width / 2;
            const childY = child.y * this.zoom + this.offsetY + 50;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + radius);
            this.ctx.lineTo(childX, childY - radius);
            this.ctx.strokeStyle = '#111';
            this.ctx.lineWidth = 4 * this.zoom;
            this.ctx.stroke();
        });
        
        // Draw node background
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        
        // Get color from node
        const color = node.getColor(this.colors);
        console.log(`Node ${node.key}: type=${node.isObject ? 'object' : node.isArray ? 'array' : 'primitive'}, level=${node.level}, color=${color}`);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2 * this.zoom;
        this.ctx.stroke();
        
        // Draw node text
        this.ctx.fillStyle = '#000';
        this.ctx.font = `${160 * this.zoom}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Draw key
        this.ctx.fillText(node.key, x, y - 8 * this.zoom);
        
        // Draw value
        this.ctx.font = `${0 * this.zoom}px Arial`;
        this.ctx.fillText(node.getValueString(), x, y + 8 * this.zoom);
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#999';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
     
        if (!this.tree.root) return;
        
        // Get all nodes and sort by level (draw from bottom to top)
        const allNodes = this.tree.getAllNodes();
        allNodes.sort((a, b) => b.level - a.level);
        
        allNodes.forEach(node => this.drawNode(node));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TreeVisualizer();
});
