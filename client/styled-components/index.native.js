import styled from 'styled-components/native'
import {css} from 'styled-components';
// import {css, injectGlobal} from 'styled-components';

// injectGlobal`
//   @font-face {
//     font-family: 'Noto Sans KR', sans-serif;
//     src: url(//fonts.googleapis.com/earlyaccess/notosanskr.css);
//   }
// `;

const styles = css`
  width: 100px;
  height: 100px;
  background: blue;
`;

export default Box = styled.View`${styles}`
