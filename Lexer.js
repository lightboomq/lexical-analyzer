const tableTokens = document.querySelector('.tableTokens');


const code = `class{
    let a = 0;
}
`

class Token {
    constructor( text,  row, pos, length) {
        this.text = text;
        this.row = row;
        this.pos = pos;
        this.length = length;
    }
}


const tokenTypesList = [
    {text: 'const' , regex: '^const'},
    {text: 'let' , regex: '^let'},
    {text: 'class' , regex: '^class'}
]



export default class Lexer {
    tokenList = [];

    constructor(code, row = 1, pos = 0, length = 0) {
        this.code = code;
        this.row = row
        this.pos = pos
        this.length = length
    }

    render(tokenList){
        for(let i=0; i<tokenList.length; i++){
            const token = document.createElement('div');
            token.style.textAlign = 'center'
            token.textContent = tokenList[i].text
            tableTokens.appendChild(token)

            const row = document.createElement('div');
            row.style.textAlign = 'center'
            row.textContent = tokenList[i].row
            tableTokens.appendChild(row)

            const pos = document.createElement('div');
            pos.style.textAlign = 'center'
            pos.textContent = tokenList[i].pos
            tableTokens.appendChild(pos)

            const length = document.createElement('div');
            length.style.textAlign = 'center'
            length.textContent = tokenList[i].length
            tableTokens.appendChild(length)
        }
        return this.tokenList
    }

    lexAnalysis(){
        while (this.nextToken()) {}
        this.tokenList = this.tokenList.filter(item => item.text !== '\n'  && item.text !== ' ');
        return this.render(this.tokenList);
    }

    nextToken(){   
        if (this.pos >= this.code.length) return

        const tokenTypesValues = Object.values(tokenTypesList)
        
        for (let i = 0; i < tokenTypesValues.length; i++) {      
            const regex = new RegExp(tokenTypesValues[i].regex);
            const result = this.code.slice(this.pos).match(regex);          
            if(result && result[0]) {
                const row = result[0] === '\n' ? this.row++ : this.row
                const length = result[0].length
                const token = new Token(result[0], row, this.pos, length);
                this.pos += result[0].length;
                this.tokenList.push(token);
                
                return true;
            }
        }
        throw new Error(`На позиции ${this.pos} обнаружена ошибка`)
    }
}


const lexer = new Lexer(code);
lexer.lexAnalysis()


























// class TokenType {
//     constructor(name, regex) {
//         this.name = name;
//         this.regex = regex;
//     }
// }

// const tokenTypesList = {
//     'NUMBER': new TokenType('NUMBER', '^[0-9]*'),
//     'CONST': new TokenType('const', '^const'),
//     'LET': new TokenType('let', '^let'),
//     'CYCLE': new TokenType('for', '^for'),
//     'CLASS': new TokenType('class','^class'),
//     'FUNCTION': new TokenType('function', '^function'),
//     '.': new TokenType('.', '^\\.'),
//     ':': new TokenType(':', '^:'),
//     'CYCLE': new TokenType('while', '^while'),
//     'SEMICOLON': new TokenType('SEMICOLON', '^;'),
//     'SPACE': new TokenType('SPACE', '^[ \\n\\t\\r]'),
//     'ASSIGN': new TokenType('ASSIGN', '^='),
//     'LPAR': new TokenType('(', '^\\('),
//     'RPAR': new TokenType(')', '^\\)'),
//     'LBRACE': new TokenType('{', '^\\{'),
//     'RBRACE': new TokenType('}', '^\\}'),
//     'IDENT': new TokenType('ident', '^[a-z]*'),
// }










console.log = function(message) {
    if (message.includes('Five Server')) {
      return; // Игнорируем сообщения, содержащие 'Five Server'
    }
    console.log.apply(console, arguments); // Выводим остальные сообщения
  };
  console.log("[Five Server] connecting...");  
  
  
