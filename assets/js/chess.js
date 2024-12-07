class chess_pieces {
    constructor() {
        this.desk = document.querySelector('.desk');

        this.pawns = [];
        this.kings = [];
        this.queens = [];
        this.bishops = [];
        this.knights = [];
        this.rocks = [];
        this.figures_classnames = [this.pawns, this.kings, this.queens, this.bishops, this.knights, this.rocks];
        this.arr_availableMoves = [];

        this.commandMove = 'white';

        this.figures_lst = ['kings', 'rocks', 'bishops', 'knights', 'queens', 'pawns'];

    }

    init_pieces() {
        for (let [piece, position] of [['pawn', '01234567'], ['king', '4'], ['queen', '3'], ['bishop', '25'], ['knight', '16'], ['rock', '07']]) {
            for (let pos of position) {
                let variableName = `white${piece}${pos}`;
                let arrayName = `${piece}s`;
                this[variableName] = document.createElement('img');
                this[variableName].classList.add(`${piece}_white`);
                this[variableName].src = `assets/media/white/${piece}.svg`;
                if (piece != 'pawn') {
                    this.desk.children[pos].children[7].append(this[variableName]);
                    this[arrayName].push(this[variableName]);
                } else {
                    this.desk.children[pos].children[6].append(this[variableName]);
                    let field = this.desk.children[pos].children[6];
                    this.pawns.push(field.children[field.children.length - 1]);
                }
            }
            for (let pos of position) {
                let variableName = `black${piece}${pos}`;
                let arrayName = `${piece}s`;
                this[variableName] = document.createElement('img');
                this[variableName].classList.add(`${piece}_black`);
                this[variableName].src = `assets/media/black/${piece}.svg`;
                if (piece != 'pawn') {
                    this.desk.children[pos].children[0].append(this[variableName]);
                    this[arrayName].push(this[variableName]);
                } else {
                    this.desk.children[pos].children[1].append(this[variableName]);
                    let field = this.desk.children[pos].children[1];
                    this.pawns.push(field.children[field.children.length - 1]);
                }
            }
        }
    }
    move_pieces() {
        function removeAvailableMoves() {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    for (let k of this.desk.children[i].children[j].children) {
                        if (k.className.includes('available_move')) {
                            k.remove();
                            this.arr_availableMoves = this.arr_availableMoves.filter((move) => move !== k);
                        }
                    }
                }
            }
        }
        function paint_available_moves(available_moves, figure) {
            removeAvailableMoves.bind(this)();

            for (let move = 0; move < available_moves.length; move++) {
                let x = available_moves[move][0];
                let y = available_moves[move][1];
                let available_move = document.createElement('span');
                available_move.classList = `available_move ${figure}`;
                this.desk.children[x].children[y].append(available_move);
                this.arr_availableMoves.push(available_move);
            }
        }
        function getPieceIndexes(figure) {
            const parent_field = figure.parentElement; // Отец
            const row = parent_field.parentElement; // Дедушка
            const rowIndex = Array.from(row.children).indexOf(parent_field);
            const colIndex = Array.from(this.desk.children).indexOf(row);

            return [rowIndex, colIndex];
        }
        function getPawnAvailableMove(figure) {
            let x = getPieceIndexes.bind(this)(figure)[1];
            let y = getPieceIndexes.bind(this)(figure)[0];
            let avMoves = [];

            if (figure.className.includes('white') && this.commandMove == 'white') {
                for (let i = 0; i < 2; i++) {
                    if (y > 0 && (!figure.className.includes('moved') || i < 1)) {
                        y--;
                        avMoves.push([x, y]);
                    }
                }
            } else if (figure.className.includes('black') && this.commandMove == 'black') {
                for (let i = 0; i < 2; i++) {
                    if (y < 5) {
                        y++;
                    }
                    avMoves.push([x, y]);

                }
            }

            return avMoves;
        }
        function getFigureAvailableMove(figure) {
            let x = getPieceIndexes.bind(this)(figure)[0];
            let y = getPieceIndexes.bind(this)(figure)[1];
            let avMoves = [];
            
            if (figure.className.includes('white') && this.commandMove == 'white') {
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        // console.log(counter);
                        if (isNotBusyField.bind(this)(this.desk.children[i].children[j], this.figures_lst)) {
                            if (canMove.bind(this)(figure, i, j, y, x)) {
                                avMoves.push([i, j]);
                            }
                        }
                    }
                }
            }

            return avMoves;
        }
        function isNotBusyField(figure, figures_lst) {
            const parent_field = figure; // Отец
            return !Array.from(parent_field.children).some((child) => {
                return figures_lst.includes(child.className.split('_')[0] + 's');
            });
        }
        function canMove(figure, i, j, y, x) {
            // Получаем текущие координаты фигуры
            const currentY = y;
            const currentX = x;
        
            // Определяем, может ли фигура двигаться
            switch (figure.className.split('_')[0]) {
                case 'king':
                    return Math.abs(currentY - i) <= 1 && Math.abs(currentX - j) <= 1;
        
                case 'queen':
                    if (i === currentY || j === currentX || Math.abs(currentY - i) === Math.abs(currentX - j)) {
                        return isPathClear.bind(this)(currentY, currentX, i, j);
                    }
                    return false;
        
                case 'bishop':
                    if (Math.abs(currentY - i) === Math.abs(currentX - j)) {
                        return isPathClear.bind(this)(currentY, currentX, i, j);
                    }
                    return false;
        
                case 'knight':
                    return Math.abs(currentY - i) * Math.abs(currentX - j) === 2;
        
                case 'rook':
                    if (i === currentY || j === currentX) {
                        return isPathClear.bind(this)(currentY, currentX, i, j);
                    }
                    return false;
        
                default:
                    return false; // Неизвестная фигура
            }
        }
        function isPathClear(currentY, currentX, targetY, targetX) {
            const stepY = Math.sign(targetY - currentY);
            const stepX = Math.sign(targetX - currentX);
        
            let y = currentY + stepY;
            let x = currentX + stepX;
        
            while (y !== targetY || x !== targetX) {
                if (this.desk.children[y].children[x].children.length > 0) {
                    return false; // Есть фигура на пути
                }
                y += stepY;
                x += stepX;
            }
        
            return true; // Путь свободен
        }
        function replaceFigure(figure, newCords) {
            let [y, x] = [newCords[0], newCords[1]];

            let newFigure = figure.cloneNode(true);
            newFigure.classList.add('moved');
            this.desk.children[x].children[y].append(newFigure);
            this.pawns.push(newFigure);
            figure.remove();
            this.pawns = this.pawns.filter((elem) => elem !== figure);

            if (figure.className.includes('pawn')) {
                newFigure.addEventListener('click', () => {
                    paint_available_moves.bind(this)(getPawnAvailableMove.bind(this)(newFigure), newFigure.className);
                    this.arr_availableMoves.forEach((available_move) => {
                        available_move.addEventListener('click', () => {
                            replaceFigure.bind(this)(newFigure, getPieceIndexes.bind(this)(available_move));
                            removeAvailableMoves.bind(this)();
                        });
                    });
                });
            } else {
                newFigure.addEventListener('click', () => {
                    paint_available_moves.bind(this)(getFigureAvailableMove.bind(this)(newFigure), newFigure.className);
                    this.arr_availableMoves.forEach((available_move) => {
                        available_move.addEventListener('click', () => {
                            replaceFigure.bind(this)(newFigure, getPieceIndexes.bind(this)(available_move));
                            removeAvailableMoves.bind(this)();
                        });
                    });
                });
            }

        }
        
        for (let figures of this.figures_lst) {
            this[figures].forEach((figure) => {
                figure.addEventListener('click', () => {
                    if (figure.className.split('_')[0] == 'pawn') {
                        paint_available_moves.bind(this)(getPawnAvailableMove.bind(this)(figure), figure.className);
                    } else {
                        paint_available_moves.bind(this)(getFigureAvailableMove.bind(this)(figure), figure.className);
                    }
                    this.arr_availableMoves.forEach((available_move) => {
                        available_move.addEventListener('click', () => {
                            replaceFigure.bind(this)(figure, getPieceIndexes.bind(this)(available_move));
                            removeAvailableMoves.bind(this)();
                        });
                    });
                });
            });
        }

    }
}

const chess = new chess_pieces();

chess.init_pieces();
chess.move_pieces();