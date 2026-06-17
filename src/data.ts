import { VocabularyWord } from './types';

export const INITIAL_WORDS: VocabularyWord[] = [
  // 商務英語 (Business)
  {
    id: 'b1',
    word: 'Collaborate',
    phonetic: '/kəˈlæb.ə.reɪt/',
    translation: '合作；協同工作',
    example: 'Our design and marketing teams need to collaborate closely on this product launch.',
    exampleTranslation: '我們的設計和行銷團隊需要在此產品發布上緊密合作。',
    category: '商務英語',
    difficulty: 'Intermediate'
  },
  {
    id: 'b2',
    word: 'Aquisition',
    phonetic: '/ˌæk.wɪˈzɪʃ.ən/',
    translation: '收購；獲得物',
    example: 'The company announced the acquisition of a smaller competitor to expand its market share.',
    exampleTranslation: '該公司宣布收購一家較小的競爭對手，以擴大其市場份額。',
    category: '商務英語',
    difficulty: 'Advanced'
  },
  {
    id: 'b3',
    word: 'Negotiate',
    phonetic: '/nəˈɡoʊ.ʃi.eɪt/',
    translation: '談判；商議',
    example: 'After hours of discussion, they were able to negotiate a mutually beneficial contract.',
    exampleTranslation: '經過數小時的討論，他們終於談判出了一份互惠互利的合約。',
    category: '商務英語',
    difficulty: 'Intermediate'
  },
  {
    id: 'b4',
    word: 'Agenda',
    phonetic: '/əˈdʒen.də/',
    translation: '議程；應辦事項',
    example: 'The budget review is the first item on the agenda for today’s board meeting.',
    exampleTranslation: '預算審查是今天董事會會議議程上的第一個項目。',
    category: '商務英語',
    difficulty: 'Elementary'
  },
  {
    id: 'b5',
    word: 'Feasible',
    phonetic: '/ˈfiː.zə.bəl/',
    translation: '可行好的；可實行的',
    example: 'With our current budget and timeline, this project plan is highly feasible.',
    exampleTranslation: '以我們目前的預算和時間表，這個專案計劃是高度可行的。',
    category: '商務英語',
    difficulty: 'Intermediate'
  },
  {
    id: 'b6',
    word: 'Leverage',
    phonetic: '/ˈlev.ɚ.ɪdʒ/',
    translation: '槓桿；利用（資源等）',
    example: 'We can leverage our social media presence to increase registrations for the webinar.',
    exampleTranslation: '我們可以利用我們在社群媒體上的影響力來增加線上研討會的註冊量。',
    category: '商務英語',
    difficulty: 'Advanced'
  },

  // 日常英語 (Everyday)
  {
    id: 'e1',
    word: 'Delectable',
    phonetic: '/dɪˈlek.tə.bəl/',
    translation: '美味的；愉悅的',
    example: 'The bakery down the street offers a delectable selection of French pastries.',
    exampleTranslation: '街角的那家麵包店提供精美美味的法式糕點選擇。',
    category: '日常英語',
    difficulty: 'Advanced'
  },
  {
    id: 'e2',
    word: 'Curious',
    phonetic: '/ˈkjʊr.i.əs/',
    translation: '好奇的；奇特的',
    example: 'Children are naturally curious about how machines and devices work.',
    exampleTranslation: '孩童天生對機器和設備如何運作感到好奇。',
    category: '日常英語',
    difficulty: 'Elementary'
  },
  {
    id: 'e3',
    word: 'Cluttered',
    phonetic: '/ˈklʌt.ɚd/',
    translation: '雜亂的；塞滿的',
    example: 'It’s hard to focus when your workspace is cluttered with unused books and papers.',
    exampleTranslation: '當你的工作空間堆滿了沒用的書本和紙張時，很難集中注意力。',
    category: '日常英語',
    difficulty: 'Elementary'
  },
  {
    id: 'e4',
    word: 'Accustom',
    phonetic: '/əˈkʌs.təm/',
    translation: '使習慣於',
    example: 'It took him a few weeks to accustom himself to the early morning workout routine.',
    exampleTranslation: '他花了解幾週的時間才習慣清晨的健身行程。',
    category: '日常英語',
    difficulty: 'Intermediate'
  },
  {
    id: 'e5',
    word: 'Nostalgia',
    phonetic: '/nɑːˈstæl.dʒə/',
    translation: '懷舊之情；思鄉病',
    example: 'Listening to old school records brought back a wave of nostalgia for my college years.',
    exampleTranslation: '聽著老歌唱片，勾起了我對大學時光的一陣懷舊思緒。',
    category: '日常英語',
    difficulty: 'Advanced'
  },

  // 旅遊英語 (Travel)
  {
    id: 't1',
    word: 'Itinerary',
    phonetic: '/aɪˈtɪn.ə.rer.i/',
    translation: '旅程；旅行計畫',
    example: 'According to our itinerary, we will visit the ancient temple tomorrow morning.',
    exampleTranslation: '根據我們的行程安排，我們明天上午將參觀那座古廟。',
    category: '旅遊英語',
    difficulty: 'Intermediate'
  },
  {
    id: 't2',
    word: 'Picturesque',
    phonetic: '/ˌpɪk.tʃərˈesk/',
    translation: '風景如畫的；美麗的',
    example: 'They stayed in a picturesque mountain village near the Swiss border.',
    exampleTranslation: '他們住在瑞士邊境附近一座風景如畫的山村裡。',
    category: '旅遊英語',
    difficulty: 'Advanced'
  },
  {
    id: 't3',
    word: 'Destination',
    phonetic: '/ˌdes.təˈneɪ.ʃən/',
    translation: '目的地；終點',
    example: 'Paris remains one of the most popular tourist destinations in the world.',
    exampleTranslation: '巴黎仍然是世界上最受歡迎的旅遊目的地之一。',
    category: '旅遊英語',
    difficulty: 'Elementary'
  },
  {
    id: 't4',
    word: 'Hospitality',
    phonetic: '/ˌhɑː.spɪˈtæl.ə.t̬i/',
    translation: '殷勤款待；好客',
    example: 'We were deeply touched by the warmth and hospitality of the local families.',
    exampleTranslation: '我們被當地家庭的熱情和好客深深感動。',
    category: '旅遊英語',
    difficulty: 'Intermediate'
  },
  {
    id: 't5',
    word: 'Commute',
    phonetic: '/kəˈmjuːt/',
    translation: '通勤；上下班路程',
    example: 'She uses public transit for her daily commute to avoid city traffic.',
    exampleTranslation: '她每天通勤使用大眾運輸工具以避開市區交通。',
    category: '旅遊英語',
    difficulty: 'Elementary'
  },

  // 科技英文 (Tech)
  {
    id: 'tech1',
    word: 'Algorithm',
    phonetic: '/ˈæl.ɡə.rɪ.ðəm/',
    translation: '演算法；運算規則',
    example: 'The social media search algorithm customizes content feed based on your interests.',
    exampleTranslation: '社群媒體搜尋演算法會根據你的興趣自訂內容推播。',
    category: '科技英文',
    difficulty: 'Intermediate'
  },
  {
    id: 'tech2',
    word: 'Automate',
    phonetic: '/ˈɑː.t̬ə.meɪt/',
    translation: '使自動化',
    example: 'Modern smart systems can automate factory tasks to save time and reduce errors.',
    exampleTranslation: '現代智慧系統可以使工廠任務自動化，以節省時間並減少錯誤。',
    category: '科技英文',
    difficulty: 'Elementary'
  },
  {
    id: 'tech3',
    word: 'Ecosystem',
    phonetic: '/ˈiː.koʊˌsɪs.təm/',
    translation: '生態系統；（軟硬體）整合體系',
    example: 'Developers love to build apps within a closely integrated hardware ecosystem.',
    exampleTranslation: '開發者喜歡在高度整合的硬體生態系統中開發應用程式。',
    category: '科技英文',
    difficulty: 'Intermediate'
  },
  {
    id: 'tech4',
    word: 'Vulnerability',
    phonetic: '/ˌvʌl.nər.əˈbɪl.ə.t̬i/',
    translation: '漏洞；脆弱性',
    example: 'The software team quickly issued a patch to fix a critical security vulnerability.',
    exampleTranslation: '軟體團隊迅速發布了修補程式，以修復一個嚴重的安全性漏洞。',
    category: '科技英文',
    difficulty: 'Advanced'
  },
  {
    id: 'tech5',
    word: 'Interface',
    phonetic: '/ˈɪn.t̬ɚ.feɪs/',
    translation: '介面；接口',
    example: 'The design team worked hard to keep the user interface clean, simple, and intuitive.',
    exampleTranslation: '設計團隊努力使使用者介面保持乾淨、簡單且直覺。',
    category: '科技英文',
    difficulty: 'Elementary'
  }
];

export const CATEGORIES = ['全部', '商務英語', '日常英語', '旅遊英語', '科技英文'];
export const DIFFICULTIES = ['全部', 'Elementary', 'Intermediate', 'Advanced'];
export const PROGRESS_LABELS = {
  new: '未學習',
  learning: '學習中',
  mastered: '已掌握'
};
