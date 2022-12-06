import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const Home = () => {

  // original matrix string
  const [ogMTX, setOgMTX] = useState('')

  // new matrix string
  const [newMTX, setNewMTX] = useState('')

  // common denominator
  const [commonDenominator, setCommonDenominator] = useState(1)

  // hashState
  const [hashState, setHashState] = useState('')

  // hashState2
  const [hashState2, setHashState2] = useState('')

  // matrix state
  const [matrixState, setMatrixState] = useState(null)

  // input1 state
  const [input1State, setInput1State] = useState('')

  // input2 state
  const [input2State, setInput2State] = useState('')

  // matching state
  const [matchingState, setMatchingState] = useState(false)

  function inverse(matrix) {
    let temp;
    let len = matrix.length; // length of the matrix
    let left = []; // this will be the identity matrix after the function executes
   
    for (var i = 0; i < len; i++)
      left[i] = [];
   
    for (i = 0; i < len; i++)
      for (var j = 0; j < len; j++) {
        left[i][j] = 0;
        if (i == j)
          left[i][j] = 1;
      }
   
    for (var k = 0; k < len; k++) {
      temp = matrix[k][k]; // temp is the pivot element
   
      for (var j = 0; j < len; j++) { // divide the pivot row by the pivot element
        matrix[k][j] /= temp;
        left[k][j] /= temp;
      }
   
      for (var i = k + 1; i < len; i++) { 
        temp = matrix[i][k];
   
        for (var j = 0; j < len; j++) {
          matrix[i][j] -= matrix[k][j] * temp;
          left[i][j] -= left[k][j] * temp;
        }
      }
    }
   
    for (var k = len - 1; k > 0; k--) {
      for (var i = k - 1; i >= 0; i--) {
        temp = matrix[i][k];
   
        for (var j = 0; j < len; j++)
        {
          matrix[i][j] -= matrix[k][j] * temp;
          left[i][j] -= left[k][j] * temp;
        }
      }
    }
   
    for (var i = 0; i < len; i++)
      for (var j = 0; j < len; j++)
        matrix[i][j] = left[i][j];
        
    return matrix;
  } 

  const hash = (str) => {
    // empty 3x3 matrix
    let matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    // get string length
    let len = str.length;
    // loop through matrix
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // get char code
        let charCode = str.charCodeAt((i * 3 + j) % len);
        matrix[i][j] = charCode;
      }
    }
    setMatrixState(matrix)
    let iMatrix = inverse(matrix);
    let output = '';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        output += ('' + (iMatrix[i][j]))
      }
    }
    // loop through output
    let out = '';
    for (let i = 0; i < output.length; i++) {
      let charCode = output.charCodeAt(i);
      out += String.fromCharCode(charCode*2) + charCode%10;
    }
    return out;
  }

  // print matrix
  const matrixToString = (matrix) => {
    let str = '<table>';
    for (let i = 0; i < matrix.length; i++) {
      str += '<tr>';
      for (let j = 0; j < matrix[i].length; j++) {
        str += '<td style=\'padding:16px;\'>' + (matrix[i][j].toFixed(4)) + '</td>';
      }
      str += '</tr>';
    }
    str += '</table>';
    return str;
  };

  const printMatrices = () => {
    setOgMTX(matrixToString(matrixState));
    setNewMTX(matrixToString(inverse(matrixState)));
  }

  useEffect(() => {
    setHashState(hash(input1State))
    setHashState2(hash(input2State))
    if(hashState === hashState2) {
      setMatchingState(true)
    } else {
      setMatchingState(false)
    }
  }, [input1State, input2State, matchingState])
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-[#0c0c0c] text-white font-Main">
      <Head>
        <title>AMS 210 - Inverse Matrix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 flex-shrink w-full px-20 text-center">
        {matchingState ? <h1 className="text-3xl font-bold text-[#6fcfa2]">Passwords Matching</h1> : <h1 className="text-3xl font-bold text-[#de7070]">Passwords Not Matching</h1>}
        <h1 className='mt-4'>Create A Password</h1>
        <input minLength={4} maxLength={9} className='p-2 text-black rounded-lg' type="text" value={input1State} onChange={(e) => setInput1State(e.target.value)} />
        <h1 className='mt-4'>Enter Password</h1>
        <input minLength={4} maxLength={9} className='p-2 mb-4 text-black rounded-lg' type="text" value={input2State} onChange={(e) => setInput2State(e.target.value)} />
        <button className='p-3 bg-[#272727] rounded-lg hover:bg-[#171717] transition-all' onClick={() => printMatrices()}>Show Matrices</button>
        <h1 className='mt-8'>Given Matrix</h1>
        <p dangerouslySetInnerHTML={{ __html: ogMTX }}></p>
        <h1 className='mt-8'>Inverse Matrix</h1>
        <p dangerouslySetInnerHTML={{ __html: newMTX }}></p>
        <h1 className='mt-8'>Created Password Hash</h1>
        <p className='flex break-all'>{hashState}</p>
        <h1 className='mt-8'>Entered Password Hash</h1>
        <p className='flex break-all'>{hashState2}</p>
      </main>
    </div>
  )
}

export default Home
