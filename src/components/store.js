const initialState = {
  blockCount: 5,
  targetStrings: [
    '您吃了吗',
    '天气不错',
    '很高兴认识你',
    '打篮球还是踢足球',
    '新闻播送结束',
  ],
  wordFrequencyLevels: ['random', 'high'],
  referenceStructureLevels: ['whole', 'simplified'],
  trials: [
    {
      targetString: '您吃了吗',
      wordFrequencyLevel: 0,
      referenceStructureLevel: 0,
      analysisResult: false,
    },
    {
      targetString: '天气不错',
      wordFrequencyLevel: 0,
      referenceStructureLevel: 1,
      analysisResult: false,
    },
    {
      targetString: '很高兴认识你',
      wordFrequencyLevel: 1,
      referenceStructureLevel: 0,
      analysisResult: false,
    },
    {
      targetString: '打篮球还是踢足球',
      wordFrequencyLevel: 1,
      referenceStructureLevel: 1,
      analysisResult: false,
    },
    {
      targetString: '新闻播送结束',
      wordFrequencyLevel: 0,
      referenceStructureLevel: 1,
      analysisResult: false,
    },
  ],
  results: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'COMPLETE_TRIAL':
      return {
        ...state,
        trials: [
          ...state.trials.slice(0, action.index),
          { ...state.trials[action.index], analysisResult: true },
          ...state.trials.slice(action.index + 1),
        ],
      };
    case 'RESET_TRIALS':
      return {
        ...state,
        trials: state.trials.map(trial => ({...trial, analysisResult: false})),
      }
    default:
      throw new Error();
  }
};

export { initialState, reducer };