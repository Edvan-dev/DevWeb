function calculadora(valor1, valor2, operador) {
    let resultado;

    switch (operador) {
        case '+':
            resultado = valor1 + valor2;
            break;
        case '-':
            resultado = valor1 - valor2;
            break;
        case '*':
            resultado = valor1 * valor2;
            break;
        case '/':
            resultado = valor1 / valor2;
            break;
        default:
            // Caso o operador não seja válido
            return 'Operador inválido';
    }

    return resultado;
}

let soma = calculadora(2,2,"+")
let sub = calculadora(5,2,"-")
let mult = calculadora(2,3,"*")
let div = calculadora(8,4,"/")
console.log(soma)
console.log(sub)
console.log(mult)
console.log(div)

  