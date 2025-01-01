const tableTokens = document.querySelector('ol'); 
const input = document.querySelector('.input'); 
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
            this.createEl(`${tokenList[i].token}: `,  `${tokenList[i].name}`,tokenList[i].pos)
            this.createEl(tokenList[i].row)
            this.createEl(tokenList[i].pos)
            this.createEl(tokenList[i].length)
        }
    }
    createEl(token,tokenName,pos){ 
          
        const li = document.createElement('li');
        li.classList.add('row');
        this.countBorder++;
        if(this.countBorder === 4) {
            li.style.borderRight = '1px solid black';
            this.countBorder = 0;
        }    
        if(tokenName){
            const span = document.createElement('span');
            li.setAttribute('pos', pos)
            span.textContent = tokenName
            li.textContent = token;
            li.appendChild(span);
        }
        else{
            li.textContent = token;
        }
     
        tableTokens.appendChild(li);
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
            
            if(result !== null) { 
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
    const code = input.textContent; 
    console.log(code)
    const lexer = new Lexer(code) 
    lexer.nextToken() 
})


// const lexer = new Lexer(`for(i=0;i++) for(j=1;j--)`)

// lexer.nextToken()

tableTokens.addEventListener('click', (e)=>{
    const li = e.target;
    if(li.tagName !== 'LI') return;
    console.log(li)
    const span = li.querySelector('span');
    const selectedToken = span.textContent;
    const posToken = Number(span.getAttribute('pos'));

    const code = input.textContent
    
    highlightToken(code,selectedToken,posToken);
})


function highlightToken(code,selectedToken,posToken) {
    const span = `<span class='highlight'>${selectedToken}</span>`;
    const updateInput = code.slice(0, posToken-selectedToken.length) + span + code.slice(posToken,)                    
    input.innerHTML = updateInput
}











