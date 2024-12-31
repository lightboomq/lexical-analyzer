const tableTokens = document.querySelector('ol'); 
const input = document.querySelector('.inputCode'); 
const btn = document.querySelector('.btn') 
const errors = document.querySelector('.listOfErrors')

class Token { 
    constructor( token, name, row, pos, length) { 
        this.token = token;
        this.name = name
        this.row = row;
        this.pos = pos;
        this.length = length;
    }
}

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
    countBorder = 0;
    constructor(code, row = 1, pos = 0, length = 0) {
        this.code = code;
        this.row = row
        this.pos = pos
        this.length = length
    }

    render(tokenList){     
        for(let i=0; i<tokenList.length; i++){ 
            this.createEl(`${tokenList[i].token}: ${tokenList[i].name}`)
            this.createEl(tokenList[i].row)
            this.createEl(tokenList[i].pos)
            this.createEl(tokenList[i].length)
        }
    }
    createEl(token){ 
        this.countBorder++;      
        const el = document.createElement('li');
        if(this.countBorder === 4) {
            el.style.borderRight = '1px solid black';
            this.countBorder = 0;
        }
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
                const rowToken = currentToken === 'new line' ? this.row++ : this.row  
                const lengthToken = result[0].length 
                const token = new Token(currentToken, name, rowToken, this.pos, lengthToken); 
                
                this.tokenList.push(token); 
                
                return this.nextToken(); 
            }
        }
        errors.textContent = `На позиции ${this.pos} обнаружен не существующий токен языка`
        throw new Error(`На позиции ${this.pos} обнаружен не существующий токен языка`)
    }
}

btn.addEventListener('click',()=>{
    tableTokens.textContent = '';
    const code = input.value; 
    const lexer = new Lexer(code) 
    lexer.nextToken() 
})

