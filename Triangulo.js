// Função para verificar se três lados formam um triângulo
function tipoDeTriangulo(a, b, c) {
    // Verifica se os lados podem formar um triângulo
    if (a + b > c && a + c > b && b + c > a) {
      // Verifica o tipo de triângulo
      if (a === b && b === c) {
        console.log("Os lados formam um triângulo equilátero.");
      } else if (a === b || a === c || b === c) {
        console.log("Os lados formam um triângulo isósceles.");
      } else {
        console.log("Os lados formam um triângulo escaleno.");
      }
    } else {
      console.log("Os lados não formam um triângulo.");
    }
  }
  
  // Exemplo de uso da função
  const lado1 = 3;
  const lado2 = 4;
  const lado3 = 4;
  
  let tri = tipoDeTriangulo(lado1, lado2, lado3);
  