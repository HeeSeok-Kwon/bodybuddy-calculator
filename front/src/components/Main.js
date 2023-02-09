import { useState } from "react";
import axios from 'axios';
import "./css/main.css";

function Main() {
    const [equation, setEquation] = useState("");
    const [result, setResult] = useState("");
    const [chkRes, setChkRes] = useState(false);
    const [cnt, setCnt] = useState(0);

    axios.defaults.withCredentials = true;

    const inputResult = async (answer) => {
        try {
            await axios.post("http://localhost:3001/api/insert", {
                answer: answer
            }).then((response) => {
                alert(response.data);
            });
        } catch (error) {
            alert(error+"\n"+"재시도 요청");
            // 재요청
            await axios.post("http://localhost:3001/api/insert", {
                answer: answer
            }).then((response) => {
                alert(response.data);
            });
        }
    }

    const showResult = async (answer) => {
        try {
            await axios.get("http://localhost:3001/api/result"
            ).then((response) => {
                const tempArr = [...response.data];
                const resArr = []
                tempArr.forEach((item) => {
                    resArr.push(item['answer']);
                })
                alert(resArr);
            });
        } catch (error) {
            alert(error);
        }
    }
    
    const clearAll = () => {
        setEquation("");
        setCnt(0);
    }

    const checkFirstOperator = (input) => {
        if(equation === "" && 
            (
                input === '+' || 
                input === '-' || 
                input === '×' || 
                input === '÷'
            )
        ) {
            return true;
        }
        return false;
    }

    const checkDoubleOperator = (input) => {
        const lastWord = equation.slice(-1);
        if(
            (
                lastWord === '+' || 
                lastWord === '-' || 
                lastWord === '×' || 
                lastWord === '÷'
            ) && 
            (
                input === '+' || 
                input === '-' || 
                input === '×' || 
                input === '÷'
            )
        ) {
            return true;
        }
        return false;
    }

    const checkLastOperator = () => {
        const lastWord = equation.slice(-1);
        if(
            lastWord === '+' || 
            lastWord === '-' || 
            lastWord === '×' || 
            lastWord === '÷'
        ) {
            return true;
        }
        return false;
    }

    const checkNumOfDigits = (input) => {
        if(
            input === '+' || 
            input === '-' || 
            input === '×' || 
            input === '÷'
        ) {
            return false;
        }
        if(cnt >= 15) {
            setCnt(0);
        }
        return true;
    }

    const makeEquation = (input) => {
        const checkFO = checkFirstOperator(input);
        const checkDO = checkDoubleOperator(input);
        const checkND = checkNumOfDigits(input);

        if(checkFO) {
            alert('완성되지 않은 수식입니다.');
            setCnt(0);
            return;
        } else if(checkDO) {
            setCnt(0);
            return;
        } else if(cnt >= 15 && checkND) {
            alert('15자리까지 입력할 수 있어요.');
        } else {
            if(input === '=') {
                const checkLO = checkLastOperator();

                if(checkLO) {return;}

                // 결과 도출
                makeResult();
                return;
            }

            const bufferStr = chkRes && checkND ? input : equation + input;
            setEquation(bufferStr);
            setCnt(cnt => cnt = cnt + 1);
            if(chkRes) {setChkRes(false);}
        }
    }

    const makeResult = () => {
        const eqArr = equation.split('');
        let totalArr = [];
        let numArr = [];
        let opArr = [];
        let tempStr = '';

        console.log(parseFloat(-50));
        
        // 문자열 자르기
        eqArr.map(function(item) {
            if(
                item === '+' ||
                item === '×' ||
                item === '÷'
            ) {
                totalArr.push(parseFloat(tempStr));
                totalArr.push(item);
                tempStr = '';
            } else if (item === '-') {
                totalArr.push(parseFloat(tempStr));
                totalArr.push('+');
                tempStr = '-';
            } else {
                tempStr += item;
            }
        });
        
        totalArr.push(parseFloat(tempStr));
        tempStr = '';

        console.log("totalArr : "+ totalArr);

        if(isNaN(totalArr[0])) {
            totalArr[0] = 0; // 음수일 경우 처리
        }

        while(totalArr.length > 0) {
            const element = totalArr.shift();
            if(!isNaN(Number(element))) {
                numArr.unshift(element);
            } else {
                if(element === '×') {
                    const num1 = numArr.shift();
                    const num2 = totalArr.shift();
                    numArr.unshift(num1 * num2);
                } else if(element === '÷') {
                    const num1 = numArr.shift();
                    const num2 = totalArr.shift();
                    numArr.unshift(num1 / num2);
                } else {
                    opArr.unshift(element);
                }
            }
        }

        while(opArr.length) {
            const op = opArr.shift();
            const num1 = numArr.shift();
            const num2 = numArr.shift();

            if(op === '+') {
                numArr.unshift(num2 + num1);
            } else if(op === '-') {
                numArr.unshift(num2 - num1);
            }
        }
       
        if(!Number.isFinite(numArr[0])) {
            alert('0으로 나눌 수 없어요.');
        } else {
            setResult(numArr[0]);
            setEquation(numArr[0] + "");
            setCnt(0);
            setChkRes(true);
            inputResult(parseFloat(numArr[0])); // DB 저장
        }
        return;
    }

    return (
        <main>
            <section className="main">
                <div className="cal_wrap">
                    <div className="cal">
                        <div className="cal_header_sec">
                            <span className="cal_title">
                                <a onClick={() => showResult()} className="get-result">Calculator</a>
                            </span>
                        </div>
                        <div className="cal_main_sec">
                            <div className="cal_answer_sec">
                                <div className="cal_anwser_display">
                                    {equation}
                                </div>
                            </div>
                            <div className="cal_btn_sec">
                                <button className="cal_btn bg-common" onClick={() => clearAll()}>AC</button>
                                <button className="empty_space">{" "}</button>
                                <button className="empty_space">{" "}</button>
                                <button className="cal_btn bg-deep" onClick={() => makeEquation("+")}>+</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("1")}>1</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("2")}>2</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("3")}>3</button>
                                <button className="cal_btn bg-deep" onClick={() => makeEquation("-")}>-</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("4")}>4</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("5")}>5</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("6")}>6</button>
                                <button className="cal_btn bg-deep" onClick={() => makeEquation("×")}>×</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("7")}>7</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("8")}>8</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("9")}>9</button>
                                <button className="cal_btn bg-deep" onClick={() => makeEquation("÷")}>÷</button>
                                <button className="empty_space">{" "}</button>
                                <button className="cal_btn bg-common" onClick={() => makeEquation("0")}>0</button>
                                <button className="empty_space">{" "}</button>
                                <button className="cal_btn bg-res" onClick={() => makeEquation("=")}>=</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Main;