import { CastleMilestone } from './types';

export interface CastlePhotoAlbumEntry {
  stage: number;
  starsRequired: number;
  photoTitle: string;
  subtitle: string;
  description: string;
  elsaMemoryQuote: string;
  unlockedCharacter: string;
  characterEmoji: string;
  sticker: string;
}

export const CASTLE_ALBUM_ENTRIES: CastlePhotoAlbumEntry[] = [
  {
    stage: 0,
    starsRequired: 0,
    photoTitle: '初始篇：冰雪初生基石',
    subtitle: '小巧晶瑩的冰雪起點',
    description: '在白雪皚皚的山丘上，第一顆冰晶基石發出柔和光芒，等待數學魔法的召喚！',
    elsaMemoryQuote: '「這是一切美麗故事的開始，每一位偉大的魔法師都是從小基石出發的喔！」',
    unlockedCharacter: '冰雪精靈',
    characterEmoji: '🧚‍♀️',
    sticker: '❄️ 初生冰晶',
  },
  {
    stage: 1,
    starsRequired: 2,
    photoTitle: '第一篇：冰晶迴旋階梯',
    subtitle: '雪寶拜訪的冰晶階梯',
    description: '晶瑩剔透的冰旋階梯螺旋向上生長，雪寶開心地跑來打招呼！',
    elsaMemoryQuote: '「看！階梯像水晶一樣閃閃發光，雪寶在階梯上跳著歡樂的舞步呢！」',
    unlockedCharacter: '雪寶 Olaf',
    characterEmoji: '⛄',
    sticker: '⛄ 溫暖擁抱',
  },
  {
    stage: 2,
    starsRequired: 5,
    photoTitle: '第二篇：琉璃大門與水晶立柱',
    subtitle: '雄偉堅固的水晶宮殿門戶',
    description: '高聳的水晶立柱與雪花浮雕大門巍峨立起，守護著整座冰雪王國。',
    elsaMemoryQuote: '「這座大門充滿了你的智慧力量，連小雪怪都忍不住來幫我們守門了！」',
    unlockedCharacter: '小雪怪 Marshmallow',
    characterEmoji: '❄️',
    sticker: '🛡️ 冰雪守護',
  },
  {
    stage: 3,
    starsRequired: 9,
    photoTitle: '第三篇：魔法星光高塔',
    subtitle: '穿透雲霄的水晶尖塔',
    description: '高聳入雲的哥德式水晶尖塔在陽光下折射出七彩光芒，風之精靈在塔頂吹起雪花旋風。',
    elsaMemoryQuote: '「好高好美的尖塔！在塔頂可以看到整個阿倫黛爾王國的美景！」',
    unlockedCharacter: '風之精靈 Gale',
    characterEmoji: '🍃',
    sticker: '✨ 星光尖塔',
  },
  {
    stage: 4,
    starsRequired: 14,
    photoTitle: '第四篇：永恆冰封魔法噴泉',
    subtitle: '水晶水花與雙側神殿尖塔',
    description: '城堡庭院中長出了冰封噴泉，晶瑩的水花凝固在空中，火精靈布魯尼也開心地圍繞著噴泉跑跳！',
    elsaMemoryQuote: '「這座噴泉的水花永遠都不會融化，布魯尼超喜歡在這裡吐藍色小火苗！」',
    unlockedCharacter: '火精靈 布魯尼',
    characterEmoji: '🦎',
    sticker: '⛲ 魔法噴泉',
  },
  {
    stage: 5,
    starsRequired: 20,
    photoTitle: '終極篇：阿倫黛爾極光皇宮',
    subtitle: '七彩極光照耀的宏偉大城堡',
    description: '整座水晶大城堡完全盛放！夜空中綻放阿倫黛爾最璀璨的七彩極光，冰雪神駒水之靈優雅奔馳，完美大團圓！',
    elsaMemoryQuote: '「太不可思議了！你建造了全王國最宏偉壯麗的城堡，你是真正了不起的數學魔法女王/國王！」',
    unlockedCharacter: '水之靈 Nokk & 愛莎',
    characterEmoji: '👑',
    sticker: '🌌 璀璨極光',
  },
];

export const CASTLE_MILESTONES: CastleMilestone[] = [
  {
    id: 1,
    starsRequired: 2,
    title: '第一章：冰晶階梯升起！',
    storyText: '愛莎公主揮動雙手：「看！你的數學魔法讓晶瑩的冰晶階梯從雪地中升起來了！雪寶（Olaf）也跑出來向你招手囉！」',
    unlockedItem: '冰晶迴旋階梯 ❄️',
    characterName: '雪寶 Olaf',
    characterEmoji: '⛄',
    castleStage: 1,
  },
  {
    id: 2,
    starsRequired: 5,
    title: '第二章：琉璃城堡大門與水晶柱！',
    storyText: '愛莎公主微笑說：「好棒的算術！城堡的大門與兩側閃閃發光的水晶立柱建造完成了，小雪人怪獸也來守護城堡！」',
    unlockedItem: '琉璃大門與水晶柱 🏰',
    characterName: '小雪怪 Marshmallow',
    characterEmoji: '❄️',
    castleStage: 2,
  },
  {
    id: 3,
    starsRequired: 9,
    title: '第三章：高聳的水晶尖塔！',
    storyText: '愛莎公主施展強大的冰雪魔法：「尖塔直衝雲霄！風之精靈蓋兒（Gale）在塔頂吹起歡樂的雪花旋風！」',
    unlockedItem: '魔法水晶尖塔 🗼',
    characterName: '風之精靈 Gale',
    characterEmoji: '🍃',
    castleStage: 3,
  },
  {
    id: 4,
    starsRequired: 14,
    title: '第四章：冰封噴泉與火精靈相聚！',
    storyText: '愛莎公主驚喜道：「城堡庭院長出了永恆冰封噴泉，連調皮可愛的火精靈布魯尼（Bruni）都被你的數學魅力吸引來了！」',
    unlockedItem: '冰封魔法噴泉 ⛲',
    characterName: '火精靈 布魯尼',
    characterEmoji: '🦎',
    castleStage: 4,
  },
  {
    id: 5,
    starsRequired: 20,
    title: '終章：阿倫黛爾璀璨極光盛宴！',
    storyText: '愛莎公主為你戴上冰晶王冠：「你完成了整座宏偉的冰雪魔法城堡！天空中綻放著阿倫黛爾最美麗的極光，你是最棒的數學魔法大師！」',
    unlockedItem: '阿倫黛爾七彩極光 🌌',
    characterName: '水之靈 Nokk & 愛莎',
    characterEmoji: '👑',
    castleStage: 5,
  },
];

export const ELSA_QUOTES = {
  welcome: [
    '歡迎來到冰雪王國！跟我一起用數學魔法建造冰雪城堡吧！✨',
    '每解開一道題目，城堡就會多一座美麗的水晶雕像喔！❄️',
    '深呼吸，冰雪魔法隨時準備為你綻放！💎',
  ],
  arrange: [
    '先把橫式魔法數字放到直式格子裡吧！',
    '十位找十位、個位找個位，仔細想想看喔！',
    '相信你的智慧，你能把數字排得很整齊！',
  ],
  calcUnits: [
    '太棒了！現在讓我們來計算個位數！❄️',
    '數一數個位積木，相加或相減是多少呢？',
    '如果有滿十進一，要記得把魔法棒送給十位喔！🌟',
  ],
  calcTens: [
    '個位算對了！現在來算十位數吧！✨',
    '數數看十位棒有幾條？記得算上進位的魔法棒喔！',
  ],
  correct: [
    '太神奇了！冰雪魔法為你綻放！✨',
    '真厲害！城堡的水晶又更耀眼了！🏰',
    '愛莎公主為你喝采！繼續加油！👑',
    '完美的魔法計算！雪寶都在為你拍手呢！⛄',
  ],
  error: [
    '沒關係，冰雪魔法需要多試一次！再想一想喔！❄️',
    '差一點點囉！仔細看看題目，你一定可以的！💪',
  ],
};
