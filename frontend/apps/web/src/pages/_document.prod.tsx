import Document, { Head, Html, Main, NextScript } from 'next/document';
import Link from 'next/link';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <Link
            rel='stylesheet'
            as='style'
            href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/variable/pretendardvariable-dynamic-subset.css'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
