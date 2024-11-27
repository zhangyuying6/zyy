// 选择 HTML 元素
const shapes = document.querySelectorAll('.shape-container');
const rightPanel = document.getElementById('right-panel');
const leftPanel = document.getElementById('left-panel');
const rotationSlider = document.getElementById('rotation-slider');
const sizeSlider = document.getElementById('size-slider');
const inputRotation = document.getElementById('input-rotation');
const inputSize = document.getElementById('input-size');
const colorPicker = document.getElementById('color-picker');
const rotationValueDisplay = document.getElementById('rotation-value');
const sizeValueDisplay = document.getElementById('size-value');
const drawBtn = document.getElementById('draw-btn');
const eraseBtn = document.getElementById('erase-btn');
const brushColorPicker = document.getElementById('brush-color-picker');
const brushSizeSlider = document.getElementById('brush-size-slider');
const brushSizeDisplay = document.getElementById('brush-size-display');
const shapeTabBtn = document.getElementById('shape-tab-btn');
const textTabBtn = document.getElementById('text-tab-btn');
const canvasTabBtn = document.getElementById('canvas-tab-btn');

const shapeControls = document.getElementById('shape-controls');
const textControls = document.getElementById('text-controls');
const canvasControls = document.getElementById('canvas-controls');

shapeTabBtn.addEventListener('click', () => {
    showTab('shape');
});

textTabBtn.addEventListener('click', () => {
    showTab('text');
});

canvasTabBtn.addEventListener('click', () => {
    showTab('canvas');
});

function showTab(tab) {
    shapeControls.style.display = 'none';
    textControls.style.display = 'none';
    canvasControls.style.display = 'none';

    shapeTabBtn.classList.remove('active');
    textTabBtn.classList.remove('active');
    canvasTabBtn.classList.remove('active');

    if (tab === 'shape') {
        shapeControls.style.display = 'block';
        shapeTabBtn.classList.add('active');
    } else if (tab === 'text') {
        textControls.style.display = 'block';
        textTabBtn.classList.add('active');
    } else if (tab === 'canvas') {
        canvasControls.style.display = 'block';
        canvasTabBtn.classList.add('active');
    }
}
let activeMode = null; // 追踪当前活动模式（null, 'draw', 'erase'）
let brushColor = '#000000';
let brushSize = 5;

// 初始化Canvas
const canvas = document.createElement('canvas');
canvas.width = rightPanel.clientWidth;
canvas.height = rightPanel.clientHeight;
rightPanel.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.lineWidth = brushSize;
ctx.lineCap = 'round';

window.addEventListener('resize', () => {
    canvas.width = rightPanel.clientWidth;
    canvas.height = rightPanel.clientHeight;
    ctx.lineWidth = brushSize;
});

// 更新画笔参数
brushColorPicker.addEventListener('input', () => {
    brushColor = brushColorPicker.value;
});

brushSizeSlider.addEventListener('input', () => {
    brushSize = brushSizeSlider.value;
    brushSizeDisplay.textContent = brushSize;
    ctx.lineWidth = brushSize;
});

// 画笔模式切换
drawBtn.addEventListener('click', () => {
    if (activeMode === 'draw') {
        setMode(null); // 退出模式
    } else {
        setMode('draw'); // 进入画笔模式
    }
});

// 橡皮擦模式切换
eraseBtn.addEventListener('click', () => {
    if (activeMode === 'erase') {
        setMode(null); // 退出模式
    } else {
        setMode('erase'); // 进入橡皮擦模式
    }
});

// 设置当前模式
function setMode(mode) {
    if (mode === 'draw') {
        activeMode = 'draw';
        ctx.globalCompositeOperation = 'source-over'; // 绘图模式
        drawBtn.classList.add('active');
        eraseBtn.classList.remove('active');
    } else if (mode === 'erase') {
        activeMode = 'erase';
        ctx.globalCompositeOperation = 'destination-out'; // 擦除模式
        eraseBtn.classList.add('active');
        drawBtn.classList.remove('active');
    } else {
        activeMode = null;
        drawBtn.classList.remove('active');
        eraseBtn.classList.remove('active');
    }
}

// 处理鼠标绘图
canvas.addEventListener('mousedown', (event) => {
    if (activeMode) {
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
        canvas.addEventListener('mousemove', draw);
    }
});

document.addEventListener('mouseup', () => {
    canvas.removeEventListener('mousemove', draw);
});

function draw(event) {
    if (activeMode === 'draw' || activeMode === 'erase') {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.strokeStyle = activeMode === 'draw' ? brushColor : 'rgba(0,0,0,1)';
        ctx.stroke();
    }
}
// 获取清除画布按钮
const clearCanvasBtn = document.getElementById('clear-canvas-btn');

// 清除画布的函数
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布内容
}

// 添加清除画布按钮点击事件
clearCanvasBtn.addEventListener('click', clearCanvas);


// 为每个左侧形状添加点击事件
shapes.forEach(shape => {
    shape.addEventListener('click', () => {
        highlightLeftShape(shape);
        createShape(shape.dataset.shape);
    });
});

function highlightLeftShape(shape) {
    shapes.forEach(s => {
        const svg = s.querySelector('svg');
        if (svg) {
            const shapeElements = svg.querySelectorAll('circle, rect, polygon, ellipse, line');
            shapeElements.forEach(elem => {
                elem.setAttribute('fill', 'none');
                elem.setAttribute('stroke', 'black'); // 恢复图形的默认样式
            });
        }
    });

    // 为当前选择的形状高亮
    const svg = shape.querySelector('svg');
    if (svg) {
        const shapeElements = svg.querySelectorAll('circle, rect, polygon, ellipse, line');
        shapeElements.forEach(elem => {
            if (['circle', 'rect', 'polygon', 'ellipse'].includes(elem.tagName)) {
                elem.setAttribute('fill', 'yellow'); 
                elem.setAttribute('stroke', 'black');// 高亮填充
            }
            else
            elem.setAttribute('stroke', 'yellow');
             // 即便高亮也保持黑色边框
        });
    }
}

function createShape(shapeType) {
    const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const padding = 10;
    const { panelWidth, svgWidth, svgHeight } = { panelWidth: rightPanel.offsetWidth, svgWidth: 120, svgHeight: 120 };
    const existingShapes = rightPanel.querySelectorAll('.draggable');
    const currentRow = Math.floor(existingShapes.length / Math.floor(panelWidth / svgWidth));
    const currentCol = existingShapes.length % Math.floor(panelWidth / svgWidth);
    newSvg.setAttribute('width', '120');
    newSvg.setAttribute('height', '120');
    newSvg.setAttribute('class', 'draggable');
    newSvg.style.position = 'absolute';
    newSvg.style.zIndex = 500;
    newSvg.style.left = `${currentCol * (svgWidth + padding)}px`;
    newSvg.style.top = `${currentRow * (svgHeight + padding)}px`;

    switch (shapeType) {
        case 'star':
            const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            star.setAttribute('points', '60,15 70,45 95,45 75,60 85,90 60,75 35,90 45,60 25,45 50,45');
            star.setAttribute('fill', 'none');
            star.setAttribute('stroke', 'black');
            newSvg.appendChild(star);
            break;
        case 'circle':
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '60');
            circle.setAttribute('cy', '60');
            circle.setAttribute('r', '40');
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', 'black');
            newSvg.appendChild(circle);
            break;
        case 'rect':
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', '20');
            rect.setAttribute('y', '30');
            rect.setAttribute('width', '80');
            rect.setAttribute('height', '60');
            rect.setAttribute('fill', 'none');
            rect.setAttribute('stroke', 'black');
            newSvg.appendChild(rect);
            break;
        case 'triangle':
            const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            triangle.setAttribute('points', '60,10 20,110 100,110');
            triangle.setAttribute('fill', 'none');
            triangle.setAttribute('stroke', 'black');
            newSvg.appendChild(triangle);
            break;
        case 'arrow':
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '10');
            line.setAttribute('y1', '50');
            line.setAttribute('x2', '70');
            line.setAttribute('y2', '50');
            line.setAttribute('stroke', 'black');
            line.setAttribute('stroke-width', '2');
            const arrowHead = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            arrowHead.setAttribute('points', '70,45 90,50 70,55');
            arrowHead.setAttribute('fill', 'none');
            arrowHead.setAttribute('stroke', 'black');
            newSvg.appendChild(line);
            newSvg.appendChild(arrowHead);
            break;
        case 'hexagon':
            const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            hexagon.setAttribute('points', '60,10 100,40 100,80 60,110 20,80 20,40');
            hexagon.setAttribute('fill', 'none');
            hexagon.setAttribute('stroke', 'black');
            newSvg.appendChild(hexagon);
            break;
        case 'ellipse':
            const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            ellipse.setAttribute('cx', '60');
            ellipse.setAttribute('cy', '60');
            ellipse.setAttribute('rx', '50');
            ellipse.setAttribute('ry', '30');
            ellipse.setAttribute('fill', 'none');
            ellipse.setAttribute('stroke', 'black');
            newSvg.appendChild(ellipse);
            break;
        case 'line':
            const lineShape = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            lineShape.setAttribute('x1', '10');
            lineShape.setAttribute('y1', '60');
            lineShape.setAttribute('x2', '110');
            lineShape.setAttribute('y2', '60');
            lineShape.setAttribute('stroke', 'black');
            lineShape.setAttribute('stroke-width', '2');
            newSvg.appendChild(lineShape);
            break;
    }

    newSvg.addEventListener('mousedown', startDrag);
    newSvg.addEventListener('click', selectShape);
    rightPanel.appendChild(newSvg);
}

function updateDisplayedValues() {
    if (!selectedElement) return;

    rotationSlider.value = getRotation(selectedElement);
    sizeSlider.value = getScale(selectedElement);
    inputRotation.value = rotationSlider.value;
    inputSize.value = sizeSlider.value;

    rotationValueDisplay.textContent = `${rotationSlider.value}°`;
    sizeValueDisplay.textContent = sizeSlider.value;
}

function selectShape(event) {
    deselectAll();
    selectedElement = event.target.closest('svg');
    if (selectedElement) {
        const shapeElements = selectedElement.querySelectorAll('circle, rect, polygon, ellipse, line');
        shapeElements.forEach(elem => {
            if (elem.tagName === 'line') {
                // 保存当前横线的颜色
                elem.setAttribute('data-original-stroke', elem.getAttribute('stroke'));
            }
            elem.setAttribute('stroke-width', '5');
            elem.setAttribute('stroke', 'red'); // 高亮时边框变成红色
        });
        selectedElement.classList.add('selected');

        updateDisplayedValues();
    }
}

function deselectAll() {
    const allShapes = rightPanel.querySelectorAll('.draggable');
    allShapes.forEach(shape => {
        shape.classList.remove('selected');
        const shapeElements = shape.querySelectorAll('circle, rect, polygon, ellipse, line');
        shapeElements.forEach(elem => {
            elem.setAttribute('stroke-width', '1');
            if (elem.tagName === 'line') {
                // 保持原横线颜色
                const originalStroke = elem.getAttribute('data-original-stroke');
                elem.setAttribute('stroke', originalStroke || 'black'); // 如果没有保存则为黑色
            } else {
                elem.setAttribute('stroke', 'black'); // 恢复其他元素的边框颜色
            }
        });
    });

    // 处理左侧的形状（如果需要）
    shapes.forEach(shape => {
        const svg = shape.querySelector('svg');
        if (svg) {
            const shapeElements = svg.querySelectorAll('circle, rect, polygon, ellipse, line');
            shapeElements.forEach(elem => {
                if (['circle', 'rect', 'polygon', 'ellipse'].includes(elem.tagName)) {
                    elem.setAttribute('fill', 'none');
                }
                elem.setAttribute('stroke', 'black'); // 恢复边框颜色
            });
        }
    });

    selectedElement = null;
}
document.addEventListener('click', function(event) {
    if (event.target === rightPanel || event.target === leftPanel) {
        deselectAll();
    }
});

document.getElementById('rotate').addEventListener('click', () => {
    if (selectedElement) {
        const inputRotation = prompt("请输入旋转角度（0-360）：", rotationSlider.value);
        if (inputRotation !== null && !isNaN(inputRotation)) {
            rotationSlider.value = inputRotation;
            document.getElementById('rotation-value').textContent = `${inputRotation}°`;
            updateTransform();
        }
    } else {
        alert('请先选择一个图形！');
    }
});

document.getElementById('resize').addEventListener('click', () => {
    if (selectedElement) {
        const scale = prompt('请输入缩放比例（如1.0为原始大小）：', sizeSlider.value);
        if (scale !== null && !isNaN(scale)) {
            sizeSlider.value = scale;
            inputSize.value = scale;
            updateTransform();
        }
    } else {
        alert('请先选择一个图形！');
    }
});

rotationSlider.addEventListener('input', () => {
    if (selectedElement) {
        inputRotation.value = rotationSlider.value;
        const rotation = rotationSlider.value;
        document.getElementById('rotation-value').textContent = `${rotation}°`;
        updateTransform();
    }
});

sizeSlider.addEventListener('input', () => {
    if (selectedElement) {
        inputSize.value = sizeSlider.value;
        document.getElementById('size-value').textContent = sizeSlider.value;
        updateTransform();
    }
});

colorPicker.addEventListener('input', () => {
    if (selectedElement) {
        const color = colorPicker.value;
        const shapeElements = selectedElement.querySelectorAll('circle, rect, polygon, ellipse, line');
        shapeElements.forEach(elem => {
            if (  elem.getAttribute('fill') !== 'none') {
                elem.setAttribute('stroke', color);
            }

            if ( elem.tagName === 'line'){
                elem.setAttribute('data-original-stroke', elem.getAttribute('stroke')); 
            }
            if (elem.tagName !== 'line') {
                elem.setAttribute('fill', color);
            }
        });
        
    }
});

function updateTransform() {
    if (!selectedElement) return;

    const rotation = rotationSlider.value;
    const scale = sizeSlider.value;
    selectedElement.style.transform = `rotate(${rotation}deg) scale(${scale})`;
}

function getRotation(element) {
    const transform = getComputedStyle(element).transform;
    if (transform === 'none') return 0;
    const values = transform.split('(')[1].split(')')[0].split(',');
    const a = values[0];
    const b = values[1];
    return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

function getScale(element) {
    const transform = getComputedStyle(element).transform;
    if (transform === 'none') return 1;
    const values = transform.split('(')[1].split(')')[0].split(',');
    return Math.sqrt(values[0] * values[0] + values[1] * values[1]);
}

let startX, startY, initialLeft, initialTop;

function startDrag(event) {
    if (!event.target.closest('svg')) return;
    selectedElement = event.target.closest('svg');
    if (selectedElement) {
        event.preventDefault();
        selectedElement.classList.add('dragging');
        const rect = selectedElement.getBoundingClientRect();
        startX = event.clientX;
        startY = event.clientY;
        initialLeft = parseFloat(selectedElement.style.left || 0);
        initialTop = parseFloat(selectedElement.style.top || 0);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
    }
}

function drag(event) {
    if (!selectedElement) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    selectedElement.style.left = `${initialLeft + dx}px`;
    selectedElement.style.top = `${initialTop + dy}px`;
}

function endDrag() {
    if (selectedElement) {
        selectedElement.classList.remove('dragging');
    }
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
}
canvas.addEventListener('click', function(event) {
    // Deselect all shapes and text when clicking on canvas background
    deselectAll();
    deselectText();
});

document.addEventListener('DOMContentLoaded', function() {
    const addTextBtn = document.getElementById('add-text-btn');
    const textColorPicker = document.getElementById('text-color-picker');
    const textSizeInput = document.getElementById('text-size-input');
    const setTextSizeBtn = document.getElementById('set-text-size-btn');
    const textRotationSlider = document.getElementById('text-rotation-slider');
    const rotationDisplay = document.getElementById('rotation-display');
    const rightPanel = document.getElementById('right-panel');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const controlsTabBtns = document.querySelectorAll('.tab-btn');

    let selectedText = null;
    let textMode = false;

    // Toggle text mode on button click
    addTextBtn.addEventListener('click', function () {
        // Toggle the text mode
        
        // Show or hide the active state of the button
        addTextBtn.classList.toggle('active', textMode);
        textMode = !textMode; 
        
    });

    // Handle clicking on the right panel or canvas
    rightPanel.addEventListener('click', function(event) {
        if (textMode) {
            const userText = prompt('请输入文本:');
            if (userText) {
                const textElement = createTextElement(userText, event);
                rightPanel.appendChild(textElement);
                textMode = false;
                addTextBtn.classList.remove('active');
            }
        } else {
            // Default click behaviour to deselect
            if (event.target === rightPanel || event.target === canvas) { 
                deselectAll();
                deselectText();
            }
        }
        if (event.target.classList.contains('text-element')) {
            selectText(event.target);
        } else {
            deselectText(); // Click anywhere else to deselect
        }
    });

    // Function to create a text element at clicked position
    function createTextElement(text, event) {
        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.classList.add('text-element');
        textElement.style.position = 'absolute';
        const rect = rightPanel.getBoundingClientRect();
        const offsetX = event.clientX - rect.left + rightPanel.scrollLeft;
        const offsetY = event.clientY - rect.top + rightPanel.scrollTop;

        textElement.style.left = `${offsetX}px`;
        textElement.style.top = `${offsetY}px`;
        textElement.style.color = textColorPicker.value;
        textElement.style.fontSize = `${textSizeInput.value}px`;
        textElement.style.cursor = 'move';
        textElement.style.zIndex = 1000;

        textElement.addEventListener('mousedown', dragStart);
        return textElement;
    }

    // Drag and drop logic for text elements
    function dragStart(event) {
        if (event.target.classList.contains('text-element')) {
            selectedText = event.target;
            let offsetX = event.clientX - selectedText.offsetLeft;
            let offsetY = event.clientY - selectedText.offsetTop;

            function dragMove(e) {
                selectedText.style.left = `${e.clientX - offsetX}px`;
                selectedText.style.top = `${e.clientY - offsetY}px`;
            }

            function dragEnd() {
                document.removeEventListener('mousemove', dragMove);
                document.removeEventListener('mouseup', dragEnd);
            }

            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);
        }
    }

    function selectText(element) {
        // First, deselect any previously selected text
        deselectText();

        // Then, select the new element
        if (element) {
            selectedText = element;
            selectedText.classList.add('highlight');
            updateRotationSlider();
        }
    }

    function deselectText() {
        // Check if there's currently a highlighted (selected) text element
        if (selectedText) {
            selectedText.classList.remove('highlight');
            selectedText = null;
        }
    }

    // Deselect any selected text
    function deselectAll() {
        if (selectedText) {
            selectedText.classList.remove('highlight');
            selectedText = null;
        }
    }

    // Update the color and size of selected text
    textColorPicker.addEventListener('input', function() {
        if (selectedText) {
            selectedText.style.color = textColorPicker.value;
        }
    });

    setTextSizeBtn.addEventListener('click', function() {
        if (selectedText) {
            selectedText.style.fontSize = `${textSizeInput.value}px`;
        }
    });

    textRotationSlider.addEventListener('input', function() {
        if (selectedText) {
            const rotation = textRotationSlider.value;
            rotationDisplay.textContent = `${rotation}°`;
            selectedText.style.transform = `rotate(${rotation}deg)`;
        }
    });

    // Update rotation slider based on the selected text
    function updateRotationSlider() {
        if (!selectedText) return;
        const currentRotation = getRotation(selectedText);
        textRotationSlider.value = currentRotation;
        rotationDisplay.textContent = `${currentRotation}°`;
    }

    function getRotation(element) {
        const transform = getComputedStyle(element).transform;
        if (transform === 'none') return 0;
        const values = transform.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];
        return Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }
    const toggleTab = (button) => {
        const isActive = button.classList.contains('active');
        controlsTabBtns.forEach(btn => btn.classList.remove('active'));
        if (!isActive) {
            button.classList.add('active');
        }
    };

    tabBtns.forEach(button => {
        button.addEventListener('click', () => toggleTab(button));
    });

    

    const toggleButtonStyle = (button) => {
        const isActive = button.classList.contains('active');
        document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        if (!isActive) {
            button.classList.add('active');
        }
    };

    // Functionality to toggle button styles
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => toggleButtonStyle(button));
    });

    // Example for canvas mode buttons
    const drawBtn = document.getElementById('draw-btn');
    const eraseBtn = document.getElementById('erase-btn');

    let activeMode = null; 

    drawBtn.addEventListener('click', () => setMode('draw', drawBtn));
    eraseBtn.addEventListener('click', () => setMode('erase', eraseBtn));

    function setMode(mode, button) {
        if (activeMode === mode) {
            activeMode = null;
            button.classList.remove('active');
        } else {
            activeMode = mode;
            drawBtn.classList.remove('active');
            eraseBtn.classList.remove('active');
            button.classList.add('active');
        }
    }
});