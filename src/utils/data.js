// no longer used

export const targetStrings = [
  '您吃了吗',
  '天气不错',
  '很高兴认识你',
  '打篮球还是踢足球',
  '新闻播送结束',
];

export const wordFrequencyLevels = ['random', 'high'];

export const referenceStructureLevels = ['whole', 'simplified'];

export const balancedLatinSquare = [
  // 0, 1, 3, 2
  [
    { wordFrequencyLevel: 0, referenceStructureLevel: 0 },
    { wordFrequencyLevel: 0, referenceStructureLevel: 1 },
    { wordFrequencyLevel: 1, referenceStructureLevel: 1 },
    { wordFrequencyLevel: 1, referenceStructureLevel: 0 },
  ],
  // 1, 2, 0, 3
  [
    { wordFrequencyLevel: 0, referenceStructureLevel: 1 },
    { wordFrequencyLevel: 1, referenceStructureLevel: 0 },
    { wordFrequencyLevel: 0, referenceStructureLevel: 0 },
    { wordFrequencyLevel: 1, referenceStructureLevel: 1 },
  ],
  // 2, 3, 1, 0
  [
    { wordFrequencyLevel: 1, referenceStructureLevel: 0 },
    { wordFrequencyLevel: 1, referenceStructureLevel: 1 },
    { wordFrequencyLevel: 0, referenceStructureLevel: 1 },
    { wordFrequencyLevel: 0, referenceStructureLevel: 0 },
  ],
  // 3, 0, 2, 1
  [
    { wordFrequencyLevel: 1, referenceStructureLevel: 1 },
    { wordFrequencyLevel: 0, referenceStructureLevel: 0 },
    { wordFrequencyLevel: 1, referenceStructureLevel: 0 },
    { wordFrequencyLevel: 0, referenceStructureLevel: 1 },
  ],
];
