class chess_board {
    constructor() {
        this.even_color = '#769656';
        this.not_even_color = '#EEEED2';
        this.desk_fields = document.querySelector('.desk');
    }

    paint_fields_in_chess_order() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let isEvenRow = i % 2 !== 0;
                let isEvenCol = j % 2 === 0;

                if (isEvenRow && isEvenCol || !isEvenRow && !isEvenCol) {
                    this.desk_fields.children[i].children[j].style.background = this.even_color;
                    this.desk_fields.children[i].children[j].style.color = this.not_even_color;
                } else {
                    this.desk_fields.children[i].children[j].style.background = this.not_even_color;
                    this.desk_fields.children[i].children[j].style.color = this.even_color;
                }
            }
        }
    }
    make_numeration_for_fields() {
        let count = 8;
        for (let i = 0; i < 8; i++) {
            let number = document.createElement('p');
            number.classList = 'number';
            number.innerHTML = `${count}`;
            this.desk_fields.children[0].children[i].append(number);
            count--;
        }
    }
    make_numeration_for_lets() {
        let count = 0;
        for (let i = 0; i < 8; i++) {
            let symbol = document.createElement('p');
            symbol.classList = 'symbol';
            symbol.innerHTML = `${String.fromCharCode(count + 97)}`;
            this.desk_fields.children[i].children[7].append(symbol);
            count++;
        }
    }
}

const board = new chess_board();
board.paint_fields_in_chess_order();
board.make_numeration_for_fields();
board.make_numeration_for_lets();