import React from 'react';
import TestPage from './components/TestPage';


function App() {
  const targetStrings = [
    '您吃了吗',
    '天气不错',
    '很高兴认识你',
    '打篮球还是踢足球',
    '新闻播送结束',
  ];

  return (
    <div className="App">
      <TestPage targetStrings={targetStrings}></TestPage>
    </div>
  );
}

export default App;
