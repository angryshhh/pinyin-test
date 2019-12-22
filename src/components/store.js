const initialState = {
  blockCount: 5,
  currentBlock: 1,
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
    },
    {
      targetString: '天气不错',
      wordFrequencyLevel: 0,
      referenceStructureLevel: 1,
    },
    {
      targetString: '很高兴认识你',
      wordFrequencyLevel: 1,
      referenceStructureLevel: 0,
    },
    {
      targetString: '打篮球还是踢足球',
      wordFrequencyLevel: 1,
      referenceStructureLevel: 1,
    },
    {
      targetString: '新闻播送结束',
      wordFrequencyLevel: 0,
      referenceStructureLevel: 1,
    },
  ],
  currentTrial: 1,
  results: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'COMPLETE_TRIAL':
      let { results } = state;
      results.push(action.index + 1);
      return {
        ...state,
        results,
      };
    case 'NEXT_TRIAL':
      let { currentTrial, trials } = state;
      if (currentTrial < trials.length) currentTrial++;
      else currentTrial = 1;
      return {
        ...state,
        currentTrial,
      };
    case 'NEXT_BLOCK':
      if (state.currentBlock !== state.blockCount) {
        let { currentBlock, blockCount } = state;

        return {
          ...state,
          currentBlock: Math.min(currentBlock + 1, blockCount),
          currentTrial: 1,
        };
      } else return state;
    default:
      throw new Error();
  }
};

export { initialState, reducer };