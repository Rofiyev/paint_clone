window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  const toolsBtn = document.querySelectorAll('.tool');
  const fillColor = document.querySelector('#fill-color');
  const sizeSlider = document.querySelector('#size-slider');
  const colorBtns = document.querySelectorAll('.colors .option');
  const colorPicker = document.querySelector('#color-picker');
  const clearCanvasBtn = document.querySelector('.clear-canvas');
  const saveImageBtn = document.querySelector('.save-img');

  let ctx = canvas.getContext('2d');
  let isDrawing = false;
  let brushWidth = 5;
  let selectedTool = 'brush';
  let prevMouseX;
  let prevMouseY;
  let snapshot;
  let selectedColor = '#000';

  const setCanvasBG = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
  }

  window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBG();
  });


  const startDrawing = e => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  const drowingRectangle = e => {
    !fillColor.checked
      ? ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
      : ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }

  const drawingCircle = e => {
    ctx.beginPath();
    const radius = (Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) + Math.pow(prevMouseY - e.offsetY, 2) / 100);
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
  }

  const drawingTriangle = e => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
  }

  const drawing = e => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    switch (selectedTool) {
      case 'brush':
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        break;
      case 'rectangle':
        drowingRectangle(e);
        break;
      case 'circle':
        drawingCircle(e);
        break;
      case 'triangle':
        drawingTriangle(e);
        break;
      case 'eraser':
        ctx.strokeStyle = '#fff';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        break;
      default:
        break;
    }
  }

  sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value);

  colorBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelector('.options .selected').classList.remove('selected');
      btn.classList.add('selected');
      const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color');
      selectedColor = bgColor;
    })
  });

  colorPicker.addEventListener('change', () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
  });

  clearCanvasBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBG();
  });

  saveImageBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `Rof1yev-Paint-${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
  });

  const stopDrawing = () => { isDrawing = false };

  toolsBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.options .active').classList.remove('active');
      btn.classList.add('active');
      selectedTool = btn.id;
    })
  });


  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('mouseup', stopDrawing)

});