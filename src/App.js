import React from "react";
import "./styles.css";

export default function App() {
  const [dob, setDob] = React.useState('');
  //to store the "combo" in which user's date is palindrome
  const [palindromeDate, setPalindrome] = React.useState(null);
  //to store non palindrome date so that jsx doesnt get conditionally rendered everytime onChange is triggered
  const [nonPalindromeDob, setNonPalindromeDob] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const checkPalindrome = (string) => {
    for (let i = 0; i< Math.floor(string.length/2); i++) {
      if(string[i] !== string[string.length-1 - i]) return false;
    }
    return true;
  }

  const checkDate = (date) => {
    let dateArr = date.split(/[\s-/.]+/), dateArrTwo = date.split(/[\s-/.]+/);
    //dates without zero padding on DD and MM part
    if (dateArr[1].startsWith('0')) dateArr[1] = dateArr[1].slice(1);
    if (dateArr[2].startsWith('0')) dateArr[2] = dateArr[2].slice(1);
    //dates with zero padding on DD and MM part
    dateArrTwo[1] = dateArr[1].padStart(2, '0');
    dateArrTwo[2] = dateArr[2].padStart(2, '0');
    //all combos except for ones with year in middle
    let dateCombos =[
      //combos without zero padding
      [dateArr[0],dateArr[1],dateArr[2]],
      [dateArr[0],dateArr[2],dateArr[1]],
      [dateArr[1],dateArr[2],dateArr[0]],
      [dateArr[2],dateArr[1],dateArr[0]], 
      //combos with zero padding
      [dateArr[0],dateArrTwo[1],dateArrTwo[2]],
      [dateArr[0],dateArrTwo[2],dateArrTwo[1]],
      [dateArrTwo[1],dateArrTwo[2],dateArr[0]],
      [dateArrTwo[2],dateArrTwo[1],dateArr[0]]
    ]
    for (let combo of dateCombos) {
      if( checkPalindrome(combo.join('')) ) {
        let properDate = combo.join('-');
        return properDate;
      }
    }
    return null;
  }

  const clickHandler = () => {
    if (!dob) return setError(true);
    setLoading(true);
    setError(false);

    setTimeout(() => {
      if (checkDate(dob)) {
        setPalindrome(checkDate(dob));
      } else if (!checkDate(dob)){
        setPalindrome('notPalindrome');
        setNonPalindromeDob(dob);
      }
      setLoading(false);
    }, 1800);

  }

  const findNearestPalindrome = (date) => {
    let nextDate = new Date(date), prevDate = new Date(date);
    let prevDateStr = prevDate.toLocaleDateString('ko-KR'), nextDateStr = nextDate.toLocaleDateString('ko-KR');

    let daysAgo=0, daysLater=0;
    while (!checkDate(prevDateStr)) {
      prevDate.setDate(prevDate.getDate()-1);
      prevDateStr = prevDate.toLocaleDateString('ko-KR');
      daysAgo++;
    }
    while (!checkDate(nextDateStr)) {
      nextDate.setDate(nextDate.getDate()+1);
      nextDateStr = nextDate.toLocaleDateString('ko-KR');
      daysLater++;
    }
    
    let nearestPalindromeObj = {};
    if (daysAgo<daysLater) {
      nearestPalindromeObj.dateString = checkDate(prevDateStr);
      nearestPalindromeObj.dayGapString = `was ${daysAgo} days ago`;
    } else {
      nearestPalindromeObj.dateString = checkDate(nextDateStr);
      nearestPalindromeObj.dayGapString = `is ${daysLater} days later`;
    }

    return nearestPalindromeObj;
  }

  const renderNotPalindromeMessage = () => {
    let dayGap = findNearestPalindrome(nonPalindromeDob).dayGapString;
    let nearestDate = findNearestPalindrome(nonPalindromeDob).dateString;

    return (
      <>
        This date is not a palindrome date.<br/>
        {`Nearest Palindrome date ${dayGap} on ${nearestDate}.`}
      </>
    )
  }

  return (
    <div className="App">
      <header>
        <h2>Palindrome Birthdays</h2>
      </header>

      {error? <p className='errMsg'>choose a date first</p>: null}
      
      <section className='mainSection'>
        <div>  
          <input type='date'
          className='inputDate'
          onChange = {({target}) => setDob(target.value)}
          value={dob}/>
          <br/>
          <button onClick={clickHandler}>Find Out</button> 
          <button onClick={()=>{
            setDob('');
            setPalindrome(null);
          }}>Reset</button>
        </div>

        <div>
          <div className = {loading?'loadingMessage':'invisible'}>
              <h3>checking..</h3>
              <img src='https://media1.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif?cid=ecf05e475793660e8c27c78d15dde327c86c89f6e1a5be8c&rid=giphy.gif' alt='loading..'/>
          </div>

          {!palindromeDate || loading || error ? null :
          palindromeDate === 'notPalindrome'? renderNotPalindromeMessage():
          `${palindromeDate} is a palindrome date !`}  
        </div>
      </section>

      <footer>
        <h3>about</h3>
        this web app tells you whether you were born on a palindrome day or not
      </footer>
    </div>
  );
}