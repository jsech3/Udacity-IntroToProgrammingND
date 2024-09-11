document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('colorPicker');
    const sizePicker = document.getElementById('sizePicker');
    const pixelCanvas = document.getElementById('pixelCanvas');
    const inputHeight = document.getElementById('inputHeight');
    const inputWidth = document.getElementById('inputWidth');
    const resetButton = document.getElementById('resetButton');

    const mainHeading = document.getElementById('mainHeading');
    const chooseGridSizeHeading = document.getElementById('chooseGridSizeHeading');
    const pickColorHeading = document.getElementById('pickColorHeading');

    function addHeadingColorListener(headingElement) {
        if (headingElement) {
            headingElement.addEventListener('click', function() {
                headingElement.style.color = colorPicker.value;
            });
        } else {
            console.warn('Heading element not found');
        }
    }

    addHeadingColorListener(mainHeading);
    addHeadingColorListener(chooseGridSizeHeading);
    addHeadingColorListener(pickColorHeading);

    sizePicker.addEventListener('submit', function(event) {
        event.preventDefault();
        makeGrid();
    });

    resetButton.addEventListener('click', function() {
        resetCanvas();
    });

    function makeGrid() {
        console.log('makeGrid() called');
        pixelCanvas.innerHTML = '';

        const height = parseInt(inputHeight.value);
        const width = parseInt(inputWidth.value);

        if (isNaN(height) || isNaN(width) || height < 1 || width < 1) {
            alert('Please enter valid grid dimensions (minimum 1)');
            return;
        }

        for (let i = 0; i < height; i++) {
            const row = pixelCanvas.insertRow(i);
            for (let j = 0; j < width; j++) {
                const cell = row.insertCell(j);
                cell.style.border = '1px solid #000';
                cell.style.width = '20px';
                cell.style.height = '20px';
                cell.addEventListener('click', function() {
                    cell.style.backgroundColor = colorPicker.value;
                });
            }
        }
    }

    function resetCanvas() {
        console.log('resetCanvas() called');
        pixelCanvas.innerHTML = '';
    }
});
