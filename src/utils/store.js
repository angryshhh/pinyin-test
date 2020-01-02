const initialState = {
  targetStrings: [],
  balancedLatinSquare: [],
  completed: false,
  subjectCode: 1,
  block: 1,
  trials: [],
  currentTrial: 1,
  results: [],
};

const reducer = (state, action) => {
  let { trials, currentTrial, results, targetStrings, balancedLatinSquare } = state;
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        targetStrings: action.data.targetStrings,
        balancedLatinSquare: action.data.balancedLatinSquare,
      }
    case 'SUBJECT_LOGIN':
      let { subjectCode, block } = action;
      balancedLatinSquare[subjectCode % 4].forEach(levelCombination => {
        targetStrings.forEach(targetString => {
          trials.push({ ...levelCombination, targetString });
        });
      });
      console.log(trials)
      return {
        ...state,
        subjectCode,
        trials,
        block,
      };
    case 'COMPLETE_TRIAL':
      let { result } = action;
      result.subjectCode = state.subjectCode;
      result.blockNum = state.block;
      result.trialNum = state.currentTrial;
      results.push(result);
      return {
        ...state,
        results,
      };
    case 'NEXT_TRIAL':
      if (currentTrial < trials.length) currentTrial++;
      else currentTrial = 1;
      return {
        ...state,
        currentTrial,
      };
    case 'COMPLETE_ALL':
      return {
        ...state,
        completed: true,
      };
    case 'RESET':
      return {
        ...state,
        completed: false,
        trials: [],
        currentTrial: 1,
        results: [],
      };
    default:
      throw new Error();
  }
};

export { initialState, reducer };