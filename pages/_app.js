// pages/_app.js
import '../styles.css';   // <- root styles file that definitely exists

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
