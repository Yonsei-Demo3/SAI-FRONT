import { useEffect, useState } from 'react';

export default function KakaoLoginHandler({ code }) {
  const [result, setResult] = useState('');

  useEffect(() => {
    
    if (!code) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/login/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code : code, 
        redirectUri: import.meta.env.VITE_FRONT_BASE_URL + '/login'
    })
    })
      .then(res => res.json())
      .then(data => setResult(JSON.stringify(data)))
      .catch(err => setResult('에러: ' + err));
  }, [code]);

  return (
    <div className="text-center text-lg font-semibold break-all">
      {result ? (
        <>
          <div>백엔드 응답:</div>
          <div>{result}</div>
        </>
      ) : (
        <div>카카오 인증 코드 처리 중</div>
      )}
    </div>
  );
}
