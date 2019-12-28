import { targetStrings, balancedLatinSquare } from './data';

const initialState = {
  completed: false,
  subjectCode: 1,
  blockCount: 5,
  currentBlock: 1,
  trials: [],
  currentTrial: 1,
  results: [],
};

const reducer = (state, action) => {
  let { blockCount, currentBlock, trials, currentTrial, results } = state;
  switch (action.type) {
    case 'SUBJECT_LOGIN':
      let subjectCode = action.subjectCode;
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
      };
    case 'COMPLETE_TRIAL':
      let { result } = action;
      result.subjectCode = state.subjectCode;
      result.blockNum = state.currentBlock;
      result.trialNum = state.currentTrial
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
    case 'NEXT_BLOCK':
      if (currentBlock !== blockCount) {
        return {
          ...state,
          currentBlock: Math.min(currentBlock + 1, blockCount),
          currentTrial: 1,
        };
      } else return state;
    case 'COMPLETE_ALL':
      return {
        ...state,
        completed: true,
      };
    default:
      throw new Error();
  }
};

export { initialState, reducer };