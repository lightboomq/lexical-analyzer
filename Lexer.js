const tableTokens = document.querySelector('.tableTokens'); 
const input = document.querySelector('.inputCode'); 
const btn = document.querySelector('.btn') 


class Token { 
    constructor( token, name, row, pos, length) { 
        this.token = token;
        this.name = name
        this.row = row;
        this.pos = pos;
        this.length = length;
    }
}

console.log()
const typeList = [ 
    {token: 'new line' , regex: '^[\\n]'},
    {token: 'space' , regex: '^[\\s]'},
    {token: 'keyword' , regex: `^(map|filter|break|case|catch|class|constructor|const|continue|debugger|default|delete|do|else|export|extends|finally|for
                                 |function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|for|while|width|yield)`},
    {token:'literal', regex: '^(\\d{1,}|null|undefined|true|false)'},
    {token:'aritmetic operator', regex: '^(\\+|-|\\*|\\/|%)'},
    {token:'assignment operator', regex: '^(=|\\+=|-=|\\*=|\\/=)'},
    {token:'logical operator', regex: '^(&&|!|\\|\\|)'},
    {token:'compare operator', regex: '^(==|===|!=|<|>|<=|>=)'},
    {token:'punctuation', regex: '^(,|;|\\(|\\)|\\{|\\}|\\[|\\]|:|\\.)'},
    {token:'template literals', regex: '^${'},
    {token:'ident', regex: '^\\w{1,}'},
]

class Lexer {
    tokenList = []; 
    
    constructor(code, row = 1, pos = 0, length = 0) {
        this.code = code;
        this.row = row
        this.pos = pos
        this.length = length
    }

    render(tokenList){     
        for(let i=0; i<tokenList.length; i++){ 
            this.createEl(`${tokenList[i].token}: ${tokenList[i].name}`, i)
            this.createEl(tokenList[i].row, i)
            this.createEl(tokenList[i].pos, i)
            this.createEl(tokenList[i].length, i)
        }
    }
    createEl(token, i){       
        const el = document.createElement('div');
        if(i % 1=== 0 ) el.style.borderRight = '0px solid black';
        el.classList.add('row');
        el.textContent = token;
        tableTokens.appendChild(el);
    }
    
    nextToken(){  
        if (this.pos >= this.code.length){ 
            this.tokenList = this.tokenList.filter(item => item.token !== 'space' && item.token !== 'new line' && item.text !== ' ') 
            return this.render(this.tokenList); 
        } 

        for (let i = 0; i < typeList.length; i++) {   
            const currentRegex = new RegExp(typeList[i].regex); 
            const currentToken = typeList[i].token 
            const currentStr = this.code.slice(this.pos)  
            const result = currentStr.match(currentRegex); 
            
            if(result && result[0]) { 
                this.pos += result[0].length; 
                const name = result[0]; 
                const rowToken = currentToken === 'new-line' ? this.row++ : this.row  
                const lengthToken = result[0].length 
                const token = new Token(currentToken, name, rowToken, this.pos, lengthToken); 
                
                this.tokenList.push(token); 
                
                return this.nextToken(); 
            }
        }
        throw new Error(`На позиции ${this.pos} обнаружена ошибка`) 
    }
}



btn.addEventListener('click',()=>{ 
    const code = input.value; 
    const lexer = new Lexer(code) 
    lexer.nextToken() 
})

const lexer = new Lexer('for{let i = 0; i<20; i++') 
lexer.nextToken() 






// const typeList = {
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




// class TokenType {
//     constructor(name, regex) {
//         this.name = name;
//         this.regex = regex;
//     }
// }

// const typeList = {
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










  
  
  
