
            const rows = 6;
            const cols = 7;
            const history = [];
            let playerWin = false
            const listPlayers = [
                { name: 'Player 1', value: "X" },
                { name: 'Player 2', value: "O" }
            ];

            const currentGame = []

            var currentPlayer = listPlayers[0];

            const validCell = (row, column) => {
                const table = document.getElementById('tableMain')
                const rowsTable = table.rows
                const cell = rowsTable[row]?.cells[column] || null;
                if (!cell || cell?.childNodes?.length == 0) return null;
                const element = cell.childNodes[0]

                return element.tagName == "DIV" ? element : null
            }
            const winDiagonalLeft = () => {
                 for (let colSelected = 0; colSelected < cols; colSelected++) {
                    for (let rowSelected = 0; rowSelected < rows; rowSelected++) {
                        let merge = 0
                        for (let cellSelected = 0; cellSelected < 4; cellSelected++) {
                            const infoCell = validCell(rowSelected + cellSelected, colSelected - cellSelected)
                            if (infoCell != null && infoCell?.classList.contains(`value-${currentPlayer.value}`)) {
                                merge++
                                if (merge == 4) {
                                    playerWin = true
                                    break
                                }
                            }
                        }
                        if (playerWin) break
                    }
                    if (playerWin) break
                }
            }

            const winDiagonalRight = () => {
                
                for (let colSelected = 0; colSelected < cols; colSelected++) {
                    for (let rowSelected = 0; rowSelected < rows; rowSelected++) {
                        let merge = 0
                        for (let cellSelected = 0; cellSelected < 4; cellSelected++) {
                            const infoCell = validCell(rowSelected + cellSelected, colSelected + cellSelected)
                            if (infoCell != null && infoCell?.classList.contains(`value-${currentPlayer.value}`)) {
                                merge++
                                if (merge == 4) {
                                    playerWin = true
                                    break
                                }
                            }

                        }
                        if (playerWin) break
                    }
                    if (playerWin) break
                }
            }

            const winVertical = () => {
                for (let colSelected = 0; colSelected < cols; colSelected++) {
                    let merge = 0
                    for (let rowSelected = 0; rowSelected < rows; rowSelected++) {
                        merge = 0
                        for (let cellSelected = 0; cellSelected < 4; cellSelected++) {
                            const infoCell = validCell(rowSelected + cellSelected, colSelected)

                            if (infoCell != null && infoCell?.classList.contains(`value-${currentPlayer.value}`)) {
                                merge++
                                if (merge == 4) {
                                    playerWin = true
                                    break
                                }
                            }
                        }
                        if (playerWin) break
                    }
                    if (playerWin) break
                }
            }

            const winHorizont = () => {
        
                for (let rowSelected = 0; rowSelected < rows; rowSelected++) { //Recorrido de filas
                    let merge = 0;
                    for (let colSelected = 0; colSelected < cols; colSelected++) { //Recorrido de columnas
                        merge = 0
                        for (let numberValid = 0; numberValid < 4; numberValid++) { //Recorrido de las 4 columnas

                            const infoCell = validCell(rowSelected, colSelected + numberValid)
                            if (infoCell != null && infoCell?.classList.contains(`value-${currentPlayer.value}`)) {
                                merge++;
                                if (merge == 4) {
                                    playerWin = true
                                    break
                                }
                            }
                        }
                        if (playerWin) break;
                    }
                    if (playerWin) break
                }


            }


            const selectCell = (event) => {

                if (playerWin) {
                    return
                }

                const table = document.getElementById('tableMain');
                const rows = table.rows;
                const cols = rows[0].cells;
                const cellIndex = event.target.cellIndex;
                let validChangePlayer = false;

                for (let rowSelected = rows.length - 1; rowSelected >= 0; rowSelected--) {
                    let exit = false
                    for (let colSelected = cols.length - 1; colSelected >= 0; colSelected--) {
                        const existDiv = rows[rowSelected].cells[colSelected].querySelector('div');

                        const isEmpty = existDiv?.classList?.contains('value-empty')

                        if (isEmpty && colSelected == cellIndex) {
                            exit = true
                            validChangePlayer = true
                            addTab(rowSelected, colSelected);
                            break;
                        }
                    }

                    if (exit) {
                        break;
                    }
                }
            }

            const reloadDescription = () => {
                const headerGame = document.getElementById('headerGame');
                const textDescription = document.getElementById('text-description');
                if (textDescription) {
                    textDescription.remove();
                }
                const elementDescription = generateDescription()
                headerGame.innerHTML += elementDescription;
            }
            const validWinPlayer = () => {
                const table = document.getElementById('tableMain');
                table.style.disable = true;
                table.classList.add('disable');
                reloadDescription()
            }

            const deleteTabEmpty = (row, column) => {
                const table = document.getElementById('tableMain');
                const rows = table.rows;
                const cell = rows[row].cells[column];
                const div = cell.querySelector('div');
                if (div) {
                    div.remove();
                }
            }

            const addTab = (row, column) => {

                deleteTabEmpty(row, column)
                const table = document.getElementById('tableMain');
                const rows = table.rows;

                const tab = document.createElement('div');
                //Se crea el evento click para que no cuando se presione el circulo aun tenga funcionalidad
                tab.addEventListener('click', (event) => {
                    const cell = event.target.closest('td');
                    if (cell) {
                        cell.click();
                    }
                    selectCell(event);
                })
                tab.classList.add('tab-game');
                tab.classList.add(`value-${currentPlayer.value}`);
                rows[row].cells[column].appendChild(tab);

                winHorizont();
                winVertical();
                winDiagonalLeft();
                winDiagonalRight();

                if (playerWin) {
                    validWinPlayer();

                } else {
                    changePlayer()
                }

            }

            const changePlayer = () => {
                currentPlayer = currentPlayer === listPlayers[0] ? listPlayers[1] : listPlayers[0];
                const elementPlayer = document.getElementById('currentPlayer');
                elementPlayer.textContent = currentPlayer.name;
            };

            const resetGame = () => {

                const cells = document.querySelectorAll('.cell');
                cells.forEach(cell => {
                    cell.textContent = '';
                });
                const elementPlayer = document.getElementById('currentPlayer');
                elementPlayer.textContent = listPlayers[0].name;
                history.length = 0; // Limpiar el historial

                const table = document.getElementById('tableMain');
                if(table) {
                    table.remove();
                }
                //table.classList.remove('disable');
                playerWin = false;


                reloadDescription()
                generateTableGame()
            };
            const generateDescription = () => {
                let element = ''
                if (playerWin) {
                    element = `<h5 id="text-description" class="text-success">El jugador <strong id="currentPlayer">${currentPlayer.name}</strong> ha ganado!</h5>`;
                }
                else {

                    element = `<h5 id="text-description">Es turno de : <strong id="currentPlayer">${currentPlayer.name}</strong></h5>`;
                }
                return element

            }

            const generateTableGame = async () => {
                const container = document.getElementById('tableGame');

                if (!container) {
                    console.error("El elemento con id 'tableGame' no existe.");
                    return;
                }

                const table = document.createElement('table');
                table.id = 'tableMain';
                const tbody = document.createElement('tbody');


                for (let currentRow = 0; currentRow < rows; currentRow++) {
                    const row = document.createElement('tr');
                    for (let currentColumn = 0; currentColumn < cols; currentColumn++) {
                        const cell = document.createElement('td');
                        cell.classList.add('cell');
                        cell.dataset.row = currentRow;
                        cell.dataset.col = currentColumn;

                        const emptyTab = document.createElement('div');
                        emptyTab.classList.add('tab-game');
                        emptyTab.classList.add('value-empty');
                        emptyTab.addEventListener('click', function () {

                            const cell = event.target.closest('td');
                            if (cell) {
                                cell.click();
                            }

                            selectCell(event);
                        });
                        cell.appendChild(emptyTab);


                        cell.addEventListener("click", function () {

                            selectCell(event);

                        });
                        row.appendChild(cell);
                    }
                    tbody.appendChild(row);
                }

                table.appendChild(tbody);
                container.appendChild(table);

                table.addEventListener('mouseover', function (e) {
                    if (e.target.tagName === 'TD' ) {
                        const colIndex = e.target.cellIndex;
                        const rows = table.rows;

                        for (let rowSelected = 0; rowSelected < rows.length; rowSelected++) {
                            rows[rowSelected].cells[colIndex].classList.add('highlighted-column');
                        }
                    }
                });

                table.addEventListener('mouseout', function (e) {
                    if (e.target.tagName === 'TD') {
                        const colIndex = e.target.cellIndex;
                        const rows = table.rows;

                        for (let rowSelected = 0; rowSelected < rows.length; rowSelected++) {
                            rows[rowSelected].cells[colIndex].classList.remove('highlighted-column');
                        }
                    }
                });

                reloadDescription()


            }

            document.addEventListener("DOMContentLoaded", function () {
                generateTableGame();
            });


