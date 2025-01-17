var gridSize = 10;
var generation = 0;
var moving = false;

function initGrid() {
    var displaySize = document.getElementById('grid');
    var grid = getGrid();
    displaySize.appendChild(grid);
    updateGeneration(0);
}

function start() {
    if (!moving) {
        moving = true;
        generationCount(1);
        setTimeout(tick, 200);
    }
}

function stop() {
    moving = false;
}

function changeGridSize(selectSize) {
    if (moving) {
        reset();
    }

    var num = parseInt(selectSize.value);
    gridSize = num;
    cleanGameElem();
    var grid = getGrid();
    var displaySize = document.getElementById('grid');
    displaySize.appendChild(grid);
    updateGeneration(0);
}

function cleanGameElem() {
    var displaySize = document.getElementById('grid');
    while (displaySize.hasChildNodes()) {
        displaySize.removeChild(displaySize.lastChild);
    }
}

function tick() {
    if (moving) {
        generationCount(1);
        setTimeout(tick, 200);
    }
}

function getTdElem(name) {
    var tdElem = document.createElement('td');
    tdElem.setAttribute('id', name);
    tdElem.setAttribute('onclick', 'changeCellState(this)')
    tdElem.style.height = (500 / gridSize) + 'px';
    tdElem.style.width = (500 / gridSize) + 'px';
    return tdElem;
}

function getTrElem(name) {
    var trElem = document.createElement('tr');
    trElem.setAttribute('id', name);
    return trElem;
}

function getGrid() {
    var grid = document.createElement('grid');
    grid.setAttribute('id', 'game_grid');
    for (var i = 0; i < gridSize; i++) {
        var rowName = 'tr_' + i;
        var tr = getTrElem(rowName);
        for (var j = 0; j < gridSize; j++) {
            var tdName = 'td_' + i + '_' + j;
            var td = getTdElem(tdName);
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
    return grid;
}

function changeCellState(td) {
    var background = td.style.background;
    if (background === 'black') {
        td.style.background = '#DCDCDC';
    } else {
        td.style.background = 'black';
    }
    updateGeneration(calculatePopulation(document.getElementsByTagName('td')));
}

function topLeftCell(row, column, cellState) {
    if (row - 1 > -1) {
        if (column - 1 > -1) {
            return cellState[row - 1][column - 1];
        }
    }
    return 0;
}

function topCell(row, column, cellState) {
    if (row - 1 > -1) {
        return cellState[row - 1][column];
    }
    return 0;
}

function topRightCell(row, column, cellState) {
    if (row - 1 > -1) {
        if (column + 1 < gridSize) {
            return cellState[row - 1][column + 1];
        }
    }
    return 0;
}

function sideRightCell(row, column, cellState) {
    if (column + 1 < gridSize) {
        return cellState[row][column + 1];
    }
    return 0;
}

function bottomRightCell(row, column, cellState) {
    if (row + 1 < gridSize) {
        if (column + 1 < gridSize) {
            return cellState[row + 1][column + 1];
        }
    }
    return 0;
}

function bottomCell(row, column, cellState) {
    if (row + 1 < gridSize) {
        return cellState[row + 1][column];
    }
    return 0;
}

function bottomLeftCell(row, column, cellState) {
    if (row + 1 < gridSize) {
        if (column - 1 > -1) {
            return cellState[row + 1][column - 1];
        }
    }
    return 0;
}

function sideLeftCell(row, column, cellState) {
    if (column - 1 > -1) {
        return cellState[row][column - 1];
    }
    return 0;
}

function checkNeigbors(row, column, cellState) {
    var count = 0;
    count += topLeftCell(row, column, cellState);
    count += topCell(row, column, cellState);
    count += topRightCell(row, column, cellState);
    count += sideRightCell(row, column, cellState);
    count += bottomRightCell(row, column, cellState);
    count += bottomCell(row, column, cellState);
    count += bottomLeftCell(row, column, cellState);
    count += sideLeftCell(row, column, cellState);
    return count;
}

function generationCount(skipCount) {
    var cellState = new Array(gridSize);
    for (var i = 0; i < gridSize; i++) {
        cellState[i] = new Array(gridSize);
        for (var j = 0; j < gridSize; j++) {
            cellState[i][j] = 0;
        }
    }

    var tdList = document.getElementsByTagName('td');
    for (var i = 0; i < tdList.length; i++) {
        var td = tdList[i];
        var id = td.getAttribute('id');
        var idSplit = id.split('_');
        var row = parseInt(idSplit[1]);
        var column = parseInt(idSplit[2]);

        var background = td.style.background;
        if (background === 'black') {
            cellState[row][column] = 1;
        }
    }

    for (var i = 0; i < tdList.length; i++) {
        var td = tdList[i];
        var id = td.getAttribute('id');
        var idSplit = id.split('_');
        var row = parseInt(idSplit[1]);
        var column = parseInt(idSplit[2]);

        var neighborCount = checkNeigbors(row, column, cellState);
        var background = td.style.background;
        if (background == 'black' && neighborCount < 2) {
            td.style.background = '#DCDCDC';
        } else if (background == 'black' && neighborCount > 3) {
            td.style.background = '#DCDCDC';
        } else if (background != 'black' && neighborCount == 3) {
            td.style.background = 'black';
        }
    }

    generation++;
    skipCount--;
    if (skipCount > 0) {
        generationCount(skipCount);
    } else {
        var numLive = calculatePopulation(tdList);
        if (numLive == 0 & moving)
            moving = false;
        updateGeneration(numLive);
    }
}

function randomPopulation() {
    var randPop = Math.random() * (gridSize * gridSize);
    reset();
    for (var i = 0; i < randPop; i++) {
        var x = Math.floor(Math.random() * gridSize);
        var y = Math.floor(Math.random() * gridSize);

        var tdElem = document.getElementById('td_' + x + '_' + y);
        var background = tdElem.style.background;
        if (background === 'black') {
            i--;
        } else {
            tdElem.style.background = 'black';
        }
    }
    updateGeneration(calculatePopulation(document.getElementsByTagName('td')));
}

function reset() {
    moving = false;
    var tdList = document.getElementsByTagName('td');
    for (var i = 0; i < tdList.length; i++) {
        var td = tdList[i];
        td.style.background = '#DCDCDC';
    }
    generation = 0;
    updateGeneration(0);
}

function calculatePopulation(tdList) {
    var liveCount = 0;
    for (var i = 0; i < tdList.length; i++) {
        var td = tdList[i];
        var background = td.style.background;
        if (background === 'black')
            liveCount++;
    }
    return liveCount;
}

function updateGeneration(count) {
    var gen = document.getElementById('generationDisplay');
    gen.innerHTML = "Generation: " + generation;
}