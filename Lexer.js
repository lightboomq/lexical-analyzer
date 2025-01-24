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
    {token:'compare operator', regex: '^(==|===|!=|<|>|<=|>=)'},
    {token: 'new line' , regex: '^[\\n]'},
    {token: 'space' , regex: '^[\\s]'},
    {token: 'keyword' , regex: `^(map|filter|break|case|catch|class|constructor|const|continue|debugger|default|delete|do|else|export|extends|finally|for
                                 |function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|for|while|width|yield|console|log)`},
    {token:'literal', regex: '^(\\d{1,}|null|undefined|true|false|`)'},
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
            this.createEl(`${tokenList[i].token}: `, `${tokenList[i].name}`, tokenList[i].pos)
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
            const spanTokenName = document.createElement('span');
            spanTokenName.classList.add('spanTokenName')
            spanTokenName.setAttribute('pos', pos)
            spanTokenName.textContent = tokenName

            li.textContent = token
            li.appendChild(spanTokenName)            
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
            const currentToken = typeList[i].token;
            let currentStr = this.code.slice(this.pos); 
        
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
    }
}

btn.addEventListener('click',()=>{
    tableTokens.textContent = '';
    errors.textContent = 'Ошибки...';

    let code = input.innerHTML; 
    code = getReplacedHtmlMarkup(code)
   
    const lexer = new Lexer(code) 
    lexer.nextToken() 
})

tableTokens.addEventListener('click', (e)=>{
    if(e.target.tagName !== 'SPAN') return

    const spanTokenName = e.target;
    const selectedToken = spanTokenName.textContent;
    const posToken = Number(spanTokenName.getAttribute('pos'));

    let code = input.innerHTML; 
    code = getReplacedHtmlMarkup(code);
   
    getHighlightToken(code,selectedToken,posToken);
})


function getReplacedHtmlMarkup(code){
    let updateCode;
    updateCode = code.replace(/<div>/g, '\n').replace(/<\/div>/g, '');
    updateCode = code.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
    updateCode = code.replace(/&gt;/g,'>')
    updateCode = code.replace(/&lt;/g,'<')

    return updateCode;
} 

function getHighlightToken(code,selectedToken,posToken) {
    const span = `<span class='highlight'>${selectedToken}</span>`;
    let updateInput = code.slice(0, posToken-selectedToken.length) + span + code.slice(posToken,);  
    updateInput = getReplacedHtmlMarkup(updateInput)
    
    input.innerHTML = updateInput; 
}






