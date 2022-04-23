import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`

/* Fonts Used */

@font-face{
  font-family: 'Styled';
  src: url(/fonts/poor_richard.ttf);
}

@font-face{
  font-family: 'Main';
  src: url(/fonts/mian.ttf);
}

@font-face{
  font-family: 'Styled';
  src: url(/fonts/tangerine.ttf);
}

/* Fonts Used End */



/* ------------------------------------------------------------------ */



/* Fonts Size and Rem selection */

html{
  font-size: 16px;
}

@media screen and (max-width: 800px) {
  
  html{
    font-size: 15px;
  }

}

@media screen and (max-width: 700px) {
  
  html{
    font-size: 14px;
  }

}

@media screen and (max-width: 600px) {
  
  html{
    font-size: 13px;
  }

}

@media screen and (max-width: 500px) {
  
  html{
    font-size: 11px;
  }

}

@media screen and (max-width: 400px) {
  
  html{
    font-size: 10px;
  }

}

@media screen and (max-width: 400px) {
  
  html{
    font-size: 9px;
  }

}

@media screen and (max-height: 300px) {
  
  html{
    font-size: 8px;
  }

}

@media screen and (max-width: 270px) {
  
  html{
    font-size: 7px;
  }

}

@media screen and (max-width: 200px) {
  
  html{
    font-size: 6px;
  }

}

@media screen and (max-width: 100px) {
  
  html{
    font-size: 5px;
  }

}

@media screen and (max-width: 80px) {
  
  html{
    font-size: 4px;
  }

}

@media screen and (max-width: 50px) {
  
  html{
    font-size: 4px;
  }

}

/* Fonts Size and Rem selection END */



/* ------------------------------------------------------------------ */



/* Base Elements Styles */

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  font-family: inherit;
  font-size: inherit;
  word-break: break-word;
  line-height: inherit;
}

body{
  min-height: 100vh;
  font-size: .8rem;
  line-height: 2rem;
  font-family: Main;
  background-color: #f7f7f7;
  color: #323232;
  overflow-x: hidden;
  padding-right: .1rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
}

body > #__next{
  width: 100%;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
}

.absolute-invisibility{
  position: absolute;
  display: none;
  width: 0; height: 0;
  border: 0; outline: 0;
  background: transparent;
}

a{
  color: slategray;
}

button{
  border: 1px solid grey;
  background-color: transparent;
  outline: 0 none;
  cursor: pointer;
  padding: 0 .5rem;
}


/* Base Elements Styles */



/* ------------------------------------------------------------------ */


/* Magnifing Glass */

.el-img-magnifier-glass {
  position: absolute;
  border: 3px solid #000;
  border-radius: 50%;
  cursor: none;
  /*Set the size of the magnifier glass:*/
  width: 100px;
  height: 100px;
}

/* Magnifing Glass ENDS */


/* ------------------------------------------------------------------ */


/* Custom Scroll bar */

::-webkit-scrollbar {
  width: .3rem;
  height: .3rem;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Custom Scroll bar END */

/* ------------------------------------------------------------------ */



/* Autocomplete for Input */

.el-autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
}

.el-autocomplete-items div {
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;
}

.el-autocomplete-items div:hover {
  /*when hovering an item:*/
  background-color: #e9e9e9;
}

.el-autocomplete-active {
  /*when navigating through the items using the arrow keys:*/
  background-color: DodgerBlue !important;
  color: #ffffff;
}

/* Autocomplete for Input ENDS */



/* ------------------------------------------------------------------ */


input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
}

/* ------------------------------------------------------------------ */

/* Random flying stuffs */

@keyframes spin-me-fx-1 {
  0%{transform: rotate(0deg); left: 11%; top: 13%;}
  10%{left: 64%; top: 40%;}
  20%{left: 96%; top: 53%;}
  30%{left: 6%; top: 61%;}
  40%{left: 100%; top: 30%;}
  50%{left: 17%; top: 80%;}
  60%{left: 88%; top: 12%;}
  70%{left: 65%; top: 84%;}
  80%{left: 28%; top: 27%;}
  90%{left: 87%; top: 32%;}
  100%{transform: rotate(360deg); left: 11%; top: 13%;}
}

@keyframes spin-me-fx-2 {
  0%{transform: rotate(0deg); left: 55%; top: 92%;}
  10%{left: 68%; top: 29%;}
  20%{left: 35%; top: 12%;}
  30%{left: 1%; top: 6%;}
  40%{left: 34%; top: 16%;}
  50%{left: 40%; top: 70%;}
  60%{left: 95%; top: 39%;}
  70%{left: 90%; top: 92%;}
  80%{left: 34%; top: 59%;}
  90%{left: 38%; top: 4%;}
  100%{transform: rotate(360deg); left: 55%; top: 92%;}
}

@keyframes spin-me-fx-3 {
  0%{transform: rotate(0deg); left: 83%; top: 29%;}
  10%{left: 17%; top: 68%;}
  20%{left: 30%; top: 89%;}
  30%{left: 33%; top: 30%;}
  40%{left: 25%; top: 41%;}
  50%{left: 32%; top: 40%;}
  60%{left: 93%; top: 36%;}
  70%{left: 77%; top: 80%;}
  80%{left: 45%; top: 93%;}
  90%{left: 28%; top: 15%;}
  100%{transform: rotate(360deg); left: 83%; top: 29%;}
}

@keyframes spin-me-fx-4 {
  0%{transform: rotate(0deg); left: 26%; top: 37%;}
  10%{left: 65%; top: 73%;}
  20%{left: 1%; top: 1%;}
  30%{left: 70%; top: 48%;}
  40%{left: 20%; top: 97%;}
  50%{left: 57%; top: 46%;}
  60%{left: 65%; top: 54%;}
  70%{left: 1%; top: 97%;}
  80%{left: 22%; top: 99%;}
  90%{left: 35%; top: 15%;}
  100%{transform: rotate(360deg); left: 26%; top: 37%;}
}

@keyframes spin-me-fx-5 {
  0%{transform: rotate(0deg); left: 53%; top: 70%;}
  10%{left: 79%; top: 41%;}
  20%{left: 21%; top: 82%;}
  30%{left: 73%; top: 10%;}
  40%{left: 78%; top: 48%;}
  50%{left: 66%; top: 12%;}
  60%{left: 79%; top: 55%;}
  70%{left: 1%; top: 70%;}
  80%{left: 93%; top: 80%;}
  90%{left: 20%; top: 31%;}
  100%{transform: rotate(360deg); left: 53%; top: 70%;}
}

@keyframes spin-me-fx-6 {
  0%{transform: rotate(0deg); left: 45%; top: 83%;}
  10%{left: 47%; top: 86%;}
  20%{left: 89%; top: 25%;}
  30%{left: 61%; top: 78%;}
  40%{left: 12%; top: 82%;}
  50%{left: 20%; top: 16%;}
  60%{left: 52%; top: 30%;}
  70%{left: 11%; top: 12%;}
  80%{left: 74%; top: 56%;}
  90%{left: 28%; top: 30%;}
  100%{transform: rotate(360deg); left: 45%; top: 83%;}
}

@keyframes spin-me-fx-7 {
  0%{transform: rotate(0deg); left: 94%; top: 41%;}
  10%{left: 66%; top: 51%;}
  20%{left: 47%; top: 1%;}
  30%{left: 71%; top: 94%;}
  40%{left: 38%; top: 64%;}
  50%{left: 11%; top: 57%;}
  60%{left: 74%; top: 42%;}
  70%{left: 1%; top: 1%;}
  80%{left: 69%; top: 49%;}
  90%{left: 24%; top: 26%;}
  100%{transform: rotate(360deg); left: 94%; top: 41%;}
}

@keyframes spin-me-fx-8 {
  0%{transform: rotate(0deg); left: 52%; top: 18%;}
  10%{left: 61%; top: 62%;}
  20%{left: 43%; top: 27%;}
  30%{left: 37%; top: 23%;}
  40%{left: 58%; top: 1%;}
  50%{left: 32%; top: 37%;}
  60%{left: 84%; top: 9%;}
  70%{left: 89%; top: 78%;}
  80%{left: 21%; top: 72%;}
  90%{left: 60%; top: 57%;}
  100%{transform: rotate(360deg); left: 52%; top: 18%;}
}

@keyframes spin-me-fx-9 {
  0%{transform: rotate(0deg); left: 8%; top: 30%;}
  10%{left: 83%; top: 100%;}
  20%{left: 0%; top: 93%;}
  30%{left: 95%; top: 52%;}
  40%{left: 80%; top: 51%;}
  50%{left: 74%; top: 71%;}
  60%{left: 31%; top: 25%;}
  70%{left: 22%; top: 58%;}
  80%{left: 81%; top: 69%;}
  90%{left: 85%; top: 57%;}
  100%{transform: rotate(360deg); left: 8%; top: 30%;}
}

@keyframes spin-me-fx-10 {
  0%{transform: rotate(0deg); left: 47%; top: 34%;}
  10%{left: 76%; top: 55%;}
  20%{left: 40%; top: 43%;}
  30%{left: 67%; top: 44%;}
  40%{left: 74%; top: 19%;}
  50%{left: 6%; top: 16%;}
  60%{left: 64%; top: 76%;}
  70%{left: 50%; top: 42%;}
  80%{left: 43%; top: 93%;}
  90%{left: 25%; top: 8%;}
  100%{transform: rotate(360deg); left: 47%; top: 34%;}
}

`

export default GlobalStyle;