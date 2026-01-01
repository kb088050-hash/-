import { Word } from "./types";

export const MOCK_WORDS: Word[] = [
  {
    id: '1',
    term: 'Serendipity',
    definition: '意外发现珍宝的运气',
    confusers: ['通过努力获得的成功', '一种宁静的冥想状态', '无法避免的悲剧命运'],
    hookL1: '在寻找旧地图的途中，撞见未命名的星系。',
    hookL2: '源自锡兰三王子的传说，意指智慧与运气的非线性交汇。不仅仅是幸运，而是具备辨识幸运的能力。',
    comparison: '并不是单纯的好运，而是意外中的敏锐洞察。',
    status: 'new',
    lastReview: 0,
    errorCount: 0
  },
  {
    id: '2',
    term: 'Ephemeral',
    definition: '转瞬即逝的，短暂的',
    confusers: ['永恒不变的真理', '极其坚硬的物质', '深奥难懂的理论'],
    hookL1: '朝露在日出前蒸发，美丽因其必将消亡。',
    hookL2: '蜉蝣朝生暮死。希腊语 ephemeros 意为“持续一天的”。它提醒我们，存在的美学往往建立在时间的稀缺性之上。',
    comparison: '并不是虚无，而是极短时间内的极度绽放。',
    status: 'new',
    lastReview: 0,
    errorCount: 0
  },
  {
    id: '3',
    term: 'Labyrinth',
    definition: '错综复杂的迷宫',
    confusers: ['开阔的平原', '笔直的高速公路', '封闭的地下室'],
    hookL1: '为了禁锢牛头怪，构建出无限折叠的空间。',
    hookL2: '不仅仅是让人迷路的建筑，更是心理困境的具象化。每一个转角都既是出口也是死胡同。',
    comparison: '并不是简单的谜题，而是不仅迷路且无法逃脱的结构。',
    status: 'new',
    lastReview: 0,
    errorCount: 0
  }
];
