
import Token from "./Token";
import TokenType, {tokenTypesList} from "./TokenType";
import ExpressionNode from "./AST/ExpressionNode";
import StatementsNode from "./AST/StatementsNode";
import NumberNode from "./AST/NumberNode";
import VariableNode from "./AST/VariableNode";
import BinOperationNode from "./AST/BinOperationNode";
import UnarOperationNode from "./AST/UnarOperationNode";

export default class Parser {
   


    constructor(tokens) {
        this.tokens = tokens;
    }

    match(...expected) {
        if (this.pos < this.tokens.length) {
            const currentToken = this.tokens[this.pos];
            if (expected.find(type => type.name === currentToken.type.name)) {
                this.pos += 1;
                return currentToken;
            }
        }
        return null;
    }

    require(...expected) {
        const token = this.match(...expected);
        if (!token) {
            throw new Error(`на позиции ${this.pos} ожидается ${expected[0].name}`)
        }
        return token;
    }

    parseVariableOrNumber() {
        const number = this.match(tokenTypesList.NUMBER);
        if (number != null) {
            return new NumberNode(number);
        }
        const variable = this.match(tokenTypesList.VARIABLE);
        if (variable != null) {
            return new VariableNode(variable);
        }
        throw new Error(`Ожидается переменная или число на ${this.pos} позиции`)
    }

    parsePrint() {
        const operatorLog = this.match(tokenTypesList.LOG);
        if (operatorLog != null) {
            return new UnarOperationNode(operatorLog, this.parseFormula())
        }
        throw new Error(`Ожидается унарный оператор КОНСОЛЬ на ${this.pos} позиции`)
    }

    parseParentheses() {
        if (this.match(tokenTypesList.LPAR) != null) {
            const node = this.parseFormula();
            this.require(tokenTypesList.RPAR);
            return node;
        } else {
            return this.parseVariableOrNumber();
        }
    }

    parseFormula() {
        let leftNode = this.parseParentheses();
        let operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
        while (operator != null) {
            const rightNode = this.parseParentheses();
            leftNode = new BinOperationNode(operator, leftNode, rightNode);
            operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
        }
        return leftNode;
    }

    parseExpression(){
        if (this.match(tokenTypesList.VARIABLE) == null) {
            const printNode = this.parsePrint()
            return printNode;
        }
        this.pos -= 1;
        let variableNode = this.parseVariableOrNumber();
        const assignOperator = this.match(tokenTypesList.ASSIGN);
        if (assignOperator != null) {
            const rightFormulaNode = this.parseFormula();
            const binaryNode = new BinOperationNode(assignOperator, variableNode, rightFormulaNode);
            return binaryNode;
        }
        throw new Error(`После переменной ожидается оператор присвоения на позиции ${this.pos}`);
    }

    parseCode() {
        const root = new StatementsNode();
        while (this.pos < this.tokens.length) {
            const codeStringNode = this.parseExpression();
            this.require(tokenTypesList.SEMICOLON);
            root.addNode(codeStringNode);
        }
        return root;
    }

    run(node){
        if (node instanceof NumberNode) {
            return parseInt(node.number.text);
        }
        if (node instanceof UnarOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypesList.LOG.name:
                    console.log(this.run(node.operand))
                    return;
            }
        }
        if (node instanceof BinOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypesList.PLUS.name:
                    return this.run(node.leftNode) + this.run(node.rightNode)
                case tokenTypesList.MINUS.name:
                    return this.run(node.leftNode) - this.run(node.rightNode)
                case tokenTypesList.ASSIGN.name:
                    const result = this.run(node.rightNode)
                    const variableNode = node.leftNode;
                    this.scope[variableNode.variable.text] = result;
                    return result;
            }
        }
        if (node instanceof VariableNode) {
            if (this.scope[node.variable.text]) {
                return this.scope[node.variable.text]
            } else {
                throw new Error(`Переменная с названием ${node.variable.text} не обнаружена`)
            }
        }
        if (node instanceof StatementsNode) {
            node.codeStrings.forEach(codeString => {
                this.run(codeString);
            })
            return;
        }
        throw new Error('Ошибка!')
    }
}