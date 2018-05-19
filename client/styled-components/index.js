import styled, {css, injectGlobal} from 'styled-components';

injectGlobal`
  @font-face {
    font-family: 'Noto Sans KR', sans-serif;
    src: url(//fonts.googleapis.com/earlyaccess/notosanskr.css);
  }
`;


const styles = css`
  width: 100px;
  height: 100px;
  background: red;
`;

export default Box = styled.div`${styles}`
