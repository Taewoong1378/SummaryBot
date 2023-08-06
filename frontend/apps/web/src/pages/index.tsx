import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { authState } from '@recoilState';

import { Input, Loading } from '@components';
import { Home } from '@templates';

import { useWindowSize } from '@hooks';

export default function HomePage() {
  const { height } = useWindowSize();

  const [text, setText] = useState<string>('');
  const [auth, setAuth] = useRecoilState(authState);

  const [authentication, setAuthentication] = useState(false);
  const [loading, setLoading] = useState(true);

  const onSubmit = () => {
    if (text === process.env.NEXT_PUBLIC_PASSWORD) {
      setAuth(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  useEffect(() => {
    setLoading(false);
    if (auth) {
      setAuthentication(true);
    } else {
      setAuthentication(false);
    }
  }, [auth]);

  if (loading) {
    return <Loading />;
  }

  if (!authentication) {
    return (
      <main className='flex h-screen w-full items-center justify-center'>
        <form className='flex w-[300px] flex-row gap-6' onSubmit={onSubmit}>
          <Input
            placeholder='비밀번호 입력'
            onChange={(e) => setText(e.target.value)}
            type='password'
          />
          <button className='w-[80px] rounded-md bg-DTRed-400 font-bold text-white' type='submit'>
            확인
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className='flex flex-col items-center justify-center' style={{ minHeight: height }}>
      <Home />
    </main>
  );
}
