const initialState = {
  trials: [
    {
      targetString: '您吃了吗',
      analysisResult: false,
    },
    {
      targetString: '天气不错',
      analysisResult: false,
    },
    {
      targetString: '很高兴认识你',
      analysisResult: false,
    },
    {
      targetString: '打篮球还是踢足球',
      analysisResult: false,
    },
    {
      targetString: '新闻播送结束',
      analysisResult: false,
    },
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'COMPLETE_TRIAL':
      return {
        trials: [
          ...state.trials.slice(0, action.index),
          { ...state.trials[action.index], analysisResult: true },
          ...state.trials.slice(action.index + 1),
        ],
      };
    case 'RESET_TRIALS':
      return {
        trials: state.trials.map(trial => ({...trial, analysisResult: false})),
      }
    default:
      throw new Error();
  }
};

export { initialState, reducer };