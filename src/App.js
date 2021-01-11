import React from "react";
import "./styles.css";

export default function App() {
  const [dob, setDob] = React.useState(null);
  const [palindromeDate, setPalindrome] = React.useState(null);
  const [nearestPalindrome, setNearestPalindrome] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const checkPalindrome = (string) => {
    for (let i = 0; i< Math.floor(string.length/2); i++) {
      if(string[i] !== string[string.length-1 - i]) return false;
    }
    return true;
  }

  const checkDate = (date) => {
    let dateArr = date.split(/[-/.]+/);
    dateArr[1] = dateArr[1].padStart(2,'0');
    dateArr[2] = dateArr[2].padStart(2, '0');
    let dateCombos =[
      [dateArr[0],dateArr[1],dateArr[2]],
      [dateArr[0],dateArr[2],dateArr[1]],
      [dateArr[1],dateArr[0],dateArr[2]],
      [dateArr[1],dateArr[2],dateArr[0]],
      [dateArr[2],dateArr[0],dateArr[1]],
      [dateArr[2],dateArr[1],dateArr[0]], 
    ]
    for (let combo of dateCombos) {
      if( checkPalindrome(combo.join('')) ) {
        let properDate = combo.join('-');
        return properDate;
      }
    }
    return null;
  }

  const findNearestPalindrome = (date) => {
    let nextDate = new Date(date), prevDate = new Date(date);
    let nextDateStr = nextDate.toLocaleDateString(), prevDateStr = prevDate.toLocaleDateString();

    let daysAgo=0, daysLater=0;
    while (!checkDate(prevDateStr)) {
      prevDate.setDate(prevDate.getDate()-1);
      prevDateStr = prevDate.toLocaleDateString();
      daysAgo++;
    }
    while (!checkDate(nextDateStr)) {
      nextDate.setDate(nextDate.getDate()+1);
      nextDateStr = nextDate.toLocaleDateString();
      daysLater++;
    }
    return daysLater+'days later';
  }

  const clickHandler = () => {
    if (!dob) return alert('choose a date');
    setLoading(true);

    setTimeout(() => {
      if (checkDate(dob)) {
        setPalindrome(checkDate(dob));
      } else {
        setPalindrome('notPalindrome');
      }
      setLoading(false);
    }, 1500);

  }

  return (
    <div className="App">
      {dob}
      <input type='date' onChange = {({target}) => setDob(target.value)}/>
      <button onClick={clickHandler}>Find Out</button> 
      {findNearestPalindrome('2020-02-02')}
      <div>
        {loading? <h1>Loading..</h1>: null}

        {!palindromeDate || loading? null :
        palindromeDate === 'notPalindrome'? 'not palindrome :(':
        `oo ma gu turu ${palindromeDate} palindrome`}  
      </div>   
    </div>
  );
}