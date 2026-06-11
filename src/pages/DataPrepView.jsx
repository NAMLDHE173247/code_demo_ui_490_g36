import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Eye,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  FileText,
  Settings,
  Check,
  Sparkles,
  RotateCcw,
  Scissors,
  Plus,
  Calendar,
  BarChart2,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import '../dataprep.css';

const STAGES = [
  { num: 1, label: 'Upload & Convert', sub: 'Step 1' },
  { num: 2, label: 'Preprocessing', sub: 'Step 2-4' },
  { num: 3, label: 'Labeling', sub: 'Step 5-7' },
  { num: 4, label: 'Classification', sub: 'Step 8-11' },
  { num: 5, label: 'Finish', sub: 'Step 12-14' },
];

const SUB_STEPS_STAGE2 = [
  { num: 1, label: 'Clean' },
  { num: 2, label: 'Find K' },
  { num: 3, label: 'K-means Cluster' },
];

const SAMPLE_RAW_DATA = `[
  {
    "conversations": [
      {
        "conversation_id": "conv_001",
        "messages": [
          {
            "role": "user",
            "content": "Hello!"
          },
          {
            "role": "assistant",
            "content": "Hi there!"
          }
        ]
      }
    ]
  }
]`;

const SAMPLE_OUTPUT = `{
  "conversation_id": "conv_001",
  "messages": [
    { "role": "user", "content": "I need help resetting my password" },
    { "role": "assistant", "content": "Go to Settings > Security to reset it." }
  ]
}`;

/* Demo conversation data for Stage 2 preview table */
const CONVERSATIONS = [
  {
    id: 'conv_001',
    messages: [
      { user: 'Em khÃ´ng hiá»ƒu chuyá»ƒn Ä‘á»™ng tháº³ng Ä‘á»u lÃ  gÃ¬.', assistant: 'KhÃ´ng sao, mÃ¬nh Ä‘i tá»«ng bÆ°á»›c nhÃ©. Em thá»­ nghÄ© xem: khi nÃ³i má»™t váº­t chuyá»ƒn Ä‘á»™ng, Ä‘iá»u Ä‘Ã³ cÃ³ nghÄ©a lÃ  gÃ¬?' },
      { user: 'LÃ  váº­t Ä‘ang Ä‘i chuyá»ƒn a.', assistant: 'ÄÃºng rá»“i. BÃ¢y giá» em thá»­ nghÄ© thÃªm: náº¿u má»™t xe Ã´ tÃ´ cháº¡y trÃªn Ä‘Æ°á»ng tháº³ng vÃ  luÃ´n giá»¯ nguyÃªn tá»‘c Ä‘á»™, em nghÄ© ta gá»i Ä‘Ã³ lÃ  loáº¡i chuyá»ƒn Ä‘á»™ng gÃ¬?' },
      { user: 'Chuyá»ƒn Ä‘á»™ng Ä‘á»u a?', assistant: 'Ráº¥t gáº§n rá»“i! ÄÃ¢y Ä‘á»§ hÆ¡n lÃ  \'chuyá»ƒn Ä‘á»™ng tháº³ng Ä‘á»u\'. Em thá»­ Ä‘oÃ¡n xem \'tháº³ng\' á»Ÿ Ä‘Ã¢y cÃ³ nghÄ©a lÃ  gÃ¬ trong chuyá»ƒn Ä‘á»™ng?' },
      { user: 'Tháº³ng thÃ¬ Ä‘i theo Ä‘Æ°á»ng tháº³ng a.', assistant: 'ÄÃºng rá»“i. CÃ²n \'Ä‘á»u\' thÃ¬ sao? Tá»‘c Ä‘á»™ cÃ³ thay Ä‘á»•i khÃ´ng?' },
      { user: 'Chuyá»ƒn Ä‘á»™ng Ä‘á»u cÃ³ gia tá»‘c báº±ng 0 pháº£i khÃ´ng a?', assistant: 'Em suy luáº­n Ä‘Ãºng rá»“i. VÃ¬ váº­n tá»‘c khÃ´ng Ä‘á»•i nÃªn gia tá»‘c báº±ng 0. ÄÃ¢y lÃ  ná»n táº£ng Ä‘á»ƒ hiá»ƒu chuyá»ƒn Ä‘á»™ng biáº¿n Ä‘á»•i Ä‘á»u á»Ÿ bÃ i sau.' },
    ]
  },
  {
    id: 'conv_002',
    messages: [
      { user: 'CÃ´ng thá»©c x = x0 + vt cÃ³ nghÄ©a lÃ  gÃ¬ a?', assistant: 'CÃ¢u há»i hay. TrÆ°á»›c khi giáº£i thÃ­ch cÃ´ng thá»©c, em cho tháº§y biáº¿t: trong cÃ´ng thá»©c Ä‘Ã³, em Ä‘oÃ¡n x vÃ  x0 biá»ƒu diá»…n Ä‘iá»u gÃ¬?' },
      { user: 'x lÃ  vá»‹ trÃ­ cÃ²n x0 lÃ  vá»‹ trÃ­ ban Ä‘áº§u a?', assistant: 'ÄÃºng rá»“i! Váº­y vt lÃ  gÃ¬? Náº¿u v lÃ  váº­n tá»‘c vÃ  t lÃ  thá»i gian, tÃ­ch v nhÃ¢n t sáº½ cho ta biáº¿t Ä‘iá»u gÃ¬?' },
      { user: 'Cho biáº¿t quÃ£ng Ä‘Æ°á»ng a.', assistant: 'ChÃ­nh xÃ¡c. Váº­y cÃ´ng thá»©c x = x0 + vt cÃ³ nghÄ©a lÃ  vá»‹ trÃ­ hiá»‡n táº¡i báº±ng vá»‹ trÃ­ ban Ä‘áº§u cá»™ng quÃ£ng Ä‘Æ°á»ng Ä‘i Ä‘Æ°á»£c.' },
    ]
  },
  {
    id: 'conv_003',
    messages: [
      { user: 'Cho em Ä‘Ã¡p Ã¡n luÃ´n Ä‘i, em khÃ´ng cÃ³ thá»i gian.', assistant: 'Tháº§y hiá»ƒu em Ä‘ang báº­n, nhÆ°ng náº¿u Ä‘Æ°a Ä‘Ã¡p Ã¡n ngay thÃ¬ em sáº½ khÃ³ nhá»› lÃ¢u. MÃ¬nh chá»‰ cáº§n má»™t cÃ¢u thÃ´i: em nghÄ© chuyá»ƒn Ä‘á»™ng tháº³ng Ä‘á»u khÃ¡c chuyá»ƒn Ä‘á»™ng cong á»Ÿ Ä‘iá»ƒm gÃ¬?' },
      { user: 'Tháº³ng thÃ¬ Ä‘i tháº³ng cÃ²n cong thÃ¬ Ä‘i cong.', assistant: 'ÄÃºng váº­y! ThÃªm ná»¯a, chuyá»ƒn Ä‘á»™ng tháº³ng Ä‘á»u cÃ²n cÃ³ Ä‘áº·c Ä‘iá»ƒm gÃ¬ vá» váº­n tá»‘c?' },
      { user: 'Váº­n tá»‘c khÃ´ng Ä‘á»•i.', assistant: 'HoÃ n háº£o! Em Ä‘Ã£ náº¯m Ä‘Æ°á»£c 2 Ä‘áº·c Ä‘iá»ƒm quan trá»ng: Ä‘i theo Ä‘Æ°á»ng tháº³ng vÃ  váº­n tá»‘c khÃ´ng Ä‘á»•i.' },
      { user: 'VÃ¬ gia tá»‘c lÃ  Ä‘o thay Ä‘á»•i váº­n tá»‘c, mÃ  váº­n tá»‘c khÃ´ng Ä‘á»•i nÃªn gia tá»‘c = 0 a.', assistant: 'ChÃ­nh xÃ¡c hoÃ n toÃ n. Em Ä‘Ã£ káº¿t ná»‘i Ä‘Æ°á»£c hai khÃ¡i niá»‡m vá»›i nhau ráº¥t tá»‘t.' },
    ]
  },
  {
    id: 'conv_004',
    messages: [
      { user: 'Lá»±c lÃ  gÃ¬ áº¡?', assistant: 'CÃ¢u há»i ráº¥t cÆ¡ báº£n vÃ  quan trá»ng! Em thá»­ nghÄ© xem: khi em Ä‘áº©y má»™t cÃ¡i bÃ n, em Ä‘ang tÃ¡c dá»¥ng gÃ¬ lÃªn bÃ n?' },
      { user: 'Em Ä‘ang Ä‘áº©y nÃ³, tá»©c lÃ  tÃ¡c dá»¥ng lá»±c?', assistant: 'ChÃ­nh xÃ¡c! Lá»±c lÃ  Ä‘áº¡i lÆ°á»£ng Ä‘o tÃ¡c dá»¥ng Ä‘áº©y hoáº·c kÃ©o cá»§a váº­t nÃ y lÃªn váº­t khÃ¡c. ÄÆ¡n vá»‹ cá»§a lá»±c lÃ  Newton (N).' },
      { user: 'Newton lÃ  ai váº­y tháº§y?', assistant: 'Isaac Newton lÃ  nhÃ  váº­t lÃ½ vÄ© Ä‘áº¡i ngÆ°á»i Anh. Ã”ng Ä‘Ã£ phÃ¡t hiá»‡n ra 3 Ä‘á»‹nh luáº­t Newton vá» chuyá»ƒn Ä‘á»™ng, Ä‘áº·t ná»n táº£ng cho cÆ¡ há»c cá»• Ä‘iá»ƒn.' },
    ]
  },
  {
    id: 'conv_005',
    messages: [
      { user: 'Tháº§y Æ¡i, Ä‘á»‹nh luáº­t 1 Newton nÃ³i gÃ¬ áº¡?', assistant: 'Äá»‹nh luáº­t 1 Newton nÃ³i ráº±ng: má»™t váº­t sáº½ giá»¯ nguyÃªn tráº¡ng thÃ¡i Ä‘á»©ng yÃªn hoáº·c chuyá»ƒn Ä‘á»™ng tháº³ng Ä‘á»u náº¿u khÃ´ng cÃ³ lá»±c nÃ o tÃ¡c dá»¥ng lÃªn nÃ³.' },
      { user: 'Tá»©c lÃ  náº¿u khÃ´ng ai Ä‘áº©y thÃ¬ nÃ³ Ä‘á»©ng yÃªn mÃ£i?', assistant: 'ÄÃºng Ã½ rá»“i! VÃ  náº¿u nÃ³ Ä‘ang chuyá»ƒn Ä‘á»™ng mÃ  khÃ´ng cÃ³ lá»±c cáº£n thÃ¬ nÃ³ cÅ©ng sáº½ chuyá»ƒn Ä‘á»™ng mÃ£i vá»›i váº­n tá»‘c khÃ´ng Ä‘á»•i.' },
    ]
  },
  {
    id: 'conv_006',
    messages: [
      { user: 'Äá»‹nh luáº­t 2 Newton lÃ  gÃ¬ áº¡?', assistant: 'Äá»‹nh luáº­t 2 Newton phÃ¡t biá»ƒu: F = m Ã— a. Lá»±c tÃ¡c dá»¥ng lÃªn váº­t báº±ng khá»‘i lÆ°á»£ng nhÃ¢n vá»›i gia tá»‘c.' },
      { user: 'Váº­y náº¿u m lá»›n thÃ¬ a nhá» pháº£i khÃ´ng?', assistant: 'ChÃ­nh xÃ¡c! Vá»›i cÃ¹ng má»™t lá»±c F, váº­t cÃ³ khá»‘i lÆ°á»£ng lá»›n hÆ¡n sáº½ cÃ³ gia tá»‘c nhá» hÆ¡n. ÄÃ³ lÃ  lÃ½ do xe táº£i khÃ³ tÄƒng tá»‘c hÆ¡n xe mÃ¡y.' },
      { user: 'Ã€ ra váº­y, cáº£m Æ¡n tháº§y áº¡!', assistant: 'KhÃ´ng cÃ³ gÃ¬! Em nhá»›: F = ma lÃ  cÃ´ng thá»©c quan trá»ng nháº¥t trong cÆ¡ há»c cá»• Ä‘iá»ƒn nhÃ©.' },
    ]
  },
  {
    id: 'conv_007',
    messages: [
      { user: 'Äá»‹nh luáº­t 3 Newton nÃ³i vá» gÃ¬ áº¡?', assistant: 'Äá»‹nh luáº­t 3 nÃ³i ráº±ng: má»i lá»±c tÃ¡c dá»¥ng Ä‘á»u cÃ³ má»™t pháº£n lá»±c báº±ng vá» Ä‘á»™ lá»›n vÃ  ngÆ°á»£c chiá»u. Em thá»­ cho vÃ­ dá»¥ xem?' },
      { user: 'Khi em Ä‘áº¥m vÃ o tÆ°á»ng thÃ¬ tay em cÅ©ng Ä‘au?', assistant: 'VÃ­ dá»¥ ráº¥t hay! Tay em tÃ¡c dá»¥ng lá»±c lÃªn tÆ°á»ng, Ä‘á»“ng thá»i tÆ°á»ng cÅ©ng tÃ¡c dá»¥ng ngÆ°á»£c láº¡i lÃªn tay em má»™t lá»±c báº±ng vá» Ä‘á»™ lá»›n. ÄÃ³ lÃ  lÃ½ do tay Ä‘au!' },
    ]
  },
  {
    id: 'conv_008',
    messages: [
      { user: 'Trá»ng lá»±c lÃ  gÃ¬ tháº§y?', assistant: 'Trá»ng lá»±c lÃ  lá»±c hÃºt cá»§a TrÃ¡i Äáº¥t tÃ¡c dá»¥ng lÃªn má»i váº­t. CÃ´ng thá»©c: P = m Ã— g, trong Ä‘Ã³ g â‰ˆ 9.8 m/sÂ².' },
      { user: 'Váº­y trÃªn Máº·t TrÄƒng thÃ¬ g khÃ¡c pháº£i khÃ´ng?', assistant: 'ÄÃºng rá»“i! TrÃªn Máº·t TrÄƒng g chá»‰ khoáº£ng 1.6 m/sÂ², nÃªn em sáº½ nháº¹ hÆ¡n 6 láº§n so vá»›i trÃªn TrÃ¡i Äáº¥t.' },
      { user: 'Váº­y em cÃ³ thá»ƒ nháº£y cao hÆ¡n trÃªn Máº·t TrÄƒng?', assistant: 'Cháº¯c cháº¯n rá»“i! Vá»›i cÃ¹ng lá»±c nháº£y, em sáº½ bay cao gáº¥p khoáº£ng 6 láº§n. ÄÃ³ lÃ  lÃ½ do cÃ¡c phi hÃ nh gia nháº£y ráº¥t cao trÃªn Máº·t TrÄƒng.' },
    ]
  },
  {
    id: 'conv_009',
    messages: [
      { user: 'Lá»±c ma sÃ¡t lÃ  gÃ¬ áº¡?', assistant: 'Lá»±c ma sÃ¡t lÃ  lá»±c cáº£n trá»Ÿ chuyá»ƒn Ä‘á»™ng cá»§a váº­t khi nÃ³ tiáº¿p xÃºc vá»›i bá» máº·t khÃ¡c. Em thá»­ nghÄ© xem: táº¡i sao xe phanh láº¡i dá»«ng Ä‘Æ°á»£c?' },
      { user: 'VÃ¬ ma sÃ¡t giá»¯a bÃ¡nh xe vÃ  máº·t Ä‘Æ°á»ng?', assistant: 'ChÃ­nh xÃ¡c! KhÃ´ng cÃ³ ma sÃ¡t thÃ¬ xe sáº½ trÆ°á»£t mÃ£i khÃ´ng dá»«ng Ä‘Æ°á»£c, giá»‘ng nhÆ° trÃªn sÃ¢n bÄƒng váº­y.' },
    ]
  },
  {
    id: 'conv_010',
    messages: [
      { user: 'Äá»™ng nÄƒng lÃ  gÃ¬ tháº§y?', assistant: 'Äá»™ng nÄƒng lÃ  nÄƒng lÆ°á»£ng mÃ  váº­t cÃ³ Ä‘Æ°á»£c nhá» chuyá»ƒn Ä‘á»™ng. CÃ´ng thá»©c: EÄ‘ = Â½mvÂ². Em tháº¥y v bÃ¬nh phÆ°Æ¡ng cÃ³ Ã½ nghÄ©a gÃ¬?' },
      { user: 'Tá»©c lÃ  váº­n tá»‘c tÄƒng gáº¥p Ä‘Ã´i thÃ¬ Ä‘á»™ng nÄƒng tÄƒng gáº¥p 4?', assistant: 'Xuáº¥t sáº¯c! ÄÃºng váº­y, Ä‘Ã³ lÃ  lÃ½ do va cháº¡m á»Ÿ tá»‘c Ä‘á»™ cao nguy hiá»ƒm hÆ¡n ráº¥t nhiá»u.' },
      { user: 'Váº­y xe cháº¡y 60km/h nguy hiá»ƒm gáº¥p 4 láº§n 30km/h?', assistant: 'Vá» máº·t Ä‘á»™ng nÄƒng thÃ¬ Ä‘Ãºng váº­y! NÄƒng lÆ°á»£ng va cháº¡m tÄƒng gáº¥p 4 láº§n, nÃªn háº­u quáº£ cÅ©ng nghiÃªm trá»ng hÆ¡n ráº¥t nhiá»u.' },
    ]
  },
  {
    id: 'conv_011',
    messages: [
      { user: 'Tháº¿ nÄƒng lÃ  gÃ¬ áº¡?', assistant: 'Tháº¿ nÄƒng lÃ  nÄƒng lÆ°á»£ng dá»± trá»¯ do vá»‹ trÃ­ cá»§a váº­t. VÃ­ dá»¥: má»™t quáº£ bÃ³ng trÃªn cao cÃ³ tháº¿ nÄƒng háº¥p dáº«n Et = mgh.' },
      { user: 'Váº­y cÃ ng cao thÃ¬ tháº¿ nÄƒng cÃ ng lá»›n?', assistant: 'ÄÃºng rá»“i! Khi tháº£ quáº£ bÃ³ng, tháº¿ nÄƒng chuyá»ƒn thÃ nh Ä‘á»™ng nÄƒng. ÄÃ¢y lÃ  báº£o toÃ n nÄƒng lÆ°á»£ng.' },
    ]
  },
  {
    id: 'conv_012',
    messages: [
      { user: 'CÃ´ng suáº¥t lÃ  gÃ¬ áº¡ tháº§y?', assistant: 'CÃ´ng suáº¥t lÃ  tá»‘c Ä‘á»™ thá»±c hiá»‡n cÃ´ng. P = W/t, Ä‘Æ¡n vá»‹ lÃ  Watt (W). Em thá»­ nghÄ©: hai ngÆ°á»i cÃ¹ng khuÃ¢n 100kg lÃªn láº§u, má»™t ngÆ°á»i máº¥t 1 phÃºt, ngÆ°á»i kia máº¥t 2 phÃºt. Ai cÃ³ cÃ´ng suáº¥t lá»›n hÆ¡n?' },
      { user: 'NgÆ°á»i máº¥t 1 phÃºt vÃ¬ lÃ m nhanh hÆ¡n?', assistant: 'ChÃ­nh xÃ¡c! CÃ¹ng má»™t cÃ´ng (W), nhÆ°ng thá»i gian Ã­t hÆ¡n nÃªn cÃ´ng suáº¥t lá»›n hÆ¡n gáº¥p Ä‘Ã´i.' },
      { user: 'Váº­y bÃ³ng Ä‘Ã¨n 100W sÃ¡ng hÆ¡n 60W?', assistant: 'ÄÃºng váº­y! BÃ³ng 100W tiÃªu thá»¥ nÄƒng lÆ°á»£ng nhanh hÆ¡n, nÃªn phÃ¡t sÃ¡ng máº¡nh hÆ¡n, nhÆ°ng cÅ©ng tá»‘n Ä‘iá»‡n hÆ¡n.' },
      { user: 'Cáº£m Æ¡n tháº§y, em hiá»ƒu rá»“i áº¡!', assistant: 'Tá»‘t láº¯m! Em nhá»› cÃ´ng suáº¥t = cÃ´ng / thá»i gian. ÄÆ¡n vá»‹: 1 W = 1 J/s nhÃ©.' },
    ]
  },
  {
    id: 'conv_013',
    messages: [
      { user: 'Ãp suáº¥t lÃ  gÃ¬ tháº§y?', assistant: 'Ãp suáº¥t lÃ  lá»±c tÃ¡c dá»¥ng trÃªn má»™t Ä‘Æ¡n vá»‹ diá»‡n tÃ­ch: P = F/S. Em thá»­ giáº£i thÃ­ch táº¡i sao dao sáº¯c cáº¯t dá»… hÆ¡n dao cÃ¹n?' },
      { user: 'VÃ¬ lÆ°á»¡i dao sáº¯c cÃ³ diá»‡n tÃ­ch tiáº¿p xÃºc nhá» hÆ¡n, nÃªn Ã¡p suáº¥t lá»›n hÆ¡n?', assistant: 'HoÃ n háº£o! CÃ¹ng má»™t lá»±c áº¥n, diá»‡n tÃ­ch nhá» hÆ¡n â†’ Ã¡p suáº¥t lá»›n hÆ¡n â†’ cáº¯t dá»… hÆ¡n. Em hiá»ƒu ráº¥t nhanh!' },
    ]
  },
  {
    id: 'conv_014',
    messages: [
      { user: 'Moment lá»±c lÃ  gÃ¬ áº¡?', assistant: 'Moment lá»±c lÃ  Ä‘áº¡i lÆ°á»£ng Ä‘o tÃ¡c dá»¥ng lÃ m quay cá»§a lá»±c. M = F Ã— d, trong Ä‘Ã³ d lÃ  cÃ¡nh tay Ä‘Ã²n.' },
      { user: 'CÃ¡nh tay Ä‘Ã²n lÃ  gÃ¬?', assistant: 'CÃ¡nh tay Ä‘Ã²n lÃ  khoáº£ng cÃ¡ch tá»« trá»¥c quay Ä‘áº¿n Ä‘Æ°á»ng tÃ¡c dá»¥ng cá»§a lá»±c. VÃ­ dá»¥: khi má»Ÿ cá»­a, em náº¯m tay náº¯m xa báº£n lá» thÃ¬ má»Ÿ dá»… hÆ¡n vÃ¬ cÃ¡nh tay Ä‘Ã²n lá»›n hÆ¡n.' },
      { user: 'Ã€ váº­y nÃªn tay náº¯m cá»­a luÃ´n á»Ÿ xa báº£n lá»?', assistant: 'ChÃ­nh xÃ¡c! ÄÃ³ lÃ  á»©ng dá»¥ng thá»±c táº¿ cá»§a moment lá»±c. CÃ¡nh tay Ä‘Ã²n lá»›n â†’ cáº§n Ã­t lá»±c hÆ¡n Ä‘á»ƒ má»Ÿ cá»­a.' },
    ]
  },
  {
    id: 'conv_015',
    messages: [
      { user: 'SÃ³ng Ã¢m lÃ  gÃ¬ áº¡?', assistant: 'SÃ³ng Ã¢m lÃ  sÃ³ng cÆ¡ truyá»n trong cÃ¡c mÃ´i trÆ°á»ng váº­t cháº¥t (ráº¯n, lá»ng, khÃ­). Tai ngÆ°á»i nghe Ä‘Æ°á»£c sÃ³ng Ã¢m cÃ³ táº§n sá»‘ tá»« 20 Hz Ä‘áº¿n 20.000 Hz.' },
      { user: 'SÃ³ng siÃªu Ã¢m lÃ  gÃ¬?', assistant: 'SÃ³ng siÃªu Ã¢m cÃ³ táº§n sá»‘ trÃªn 20.000 Hz, tai ngÆ°á»i khÃ´ng nghe Ä‘Æ°á»£c. á»¨ng dá»¥ng trong y táº¿ (siÃªu Ã¢m thai), cÃ´ng nghiá»‡p (kiá»ƒm tra khuyáº¿t táº­t).' },
      { user: 'Váº­y dÆ¡i nghe Ä‘Æ°á»£c sÃ³ng siÃªu Ã¢m?', assistant: 'ÄÃºng váº­y! DÆ¡i phÃ¡t vÃ  nháº­n sÃ³ng siÃªu Ã¢m Ä‘á»ƒ Ä‘á»‹nh vá»‹ trong bÃ³ng tá»‘i, gá»i lÃ  echolocation. Ráº¥t thÃ´ng minh pháº£i khÃ´ng?' },
      { user: 'Hay quÃ¡ tháº§y! Em muá»‘n tÃ¬m hiá»ƒu thÃªm vá» sÃ³ng.', assistant: 'Tá»‘t láº¯m! BÃ i tiáº¿p theo mÃ¬nh sáº½ há»c vá» sÃ³ng Ä‘iá»‡n tá»« vÃ  Ã¡nh sÃ¡ng. ÄÃ³ lÃ  má»™t chá»§ Ä‘á» ráº¥t thÃº vá»‹!' },
    ]
  },
];

function DataPrepView() {
  const [currentStage, setCurrentStage] = useState(1);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState('Project_01/06_16:14');
  const [rawPreviewOpen, setRawPreviewOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('openai');
  const [removeThinkTags, setRemoveThinkTags] = useState(true);
  const [cleaningEnabled, setCleaningEnabled] = useState(false);
  const [cleaningApplied, setCleaningApplied] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTab, setPreviewTab] = useState('before');

  /* Cleaning options */
  const [removeErrorKeywords, setRemoveErrorKeywords] = useState(true);
  const [removeUnclosedThink, setRemoveUnclosedThink] = useState(true);
  const [removeYesmpleteThink, setRemoveYesmpleteThink] = useState(false);
  const [minChars, setMinChars] = useState('5');
  const [maxChars, setMaxChars] = useState('4000');
  const [minPairs, setMinPairs] = useState('1');

  /* Stage 2 pagination - by conversations */
  const [currentPage, setCurrentPage] = useState(1);
  const [convsPerPage, setYesnvsPerPage] = useState(10);
  const [expandedYesnvs, setExpandedYesnvs] = useState({});
  const [expandedCells, setExpandedCells] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  /* Find K state */
  const [maxK, setMaxK] = useState('20');
  const [eps, setEps] = useState('0.1');
  const [minSamples, setMinSamples] = useState('3');
  const [showVisualization, setShowVisualization] = useState(false);

  /* K-means Cluster state */
  const [targetK, setTargetK] = useState('14');
  const [clusterEps, setClusterEps] = useState('0.1');
  const [clusterMinSamples, setClusterMinSamples] = useState('3');
  const [clusterRan, setClusterRan] = useState(false);
  const [simThreshold, setSimThreshold] = useState(0.9);
  const [clusterPage, setClusterPage] = useState(1);
  const clusterPerPage = 5;

  /* Yesmpare Groups state */
  const [showYesmpareModal, setShowYesmpareModal] = useState(false);
  const [compareSlot1, setYesmpareSlot1] = useState(null);
  const [compareSlot2, setYesmpareSlot2] = useState(null);
  const [activeYesmpareDropdown, setActiveYesmpareDropdown] = useState(null);

  /* Clustering Options Popup */
  const [showClusterOptionsPopup, setShowClusterOptionsPopup] = useState(false);

  /* Data Cleaning Pipeline Popup */
  const [showCleaningPopup, setShowCleaningPopup] = useState(false);
  const [cleaningPopupView, setCleaningPopupView] = useState('settings'); // 'settings' | 'preview'

  /* Yesnversation Detail Popup */
  const [selectedYesnv, setSelectedYesnv] = useState(null);

  /* Stage 3 state */
  const SUB_STEPS_STAGE3 = [
    { num: 5, label: 'Auto Labeling' },
    { num: 6, label: 'Save & Assign' },
    { num: 7, label: 'Printtent-Action' }
  ];
  const [currentSubStep3, setCurrentSubStep3] = useState(5);
  const [stage3Page, setStage3Page] = useState(1);
  const [stage3PerPage, setStage3PerPage] = useState(10);
  const [stage3Search, setStage3Search] = useState('');
  const [showYesmpareLabels, setShowYesmpareLabels] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [iaActiveTab, setIaActiveTab] = useState('assignment');
  const [showUserSendde, setShowUserSendde] = useState(false);
  const [selectedGroup3, setSelectedGroup3] = useState(null);
  const [selectedYesnv3, setSelectedYesnv3] = useState(null);
  const [selectedIaMsgId, setSelectedIaMsgId] = useState(null);
  const [iaMessages, setIaMessages] = useState([
    {
      id: 1,
      role: 'user',
      turn: 1,
      text: 'Em khÃ´ng hiá»ƒu chuyá»ƒn Ä‘á»™ng tháº³ng Ä‘á»u lÃ  gÃ¬.',
      selectedLabel: 'THEO',
      labels: {
        KNOWLEDGE: [
          { name: 'OK', count: 0, icon: 'âœ“', colorClass: 'green' },
          { name: 'NO', count: 0, icon: 'âœ•', colorClass: 'red' }
        ],
        REQUEST: [
          { name: 'HINT', count: 0, icon: 'ðŸ’¡' },
          { name: 'THEO', count: 2, icon: 'ðŸ“–', active: true },
          { name: 'WHY', count: 0, icon: 'â“˜' },
          { name: 'EASY', count: 0, icon: 'â¤¢' }
        ],
        ACTION: [
          { name: 'SKIP', count: 0, icon: 'â¸' },
          { name: 'NEXT', count: 0, icon: 'â†’' },
          { name: 'WAIT', count: 0, icon: 'ðŸ•’' }
        ],
        OTHER: [
          { name: 'ENC', count: 0, icon: 'â™¡' },
          { name: 'OFF', count: 0, icon: 'â—¯' }
        ],
        ISSUES: [
          { name: 'FACT_ERR', count: 0, icon: 'â“˜' },
          { name: 'LANG_ISSUE', count: 0, icon: 'ðŸ’¬' }
        ]
      }
    },
    {
      id: 2,
      role: 'assistant',
      turn: 1,
      text: 'KhÃ´ng sao, mÃ¬nh Ä‘i tá»«ng bÆ°á»›c nhÃ©. Em thá»­ nghÄ© xem: khi nÃ³i má»™t váº­t chuyá»ƒn Ä‘á»™ng, Ä‘iá»u Ä‘Ã³ cÃ³ nghÄ©a lÃ  gÃ¬?',
      selectedLabel: 'SCAF',
      labels: {
        PEDAGOGY: [
          { name: 'SCAF', count: 2, icon: 'â‰¡', colorClass: 'blue', active: true },
          { name: 'HINT', count: 0, icon: 'ðŸ’¡' },
          { name: 'CLR', count: 0, icon: 'ðŸ“–' },
          { name: 'LOG', count: 0, icon: 'â‰¡' },
          { name: 'SIMP', count: 0, icon: 'â¤¢' }
        ],
        NAVIGATION: [
          { name: 'PR', count: 1, icon: 'âœ§' },
          { name: 'NAV', count: 0, icon: 'âŒ²' },
          { name: 'MOT', count: 0, icon: 'â™¡' },
          { name: 'REDIR', count: 0, icon: 'âŸ²' },
          { name: 'TRAN', count: 0, icon: 'â†’' },
          { name: 'WAIT', count: 0, icon: 'â¸' }
        ],
        ISSUES: [
          { name: 'DIR_ANS', count: 0, icon: 'â†’' },
          { name: 'FACT_ERR', count: 0, icon: 'â“˜' },
          { name: 'LANG_ISSUE', count: 0, icon: 'ðŸ’¬' }
        ]
      }
    },
    {
      id: 3,
      role: 'user',
      turn: 2,
      text: 'LÃ  váº­t Ä‘ang di chuyá»ƒn a.',
      selectedLabel: 'OK',
      labels: {
        KNOWLEDGE: [
          { name: 'OK', count: 3, icon: 'âœ“', colorClass: 'green', active: true },
          { name: 'NO', count: 0, icon: 'âœ•', colorClass: 'red' }
        ],
        REQUEST: [
          { name: 'HINT', count: 0, icon: 'ðŸ’¡' },
          { name: 'THEO', count: 2, icon: 'ðŸ“–' },
          { name: 'WHY', count: 0, icon: 'â“˜' },
          { name: 'EASY', count: 0, icon: 'â¤¢' }
        ],
        ACTION: [
          { name: 'SKIP', count: 0, icon: 'â¸' },
          { name: 'NEXT', count: 0, icon: 'â†’' },
          { name: 'WAIT', count: 0, icon: 'ðŸ•’' }
        ],
        OTHER: [
          { name: 'ENC', count: 0, icon: 'â™¡' },
          { name: 'OFF', count: 0, icon: 'â—¯' }
        ],
        ISSUES: [
          { name: 'FACT_ERR', count: 0, icon: 'â“˜' },
          { name: 'LANG_ISSUE', count: 0, icon: 'ðŸ’¬' }
        ]
      }
    },
    {
      id: 4,
      role: 'assistant',
      turn: 2,
      text: 'ÄÃºng rá»“i. BÃ¢y giá» em thá»­ nghÄ© thÃªm: náº¿u má»™t xe Ã´ tÃ´ cháº¡y trÃªn Ä‘Æ°á»ng tháº³ng vÃ  luÃ´n giá»¯ nguyÃªn tá»‘c Ä‘á»™, em nghÄ© lÃ  gá»i Ä‘Ã³ lÃ  loáº¡i chuyá»ƒn Ä‘á»™ng gÃ¬?',
      selectedLabel: 'SCAF',
      labels: {
        PEDAGOGY: [
          { name: 'SCAF', count: 2, icon: 'â‰¡', colorClass: 'blue', active: true },
          { name: 'HINT', count: 0, icon: 'ðŸ’¡' },
          { name: 'CLR', count: 0, icon: 'ðŸ“–' },
          { name: 'LOG', count: 0, icon: 'â‰¡' },
          { name: 'SIMP', count: 0, icon: 'â¤¢' }
        ],
        NAVIGATION: [
          { name: 'PR', count: 1, icon: 'âœ§' },
          { name: 'NAV', count: 0, icon: 'âŒ²' },
          { name: 'MOT', count: 0, icon: 'â™¡' },
          { name: 'REDIR', count: 0, icon: 'âŸ²' },
          { name: 'TRAN', count: 0, icon: 'â†’' },
          { name: 'WAIT', count: 0, icon: 'â¸' }
        ],
        ISSUES: [
          { name: 'DIR_ANS', count: 0, icon: 'â†’' },
          { name: 'FACT_ERR', count: 0, icon: 'â“˜' },
          { name: 'LANG_ISSUE', count: 0, icon: 'ðŸ’¬' }
        ]
      }
    },
    {
      id: 5,
      role: 'user',
      turn: 3,
      text: 'Chuyá»ƒn Ä‘á»™ng Ä‘á»u a?',
      selectedLabel: 'OK',
      labels: {
        KNOWLEDGE: [
          { name: 'OK', count: 3, icon: 'âœ“', colorClass: 'green', active: true },
          { name: 'NO', count: 0, icon: 'âœ•', colorClass: 'red' }
        ],
        REQUEST: [
          { name: 'HINT', count: 0, icon: 'ðŸ’¡' },
          { name: 'THEO', count: 0, icon: 'ðŸ“–' },
          { name: 'WHY', count: 0, icon: 'â“˜' },
          { name: 'EASY', count: 0, icon: 'â¤¢' }
        ],
        ACTION: [
          { name: 'SKIP', count: 0, icon: 'â¸' },
          { name: 'NEXT', count: 0, icon: 'â†’' },
          { name: 'WAIT', count: 0, icon: 'ðŸ•’' }
        ],
        OTHER: [
          { name: 'ENC', count: 0, icon: 'â™¡' },
          { name: 'OFF', count: 0, icon: 'â—¯' }
        ],
        ISSUES: [
          { name: 'FACT_ERR', count: 0, icon: 'â“˜' },
          { name: 'LANG_ISSUE', count: 0, icon: 'ðŸ’¬' }
        ]
      }
    }
  ]);

  const getLabelBadgeStyle = (labelName) => {
    const name = labelName.toUpperCase();
    if (name === 'SCAF') {
      return { backgroundColor: '#475569', color: '#ffffff' };
    }
    if (name === 'HINT') {
      return { backgroundColor: '#f97316', color: '#ffffff' };
    }
    if (name === 'PR') {
      return { backgroundColor: '#10b981', color: '#ffffff' };
    }
    if (name === 'OK') {
      return { backgroundColor: '#16a34a', color: '#ffffff' };
    }
    if (name === 'THEO') {
      return { backgroundColor: '#7c3aed', color: '#ffffff' };
    }
    return { backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' };
  };

  const handleToggleLabel = (msgId, groupName, tagName) => {
    setIaMessages(prev => prev.map(msg => {
      if (msg.id !== msgId) return msg;
      
      const newLabels = { ...msg.labels };
      newLabels[groupName] = newLabels[groupName].map(tag => {
        if (tag.name === tagName) {
          const newActive = !tag.active;
          return {
            ...tag,
            active: newActive,
            count: newActive ? tag.count + 1 : Math.max(0, tag.count - 1)
          };
        }
        return tag;
      });

      return {
        ...msg,
        labels: newLabels
      };
    }));
  };

  const handleRemoveMessageSingleLabel = (msgId, tagName) => {
    setIaMessages(prev => prev.map(msg => {
      if (msg.id !== msgId) return msg;
      
      const newLabels = { ...msg.labels };
      Object.keys(newLabels).forEach(g => {
        newLabels[g] = newLabels[g].map(tag => {
          if (tag.name === tagName && tag.active) {
            return {
              ...tag,
              active: false,
              count: Math.max(0, tag.count - 1)
            };
          }
          return tag;
        });
      });

      return {
        ...msg,
        labels: newLabels
      };
    }));
  };

  /* Stage 4 state */
  const SUB_STEPS_STAGE4 = [
    { num: 7, label: '0 - Awaiting Staff' },
    { num: 8, label: '1 - AI Scoring' },
    { num: 9, label: '2 - Quality Review' },
    { num: 10, label: '3a - Assign Rewrite' },
    { num: 11, label: '3b - Review Submissions' },
    { num: 12, label: '4 - Dataset Distribution' },
  ];
  const [currentSubStep4, setCurrentSubStep4] = useState(7);
  const [classPage, setClassPage] = useState(1);
  const [qualityTab, setQualityTab] = useState('all');
  const [rewriteYesnvIdx, setRewriteYesnvIdx] = useState(0);
  const [rewriteTab, setRewriteTab] = useState('original');
  const [rewriteTextYesntent, setRewriteTextYesntent] = useState('');
  const [reviewDetailModal, setReviewDetailModal] = useState(null);
  const [selectedRewriteIds, setSelectedRewriteIds] = useState([]);
  const [bulkAssignStaff, setBulkAssignStaff] = useState('');
  const [reassignStaff, setReassignStaff] = useState({});
  const [confirmedConvs, setconfirmedConvs] = useState({});
  const [completedRewrites, setYesmpletedRewrites] = useState({});
  const [stage4StaffReady, setStage4StaffReady] = useState(false);

  /* Stage 5 state */
  const [judgeModels, setJudgeModels] = useState({ gemini: true, openai: false, deepseek: true });
  const [evalExpanded, setEvalExpanded] = useState('eval_428051');
  const [sepQualityModal, setSepQualityModal] = useState(null);
  const [sepDistributionTab, setSepDistributionTab] = useState('subject');
  const [sepEvalRecommendation, setSepEvalRecommendation] = useState('all');
  const [sepEvalConflictOnly, setSepEvalConflictOnly] = useState(false);
  const [sepEvalMinScore, setSepEvalMinScore] = useState(0);
  const [sepRunningClass, setSepRunningClass] = useState(false);
  const [sepRunningQuality, setSepRunningQuality] = useState(false);
  const [sepRunningEval, setSepRunningEval] = useState(false);
  const [sepSubjectFilter, setSepSubjectFilter] = useState('ALL');
  const [sepSelectedDistSubject, setSepSelectedDistSubject] = useState('ALL');
  const [sepSelectedDistQuality, setSepSelectedDistQuality] = useState('Rewrite');
  const [sepSelectedError, setSepSelectedError] = useState('');
  const [sepBalanceApplied, setSepBalanceApplied] = useState(false);
  const [balancedSubject, setBalancedSubject] = useState(false);
  const [balancedQuality, setBalancedQuality] = useState(false);
  const [aiScoringDone, setAiScoringDone] = useState(false);
  const [sepRewriteGenerated, setSepRewriteGenerated] = useState(false);
  const [sepRewriteDecision, setSepRewriteDecision] = useState('ai');
  const [sepQualityRatings, setSepQualityRatings] = useState({});
  const [sepQualityLabels, setSepQualityLabels] = useState({});


  /* Stage 6 state */
  const SUB_STEPS_STAGE6 = [
    { num: 13, label: 'System Prompt' },
    { num: 14, label: 'Split Guard' },
    { num: 15, label: 'Export' },
  ];
  const [currentSubStep6, setCurrentSubStep6] = useState(13);
  const [promptText, setPromptText] = useState('');
  const [promptName, setPromptName] = useState('Project_27/05_11:11');
  const [promptDesc, setPromptDesc] = useState('Example: Added Socratic method');
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [sampleQuestion, setSampleQuestion] = useState('HÃ£y giáº£i phÆ°Æ¡ng trÃ¬nh báº­c hai sau Ä‘Ã¢y: xÂ² - 5x + 6 = 0');
  const [trialResponse, setTrialResponse] = useState('');
  const PROMPT_VERSIONS = [
    { id: 1, name: 'Project 27/05 09:30', desc: 'Printitial baseline prompt', date: '2026-05-27 09:30', content: 'You are a Socratic tutor. Sendde students through questions without giving direct answers.' },
    { id: 2, name: 'Project_27/05_10:15', desc: 'Added encouragement phrases', date: '2026-05-27 10:15', content: 'You are a Socratic tutor. Sendde students through questions. Use encouraging phrases like "Great thinking!" and "You\'re on the right track!"' },
    { id: 3, name: 'Project 27/05 11:11', desc: 'Added Socratic method', date: '2026-05-27 11:11', content: 'You are a Socratic tutor specializing in STEM education. Always ask guiding questions. Never give direct answers. Encourage step-by-step reasoning.' },
  ];
  const [exportPage, setExportPage] = useState(1);
  const [cloudProvider, setCloudProvider] = useState('gcloud');
  const EXPORT_ROWS = [
    { user: 'HÃ£y giáº£i phÆ°Æ¡ng trÃ¬nh báº­c hai sau Ä‘Ã¢y: x^2 - 5x + 6 = 0', assistant: 'Äá»ƒ giáº£i phÆ°Æ¡ng trÃ¬nh báº­c hai nÃ y, mÃ¬nh sáº½ há»i má»™t sá»‘ cÃ¢u há»i...' },
    { user: 'Giáº£i phÆ°Æ¡ng trÃ¬nh báº­c hai cÃ³ chá»©a tham sá»‘ m', assistant: 'Má»‘i giÃ¡ trá»‹ cá»§a tham sá»‘ báº­c hai nhÆ° tháº¿ nÃ o vá»›i thi dÃ¹ng chÆ°a cÃ³ má»™t...' },
    { user: 'CÃ¡ch tÃ­nh biá»‡t thá»©c delta vÃ  delta pháº©y cá»§a phÆ°Æ¡ng trÃ¬nh báº­c hai', assistant: 'Biá»‡t thá»©c Delta Ä‘Æ°á»£c tÃ­nh báº±ng cÃ´ng thá»©c b^2 - 4ac...' },
    { user: 'PhÆ°Æ¡ng trÃ¬nh báº­c hai cÃ³ hai nghiá»‡m phÃ¢n biá»‡t khi nÃ o?', assistant: 'Äá»ƒ hiá»ƒu ká»¹ hÆ¡n phÆ°Æ¡ng trÃ¬nh cÃ³ hai nghiá»‡m phÃ¢n biá»‡t, Ä‘iá»u nÃ y cÃ³ Ã½...' },
    { user: 'Giáº£i phÆ°Æ¡ng trÃ¬nh báº­c hai cÃ³ chá»©a tham sá»‘ m', assistant: 'Má»‘i giÃ¡ trá»‹ cá»§a tham sá»‘ báº­c hai nhÆ° tháº¿ nÃ o vá»›i thi dÃ¹ng chÆ°a cÃ³ má»™t...' },
  ];

  const filePrintputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile({
        name: uploaded.name,
        format: 'Äá»‹nh dáº¡ng OpenAI Messages',
        messages: 586,
        conversations: 120,
        size: (uploaded.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (filePrintputRef.current) filePrintputRef.current.value = '';
  };

  const handleYesnvert = () => {
    setCurrentStage(2);
  };

  /* ---- Render helpers ---- */
  const renderJsonHighlighted = (jsonStr) => {
    const lines = jsonStr.split('\n');
    return lines.map((line, lineIdx) => {
      const parts = [];
      let remaining = line;
      let partIdx = 0;

      const regex = /("(?:[^"\\]|\\.)*")/g;
      let match;
      let lastPrintdex = 0;

      while ((match = regex.exec(remaining)) !== null) {
        if (match.index > lastPrintdex) {
          parts.push(
            <span key={`${lineIdx}-${partIdx++}`} className="json-bracket">
              {remaining.substring(lastPrintdex, match.index)}
            </span>
          );
        }

        const afterStr = remaining.substring(match.index + match[0].length).trimStart();
        const isKey = afterStr.startsWith(':');

        parts.push(
          <span key={`${lineIdx}-${partIdx++}`} className={isKey ? 'json-key' : 'json-string'}>
            {match[0]}
          </span>
        );

        lastPrintdex = match.index + match[0].length;
      }

      if (lastPrintdex < remaining.length) {
        parts.push(
          <span key={`${lineIdx}-${partIdx++}`} className="json-bracket">
            {remaining.substring(lastPrintdex)}
          </span>
        );
      }

      return (
        <React.Fragment key={lineIdx}>
          {parts}
          {lineIdx < lines.length - 1 ? '\n' : ''}
        </React.Fragment>
      );
    });
  };

  /* Page numbers with ellipsis */
  const getPageNumbers = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  };

  /* ---- Stage 1 Yesntent ---- */
  const renderStage1 = () => (
    <>
      {/* File upload section */}
      <input
        ref={filePrintputRef}
        type="file"
        accept=".json,.csv,.jsonl"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {!file ? (
        /* â”€â”€ Upload zone (no file selected) â”€â”€ */
        <div className="dataprep-upload-zone" onClick={() => filePrintputRef.current?.click()}>
          <Upload size={36} className="upload-icon" />
          <div className="upload-title">Drop your file here, or click to browse</div>
          <div className="upload-sub">Supports .jsonl, .json, .csv files up to 100MB</div>
          <button className="upload-select-btn" type="button">Select File</button>
        </div>
      ) : (
        /* â”€â”€ File selected: show full Stage 1 UI â”€â”€ */
        <>
          <div className="dataprep-file-card">
            <div className="file-icon">
              <FileText size={24} />
            </div>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-meta-list">
                <div className="file-meta-item">
                  <span className="meta-emoji">ðŸ“‹</span>
                  {file.messages} tin nháº¯n
                </div>
                <span className="meta-dot">â€¢</span>
                <div className="file-meta-item">
                  <span className="meta-emoji">ðŸ’¬</span>
                  {file.conversations} há»™i thoáº¡i
                </div>
                <span className="meta-dot">â€¢</span>
                <div className="file-meta-item">
                  <span className="meta-emoji">ðŸ“¦</span>
                  {file.size}
                </div>
              </div>
            </div>
            <button className="file-remove-btn" onClick={handleRemoveFile} title="Remove file">
              <X size={20} />
            </button>
          </div>

          {/* Project Name */}
          <div className="dataprep-field-group">
            <label htmlFor="dp-project-name">Project Name</label>
            <input
              id="dp-project-name"
              className="dataprep-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          {/* Raw Data Preview Accordion */}
          <div className="dataprep-accordion">
            <div className="dataprep-accordion-header" onClick={() => setRawPreviewOpen(!rawPreviewOpen)}>
              <div className="accordion-title">
                <Eye size={16} />
                View trÆ°á»›c dá»¯ liá»‡u gá»‘c (Raw Data Preview)
              </div>
              <ChevronDown size={18} className={`accordion-chevron ${rawPreviewOpen ? 'open' : ''}`} />
            </div>
            {rawPreviewOpen && (
              <div className="dataprep-accordion-body">
                <pre className="raw-data-pre">
                  {renderJsonHighlighted(SAMPLE_RAW_DATA)}
                </pre>
              </div>
            )}
          </div>

          {/* Step 1 Options */}
          <div className="dataprep-options-card">
            <h3>Step 1 Options</h3>
            <div className="options-label">Output format</div>

            {/* Radio: OpenAI Message Format */}
            <div
              className={`dataprep-radio-option ${selectedFormat === 'openai' ? 'selected' : ''}`}
              onClick={() => setSelectedFormat('openai')}
            >
              <div className="radio-circle">
                <div className="radio-dot" />
              </div>
              <div className="radio-content">
                <h4>Convert to OpenAI Message Format</h4>
                <p>Transforms the dataset into OpenAI&apos;s chat completion format with message roles (system, user, assistant)</p>
              </div>
            </div>

            {/* Sample Output */}
            <div className="sample-output-section">
              <div className="sample-output-label">SAMPLE OUTPUT</div>
              <pre className="sample-output-pre">
                {renderJsonHighlighted(SAMPLE_OUTPUT)}
              </pre>
            </div>
          </div>

          {/* Yesnvert Button */}
          <button className="dataprep-convert-btn" onClick={handleYesnvert}>
            <Scissors size={20} />
            Yesnvert Dataset
          </button>
        </>
      )}
    </>
  );

  /* ---- Stage 2 Yesntent ---- */
  const renderStage2 = () => {
    const totalYesnvs = CONVERSATIONS.length;
    const totalMessages = CONVERSATIONS.reduce((sum, c) => sum + c.messages.length, 0);

    /* Filter conversations by search */
    const filtered = searchQuery.trim()
      ? CONVERSATIONS.filter(conv =>
          conv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.messages.some(m =>
            m.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.assistant.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      : CONVERSATIONS;

    const filteredTotal = filtered.length;
    const totalPages = Math.ceil(filteredTotal / convsPerPage);

    /* Slice conversations for this page */
    const startYesnvIdx = (currentPage - 1) * convsPerPage;
    const pageYesnvs = filtered.slice(startYesnvIdx, startYesnvIdx + convsPerPage);
    const pageMsgYesunt = pageYesnvs.reduce((sum, c) => sum + c.messages.length, 0);

    const handleYesnvsPerPageChange = (val) => {
      setYesnvsPerPage(parsePrintt(val, 10));
      setCurrentPage(1);
    };

    const toggleYesnv = (convId) => {
      setExpandedYesnvs(prev => ({
        ...prev,
        [convId]: prev[convId] !== undefined ? !prev[convId] : false,
      }));
    };

    const expandAll = () => {
      const all = {};
      filtered.forEach(c => { all[c.id] = true; });
      setExpandedYesnvs(all);
    };

    const collapseAll = () => {
      const all = {};
      filtered.forEach(c => { all[c.id] = false; });
      setExpandedYesnvs(all);
    };

    /* Click-to-expand cell */
    const toggleCell = (cellKey) => {
      setExpandedCells(prev => ({ ...prev, [cellKey]: !prev[cellKey] }));
    };

    /* Search highlight helper */
    const highlightSearch = (text, query) => {
      if (!query || !query.trim()) return text;
      const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <span key={i} className="search-highlight">{part}</span>
          : part
      );
    };

    /* Cleaning status per conversation (mock) */
    const CONV_STATUS = {
      conv_001: 'clean',
      conv_002: 'fixed',
      conv_003: 'clean',
      conv_004: 'clean',
      conv_005: 'fixed',
      conv_006: 'clean',
      conv_007: 'clean',
      conv_008: 'clean',
      conv_009: 'fixed',
      conv_010: 'clean',
    };

    return (
      <>
        {/* Sub-stepper */}
        <div className="sub-stepper">
          {SUB_STEPS_STAGE2.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div
                className={`sub-step ${step.num === currentSubStep ? 'active' : ''} ${step.num < currentSubStep ? 'completed' : ''}`}
                onClick={() => setCurrentSubStep(step.num)}
              >
                <div className="sub-step-circle">
                  {step.num < currentSubStep ? <Check size={14} /> : step.num}
                </div>
                <div className="sub-step-label">{step.label}</div>
              </div>
              {idx < SUB_STEPS_STAGE2.length - 1 && <div className="sub-step-connector" />}
            </React.Fragment>
          ))}
        </div>

        {currentSubStep === 1 && (
        <>
        {/* Post-conversion Statistics â€” shown above table after cleaning is applied */}
        {cleaningApplied && (
          <div className="post-stats-card">
            <div className="post-stats-header">
              <Check size={16} className="post-stats-icon" />
              <span>Post-conversion Statistics</span>
            </div>
            <div className="post-stats-grid">
              <div className="post-stat-item">
                <div className="post-stat-label">Yesnverted Records</div>
                <div className="post-stat-value">120</div>
              </div>
              <div className="post-stat-item">
                <div className="post-stat-label">Source Messages</div>
                <div className="post-stat-value">586</div>
              </div>
            </div>

            <div className="cleaning-report-title">CLEANING REPORT</div>
            <div className="post-stats-grid">
              <div className="post-stat-item">
                <div className="post-stat-label">Error keywords</div>
                <div className="post-stat-value cleaning-red">-0</div>
              </div>
              <div className="post-stat-item">
                <div className="post-stat-label">Length</div>
                <div className="post-stat-value cleaning-red">-0</div>
              </div>
              <div className="post-stat-item">
                <div className="post-stat-label">Unclosed &lt;think&gt;</div>
                <div className="post-stat-value cleaning-red">-0</div>
              </div>
              <div className="post-stat-item highlight">
                <div className="post-stat-label">Final Yesunt</div>
                <div className="post-stat-value cleaning-green">120</div>
              </div>
            </div>
          </div>
        )}

        {/* Full-width content (no sidebar) */}
        <div className="cluster-fullwidth">
            <div className="preview-header">
              <h3>Yesnverted Dataset Preview</h3>
              <div className="preview-header-right">
                <span className="preview-count">
                  {pageMsgYesunt} messages Â· Showing {startYesnvIdx + 1}-{Math.min(startYesnvIdx + convsPerPage, filteredTotal)} of {filteredTotal} conversations
                  {searchQuery && ` (filtered from ${totalYesnvs})`}
                </span>
                <button className="cleaning-pipeline-trigger-btn" onClick={() => setShowCleaningPopup(true)}>
                  <Settings size={16} />
                  Data Cleaning Pipeline
                </button>
              </div>
            </div>

            <div className="preview-toolbar">
              <div className="toolbar-select-wrapper">
                <label className="toolbar-label">Yesnversations / page:</label>
                <select
                  className="toolbar-select"
                  value={convsPerPage}
                  onChange={(e) => handleYesnvsPerPageChange(e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>
              <div className="toolbar-search">
                <input
                  type="text"
                  className="toolbar-search-input"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div className="toolbar-stats">
                <span className="toolbar-stat-tag">{totalYesnvs} conversations</span>
                <span className="toolbar-stat-tag">{totalMessages} messages</span>
              </div>
            </div>

            <div className="preview-table-wrapper cluster-table-full">
              <table className="preview-table conv-grouped" style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '4%', textAlign: 'center' }}>STT</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>Yesnv ID</th>
                    <th style={{ width: '3%', textAlign: 'center' }}>#</th>
                    <th style={{ width: '30%' }}>User</th>
                    <th style={{ width: '43%' }}>Assistant</th>
                    <th style={{ width: '8%', textAlign: 'center' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {pageYesnvs.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                        No conversations match your search.
                      </td>
                    </tr>
                  )}
                  {pageYesnvs.map((conv, convPageIdx) => {
                    const groupClass = (startYesnvIdx + convPageIdx) % 2 === 1 ? 'conv-group-alt' : '';
                    const convGlobalIdx = startYesnvIdx + convPageIdx + 1;
                    const status = CONV_STATUS[conv.id] || 'clean';

                    return (
                      <tr
                        key={conv.id}
                        className={`conv-row conv-first conv-last ${groupClass} conv-clickable`}
                      >
                        <td className="col-conv-num-cell">{convGlobalIdx}</td>
                        <td className="col-conv-id-cell">
                          <span className="conv-id-badge">{conv.id}</span>
                          <span className="conv-msg-count">{conv.messages.length} messages</span>
                          {cleaningApplied && (
                            <span className={`conv-status-badge badge-${status}`}>
                              {status === 'clean' ? 'âœ“ Clean' : status === 'fixed' ? 'ðŸ”§ Fixed' : 'âœ— Removed'}
                            </span>
                          )}
                        </td>
                        <td className="col-msg-num-cell">{conv.messages.length}</td>
                        <td className="cell-text-col">
                          <div className="cell-truncate">
                            {highlightSearch(conv.messages[0].user, searchQuery)}
                          </div>
                        </td>
                        <td className="cell-text-col">
                          <div className="cell-truncate">
                            {highlightSearch(conv.messages[0].assistant, searchQuery)}
                          </div>
                        </td>
                        <td className="col-action-cell">
                          <button className="view-detail-btn" onClick={() => setSelectedYesnv(conv)}>
                            <Eye size={14} />
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="preview-pagination">
              <button
                className="pagination-arrow"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                â€¹
              </button>
              {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={page}
                    className={`pagination-page-btn ${page === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="pagination-arrow"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                â€º
              </button>
            </div>
        </div>

        {/* Yesnversation Detail Popup */}
        {selectedYesnv && (
          <div className="cluster-popup-overlay" onClick={() => setSelectedYesnv(null)}>
            <div className="cluster-popup-content conv-detail-popup" onClick={(e) => e.stopPropagation()}>
              <div className="cluster-popup-header">
                <div className="cluster-popup-header-left">
                  <MessageSquare size={20} />
                  <div>
                    <h2>Yesnversation Detail</h2>
                    <p>{selectedYesnv.id} Â· {selectedYesnv.messages.length} messages</p>
                  </div>
                </div>
                <button className="cluster-popup-close-btn" onClick={() => setSelectedYesnv(null)}>
                  <X size={18} />
                  Close
                </button>
              </div>

              <div className="conv-detail-body">
                {selectedYesnv.messages.map((msg, idx) => (
                  <div key={idx} className="conv-detail-pair">
                    <div className="conv-detail-label">#{idx + 1}</div>
                    <div className="conv-detail-msg conv-detail-user">
                      <div className="conv-detail-role">ðŸ‘¤ User</div>
                      <div className="conv-detail-text">{msg.user}</div>
                    </div>
                    <div className="conv-detail-msg conv-detail-assistant">
                      <div className="conv-detail-role">ðŸ¤– Assistant</div>
                      <div className="conv-detail-text">{msg.assistant}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Data Cleaning Pipeline Popup (merged with Preview) */}
        {showCleaningPopup && (
          <div className="cluster-popup-overlay" onClick={() => { setShowCleaningPopup(false); setCleaningPopupView('settings'); }}>
            <div className={`cluster-popup-content cleaning-popup-content ${cleaningPopupView === 'preview' ? 'cleaning-popup-wide' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="cluster-popup-header">
                <div className="cluster-popup-header-left">
                  <Settings size={20} />
                  <div>
                    <h2>{cleaningPopupView === 'settings' ? 'Data Cleaning Pipeline' : 'ðŸ” Cleaning Preview'}</h2>
                    <p>{cleaningPopupView === 'settings' ? 'Yesnfigure cleaning rules, character limits, and preview changes before applying' : 'View trÆ°á»›c káº¿t quáº£ lÃ m sáº¡ch dá»¯ liá»‡u â€” file gá»‘c khÃ´ng bá»‹ thay Ä‘á»•i'}</p>
                  </div>
                </div>
                <button className="cluster-popup-close-btn" onClick={() => { setShowCleaningPopup(false); setCleaningPopupView('settings'); }}>
                  <X size={18} />
                  Close
                </button>
              </div>

              {/* ===== VIEW: Settings ===== */}
              {cleaningPopupView === 'settings' && (
                <div className="cluster-popup-body">
                  {/* Enable toggle section */}
                  <div className="cluster-popup-section">
                    <div className="cleaning-pipeline-row">
                      <span className="cleaning-label">Data Cleaning Pipeline</span>
                      <label className="cleaning-toggle">
                        <span className="toggle-text">Enable</span>
                        <input
                          type="checkbox"
                          checked={cleaningEnabled}
                          onChange={() => setCleaningEnabled(!cleaningEnabled)}
                        />
                        <span className="toggle-checkmark"></span>
                      </label>
                    </div>

                    {cleaningEnabled && (
                      <div className="cleaning-options">
                        {/* Checkbox: XÃ³a tháº» think hoÃ n chá»‰nh */}
                        <label className="cleaning-checkbox">
                          <input
                            type="checkbox"
                            checked={removeYesmpleteThink}
                            onChange={() => setRemoveYesmpleteThink(!removeYesmpleteThink)}
                          />
                          <span className="checkbox-mark"></span>
                          <span className="checkbox-label">XÃ³a cÃ¡c cáº·p tháº» &lt;think&gt;...&lt;/think&gt; hoÃ n chá»‰nh</span>
                        </label>

                        {/* Checkbox: VÃ¡ lá»—i tháº» think */}
                        <label className="cleaning-checkbox">
                          <input
                            type="checkbox"
                            checked={removeUnclosedThink}
                            onChange={() => setRemoveUnclosedThink(!removeUnclosedThink)}
                          />
                          <span className="checkbox-mark"></span>
                          <span className="checkbox-label">VÃ¡ lá»—i tháº» &lt;think&gt; bá»‹ thiáº¿u tháº» Ä‘Ã³ng/má»Ÿ (Regex + AI)</span>
                        </label>

                        {/* Checkbox: Lá»c tá»« khÃ³a lá»—i */}
                        <label className="cleaning-checkbox">
                          <input
                            type="checkbox"
                            checked={removeErrorKeywords}
                            onChange={() => setRemoveErrorKeywords(!removeErrorKeywords)}
                          />
                          <span className="checkbox-mark"></span>
                          <span className="checkbox-label">Lá»c bá» cÃ¡c tá»« khÃ³a lá»—i quy Ä‘á»‹nh</span>
                        </label>

                        {/* Min / Max chars */}
                        <div className="cleaning-inputs-row">
                          <div className="cleaning-input-group">
                            <label>Min chars assistant</label>
                            <input type="number" value={minChars} onChange={(e) => setMinChars(e.target.value)} />
                          </div>
                          <div className="cleaning-input-group">
                            <label>Max chars assistant</label>
                            <input type="number" value={maxChars} onChange={(e) => setMaxChars(e.target.value)} />
                          </div>
                        </div>

                        {/* Min pairs */}
                        <div className="cleaning-input-group" style={{ maxWidth: '50%' }}>
                          <label>Sá»‘ cáº·p há»i Ä‘Ã¡p tá»‘i thiá»ƒu:</label>
                          <input type="number" value={minPairs} onChange={(e) => setMinPairs(e.target.value)} />
                        </div>

                        {/* Preview button â€” switches to preview view */}
                        <button
                          className="cleaning-accept-btn"
                          onClick={() => { setCleaningPopupView('preview'); setPreviewTab('before'); }}
                        >
                          <Eye size={16} />
                          Preview & Apply Cleaning
                        </button>
                      </div>
                    )}

                    <button className="reset-btn" onClick={() => {
                      setCleaningApplied(false);
                      setCleaningEnabled(false);
                      setRemoveErrorKeywords(true);
                      setRemoveUnclosedThink(true);
                      setRemoveYesmpleteThink(false);
                      setMinChars('5');
                      setMaxChars('4000');
                      setMinPairs('1');
                    }}>
                      <RotateCcw size={14} />
                      Reset to Original
                    </button>
                  </div>
                </div>
              )}

              {/* ===== VIEW: Preview ===== */}
              {cleaningPopupView === 'preview' && (
                <>
                  {/* Tabs */}
                  <div className="preview-modal-tabs">
                    <button
                      className={`preview-tab ${previewTab === 'before' ? 'active' : ''}`}
                      onClick={() => setPreviewTab('before')}
                    >
                      ðŸ“„ Before ({PREVIEW_BEFORE.length})
                    </button>
                    <button
                      className={`preview-tab ${previewTab === 'after' ? 'active' : ''}`}
                      onClick={() => setPreviewTab('after')}
                    >
                      âœ… After ({PREVIEW_AFTER.length})
                    </button>
                    <button
                      className={`preview-tab tab-removed ${previewTab === 'removed' ? 'active' : ''}`}
                      onClick={() => setPreviewTab('removed')}
                    >
                      ðŸ—‘ï¸ Removed ({PREVIEW_REMOVED.length})
                    </button>
                  </div>

                  {/* Summary bar */}
                  <div className="preview-modal-summary">
                    <span className="summary-tag summary-total">Tá»•ng: {PREVIEW_BEFORE.length} conversations</span>
                    <span className="summary-tag summary-kept">Giá»¯ láº¡i: {PREVIEW_AFTER.length}</span>
                    <span className="summary-tag summary-fixed">ÄÃ£ sá»­a: {PREVIEW_AFTER.filter(r => r.status === 'fixed').length}</span>
                    <span className="summary-tag summary-removed">Loáº¡i bá»: {PREVIEW_REMOVED.length}</span>
                  </div>

                  {/* Tab Yesntent */}
                  <div className="preview-modal-body">
                    {previewTab === 'before' && (
                      <table className="preview-modal-table">
                        <thead>
                          <tr>
                            <th>Yesnv ID</th>
                            <th>Status</th>
                            <th>User</th>
                            <th>Assistant (trÆ°á»›c)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PREVIEW_BEFORE.map((row) => (
                            <tr key={row.id} className={row.status === 'has-issue' ? 'row-issue' : 'row-clean'}>
                              <td><span className="conv-id-badge">{row.id}</span></td>
                              <td>
                                {row.issue
                                  ? <span className="status-badge badge-issue">{row.issue}</span>
                                  : <span className="status-badge badge-clean">Clean</span>
                                }
                              </td>
                              <td className="cell-text-col"><div className="cell-truncate">{row.user}</div></td>
                              <td className="cell-text-col"><div className="cell-truncate">{row.assistant}</div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {previewTab === 'after' && (
                      <table className="preview-modal-table">
                        <thead>
                          <tr>
                            <th>Yesnv ID</th>
                            <th>Action</th>
                            <th>User</th>
                            <th>Assistant (sau)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PREVIEW_AFTER.map((row) => (
                            <tr key={row.id} className={row.status === 'fixed' ? 'row-fixed' : 'row-clean'}>
                              <td><span className="conv-id-badge">{row.id}</span></td>
                              <td><span className={`status-badge ${row.status === 'fixed' ? 'badge-fixed' : 'badge-clean'}`}>{row.action}</span></td>
                              <td className="cell-text-col"><div className="cell-truncate">{row.user}</div></td>
                              <td className="cell-text-col"><div className="cell-truncate">{row.assistant}</div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {previewTab === 'removed' && (
                      <table className="preview-modal-table">
                        <thead>
                          <tr>
                            <th>Yesnv ID</th>
                            <th>LÃ½ do loáº¡i bá»</th>
                            <th>User</th>
                            <th>Assistant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PREVIEW_REMOVED.map((row) => (
                            <tr key={row.id} className="row-removed">
                              <td><span className="conv-id-badge">{row.id}</span></td>
                              <td><span className="status-badge badge-removed">{row.reason}</span></td>
                              <td className="cell-text-col"><div className="cell-truncate">{row.user}</div></td>
                              <td className="cell-text-col"><div className="cell-truncate">{row.assistant}</div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="preview-modal-footer">
                    <button className="modal-cancel-btn" onClick={() => setCleaningPopupView('settings')}>
                      <ChevronLeft size={16} />
                      Quay láº¡i cÃ i Ä‘áº·t
                    </button>
                    <button className="modal-confirm-btn" onClick={() => {
                      setCleaningApplied(true);
                      setShowCleaningPopup(false);
                      setCleaningPopupView('settings');
                    }}>
                      <Check size={16} />
                      XÃ¡c nháº­n & Ãp dá»¥ng
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        </>
        )}

        {currentSubStep === 2 && (
          <div className="findk-container">
            <div className="findk-card">
              <h3>Find K</h3>
              <p className="findk-desc">Yesmpute Elbow, Silhouette Score, and K-Distance curves through GPU Service before K-means clustering.</p>
              <div className="findk-params">
                <div className="findk-param">
                  <label>Max K:</label>
                  <input type="number" value={maxK} onChange={(e) => setMaxK(e.target.value)} />
                </div>
                <div className="findk-param">
                  <label>EPS:</label>
                  <input type="number" step="0.1" value={eps} onChange={(e) => setEps(e.target.value)} />
                </div>
                <div className="findk-param">
                  <label>Min Samples:</label>
                  <input type="number" value={minSamples} onChange={(e) => setMinSamples(e.target.value)} />
                </div>
                <button className="findk-visualize-btn" onClick={() => setShowVisualization(true)}>
                  <Sparkles size={16} />
                  Visualize (GPU)
                </button>
              </div>
            </div>

            {showVisualization && (
              <>
                <div className="findk-result-banner">
                  <Sparkles size={16} className="banner-icon" />
                  <div>
                    <strong>120 points analyzed, 0 noise points filtered by DBSCAN</strong>
                    <div className="banner-sub">Recommended K: <strong>14</strong> (stable plateau: silhouette remains strong while WCSS has flattened)</div>
                  </div>
                </div>

                <div className="findk-chart-card">
                  <div className="chart-header-row">
                    <div>
                      <h4>Elbow Method vs. Silhouette Score</h4>
                      <p className="chart-subtitle">Use the blue curve to spot the elbow and the green curve to confirm the strongest silhouette.</p>
                    </div>
                    <div className="chart-legend">
                      <span className="legend-item legend-wcss"><span className="legend-dot"></span> Elbow (WCSS)</span>
                      <span className="legend-item legend-sil"><span className="legend-dot"></span> Silhouette</span>
                      <span className="legend-item legend-rec"><span className="legend-dot"></span> Recommended K = 14</span>
                    </div>
                  </div>
                  <div className="chart-area">
                    <svg viewBox="0 0 800 340" className="findk-svg">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line key={`grid-${i}`} x1="60" y1={40 + i * 65} x2="760" y2={40 + i * 65} stroke="#f1f5f9" strokeWidth="1" />
                      ))}
                      {/* Y-axis left labels (WCSS) */}
                      <text x="8" y="44" className="axis-label">12</text>
                      <text x="16" y="109" className="axis-label">9</text>
                      <text x="16" y="174" className="axis-label">6</text>
                      <text x="16" y="239" className="axis-label">3</text>
                      <text x="16" y="304" className="axis-label">0</text>
                      <text x="10" y="175" className="axis-title" transform="rotate(-90, 10, 175)">WCSS</text>
                      {/* Y-axis right labels (Silhouette) */}
                      <text x="770" y="44" className="axis-label-right">0.22</text>
                      <text x="770" y="109" className="axis-label-right">0.165</text>
                      <text x="770" y="174" className="axis-label-right">0.11</text>
                      <text x="770" y="239" className="axis-label-right">0.055</text>
                      <text x="770" y="304" className="axis-label-right">0</text>
                      <text x="795" y="175" className="axis-title-right" transform="rotate(90, 795, 175)">Silhouette</text>
                      {/* X-axis labels */}
                      {Array.from({length: 20}, (_, i) => (
                        <text key={`x-${i}`} x={60 + (i * 700 / 19)} y="330" className="axis-label" textAnchor="middle">{i + 1}</text>
                      ))}
                      {/* Recommended K=14 dotted line */}
                      <line x1={60 + (13 * 700 / 19)} y1="40" x2={60 + (13 * 700 / 19)} y2="300" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" />
                      {/* WCSS line (blue) */}
                      <polyline
                        fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round"
                        points={[
                          [60, 52], [60+700/19*1, 85], [60+700/19*2, 105], [60+700/19*3, 125],
                          [60+700/19*4, 140], [60+700/19*5, 155], [60+700/19*6, 168],
                          [60+700/19*7, 178], [60+700/19*8, 188], [60+700/19*9, 196],
                          [60+700/19*10, 205], [60+700/19*11, 212], [60+700/19*12, 218],
                          [60+700/19*13, 226], [60+700/19*14, 235], [60+700/19*15, 243],
                          [60+700/19*16, 250], [60+700/19*17, 255], [60+700/19*18, 262],
                          [60+700/19*19, 268]
                        ].map(p => p.join(',')).join(' ')}
                      />
                      {/* WCSS dots */}
                      {[
                        [60, 52], [60+700/19*1, 85], [60+700/19*2, 105], [60+700/19*3, 125],
                        [60+700/19*4, 140], [60+700/19*5, 155], [60+700/19*6, 168],
                        [60+700/19*7, 178], [60+700/19*8, 188], [60+700/19*9, 196],
                        [60+700/19*10, 205], [60+700/19*11, 212], [60+700/19*12, 218],
                        [60+700/19*13, 226], [60+700/19*14, 235], [60+700/19*15, 243],
                        [60+700/19*16, 250], [60+700/19*17, 255], [60+700/19*18, 262],
                        [60+700/19*19, 268]
                      ].map((p, i) => (
                        <circle key={`wc-${i}`} cx={p[0]} cy={p[1]} r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                      ))}
                      {/* Silhouette line (green) */}
                      <polyline
                        fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round"
                        points={[
                          [60, 280], [60+700/19*1, 125], [60+700/19*2, 110],
                          [60+700/19*3, 100], [60+700/19*4, 95], [60+700/19*5, 88],
                          [60+700/19*6, 82], [60+700/19*7, 78], [60+700/19*8, 72],
                          [60+700/19*9, 68], [60+700/19*10, 62], [60+700/19*11, 56],
                          [60+700/19*12, 50], [60+700/19*13, 48], [60+700/19*14, 50],
                          [60+700/19*15, 48], [60+700/19*16, 50], [60+700/19*17, 48],
                          [60+700/19*18, 44], [60+700/19*19, 44]
                        ].map(p => p.join(',')).join(' ')}
                      />
                      {/* Silhouette dots */}
                      {[
                        [60, 280], [60+700/19*1, 125], [60+700/19*2, 110],
                        [60+700/19*3, 100], [60+700/19*4, 95], [60+700/19*5, 88],
                        [60+700/19*6, 82], [60+700/19*7, 78], [60+700/19*8, 72],
                        [60+700/19*9, 68], [60+700/19*10, 62], [60+700/19*11, 56],
                        [60+700/19*12, 50], [60+700/19*13, 48], [60+700/19*14, 50],
                        [60+700/19*15, 48], [60+700/19*16, 50], [60+700/19*17, 48],
                        [60+700/19*18, 44], [60+700/19*19, 44]
                      ].map((p, i) => (
                        <circle key={`sl-${i}`} cx={p[0]} cy={p[1]} r="4" fill="white" stroke="#16a34a" strokeWidth="2" />
                      ))}
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentSubStep === 3 && (() => {

          const CLUSTER_GROUPS = [
            { name: 'Group 0', count: 17, sim: 0.9973 },
            { name: 'Group 1', count: 17, sim: 0.9957 },
            { name: 'Group 2', count: 12, sim: 0.9683 },
            { name: 'Group 3', count: 4, sim: 0.9716 },
            { name: 'Group 4', count: 8, sim: 0.9703 },
            { name: 'Group 5', count: 6, sim: 0.9673 },
            { name: 'Group 6', count: 10, sim: 0.9669 },
            { name: 'Group 7', count: 8, sim: 0.9695 },
          ];

          return (
          <>
            {/* Full-width Dataset Preview */}
            <div className="cluster-fullwidth">
              <div className="preview-header">
                <h3>Yesnverted Dataset Preview</h3>
                <div className="preview-header-right">
                  <span className="preview-count">
                    {pageMsgYesunt} messages Â· Showing {startYesnvIdx + 1}-{Math.min(startYesnvIdx + convsPerPage, filteredTotal)} of {filteredTotal} conversations
                    {searchQuery && ` (filtered from ${totalYesnvs})`}
                  </span>
                  <button className="cluster-options-trigger-btn" onClick={() => setShowClusterOptionsPopup(true)}>
                    <Settings size={16} />
                    Clustering Options
                  </button>
                </div>
              </div>

              <div className="preview-toolbar">
                <div className="toolbar-select-wrapper">
                  <label className="toolbar-label">Yesnversations / page:</label>
                  <select
                    className="toolbar-select"
                    value={convsPerPage}
                    onChange={(e) => handleYesnvsPerPageChange(e.target.value)}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                </div>
                <div className="toolbar-actions">
                  <button className="toolbar-btn-sm" onClick={expandAll} title="Expand all">Expand All</button>
                  <button className="toolbar-btn-sm" onClick={collapseAll} title="Yesllapse all">Yesllapse All</button>
                </div>
                <div className="toolbar-search">
                  <input
                    type="text"
                    className="toolbar-search-input"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <div className="toolbar-stats">
                  <span className="toolbar-stat-tag">{totalYesnvs} conversations</span>
                  <span className="toolbar-stat-tag">{totalMessages} messages</span>
                </div>
              </div>

              <div className="preview-table-wrapper cluster-table-full">
                <table className="preview-table conv-grouped">
                  <thead>
                    <tr>
                      <th className="col-conv-id">Yesnversation ID</th>
                      <th className="col-msg-num">#</th>
                      <th>User</th>
                      <th>Assistant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageYesnvs.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                          No conversations match your search.
                        </td>
                      </tr>
                    )}
                    {pageYesnvs.map((conv, convPageIdx) => {
                      const isExpanded = expandedYesnvs[conv.id] !== undefined ? expandedYesnvs[conv.id] : true;
                      const groupClass = (startYesnvIdx + convPageIdx) % 2 === 1 ? 'conv-group-alt' : '';

                      if (!isExpanded) {
                        return (
                          <tr key={conv.id} className={`conv-row conv-first conv-last conv-collapsed ${groupClass}`}>
                            <td className="col-conv-id-cell">
                              <button className="conv-toggle-btn" onClick={() => toggleYesnv(conv.id)} title="Expand">
                                <ChevronRight size={14} />
                              </button>
                              <span className="conv-id-badge">{conv.id}</span>
                              <span className="conv-msg-count">{conv.messages.length} messages</span>
                            </td>
                            <td className="col-msg-num-cell">â€”</td>
                            <td className="cell-text-col" title={conv.messages[0].user}>
                              <div className="cell-truncate">{conv.messages[0].user}</div>
                            </td>
                            <td className="cell-text-col" title={conv.messages[0].assistant}>
                              <div className="cell-truncate">{conv.messages[0].assistant}</div>
                            </td>
                          </tr>
                        );
                      }

                      return conv.messages.map((msg, msgIdx) => (
                        <tr
                          key={`${conv.id}-${msgIdx}`}
                          className={`conv-row ${msgIdx === 0 ? 'conv-first' : ''} ${msgIdx === conv.messages.length - 1 ? 'conv-last' : ''} ${groupClass}`}
                        >
                          {msgIdx === 0 && (
                            <td className="col-conv-id-cell" rowSpan={conv.messages.length}>
                              <button className="conv-toggle-btn" onClick={() => toggleYesnv(conv.id)} title="Yesllapse">
                                <ChevronDown size={14} />
                              </button>
                              <span className="conv-id-badge">{conv.id}</span>
                              <span className="conv-msg-count">{conv.messages.length} messages</span>
                            </td>
                          )}
                          <td className="col-msg-num-cell">#{msgIdx + 1}</td>
                          <td className="cell-text-col" title={msg.user}><div className="cell-truncate">{msg.user}</div></td>
                          <td className="cell-text-col" title={msg.assistant}><div className="cell-truncate">{msg.assistant}</div></td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="preview-pagination">
                <button
                  className="pagination-arrow"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  â€¹
                </button>
                {getPageNumbers(currentPage, totalPages || 1).map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`pagination-page-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  className="pagination-arrow"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  â€º
                </button>
              </div>
            </div>

            {/* Clustering Options Popup */}
            {showClusterOptionsPopup && (
              <div className="cluster-popup-overlay" onClick={() => setShowClusterOptionsPopup(false)}>
                <div className="cluster-popup-content" onClick={(e) => e.stopPropagation()}>
                  <div className="cluster-popup-header">
                    <div className="cluster-popup-header-left">
                      <Settings size={20} />
                      <div>
                        <h2>Clustering Options</h2>
                        <p>Yesnfigure clustering parameters, filter noise, and review group statistics</p>
                      </div>
                    </div>
                    <button className="cluster-popup-close-btn" onClick={() => setShowClusterOptionsPopup(false)}>
                      <X size={18} />
                      Close
                    </button>
                  </div>

                  <div className="cluster-popup-body">
                    {/* Clustering Parameters */}
                    <div className="cluster-popup-section">
                      <h3 className="cluster-card-title">Clustering Parameters</h3>
                      <div className="cleaning-input-group" style={{ marginBottom: 8 }}>
                        <label>Target K (Clusters)</label>
                        <input type="number" value={targetK} onChange={(e) => setTargetK(e.target.value)} />
                      </div>
                      <p className="cluster-recommend">Recommended K: <strong>14</strong> (stable plateau: silhouette remains strong while WCSS has flattened)</p>
                      <div className="cleaning-inputs-row" style={{ marginBottom: 12 }}>
                        <div className="cleaning-input-group">
                          <label>DBSCAN EPS</label>
                          <input type="number" step="0.1" value={clusterEps} onChange={(e) => setClusterEps(e.target.value)} />
                        </div>
                        <div className="cleaning-input-group">
                          <label>Min Samples</label>
                          <input type="number" value={clusterMinSamples} onChange={(e) => setClusterMinSamples(e.target.value)} />
                        </div>
                      </div>
                      <button className="cluster-run-btn" onClick={() => setClusterRan(true)}>
                        <Sparkles size={16} />
                        Cluster
                      </button>
                    </div>

                    {clusterRan && (
                      <>
                        {/* Similarity Threshold */}
                        <div className="cluster-popup-section">
                          <div className="sim-header">
                            <span className="sim-label">Similarity Threshold (for Deduplicate)</span>
                            <span className="sim-value">{simThreshold.toFixed(3)}</span>
                          </div>
                          <input
                            type="range" min="0" max="1" step="0.001"
                            value={simThreshold}
                            onChange={(e) => setSimThreshold(parseFloat(e.target.value))}
                            className="sim-slider"
                          />
                          <div className="cluster-action-btns">
                            <button className="cluster-btn-noise">Remove Noise</button>
                            <button className="cluster-btn-dedup">Deduplicate</button>
                          </div>
                          <button className="reset-filter-btn">Reset Filter</button>
                        </div>

                        {/* Cluster Statistics */}
                        <div className="cluster-popup-section">
                          <div className="cluster-stats-header">
                            <span className="cluster-stats-title">Cluster Statistics</span>
                            <button className="compare-btn" onClick={() => setShowYesmpareModal(true)}>
                              <Eye size={14} />
                              Yesmpare Groups
                            </button>
                          </div>
                          <table className="cluster-stats-table">
                            <thead>
                              <tr>
                                <th>Select</th>
                                <th>Group</th>
                                <th>Yesunt</th>
                                <th>Avg Similarity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {CLUSTER_GROUPS.map((g, i) => (
                                <tr key={i}>
                                  <td><input type="checkbox" /></td>
                                  <td><strong>{g.name}</strong></td>
                                  <td className="count-cell">{g.count}</td>
                                  <td className="sim-cell">{g.sim.toFixed(4)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
          );
        })()}

        {/* Action Buttons */}
        <div className="dataprep-actions-row">
          <button className="dataprep-btn-back" onClick={() => {
            if (currentSubStep > 1) {
              setCurrentSubStep(currentSubStep - 1);
            } else {
              setCurrentStage(1);
            }
          }}>
            Back
          </button>
          <button className="dataprep-btn-next" onClick={() => {
            if (currentSubStep < SUB_STEPS_STAGE2.length) {
              setCurrentSubStep(currentSubStep + 1);
            } else {
              setCurrentStage(3);
            }
          }}>
            Next
          </button>
        </div>
      </>
    );
  };
  /* Demo data for preview modal */
  const PREVIEW_BEFORE = [
    { id: 'conv_003', status: 'has-issue', issue: 'Unclosed <think>', user: 'Giáº£i thÃ­ch nguyÃªn lÃ½ báº¥t Ä‘á»‹nh Heisenberg', assistant: '<think>NguyÃªn lÃ½ báº¥t Ä‘á»‹nh... Ä‘Ã¢y lÃ  cÃ¢u há»i vá» cÆ¡ há»c lÆ°á»£ng tá»­' },
    { id: 'conv_007', status: 'has-issue', issue: 'Too short', user: 'Hi', assistant: 'Hello!' },
    { id: 'conv_009', status: 'has-issue', issue: 'Error keyword', user: 'TÃ­nh toÃ¡n entropy', assistant: 'I apologize, as an AI language model I cannot...' },
    { id: 'conv_011', status: 'clean', issue: null, user: 'So sÃ¡nh nhiá»‡t Ä‘á»™ng lá»±c há»c cá»• Ä‘iá»ƒn vÃ  thá»‘ng kÃª', assistant: 'Nhiá»‡t Ä‘á»™ng lá»±c há»c cá»• Ä‘iá»ƒn táº­p trung vÃ o cÃ¡c Ä‘áº¡i lÆ°á»£ng vÄ© mÃ´...' },
    { id: 'conv_012', status: 'has-issue', issue: 'Yesmplete <think> tags', user: 'PhÃ¢n tÃ­ch phÆ°Æ¡ng trÃ¬nh Maxwell', assistant: '<think>Cáº§n phÃ¢n tÃ­ch 4 phÆ°Æ¡ng trÃ¬nh...</think>CÃ¡c phÆ°Æ¡ng trÃ¬nh Maxwell mÃ´ táº£...' },
  ];

  const PREVIEW_AFTER = [
    { id: 'conv_003', status: 'fixed', action: 'ÄÃ£ vÃ¡ tháº» <think> báº±ng Regex+AI', user: 'Giáº£i thÃ­ch nguyÃªn lÃ½ báº¥t Ä‘á»‹nh Heisenberg', assistant: 'NguyÃªn lÃ½ báº¥t Ä‘á»‹nh Heisenberg phÃ¡t biá»ƒu ráº±ng...' },
    { id: 'conv_011', status: 'clean', action: 'KhÃ´ng thay Ä‘á»•i', user: 'So sÃ¡nh nhiá»‡t Ä‘á»™ng lá»±c há»c cá»• Ä‘iá»ƒn vÃ  thá»‘ng kÃª', assistant: 'Nhiá»‡t Ä‘á»™ng lá»±c há»c cá»• Ä‘iá»ƒn táº­p trung vÃ o cÃ¡c Ä‘áº¡i lÆ°á»£ng vÄ© mÃ´...' },
    { id: 'conv_012', status: 'fixed', action: 'ÄÃ£ xÃ³a tháº» <think>...</think>', user: 'PhÃ¢n tÃ­ch phÆ°Æ¡ng trÃ¬nh Maxwell', assistant: 'CÃ¡c phÆ°Æ¡ng trÃ¬nh Maxwell mÃ´ táº£ má»‘i quan há»‡ giá»¯a Ä‘iá»‡n trÆ°á»ng...' },
  ];

  const PREVIEW_REMOVED = [
    { id: 'conv_007', reason: 'Há»™i thoáº¡i quÃ¡ ngáº¯n (< 5 kÃ½ tá»±)', user: 'Hi', assistant: 'Hello!' },
    { id: 'conv_009', reason: 'Chá»©a tá»« khÃ³a lá»—i: "as an AI language model"', user: 'TÃ­nh toÃ¡n entropy', assistant: 'I apologize, as an AI language model I cannot...' },
  ];

  const renderStage3 = () => {
    /* Group data with distinct colors */
    const GROUP_DATA = [
      { id: 7, label: 'MATH', count: 8, color: '#6366f1', bg: '#eef2ff' },
      { id: 8, label: 'CODING', count: 9, color: '#0891b2', bg: '#ecfeff' },
      { id: 9, label: 'PHYSICAL', count: 4, color: '#059669', bg: '#ecfdf5' },
      { id: 10, label: 'MATH', count: 8, color: '#d97706', bg: '#fffbeb' },
      { id: 11, label: 'MATH', count: 5, color: '#dc2626', bg: '#fef2f2' },
      { id: 12, label: 'PHYSICAL', count: 9, color: '#7c3aed', bg: '#f5f3ff' },
    ];

    /* Build conversation list from CONVERSATIONS with group assignment */
    const allYesnvRows = CONVERSATIONS.map((conv, idx) => {
      const gIdx = idx % GROUP_DATA.length;
      const group = GROUP_DATA[gIdx];
      return {
        ...conv,
        groupId: group.id,
        groupLabel: group.label,
        groupYeslor: group.color,
        groupBg: group.bg,
        confidence: Math.floor(Math.random() * 10 + 90),
      };
    });

    const filteredRows = allYesnvRows
      .filter(r => !selectedGroup3 || r.groupId === selectedGroup3)
      .filter(r => {
        if (!stage3Search.trim()) return true;
        const q = stage3Search.toLowerCase();
        return r.id.toLowerCase().includes(q) ||
          r.messages.some(m =>
            m.user.toLowerCase().includes(q) ||
            m.assistant.toLowerCase().includes(q)
          );
      });

    const stage3TotalPages = Math.ceil(filteredRows.length / stage3PerPage);
    const stage3PageRows = filteredRows.slice((stage3Page - 1) * stage3PerPage, stage3Page * stage3PerPage);

    return (
      <div className="dataprep-stage2">
        <div className="sub-stepper">
          {SUB_STEPS_STAGE3.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div
                className={`sub-step ${step.num === currentSubStep3 ? 'active' : ''} ${step.num < currentSubStep3 ? 'completed' : ''}`}
                onClick={() => setCurrentSubStep3(step.num)}
              >
                <div className="sub-step-circle">
                  {step.num}
                </div>
                <div className="sub-step-label">{step.label}</div>
              </div>
              {idx < SUB_STEPS_STAGE3.length - 1 && <div className="sub-step-connector" />}
            </React.Fragment>
          ))}
        </div>

        {currentSubStep3 === 5 && (
          <div className="stage2-layout cluster-layout">
            {/* Left: Dataset Preview */}
            <div className="stage2-main">
              <div className="preview-header">
                <h3>Yesnverted Dataset Preview</h3>
                <span className="record-count">
                  {selectedGroup3
                    ? `Group ${selectedGroup3} â€” ${filteredRows.length} conversations`
                    : `Showing all ${allYesnvRows.length} conversations`
                  }
                </span>
              </div>

              {/* Toolbar */}
              <div className="preview-toolbar">
                <span className="toolbar-label">Yesnversations / page:</span>
                <select
                  className="toolbar-select"
                  value={stage3PerPage}
                  onChange={(e) => { setStage3PerPage(parsePrintt(e.target.value, 10)); setStage3Page(1); }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <input
                  type="text"
                  className="toolbar-search-input"
                  placeholder="Search conversations..."
                  value={stage3Search}
                  onChange={(e) => { setStage3Search(e.target.value); setStage3Page(1); }}
                />
              </div>

              <div className="preview-table-wrapper" style={{ maxHeight: '620px', overflowX: 'hidden' }}>
                <table className="preview-table conv-grouped" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '3%', textAlign: 'center' }}>STT</th>
                      <th style={{ width: '9%', textAlign: 'center' }}>Yesnv ID</th>
                      <th style={{ width: '3%', textAlign: 'center' }}>#</th>
                      <th style={{ width: '22%' }}>User</th>
                      <th style={{ width: '42%' }}>Assistant</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>Label</th>
                      <th style={{ width: '7%', textAlign: 'center' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stage3PageRows.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                          No conversations in this group.
                        </td>
                      </tr>
                    )}
                    {stage3PageRows.map((conv, idx) => (
                      <tr key={conv.id} className="conv-row conv-first conv-last">
                        <td className="col-conv-num-cell">{(stage3Page - 1) * stage3PerPage + idx + 1}</td>
                        <td className="col-conv-id-cell">
                          <span className="conv-id-badge">{conv.id}</span>
                          <span className="conv-msg-count">{conv.messages.length} msgs</span>
                        </td>
                        <td className="col-msg-num-cell">{conv.messages.length}</td>
                        <td className="cell-text-col"><div className="cell-truncate">{conv.messages[0].user}</div></td>
                        <td className="cell-text-col"><div className="cell-truncate">{conv.messages[0].assistant}</div></td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            className="auto-label-pill-colored"
                            style={{ background: conv.groupBg, color: conv.groupYeslor, borderYeslor: conv.groupYeslor }}
                          >
                            {conv.groupLabel} {conv.confidence}%
                          </span>
                        </td>
                        <td className="col-action-cell">
                          <button className="view-detail-btn" onClick={() => setSelectedYesnv3(conv)}>
                            <Eye size={14} />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="preview-pagination">
                <button className="pagination-arrow" disabled={stage3Page <= 1} onClick={() => setStage3Page(stage3Page - 1)}>â€¹</button>
                {getPageNumbers(stage3Page, stage3TotalPages).map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`pagination-page-btn ${page === stage3Page ? 'active' : ''}`}
                      onClick={() => setStage3Page(page)}
                    >
                      {page}
                    </button>
                  )
                )}
                <button className="pagination-arrow" disabled={stage3Page >= stage3TotalPages} onClick={() => setStage3Page(stage3Page + 1)}>â€º</button>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="stage2-sidebar">
              <div className="cleaning-pipeline-card">
                <div className="auto-labeling-header">
                  <h3 className="cluster-card-title">Auto Labeling</h3>
                  <div className="auto-labeling-actions">
                    <select className="label-model-select">
                      <option>Deepseek</option>
                    </select>
                    <button className="label-ai-btn">
                      <Sparkles size={14} /> Label with AI
                    </button>
                  </div>
                </div>

                <div className="label-summary">
                  <h4>Suggestion Summary</h4>
                  <p>Generated Labels: <strong>{allYesnvRows.length} / {allYesnvRows.length}</strong></p>
                </div>

                {/* Group Cards */}
                <div className="group-cards-container">
                  {/* Show All button */}
                  <div
                    className={`group-card-item ${selectedGroup3 === null ? 'group-card-active' : ''}`}
                    style={{ borderYeslor: '#94a3b8', '--group-accent': '#64748b' }}
                    onClick={() => { setSelectedGroup3(null); setStage3Page(1); }}
                  >
                    <div className="group-card-name" style={{ color: '#64748b' }}>All Groups</div>
                    <div className="group-card-count">{allYesnvRows.length}</div>
                  </div>
                  {GROUP_DATA.map(g => (
                    <div
                      key={g.id}
                      className={`group-card-item ${selectedGroup3 === g.id ? 'group-card-active' : ''}`}
                      style={{ borderYeslor: g.color, '--group-accent': g.color }}
                      onClick={() => { setSelectedGroup3(g.id); setStage3Page(1); }}
                    >
                      <div className="group-card-color-dot" style={{ background: g.color }} />
                      <div className="group-card-name" style={{ color: g.color }}>Group {g.id}</div>
                      <div className="group-card-count">{g.count}</div>
                      <div className="group-card-label">
                        <select className="inline-label-select" onClick={e => e.stopPropagation()} defaultValue={g.label}>
                          <option>PHYSICAL</option>
                          <option>MATH</option>
                          <option>CODING</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="label-bottom-actions">
                  <button className="compare-labels-btn" onClick={() => setShowYesmpareLabels(true)}>
                    <FileText size={14} /> Yesmpare Labels
                  </button>
                  <button className="save-labels-btn">
                    <Check size={14} /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Yesnversation Detail Popup for Stage 3 */}
        {selectedYesnv3 && (
          <div className="cluster-popup-overlay" onClick={() => setSelectedYesnv3(null)}>
            <div className="cluster-popup-content conv-detail-popup" onClick={(e) => e.stopPropagation()}>
              <div className="cluster-popup-header">
                <div className="cluster-popup-header-left">
                  <MessageSquare size={20} />
                  <div>
                    <h2>Yesnversation Detail</h2>
                    <p>{selectedYesnv3.id} Â· {selectedYesnv3.messages.length} messages Â· <span style={{ color: selectedYesnv3.groupYeslor, fontWeight: 700 }}>Group {selectedYesnv3.groupId} â€” {selectedYesnv3.groupLabel}</span></p>
                  </div>
                </div>
                <button className="cluster-popup-close-btn" onClick={() => setSelectedYesnv3(null)}>
                  <X size={18} /> Close
                </button>
              </div>
              <div className="conv-detail-body">
                {selectedYesnv3.messages.map((msg, idx) => (
                  <div key={idx} className="conv-detail-pair">
                    <div className="conv-detail-label">#{idx + 1}</div>
                    <div className="conv-detail-msg conv-detail-user">
                      <div className="conv-detail-role">ðŸ‘¤ User</div>
                      <div className="conv-detail-text">{msg.user}</div>
                    </div>
                    <div className="conv-detail-msg conv-detail-assistant">
                      <div className="conv-detail-role">ðŸ¤– Assistant</div>
                      <div className="conv-detail-text">{msg.assistant}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentSubStep3 === 6 && (
          <div className="sa-dashboard">
            {/* Public Access Bar */}
            <div className="sa-public-bar">
              <div>
                <h4>Public Access</h4>
                <p>Publish this sample publicly while managing assignee target labels.</p>
              </div>
              <div className="sa-public-actions">
                <button className="sa-btn-outline"><Settings size={14} /> Refresh</button>
                <button className="sa-btn-outline">Public: OFF</button>
              </div>
            </div>

            {/* Status Cards Row */}
            <div className="sa-status-row">
              {['ASSIGNED','ASSIGNEES','IN PROGRESS','SUBMITTED','SAVED DECISIONS','NEEDS REVIEW','PUBLISHED'].map(label => (
                <div key={label} className="sa-status-card">
                  <span className="sa-status-label">{label}</span>
                  <span className="sa-status-value">0</span>
                </div>
              ))}
            </div>

            <div className="sa-main-layout">
              {/* Left Yesntent */}
              <div className="sa-left">
                {/* Task Allocation */}
                <div className="sa-section-card">
                  <div className="sa-section-header">
                    <div>
                      <h4>Task Allocation Dashboard</h4>
                      <p>Divide your unassigned dataset into batches and assign to annotation.</p>
                    </div>
                    <button className="sa-create-task-btn" onClick={() => setShowCreateTaskModal(true)}><Plus size={14} /> Create Task</button>
                  </div>

                  <div className="sa-alloc-cards">
                    <div className="sa-alloc-card">
                      <span className="sa-alloc-label">Total Samples</span>
                      <span className="sa-alloc-value sa-dark">120</span>
                    </div>
                    <div className="sa-alloc-card sa-alloc-green">
                      <span className="sa-alloc-label sa-green-text">Assigned</span>
                      <span className="sa-alloc-value sa-green-text">30</span>
                    </div>
                    <div className="sa-alloc-card sa-alloc-orange">
                      <span className="sa-alloc-label sa-orange-text">Unassigned</span>
                      <span className="sa-alloc-value sa-orange-text">90</span>
                    </div>
                  </div>

                  <h5 className="sa-sub-title">Active Tasks</h5>
                  <div className="sa-tasks-table-wrap">
                    <table className="sa-tasks-table">
                      <thead>
                        <tr>
                          <th>BATCH</th>
                          <th>ASSIGNEES</th>
                          <th>SAMPLES</th>
                          <th>DUE DATE</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><span className="sa-link">batch1</span></td>
                          <td>hoang22_nmgf</td>
                          <td>30 samples assigned</td>
                          <td className="sa-date">June 8, 2026</td>
                          <td><span className="sa-badge-pending">Pending</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Samples */}
                <div className="sa-section-card">
                  <h4 className="sa-section-title">Samples</h4>
                  <div className="sa-tasks-table-wrap">
                    <table className="sa-tasks-table sa-samples-table">
                      <thead>
                        <tr>
                          <th style={{width:'5%'}}>ID</th>
                          <th style={{width:'65%'}}>SAMPLE KEY & CONTENT</th>
                          <th style={{width:'30%'}}>ASSIGNEES</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="sa-id-cell">#1</td>
                          <td>
                            <div className="sa-sample-key">
                              <span className="sa-conv-name">conv-1</span>
                              <span className="sa-conflict-badge">âŠ˜ Conflict</span>
                            </div>
                            <div className="sa-sample-content">Em khÃ´ng hiá»ƒu hÃ m sá»‘ báº­c nháº¥t lÃ  gÃ¬. Em cá»© nhÃ¬n tháº¿ nÃ o dáº¡ng tá»•ng quÃ¡t cá»§a Ä‘Æ°á»ng tháº³ng trÃªn máº·t pháº³ng tá»a Ä‘á»™ khÃ´ng? Thá»­ Ä‘oÃ¡n hÃ m sá»‘ báº­c nháº¥t cÃ³ dáº¡ng y = ax + b vá»›i a nhÆ° tháº¿ nÃ o?</div>
                            <div className="sa-sample-meta">IAA 0.11 Â· 3 pending adjudication</div>
                          </td>
                          <td>
                            <div className="sa-assignee">hoang22</div>
                            <div className="sa-assignee-email">hoangndnhe180790@fpt.edu.vn</div>
                            <div className="sa-assignee">uhhgf</div>
                            <div className="sa-assignee-email">hoangndnhe180790@fpt.edu.vn</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="sa-id-cell">#2</td>
                          <td>
                            <div className="sa-sample-key">
                              <span className="sa-conv-name">conv-2</span>
                            </div>
                            <div className="sa-sample-content">Há»‡ sá»‘ gÃ³c cá»§a Ä‘Æ°á»ng tháº³ng lÃ  gÃ¬? Khi x tÄƒng 1 Ä‘Æ¡n vá»‹ mÃ  y thay Ä‘á»•i bao nhiÃªu Ä‘Æ¡n vá»‹, em nghÄ© Ä‘áº¡i lÆ°á»£ng nÃ o Ä‘ang cÃ³ lÃ  gÃ³c dá»‘c cá»§a Ä‘Æ°á»ng tháº³ng Ä‘Ã³?</div>
                          </td>
                          <td><span className="sa-unassigned-tag">Unassigned</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="sa-right">
                <div className="sa-section-card">
                  <h4 className="sa-section-title"><FileText size={14} /> Realtime Productivity</h4>
                  <div className="sa-productivity-info">
                    <span className="sa-prod-name">hoang22</span>
                    <span className="sa-prod-detail">Last active: 0 seconds ago</span>
                    <span className="sa-prod-detail">0/30 pages Â· 05:0h samples</span>
                    <span className="sa-prod-detail">0.00s/page (avg. 0 samples)</span>
                  </div>
                </div>

                <div className="sa-section-card sa-conflict-card">
                  <h4 className="sa-section-title sa-conflict-title">âŠ˜ Conflict Review Queue</h4>
                  <div className="sa-conflict-item">
                    <div className="sa-conflict-left">
                      <span className="sa-conflict-id">#1 : conv-1</span>
                      <span className="sa-conflict-meta">IAA 0.11 Â· 3 annotators</span>
                    </div>
                    <span className="sa-pending-count">3 pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentSubStep3 === 7 && (
          <div className="ia-dashboard">
            {/* Yesverage Bar */}
            <div className="ia-coverage-bar">
              <div>
                <h4>Printtent-Action Yesverage</h4>
                <p>0 / 90 samples have complete Printtent-Action labels.</p>
              </div>
              <div className="ia-coverage-stats">
                <span className="ia-stat-green">Yesmplete: 0</span>
                <span className="ia-stat-red">Missing: 90</span>
              </div>
            </div>

            <div className="ia-main-layout">
              {/* Left: Chat History */}
              <div className="ia-left">
                <div className="ia-section-card">
                  <div className="ia-chat-header">
                    <h4><FileText size={14} /> Chat History</h4>
                    <div className="ia-chat-meta">Yesnversation 1 &nbsp; <strong>1 / 90</strong></div>
                  </div>

                  <div className="ia-chat-tabs">
                    <button className={`ia-tab ${iaActiveTab === 'assignment' ? 'active' : ''}`} onClick={() => setIaActiveTab('assignment')}>Assignment</button>
                    <button className={`ia-tab ${iaActiveTab === 'unassigned' ? 'active' : ''}`} onClick={() => setIaActiveTab('unassigned')}>Unassigned</button>
                  </div>

                  {iaActiveTab === 'assignment' && (
                  <>
                  <div className="ia-chat-messages">
                    {iaMessages.map((msg) => {
                      const isUser = msg.role === 'user';
                      const isSelected = selectedIaMsgId === msg.id;
                      
                      const msgClass = isUser ? 'ia-msg ia-msg-user' : 'ia-msg ia-msg-assistant';
                      const bubbleClass = isUser 
                        ? `ia-msg-bubble ia-bubble-user ${isSelected ? 'ia-bubble-selected-user' : ''}` 
                        : `ia-msg-bubble ia-bubble-assistant ${isSelected ? 'ia-bubble-selected-assistant' : ''}`;
                      
                      const numClass = isUser ? 'ia-msg-num' : 'ia-msg-num ia-num-green';
                      
                      const activeLabels = [];
                      Object.keys(msg.labels).forEach((groupName) => {
                        msg.labels[groupName].forEach((tag) => {
                          if (tag.active) {
                            activeLabels.push(tag.name);
                          }
                        });
                      });

                      return (
                        <div 
                          key={msg.id} 
                          className={msgClass}
                          onClick={() => setSelectedIaMsgId(prev => prev === msg.id ? null : msg.id)}
                          style={{ cursor: 'pointer', marginBottom: '8px' }}
                        >
                          {isUser ? (
                            <>
                              <div className={bubbleClass}>
                                <span className="ia-msg-role">USER</span>
                                <p>{msg.text}</p>
                              </div>
                              <span className={numClass}>{msg.turn}</span>
                              {activeLabels.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', marginLeft: '0' }}>
                                  {activeLabels.map((lbl) => (
                                    <div 
                                      key={lbl}
                                      className="ia-msg-label"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 10px',
                                        borderRadius: '16px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        margin: '0',
                                        ...getLabelBadgeStyle(lbl)
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMessageSingleLabel(msg.id, lbl);
                                      }}
                                    >
                                      {lbl === 'OK' && <Check size={10} style={{ marginRight: '2px' }} />}
                                      {lbl} <X size={10} style={{ marginLeft: '4px' }} />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <span className={numClass}>{msg.turn}</span>
                              <div className={bubbleClass}>
                                <span className="ia-msg-role">ASSISTANT</span>
                                <p>{msg.text}</p>
                              </div>
                              {activeLabels.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', marginLeft: '32px' }}>
                                  {activeLabels.map((lbl) => (
                                    <div 
                                      key={lbl}
                                      className="ia-msg-label"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 10px',
                                        borderRadius: '16px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        margin: '0',
                                        ...getLabelBadgeStyle(lbl)
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMessageSingleLabel(msg.id, lbl);
                                      }}
                                    >
                                      {lbl} <X size={10} style={{ marginLeft: '4px' }} />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <div className="ia-chat-pagination">
                    <button className="ia-page-btn">â† Previous</button>
                    <span className="ia-page-info">1 / 90</span>
                    <button className="ia-page-btn">Next â†’</button>
                  </div>
                  </>
                  )}

                  {iaActiveTab === 'unassigned' && (
                  <>
                  <div className="ia-unassigned-list">
                    {[
                      { id: 'conv-4', preview: 'Tháº§y Æ¡i, lá»±c ma sÃ¡t lÃ  gÃ¬ áº¡? Em nghe nÃ³i cÃ³ 2 loáº¡i...', turns: 6, subject: 'PHYSICAL' },
                      { id: 'conv-5', preview: 'Cho em há»i cÃ¡ch tÃ­nh diá»‡n tÃ­ch hÃ¬nh thang áº¡?', turns: 4, subject: 'MATH' },
                      { id: 'conv-7', preview: 'Em khÃ´ng hiá»ƒu pháº£n á»©ng oxi hÃ³a khá»­, giáº£i thÃ­ch giÃºp em...', turns: 8, subject: 'CHEM' },
                      { id: 'conv-9', preview: 'Anh Æ¡i giáº£i giÃºp em bÃ i toÃ¡n xÃ¡c suáº¥t nÃ y...', turns: 5, subject: 'MATH' },
                      { id: 'conv-12', preview: 'Quang há»£p lÃ  gÃ¬ áº¡? CÃ¢y xanh háº¥p thá»¥ Ã¡nh sÃ¡ng nhÆ° nÃ o?', turns: 7, subject: 'BIO' },
                      { id: 'conv-15', preview: 'Cho em há»i vá» thuyáº¿t tÆ°Æ¡ng Ä‘á»‘i cá»§a Einstein...', turns: 10, subject: 'PHYSICAL' },
                    ].map((conv) => (
                      <div key={conv.id} className="ia-unassigned-item">
                        <div className="ia-unassigned-info">
                          <div className="ia-unassigned-top">
                            <span className="ia-unassigned-id">{conv.id}</span>
                            <span className={`ia-unassigned-subject ia-subj-${conv.subject.toLowerCase()}`}>{conv.subject}</span>
                            <span className="ia-unassigned-turns">{conv.turns} turns</span>
                          </div>
                          <p className="ia-unassigned-preview">{conv.preview}</p>
                        </div>
                        <button className="ia-assign-btn">Assign to me</button>
                      </div>
                    ))}
                  </div>

                  <div className="ia-chat-pagination">
                    <button className="ia-page-btn">â† Previous</button>
                    <span className="ia-page-info">1 / 15</span>
                    <button className="ia-page-btn">Next â†’</button>
                  </div>
                  </>
                  )}
                </div>
              </div>

              {/* Right: Labels Panel */}
              <div className="ia-right">
                {/* Current Labels */}
                <div className="ia-section-card">
                  <div className="ia-labels-header">
                    <h4>â—‡ Current Labels</h4>
                    <span className="ia-label-count">1</span>
                  </div>
                  <input type="text" defaultValue="Yesnversation" className="ia-label-input" />
                  <div className="ia-current-label-card">
                    <div className="ia-cl-info">
                      <span className="ia-cl-name">MATH</span>
                      <span className="ia-cl-meta">1 user(s)</span>
                      <span className="ia-cl-assigned">Assigned by you</span>
                    </div>
                    <button className="ia-cl-remove"><X size={14} /></button>
                  </div>
                  <div className="ia-label-actions-row">
                    <button className="ia-add-label-btn">Add Label</button>
                    <input type="number" defaultValue={1} className="ia-label-num-input" />
                    <select className="ia-label-select">
                      <option>Gemini</option>
                      <option>Deepseek</option>
                    </select>
                  </div>
                  <div className="ia-label-btn-row">
                    <button className="ia-auto-labeling-btn">Auto Labeling</button>
                    <button className="ia-user-guide-btn" onClick={() => setShowUserSendde(true)}>ðŸ“‹ User Sendde</button>
                  </div>
                </div>

                {/* Hard Labels */}
                <div className="ia-section-card">
                  {selectedIaMsgId ? (
                    (() => {
                      const selectedMsg = iaMessages.find(m => m.id === selectedIaMsgId);
                      if (!selectedMsg) return null;
                      
                      return (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h5 className="ia-section-subtitle" style={{ margin: 0, textTransform: 'uppercase', fontSize: '13px', fontWeight: '800' }}>
                              {selectedMsg.role === 'user' ? 'USER HARD LABELS' : 'ASSISTANT HARD LABELS'}
                            </h5>
                            <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '13px' }}>
                              Turn {selectedMsg.turn}
                            </span>
                          </div>
                          
                          {Object.keys(selectedMsg.labels).map((groupName) => (
                            <div key={groupName} className="ia-hl-group" style={{ marginBottom: '16px' }}>
                              <span className="ia-hl-group-label" style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                {groupName}
                              </span>
                              <div className="ia-hl-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {selectedMsg.labels[groupName].map((tag) => {
                                  const isTagActive = tag.active;
                                  const isGreen = tag.colorClass === 'green' || (selectedMsg.role === 'user' && groupName === 'KNOWLEDGE' && tag.name === 'OK');
                                  const isBlue = tag.colorClass === 'blue' || (selectedMsg.role === 'assistant' && groupName === 'PEDAGOGY' && tag.name === 'SCAF');
                                  const isRed = tag.colorClass === 'red';
                                  
                                  let tagStyle = {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '4px 8px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease-in-out',
                                    minWidth: '75px',
                                    flex: '1 1 calc(33.33% - 6px)',
                                    background: 'white',
                                    color: '#334155',
                                    boxSizing: 'border-box'
                                  };

                                  if (isTagActive) {
                                    if (isGreen) {
                                      tagStyle = {
                                        ...tagStyle,
                                        background: '#e8f5e9',
                                        borderYeslor: '#4caf50',
                                        color: '#2e7d32',
                                        fontWeight: '700',
                                      };
                                    } else if (isBlue) {
                                      tagStyle = {
                                        ...tagStyle,
                                        background: '#e3f2fd',
                                        borderYeslor: '#2196f3',
                                        color: '#1565c0',
                                        fontWeight: '700',
                                      };
                                    } else if (isRed) {
                                      tagStyle = {
                                        ...tagStyle,
                                        background: '#ffebee',
                                        borderYeslor: '#ef5350',
                                        color: '#c62828',
                                        fontWeight: '700',
                                      };
                                    } else {
                                      // Default active: purple
                                      tagStyle = {
                                        ...tagStyle,
                                        background: '#f3e8ff',
                                        borderYeslor: '#a855f7',
                                        color: '#6b21a8',
                                        fontWeight: '700',
                                      };
                                    }
                                  }

                                  // Specific widths to match image:
                                  // OK and NO: 2 per row
                                  if (groupName === 'KNOWLEDGE' || groupName === 'OTHER' || (groupName === 'ISSUES' && selectedMsg.role === 'user')) {
                                    tagStyle.flex = '1 1 calc(50% - 6px)';
                                  }

                                  return (
                                    <div
                                      key={tag.name}
                                      style={tagStyle}
                                      onClick={() => handleToggleLabel(selectedMsg.id, groupName, tag.name)}
                                      className="ia-hl-tag-interactive"
                                    >
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                        <span style={{ fontSize: '11px' }}>{tag.icon}</span>
                                        <span>{tag.name}</span>
                                      </span>
                                      <span style={{ opacity: 0.8, fontSize: '11px', fontWeight: 'bold', marginLeft: '4px' }}>{tag.count}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  ) : (
                    <div>
                      <h5 className="ia-section-subtitle">HARD LABELS</h5>
                      <p className="ia-empty-hint">Chá»n má»™t tin nháº¯n Ä‘á»ƒ gÃ¡n nhÃ£n</p>
                    </div>
                  )}
                </div>

                {/* Yesnversation Hard Labels */}
                <div className="ia-section-card">
                  <h5 className="ia-section-subtitle">CONVERSATION HARD LABELS</h5>

                  <div className="ia-hl-group">
                    <span className="ia-hl-group-label">DECISION</span>
                    <div className="ia-hl-tags">
                      <span className="ia-hl-tag">âœ• REJ 0</span>
                    </div>
                  </div>

                  <div className="ia-hl-group">
                    <span className="ia-hl-group-label">SUBJECT</span>
                    <div className="ia-hl-tags">
                      <span className="ia-hl-tag ia-tag-purple">â–¦ MATH 0</span>
                      <span className="ia-hl-tag ia-tag-green">âŸ¡ PHYS 1</span>
                      <span className="ia-hl-tag ia-tag-red">âŸ¡ CHEM 0</span>
                      <span className="ia-hl-tag">â–­ LIT 0</span>
                      <span className="ia-hl-tag ia-tag-purple">âŠž BIO 0</span>
                      <span className="ia-hl-tag">â–¦ MULTI 0</span>
                      <span className="ia-hl-tag">â—Ž UNCLEAR 0</span>
                      <span className="ia-hl-tag">â—‹ OOS 0</span>
                    </div>
                  </div>

                  <div className="ia-hl-group">
                    <span className="ia-hl-group-label">STATUS</span>
                    <div className="ia-hl-tags">
                      <span className="ia-hl-tag ia-tag-green">âœ“ COMPLETED 0</span>
                      <span className="ia-hl-tag ia-tag-orange">â—Ž INCOMPLETE 0</span>
                      <span className="ia-hl-tag ia-tag-red">âœ• DROPPED 0</span>
                    </div>
                  </div>

                  <div className="ia-hl-group">
                    <span className="ia-hl-group-label">QUALITY</span>
                    <div className="ia-hl-tags">
                      <span className="ia-hl-tag ia-tag-green">âœ¦ GOOD 0</span>
                      <span className="ia-hl-tag">âŠž MEDIUM 0</span>
                      <span className="ia-hl-tag ia-tag-red">âœ• POOR 0</span>
                    </div>
                  </div>

                  <div className="ia-hl-group">
                    <span className="ia-hl-group-label">ISSUES</span>
                    <div className="ia-hl-tags">
                      <span className="ia-hl-tag">âŠ™ FACT_ERR 0</span>
                      <span className="ia-hl-tag">â€º DIR_ANS 0</span>
                      <span className="ia-hl-tag">â–­ LANG_ISSUE 0</span>
                    </div>
                  </div>
                </div>

                {/* Soft Label */}
                <div className="ia-section-card">
                  <h5 className="ia-section-subtitle">SOFT LABEL</h5>
                  <div className="ia-soft-label-row">
                    <input type="text" placeholder="e.g. grammar error" className="ia-soft-input" />
                    <button className="ia-soft-add-btn">Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Sendde Modal */}
        {showUserSendde && (
          <div className="modal-overlay" onClick={() => setShowUserSendde(false)}>
            <div className="ug-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ug-header">
                <h2>Labeling User Sendde</h2>
                <button className="modal-close-btn" onClick={() => setShowUserSendde(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="ug-subtitle">Reference for manual intent-action labeling, with definitions and common intent-action pairings.</p>

              <div className="ug-body">
                {/* Yesnversation Labels */}
                <div className="ug-section">
                  <h3 className="ug-section-title">Yesnversation Labels</h3>
                  <p className="ug-section-desc">NhÃ£n á»Ÿ má»©c toÃ n bá»™ há»™i thoáº¡i.</p>

                  <div className="ug-cards-grid">
                    <div className="ug-card ug-card-reject">
                      <div className="ug-card-header">
                        <span className="ug-card-icon ug-icon-red">âœ•</span>
                        <span className="ug-card-name ug-name-red">REJECT</span>
                      </div>
                      <p className="ug-card-desc">DÃ¹ng khi toÃ n bá»™ há»™i thoáº¡i khÃ´ng nÃªn Ä‘i tiáº¿p trong pipeline vÃ¬ cháº¥t lÆ°á»£ng hoáº·c pháº¡m vi khÃ´ng phÃ¹ há»£p.</p>
                    </div>

                    <div className="ug-card ug-card-subject">
                      <div className="ug-card-header">
                        <span className="ug-card-icon ug-icon-purple">â–¦</span>
                        <span className="ug-card-name ug-name-purple">MATH</span>
                      </div>
                      <p className="ug-card-desc">Há»™i thoáº¡i thuá»™c mÃ´n ToÃ¡n.</p>
                      <div className="ug-pairings">
                        <span className="ug-pairings-label">GOOD PAIRINGS</span>
                        <span className="ug-pairing-tag">REQUEST_HINT + HINTING</span>
                      </div>
                    </div>

                    <div className="ug-card ug-card-subject">
                      <div className="ug-card-header">
                        <span className="ug-card-icon ug-icon-green">âŸ¡</span>
                        <span className="ug-card-name ug-name-green">PHYS</span>
                      </div>
                      <p className="ug-card-desc">Há»™i thoáº¡i thuá»™c mÃ´n Váº­t lÃ½.</p>
                      <div className="ug-pairings">
                        <span className="ug-pairings-label">GOOD PAIRINGS</span>
                        <span className="ug-pairing-tag">EXPLAIN_CONCEPT + SCAFFOLDING</span>
                      </div>
                    </div>

                    <div className="ug-card ug-card-subject">
                      <div className="ug-card-header">
                        <span className="ug-card-icon ug-icon-red">âŸ¡</span>
                        <span className="ug-card-name ug-name-red">CHEM</span>
                      </div>
                      <p className="ug-card-desc">Há»™i thoáº¡i thuá»™c mÃ´n HÃ³a há»c.</p>
                      <div className="ug-pairings">
                        <span className="ug-pairings-label">GOOD PAIRINGS</span>
                        <span className="ug-pairing-tag">REQUEST_HINT + HINTING</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Printtent Labels */}
                <div className="ug-section">
                  <h3 className="ug-section-title">Printtent Labels (User)</h3>
                  <p className="ug-section-desc">NhÃ£n mÃ´ táº£ Ã½ Ä‘á»‹nh cá»§a há»c sinh trong má»—i lÆ°á»£t nÃ³i.</p>

                  <div className="ug-table-wrap">
                    <table className="ug-table">
                      <thead>
                        <tr>
                          <th>Printtent</th>
                          <th>MÃ´ táº£</th>
                          <th>VÃ­ dá»¥</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><span className="ug-intent-tag">REQUEST_HINT</span></td>
                          <td>Há»c sinh yÃªu cáº§u gá»£i Ã½ hoáº·c hÆ°á»›ng dáº«n</td>
                          <td className="ug-example">"Em khÃ´ng hiá»ƒu, tháº§y gá»£i Ã½ giÃºp em"</td>
                        </tr>
                        <tr>
                          <td><span className="ug-intent-tag">EXPLAIN_CONCEPT</span></td>
                          <td>Há»c sinh yÃªu cáº§u giáº£i thÃ­ch khÃ¡i niá»‡m</td>
                          <td className="ug-example">"Chuyá»ƒn Ä‘á»™ng tháº³ng Ä‘á»u lÃ  gÃ¬ áº¡?"</td>
                        </tr>
                        <tr>
                          <td><span className="ug-intent-tag">ANSWER</span></td>
                          <td>Há»c sinh tráº£ lá»i cÃ¢u há»i cá»§a giÃ¡o viÃªn</td>
                          <td className="ug-example">"LÃ  váº­t Ä‘ang di chuyá»ƒn a."</td>
                        </tr>
                        <tr>
                          <td><span className="ug-intent-tag">CONFIRM</span></td>
                          <td>Há»c sinh xÃ¡c nháº­n hoáº·c Ä‘á»“ng Ã½</td>
                          <td className="ug-example">"Dáº¡ em hiá»ƒu rá»“i áº¡!"</td>
                        </tr>
                        <tr>
                          <td><span className="ug-intent-tag">ASK_FOLLOWUP</span></td>
                          <td>Há»c sinh há»i thÃªm vá» chá»§ Ä‘á» liÃªn quan</td>
                          <td className="ug-example">"Váº­y trÃªn Máº·t TrÄƒng thÃ¬ sao áº¡?"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Labels */}
                <div className="ug-section">
                  <h3 className="ug-section-title">Action Labels (Assistant)</h3>
                  <p className="ug-section-desc">NhÃ£n mÃ´ táº£ hÃ nh Ä‘á»™ng cá»§a giÃ¡o viÃªn AI trong má»—i lÆ°á»£t tráº£ lá»i.</p>

                  <div className="ug-table-wrap">
                    <table className="ug-table">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>MÃ´ táº£</th>
                          <th>VÃ­ dá»¥</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><span className="ug-action-tag">HINTING</span></td>
                          <td>ÄÆ°a ra gá»£i Ã½ Ä‘á»ƒ dáº«n dáº¯t há»c sinh tá»± suy luáº­n</td>
                          <td className="ug-example">"Em thá»­ nghÄ© xem: khi nÃ³i váº­t chuyá»ƒn Ä‘á»™ng..."</td>
                        </tr>
                        <tr>
                          <td><span className="ug-action-tag">SCAFFOLDING</span></td>
                          <td>Chia nhá» váº¥n Ä‘á» thÃ nh cÃ¡c bÆ°á»›c dá»… hiá»ƒu hÆ¡n</td>
                          <td className="ug-example">"MÃ¬nh Ä‘i tá»«ng bÆ°á»›c nhÃ©..."</td>
                        </tr>
                        <tr>
                          <td><span className="ug-action-tag">DIRECT_ANSWER</span></td>
                          <td>Tráº£ lá»i trá»±c tiáº¿p cÃ¢u há»i</td>
                          <td className="ug-example">"CÃ´ng thá»©c lÃ  F = m Ã— a"</td>
                        </tr>
                        <tr>
                          <td><span className="ug-action-tag">POSITIVE_FEEDBACK</span></td>
                          <td>Khen ngá»£i, khuyáº¿n khÃ­ch há»c sinh</td>
                          <td className="ug-example">"ChÃ­nh xÃ¡c! Em hiá»ƒu ráº¥t nhanh!"</td>
                        </tr>
                        <tr>
                          <td><span className="ug-action-tag">REDIRECT</span></td>
                          <td>Chuyá»ƒn hÆ°á»›ng khi há»c sinh láº¡c Ä‘á» hoáº·c yÃªu cáº§u Ä‘Ã¡p Ã¡n</td>
                          <td className="ug-example">"MÃ¬nh chá»‰ cáº§n má»™t cÃ¢u thÃ´i..."</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="dataprep-actions-row">
          <button className="dataprep-btn-back" onClick={() => {
            if (currentSubStep3 > 5) {
              setCurrentSubStep3(currentSubStep3 - 1);
            } else {
              setCurrentStage(2);
            }
          }}>
            Back
          </button>
          <button className="dataprep-btn-reset" onClick={handleRemoveFile}>
            <RotateCcw size={16} /> Reset & Upload New
          </button>
          <button className="dataprep-btn-next" onClick={() => {
            if (currentSubStep3 < 7) {
              setCurrentSubStep3(currentSubStep3 + 1);
            } else {
              setCurrentStage(4);
            }
          }}>
            Next
          </button>
        </div>
      </div>
    );
  };

  const QUALITY_CONVS = [
    { id: 'CONV-1', hash: '(Há»˜I THOáº I #42D67D)', label: 'MATH_ADVANCED', desc: 'NÃ³ theo xuáº¥t sáº¯c...', quality: 'GOLD', msgs: 4, turns: 2, score: 4.80 },
    { id: 'CONV-2', hash: '(Há»˜I THOáº I #42D4E)', label: 'OUT_OF_SCOPE', desc: 'Chá»‰ viáº¿t láº¡i pháº§n NÃ³ A...', quality: 'REWRITE', msgs: 4, turns: 2, score: 2.50 },
    { id: 'CONV-3', hash: '(Há»˜I THOáº I #42DE5T)', label: 'OUT_OF_SCOPE', desc: 'AI pháº£n há»“i sai kiáº¿n thá»©c...', quality: 'BAD', msgs: 4, turns: 2, score: 1.20 },
    { id: 'CONV-4', hash: '(Há»˜I THOáº I #42D68B)', label: 'PHYSICS_MOTION', desc: 'Giáº£i thÃ­ch rÃµ rÃ ng...', quality: 'GOLD', msgs: 4, turns: 2, score: 4.50 },
  ];

  const renderSep490Stage4 = () => {
    const baseSubjects = sepBalanceApplied ? [
      { group: 'MATH', label: 'Math', count: 300, percentage: 42, color: '#6366f1' },
      { group: 'PHYSICAL', label: 'Physics', count: 280, percentage: 40, color: '#06b6d4' },
      { group: 'CHEMISTRY', label: 'Chemistry', count: 290, percentage: 41, color: '#10b981' },
      { group: 'BIOLOGY', label: 'Biology', count: 275, percentage: 39, color: '#f59e0b' },
      { group: 'HISTORY', label: 'History', count: 285, percentage: 40, color: '#ef4444' },
      { group: 'GEOGRAPHY', label: 'Geography', count: 270, percentage: 38, color: '#ec4899' },
      { group: 'LITERATURE', label: 'Literature', count: 295, percentage: 41, color: '#8b5cf6' },
    ] : [
      { group: 'MATH', label: 'Math', count: 450, percentage: 85, color: '#6366f1' },
      { group: 'PHYSICAL', label: 'Physics', count: 300, percentage: 70, color: '#06b6d4' },
      { group: 'CHEMISTRY', label: 'Chemistry', count: 200, percentage: 55, color: '#10b981' },
      { group: 'BIOLOGY', label: 'Biology', count: 150, percentage: 40, color: '#f59e0b' },
      { group: 'HISTORY', label: 'History', count: 100, percentage: 20, color: '#ef4444' },
      { group: 'GEOGRAPHY', label: 'Geography', count: 80, percentage: 18, color: '#ec4899' },
      { group: 'LITERATURE', label: 'Literature', count: 320, percentage: 65, color: '#8b5cf6' },
    ];

    const subjectTotal = baseSubjects.reduce((sum, item) => sum + item.count, 0);

    const subjectGroups = [
      { group: 'ALL', label: 'All', count: subjectTotal, percentage: 100, color: '#64748b' },
      ...baseSubjects
    ];

    const conversations = [
      {
        id: 'conv_428051',
        subject: 'MATH',
        messages: [
          { role: 'user', text: 'Em khong hieu dao ham cua x^2 tinh the nao a?' },
          { role: 'assistant', text: 'Dao ham cua x^2 la 2x.' },
          { role: 'user', text: 'Vi sao lai la 2x a?' },
          { role: 'assistant', text: 'Em thu nho lai cong thuc dao ham cua x^n: n*x^(n-1). Neu n = 2 thi em thay ket qua la gi?' },
        ],
      },
      {
        id: 'conv_42D67D',
        subject: 'PHYSICAL',
        messages: [
          { role: 'user', text: 'Luc ma sat la gi a?' },
          { role: 'assistant', text: 'Truoc het em thu nghi vi sao xe phanh lai dung duoc tren mat duong?' },
          { role: 'user', text: 'Yes le vi banh xe bi mat duong can lai?' },
          { role: 'assistant', text: 'Dung huong roi. Luc can do chinh la luc ma sat, no xuat hien khi hai be mat tiep xuc va can tro chuyen dong.' },
        ],
      },
      {
        id: 'conv_42DE5T',
        subject: 'HISTORY',
        messages: [
          { role: 'user', text: 'Cho em dap an luon di, em dang voi.' },
          { role: 'assistant', text: 'Dap an la 1939, em ghi vao bai nhe.' },
        ],
      },
    ];

    const visibleYesnversations = sepSubjectFilter === 'ALL'
      ? conversations
      : conversations.filter((item) => item.subject === sepSubjectFilter);
    const activeYesnversation = visibleYesnversations[(classPage - 1) % Math.max(visibleYesnversations.length, 1)] || conversations[0];

    const baseQualitySamples = [
      {
        id: 'sample_428051',
        convId: 'conv_428051',
        subject: 'MATH',
        bucket: 'Rewrite',
        score: 4.3,
        issueKey: 'direct-answer',
        issue: 'Direct answer too early',
        errorMessagePrintdex: 1,
        reason: 'Assistant gave "2x" immediately before checking whether the learner remembered the derivative rule.',
        messages: conversations[0].messages,
      },
      {
        id: 'sample_42D67D',
        convId: 'conv_42D67D',
        subject: 'PHYSICAL',
        bucket: 'Gold',
        score: 9.1,
        issueKey: 'none',
        issue: 'No critical issue',
        errorMessagePrintdex: null,
        reason: 'Good Socratic framing, uses a familiar braking example before defining friction.',
        messages: conversations[1].messages,
      },
      {
        id: 'sample_42DE5T',
        convId: 'conv_42DE5T',
        subject: 'HISTORY',
        bucket: 'Reject',
        score: 2.1,
        issueKey: 'low-training-value',
        issue: 'Direct answer and low training value',
        errorMessagePrintdex: 1,
        reason: 'The reply gives the final answer directly and does not guide the learner.',
        messages: conversations[2].messages,
      },
    ];

    const getQualityLabel = (item) => sepQualityLabels[item.id] || (item.bucket === 'Reject' ? 'Bad' : item.bucket);
    const qualityClass = (label) => label === 'Bad' ? 'bad' : label.toLowerCase();

    const qualityDistribution = [
      { label: 'Gold', count: 8, tone: 'emerald', summary: 'Ready for training with strong Socratic guidance.' },
      { label: 'Rewrite', count: 9, tone: 'amber', summary: 'Needs tutor reply rewrite before evaluation.' },
      { label: 'Bad', count: 3, tone: 'rose', summary: 'Reject or send to supervisor because quality is too low.' },
      { label: 'Printcomplete', count: 0, tone: 'slate', summary: 'Missing turns or incomplete context.' },
    ];

    const qualitySamples = Array.from({ length: 20 }, (_, idx) => {
      const source = baseQualitySamples[idx % baseQualitySamples.length];
      const cycle = Math.floor(idx / baseQualitySamples.length);
      const bucket = idx < 8 ? 'Gold' : idx < 17 ? 'Rewrite' : 'Reject';
      const issueKey = bucket === 'Gold' ? 'none' : idx % 2 === 0 ? 'direct-answer' : 'low-training-value';
      return {
        ...source,
        id: `${source.id}_${idx + 1}`,
        convId: `${source.convId}_${idx + 1}`,
        subject: baseSubjects[idx % baseSubjects.length].group,
        bucket,
        score: bucket === 'Gold' ? 8.6 + (idx % 3) * 0.2 : bucket === 'Rewrite' ? 4.1 + (idx % 5) * 0.35 : 2.0 + (idx % 3) * 0.25,
        issueKey,
        issue: bucket === 'Gold'
          ? 'No critical issue'
          : issueKey === 'direct-answer'
            ? 'Direct answer too early'
            : 'Low training value',
        errorMessagePrintdex: bucket === 'Gold' ? null : 1,
        reason: bucket === 'Gold'
          ? 'Good Socratic guidance and usable for training.'
          : issueKey === 'direct-answer'
            ? 'Assistant answers too directly before checking learner understanding.'
            : 'The response does not guide the learner enough for training.',
        messages: source.messages.map((msg, msgIdx) => ({
          ...msg,
          text: cycle === 0 ? msg.text : `${msg.text} (${baseSubjects[idx % baseSubjects.length].label} sample ${idx + 1}.${msgIdx + 1})`,
        })),
      };
    });

    const filteredQualitySamples = qualitySamples.filter((item) => {
      const itemLabel = getQualityLabel(item);
      const labelLower = itemLabel.toLowerCase();
      const tabLower = qualityTab.toLowerCase();
      const bucketOk = tabLower === 'all' ||
                       labelLower === tabLower ||
                       (tabLower === 'gold' && labelLower === 'good') ||
                       (tabLower === 'good' && labelLower === 'gold');
      const errorOk = !sepSelectedError || item.issueKey === sepSelectedError;
      return bucketOk && errorOk;
    });

    // subjectTotal computed earlier
    const qualityTotal = qualityDistribution.reduce((sum, item) => sum + item.count, 0);
    const selectedSubject = subjectGroups.find((item) => item.group === sepSelectedDistSubject) || subjectGroups[0];
    const selectedQuality = qualityDistribution.find((item) => item.label === sepSelectedDistQuality) || qualityDistribution[1];
    const getQualityScore = (sampleId, rubricName, defaultScore) => sepQualityRatings[`${sampleId}-${rubricName}`] ?? defaultScore;

    const rewriteRows = [
      {
        title: 'CONVERSATION 8',
        user: 'Tinh dao ham cua x^2 nhu the nao?',
        original: 'Dao ham cua x^2 la 2x.',
        ai: 'Voi ham x^n, dao ham se la n*x^(n-1). Em thu thay n = 2 vao cong thuc do xem ket qua la gi?',
        manual: 'Em con nho quy tac dao ham cua x^n khong? Neu thay n bang 2, em thu viet tung buoc xem sao.',
        intent: 'REQUEST_EXPLANATION',
        action: 'DIRECT_ANSWER',
        expected: 'SCAFFOLDING',
      },
      {
        title: 'CONVERSATION 9',
        user: 'Chien tranh the gioi thu hai bat dau nam nao?',
        original: 'Dap an la 1939.',
        ai: 'Em thu nho lai su kien Duc tan cong Ba Lan. Theo em su kien do dien ra vao nam nao?',
        manual: 'Minh cung nho lai moc su kien nhe: khi Duc tan cong Ba Lan, do la nam nao?',
        intent: 'ASK_THEORY',
        action: 'DIRECT_ANSWER',
        expected: 'HINTING',
      },
    ];
    const currentRewrite = rewriteRows[Math.max(0, rewriteYesnvIdx - 8) % rewriteRows.length];
    const rewriteText = sepRewriteDecision === 'manual' ? currentRewrite.manual : sepRewriteDecision === 'ai' ? currentRewrite.ai : currentRewrite.original;

    return (
      <div className="dataprep-stage2 sep490-stage">
        <div className="sub-stepper">
          {SUB_STEPS_STAGE4.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div
                className={`sub-step ${step.num === currentSubStep4 ? 'active' : ''} ${step.num < currentSubStep4 ? 'completed' : ''}`}
                onClick={() => setCurrentSubStep4(step.num)}
              >
                <div className="sub-step-circle">
                  {step.num < currentSubStep4 ? <Check size={14} /> : step.num}
                </div>
                <div className="sub-step-label">{step.label}</div>
              </div>
              {idx < SUB_STEPS_STAGE4.length - 1 && <div className="sub-step-connector" />}
            </React.Fragment>
          ))}
        </div>

        {/* ===== STEP 7: LOBBY GATE ===== */}
        {currentSubStep4 === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Hero card */}
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', color: '#fff', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '240px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>STAGE 4 â€” CHO STAFF HOAN THANH</div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800', color: '#f8fafc' }}>Dang cho Staff hoan thanh Stage 3</h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                  Sau khi tat ca Staff nop du so mau labeling, he thong se tu dong giai khoa Stage 4 de chay AI Judges.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#4f46e5" strokeWidth="8"
                      strokeDasharray={`${(77 / 100) * 264} 264`}
                      strokeLinecap="round" transform="rotate(-90 50 50)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '22px', fontWeight: '900', color: '#fff' }}>77%</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>hoan thanh</span>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>3 Staff chua nop du</span>
              </div>
            </div>

            {/* Staff Status Board */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Bang trang thai Staff</h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Update: 2 phut truoc</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Staff</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Subject phu trach</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Da nop / Phan cong</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '12px', textTransform: 'uppercase', minWidth: '150px' }}>Progress</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Thao tac</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Nguyen Thi A', mon: 'Math', done: 120, total: 120, pct: 100 },
                      { name: 'Tran Van B', mon: 'Physics', done: 98, total: 120, pct: 82 },
                      { name: 'Le Thi C', mon: 'Chemistry', done: 75, total: 120, pct: 63 },
                      { name: 'Pham Van D', mon: 'Biology', done: 120, total: 120, pct: 100 },
                      { name: 'Hoang Thi E', mon: 'History', done: 42, total: 120, pct: 35 },
                      { name: 'Bui Van F', mon: 'Geography', done: 120, total: 120, pct: 100 },
                      { name: 'Do Thi G', mon: 'Literature', done: 110, total: 120, pct: 92 },
                    ].map((staff, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
                              {staff.name[0]}
                            </div>
                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{staff.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{staff.mon}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: staff.pct === 100 ? '#16a34a' : '#ea580c' }}>
                          {staff.done} / {staff.total}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${staff.pct}%`, background: staff.pct === 100 ? '#16a34a' : staff.pct > 60 ? '#f59e0b' : '#ef4444', borderRadius: '4px' }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', minWidth: '36px' }}>{staff.pct}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                            background: staff.pct === 100 ? '#dcfce7' : staff.pct > 60 ? '#fef3c7' : '#fee2e2',
                            color: staff.pct === 100 ? '#15803d' : staff.pct > 60 ? '#92400e' : '#b91c1c'
                          }}>
                            {staff.pct === 100 ? 'Finish' : staff.pct > 60 ? 'Print Progress' : 'Cham tien do'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          {staff.pct < 100 && (
                            <button
                              onClick={() => alert(`Da gui nhac viec cho ${staff.name}`)}
                              style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#475569' }}
                            >
                              Remind
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setStage4StaffReady(true); setCurrentSubStep4(8); }}
                style={{ padding: '14px 28px', fontSize: '15px', fontWeight: '700', borderRadius: '8px', border: 'none', background: '#e2e8f0', color: '#64748b', cursor: 'pointer' }}
              >
                Skip (Demo Mode)
              </button>
              <button
                onClick={() => { setStage4StaffReady(true); setCurrentSubStep4(8); }}
                style={{ padding: '14px 28px', fontSize: '15px', fontWeight: '700', borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff', cursor: 'pointer' }}
              >
                Next: AI Cham diem &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 8: AI CHAM DIEM ===== */}
        {currentSubStep4 === 8 && (() => {
          const aiModels = [
            { key: 'gemini',   label: 'Gemini Flash 1.5', desc: 'Giao duc judge mac dinh – low cost',  color: '#4f46e5', badge: 'Recommended' },
            { key: 'openai',   label: 'OpenAI GPT-4o',    desc: 'Do chinh xac cao – xac minh kien thuc', color: '#059669', badge: '' },
            { key: 'deepseek', label: 'Deepseek R1/V3',   desc: 'Logic su pham nang cao – free',      color: '#0891b2', badge: 'Free' },
          ];
          const selectedYesunt = Object.values(judgeModels).filter(Boolean).length;
          const totalYesnv = 20;
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 24px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>Automated AI Scoring</h2>
                <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>Select cac mo hinh AI de cham diem conversations. Nen chon it nhat 2 mo hinh de phat hien conflict. Conflict = |avg(AI) − Human| &gt; nguong.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                {/* Model Selection */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>Select AI Judge Models</h3>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: selectedYesunt >= 2 ? '#dcfce7' : '#fef3c7', color: selectedYesunt >= 2 ? '#15803d' : '#92400e' }}>
                      {selectedYesunt} / 3 da chon
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {aiModels.map(({ key, label, desc, color, badge }) => (
                      <label key={key} onClick={() => setJudgeModels(prev => ({ ...prev, [key]: !prev[key] }))}
                        style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '10px', border: `2px solid ${judgeModels[key] ? color : '#e2e8f0'}`, background: judgeModels[key] ? `${color}08` : '#fafafa', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: `2px solid ${judgeModels[key] ? color : '#cbd5e1'}`, background: judgeModels[key] ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {judgeModels[key] && <span style={{ color: '#fff', fontSize: '14px', fontWeight: '900' }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{label}</span>
                            {badge && <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: badge === 'Free' ? '#dcfce7' : '#e0e7ff', color: badge === 'Free' ? '#15803d' : '#4338ca' }}>{badge}</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{desc}</div>
                        </div>
                        {judgeModels[key] && <span style={{ fontSize: '12px', fontWeight: '700', color, padding: '4px 10px', borderRadius: '20px', background: `${color}15` }}>ON</span>}
                      </label>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Conflict Threshold: |avg(AI) − Human|</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1.5, 2.0, 2.5, 3.0].map(v => (
                        <button key={v} style={{ flex: 1, padding: '8px', fontSize: '13px', fontWeight: '700', borderRadius: '8px', border: `1px solid ${v === 2.0 ? '#4f46e5' : '#e2e8f0'}`, background: v === 2.0 ? '#e0e7ff' : '#f8fafc', color: v === 2.0 ? '#4338ca' : '#475569', cursor: 'pointer' }}>
                          ±{v}
                        </button>
                      ))}
                    </div>
                    <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>Mac dinh ±2.0. Conflict se hien thi o Quality Review va Distribution Dashboard.</p>
                  </div>
                  <button
                    disabled={selectedYesunt === 0 || aiScoringDone}
                    onClick={() => { setSepRunningEval(true); window.setTimeout(() => { setSepRunningEval(false); setAiScoringDone(true); }, 2000); }}
                    style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '700', borderRadius: '10px', border: 'none', background: selectedYesunt === 0 ? '#f1f5f9' : aiScoringDone ? '#dcfce7' : '#1e293b', color: selectedYesunt === 0 ? '#94a3b8' : aiScoringDone ? '#15803d' : '#fff', cursor: selectedYesunt === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    {sepRunningEval ? '⚙ Scoring in progress...' : aiScoringDone ? '✓ Completed cham diem' : `Start Scoring (${selectedYesunt} mo hinh)`}
                  </button>
                </div>
                {/* Status Panel */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>Status cham diem</h3>
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Progress tong the</span>
                      <span style={{ fontSize: '13px', fontWeight: '900', color: aiScoringDone ? '#15803d' : '#4f46e5' }}>{aiScoringDone ? '20 / 20' : sepRunningEval ? '12 / 20' : '0 / 20'}</span>
                    </div>
                    <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: aiScoringDone ? '100%' : sepRunningEval ? '60%' : '0%', background: aiScoringDone ? '#16a34a' : '#4f46e5', borderRadius: '5px', transition: 'width 0.5s' }} />
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#64748b' }}>{aiScoringDone ? 'Finish – san sang xem ket qua' : sepRunningEval ? 'Dang goi API...' : 'Not Started'}</div>
                  </div>
                  {aiModels.map(({ key, label, color }) => (
                    judgeModels[key] && (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: '#f8fafc', border: `1px solid ${color}22` }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: aiScoringDone ? '#16a34a' : sepRunningEval ? color : '#cbd5e1', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155', flex: 1 }}>{label}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: aiScoringDone ? '#15803d' : sepRunningEval ? color : '#94a3b8' }}>
                          {aiScoringDone ? `${totalYesnv}/${totalYesnv} ✓` : sepRunningEval ? 'Dang chay...' : 'Cho'}
                        </span>
                      </div>
                    )
                  ))}
                  {aiScoringDone && (
                    <div style={{ background: '#fff7f7', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#dc2626', marginBottom: '6px' }}>⚠️ 3 Conflict phat hien</div>
                      <div style={{ fontSize: '11px', color: '#7f1d1d', lineHeight: '1.6' }}>
                        Cac conversations co |avg(AI) − Human| &gt; 2.0 se duoc danh dau trong Quality Review.
                      </div>
                    </div>
                  )}
                  {aiScoringDone && (
                    <button onClick={() => setCurrentSubStep4(9)}
                      style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '700', borderRadius: '10px', border: 'none', background: '#1e293b', color: '#fff', cursor: 'pointer' }}>
                      View Quality Review →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ===== STEP 9: QUALITY REVIEW (read-only) ===== */}
        {currentSubStep4 === 9 && (() => {
          // Mock AI Judge scores integrated with quality samples
          const aiJudgeScores = {
            'conv_428051_1': { gemini: 8.6, deepseek: 8.9, openai: null, human: 9.0, conflict: false },
            'conv_42D67D_2': { gemini: 8.8, deepseek: 8.5, openai: 8.7, human: 8.5, conflict: false },
            'conv_42DE5T_3': { gemini: 9.0, deepseek: 8.8, openai: null, human: 8.8, conflict: false },
            'conv_428051_4': { gemini: 8.6, deepseek: 8.4, openai: 8.9, human: null, conflict: false },
            'conv_42D67D_5': { gemini: 8.8, deepseek: 9.0, openai: null, human: 8.6, conflict: false },
            'conv_42DE5T_6': { gemini: 9.0, deepseek: 8.7, openai: 9.1, human: 9.0, conflict: false },
            'conv_428051_7': { gemini: 8.6, deepseek: 8.5, openai: null, human: 8.4, conflict: false },
            'conv_42D67D_8': { gemini: 8.8, deepseek: 8.9, openai: 8.6, human: 9.0, conflict: false },
            'conv_42DE5T_9': { gemini: 4.2, deepseek: 7.8, openai: 5.1, human: null, conflict: true },
            'conv_428051_10': { gemini: 5.5, deepseek: 5.1, openai: null, human: 4.8, conflict: false },
            'conv_42D67D_11': { gemini: 4.1, deepseek: 7.2, openai: 4.5, human: null, conflict: true },
            'conv_42DE5T_12': { gemini: 4.4, deepseek: 4.2, openai: null, human: 4.0, conflict: false },
            'conv_428051_13': { gemini: 5.2, deepseek: 5.0, openai: 5.3, human: null, conflict: false },
            'conv_42D67D_14': { gemini: 4.9, deepseek: 7.1, openai: null, human: 5.0, conflict: true },
            'conv_42DE5T_15': { gemini: 5.1, deepseek: 4.9, openai: 5.4, human: null, conflict: false },
            'conv_428051_16': { gemini: 5.3, deepseek: 5.5, openai: null, human: 4.9, conflict: false },
            'conv_42D67D_17': { gemini: 4.7, deepseek: 4.5, openai: 4.8, human: null, conflict: false },
          };
          const getScores = (item) => aiJudgeScores[item.convId] || { gemini: item.score, deepseek: null, openai: null, human: null, conflict: false };
          const getAvgAI = (scores) => {
            const vals = [scores.gemini, scores.deepseek, scores.openai].filter(v => v != null);
            return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
          };
          const isConflict = (scores) => {
            const avg = getAvgAI(scores);
            return avg != null && scores.human != null && Math.abs(avg - scores.human) > 2.0;
          };
          const getScoresWithConflict = (item) => {
            const s = getScores(item);
            return { ...s, conflict: s.conflict || isConflict(s) };
          };
          const rewriteItems = filteredQualitySamples.filter(i => i.bucket === 'Rewrite' || i.bucket === 'Reject');
          const goldItems = filteredQualitySamples.filter(i => i.bucket === 'Gold');
          const allItems = filteredQualitySamples;
          const conflictItems = allItems.filter(i => getScoresWithConflict(i).conflict);
          const displayItems = qualityTab === 'rewrite' ? rewriteItems : qualityTab === 'gold' ? goldItems : qualityTab === 'conflict' ? conflictItems : allItems;

          const ScoreCell = ({ val }) => val != null
            ? <span style={{ fontWeight: '700', color: val >= 7 ? '#16a34a' : val >= 5 ? '#d97706' : '#dc2626' }}>{val.toFixed(1)}</span>
            : <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header read-only */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>Quality Review — View ket qua cham diem</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>View diem cham cua AI Judges va Human Reviewer. No chinh sua o day. Dung buoc 2a/2b de xu ly cac conversations.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[['#dcfce7', '#15803d', 'Gold', goldItems.length], ['#fef3c7', '#92400e', 'Rewrite', rewriteItems.length], ['#fee2e2', '#dc2626', 'Reject', filteredQualitySamples.filter(i => i.bucket === 'Reject').length], ['#fff1f2', '#dc2626', 'Conflict', conflictItems.length]].map(([bg, clr, lbl, cnt]) => (
                    <div key={lbl} style={{ background: bg, borderRadius: '8px', padding: '8px 14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: clr }}>{lbl}</div>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: clr }}>{cnt}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary bar + tabs */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    ['all', 'All', allItems.length, '#475569'],
                    ['gold', 'Gold', goldItems.length, '#15803d'],
                    ['rewrite', 'Needs Edit', rewriteItems.length, '#92400e'],
                    ['conflict', 'Conflict', conflictItems.length, '#dc2626'],
                  ].map(([key, label, count, color]) => (
                    <button key={key} onClick={() => setQualityTab(key)} style={{
                      padding: '8px 16px', fontSize: '13px', fontWeight: '700', borderRadius: '20px', border: '1px solid',
                      background: qualityTab === key ? '#1e293b' : '#fff',
                      color: qualityTab === key ? '#fff' : color,
                      borderYeslor: qualityTab === key ? '#1e293b' : '#e2e8f0', cursor: 'pointer'
                    }}>
                      {label} <span style={{ fontWeight: '900' }}>({count})</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button onClick={() => setCurrentSubStep4(10)}
                    style={{ padding: '12px 20px', fontSize: '14px', fontWeight: '700', borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff', cursor: 'pointer' }}>
                    Go to Assign Rewrite &rarr;
                  </button>
                </div>
              </div>

              {/* Main Table */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Yesnv ID</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>Subject</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', maxWidth: '200px' }}>Issue</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: '#4f46e5', fontSize: '11px', textTransform: 'uppercase', background: '#f0f4ff' }}>Gemini</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: '#0891b2', fontSize: '11px', textTransform: 'uppercase', background: '#f0faff' }}>Deepseek</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: '#059669', fontSize: '11px', textTransform: 'uppercase', background: '#f0fdf4' }}>OpenAI</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: '#7c3aed', fontSize: '11px', textTransform: 'uppercase', background: '#f5f3ff' }}>Avg AI</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: '#ea580c', fontSize: '11px', textTransform: 'uppercase' }}>Human</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: '#dc2626', fontSize: '11px', textTransform: 'uppercase' }}>Conflict</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>Verdict</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayItems.map((item, i) => {
                      const label = getQualityLabel(item);
                      const scores = getScoresWithConflict(item);
                      const avgAI = getAvgAI(scores);
                      const diff = (avgAI != null && scores.human != null) ? Math.abs(avgAI - scores.human) : null;
                      return (
                        <tr key={item.id}
                          style={{ borderBottom: '1px solid #f1f5f9', background: scores.conflict ? '#fff7f7' : i % 2 === 0 ? '#fff' : '#fafafa', cursor: 'pointer' }}
                          onClick={() => setReviewDetailModal({ ...item, scores })}>
                          <td style={{ padding: '10px 14px', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {item.convId}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#f1f5f9', color: '#475569' }}>{item.subject}</span>
                          </td>
                          <td style={{ padding: '10px 14px', color: '#64748b', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.reason}</td>
                          <td style={{ padding: '10px 14px', textAlign: 'center', background: '#f8faff' }}><ScoreCell val={scores.gemini} /></td>
                          <td style={{ padding: '10px 14px', textAlign: 'center', background: '#f0faff' }}><ScoreCell val={scores.deepseek} /></td>
                          <td style={{ padding: '10px 14px', textAlign: 'center', background: '#f0fff4' }}><ScoreCell val={scores.openai} /></td>
                          <td style={{ padding: '10px 14px', textAlign: 'center', background: '#f5f3ff' }}>
                            {avgAI != null ? <span style={{ fontWeight: '800', color: avgAI >= 7 ? '#7c3aed' : avgAI >= 5 ? '#d97706' : '#dc2626' }}>{avgAI.toFixed(1)}</span> : <span style={{ color: '#cbd5e1' }}>—</span>}
                          </td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}><ScoreCell val={scores.human} /></td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            {scores.conflict ? (
                              <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', background: '#fee2e2', color: '#dc2626', whiteSpace: 'nowrap' }}>
                                ⚠ ±{diff?.toFixed(1) ?? '?'}
                              </span>
                            ) : (
                              <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                              background: label === 'Gold' ? '#dcfce7' : label === 'Rewrite' ? '#fef3c7' : '#fee2e2',
                              color: label === 'Gold' ? '#15803d' : label === 'Rewrite' ? '#92400e' : '#dc2626'
                            }}>{label}</span>
                          </td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <button onClick={e => { e.stopPropagation(); setReviewDetailModal({ ...item, scores }); }}
                              style={{ padding: '5px 12px', fontSize: '12px', fontWeight: '700', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#4f46e5' }}>
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* READ-ONLY Detail Modal */}
              {reviewDetailModal && (() => {
                const scores = reviewDetailModal.scores || getScoresWithConflict(reviewDetailModal);
                const label = getQualityLabel(reviewDetailModal);
                const avgAI = getAvgAI(scores);
                const diff = (avgAI != null && scores.human != null) ? Math.abs(avgAI - scores.human) : null;
                return (
                  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zPrintdex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    onClick={() => setReviewDetailModal(null)}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
                      onClick={e => e.stopPropagation()}>
                      <div style={{ background: '#1e293b', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#f8fafc' }}>{reviewDetailModal.convId}</h3>
                          <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', background: label === 'Gold' ? '#dcfce7' : label === 'Rewrite' ? '#fef3c7' : '#fee2e2', color: label === 'Gold' ? '#15803d' : label === 'Rewrite' ? '#92400e' : '#dc2626' }}>{label}</span>
                          {scores.conflict && <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', background: '#fee2e2', color: '#dc2626' }}>⚠ CONFLICT</span>}
                        </div>
                        <button onClick={() => setReviewDetailModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }}>&#x2715;</button>
                      </div>
                      <div style={{ padding: '2px 24px 12px', background: '#1e293b' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Subject: {reviewDetailModal.subject} — Issue: {reviewDetailModal.issue}</p>
                      </div>
                      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <h4 style={{ margin: '0 0 14px 0', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Score danh gia (chi doc)</h4>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                          {[{ label: 'Gemini', val: scores.gemini, color: '#4f46e5', bg: '#e0e7ff' }, { label: 'Deepseek', val: scores.deepseek, color: '#0891b2', bg: '#cffafe' }, { label: 'OpenAI', val: scores.openai, color: '#059669', bg: '#d1fae5' }].map(({ label: lbl, val, color, bg }) => (
                            <div key={lbl} style={{ background: bg, borderRadius: '8px', padding: '10px 16px', textAlign: 'center', minWidth: '80px' }}>
                              <div style={{ fontSize: '11px', fontWeight: '700', color, marginBottom: '4px' }}>{lbl}</div>
                              <div style={{ fontSize: '20px', fontWeight: '900', color: val == null ? '#cbd5e1' : val >= 7 ? '#15803d' : val >= 5 ? '#d97706' : '#dc2626' }}>{val != null ? val.toFixed(1) : '—'}</div>
                            </div>
                          ))}
                          <div style={{ background: '#f5f3ff', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', minWidth: '90px', border: '2px solid #c4b5fd' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#7c3aed', marginBottom: '4px' }}>Avg AI</div>
                            <div style={{ fontSize: '22px', fontWeight: '900', color: avgAI == null ? '#cbd5e1' : avgAI >= 7 ? '#7c3aed' : avgAI >= 5 ? '#d97706' : '#dc2626' }}>{avgAI != null ? avgAI.toFixed(1) : '—'}</div>
                            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>TB cac AI</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '22px', fontWeight: '300', alignSelf: 'center' }}>vs</div>
                          <div style={{ background: '#fed7aa', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', minWidth: '80px', border: scores.conflict ? '2px solid #f97316' : '2px solid transparent' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#ea580c', marginBottom: '4px' }}>Human</div>
                            <div style={{ fontSize: '22px', fontWeight: '900', color: scores.human == null ? '#cbd5e1' : scores.human >= 7 ? '#15803d' : scores.human >= 5 ? '#d97706' : '#dc2626' }}>{scores.human != null ? scores.human.toFixed(1) : '—'}</div>
                          </div>
                          {diff != null && (
                            <div style={{ background: scores.conflict ? '#fee2e2' : '#f1f5f9', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', minWidth: '80px', border: scores.conflict ? '1px solid #fca5a5' : '1px solid #e2e8f0' }}>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: scores.conflict ? '#dc2626' : '#64748b', marginBottom: '4px' }}>Delta</div>
                              <div style={{ fontSize: '20px', fontWeight: '900', color: scores.conflict ? '#dc2626' : '#64748b' }}>±{diff.toFixed(1)}</div>
                              {scores.conflict && <div style={{ fontSize: '10px', color: '#dc2626', marginTop: '2px' }}>⚠ &gt; 2.0</div>}
                            </div>
                          )}
                        </div>
                        {scores.conflict && diff != null && (
                          <div style={{ marginTop: '14px', background: '#fff7f7', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#b91c1c', display: 'flex', gap: '8px' }}>
                            <span>⚠️</span>
                            <span><strong>Conflict AI vs Human:</strong> Score TB cac AI ({avgAI?.toFixed(1)}) chenh lech voi Human ({scores.human?.toFixed(1)}) la ±{diff.toFixed(1)} vuot nguong 2.0. Can Human expert xem lai.</span>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '20px 24px' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Noi dung conversations</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                          {reviewDetailModal.messages.map((msg, idx) => (
                            <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '14px', lineHeight: '1.6', background: msg.role === 'user' ? '#f8fafc' : idx === reviewDetailModal.errorMessagePrintdex ? '#fef3c7' : '#f0fdf4', border: idx === reviewDetailModal.errorMessagePrintdex ? '2px solid #fcd34d' : '1px solid transparent', alignSelf: msg.role === 'user' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>{msg.role === 'user' ? 'Hoc sinh' : idx === reviewDetailModal.errorMessagePrintdex ? '⚠ AI Tutor (co loi)' : 'AI Tutor'}</div>
                              {msg.text}
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>ℹ️</span>
                          <span>This screen is read-only. To edit, use step "3a - Assign Rewrite" or "3b - Review Submissions".</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* ===== STEP 10: GIAO VIEC REWRITE (BULK ASSIGN) ===== */}
        {currentSubStep4 === 10 && (() => {
          const rewriteItems = filteredQualitySamples.filter(i => i.bucket === 'Rewrite');
          const allSelected = rewriteItems.length > 0 && selectedRewriteIds.length === rewriteItems.length;
          const assignedYesunt = rewriteItems.filter(i => reassignStaff[i.id]).length;
          const pendingYesunt = rewriteItems.length - assignedYesunt;
          const progress = rewriteItems.length > 0 ? Math.round((assignedYesunt / rewriteItems.length) * 100) : 0;

          const subjectYeslors = {
            'Math': { bg: '#e0e7ff', color: '#4338ca' }, 'Physics': { bg: '#cffafe', color: '#0e7490' },
            'Chemistry': { bg: '#d1fae5', color: '#065f46' }, 'Biology': { bg: '#fef3c7', color: '#92400e' },
            'History': { bg: '#ede9fe', color: '#6d28d9' }, 'Geography': { bg: '#fee2e2', color: '#b91c1c' },
            'Literature': { bg: '#fce7f3', color: '#9d174d' }, 'English': { bg: '#fff7ed', color: '#9a3412' },
            'PHYSICAL': { bg: '#cffafe', color: '#0e7490' }, 'CHEMISTRY': { bg: '#d1fae5', color: '#065f46' },
            'BIOLOGY': { bg: '#fef3c7', color: '#92400e' }, 'HISTORY': { bg: '#ede9fe', color: '#6d28d9' },
            'GEOGRAPHY': { bg: '#fee2e2', color: '#b91c1c' }, 'LITERATURE': { bg: '#fce7f3', color: '#9d174d' },
            'MATH': { bg: '#e0e7ff', color: '#4338ca' },
          };
          const getSubjectStyle = (s) => subjectYeslors[s] || { bg: '#f1f5f9', color: '#475569' };

          const staffList = [
            { value: 'Nguyen Thi A', initials: 'NA', color: '#4f46e5' },
            { value: 'Tran Van B', initials: 'TB', color: '#0891b2' },
            { value: 'Le Thi C', initials: 'LC', color: '#059669' },
            { value: 'Pham Van D', initials: 'PD', color: '#d97706' },
          ];
          const getStaffYeslor = (name) => staffList.find(s => s.value === name)?.color || '#64748b';
          const getStaffPrintitials = (name) => staffList.find(s => s.value === name)?.initials || '??';

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header card */}
              <div style={{ background: 'linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%)', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '18px' }}>📋</span>
                      </div>
                      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>Assign Rewrite Tasks to Staff</h2>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Assign conversations that need editing to team members. Select multiple for bulk assignment.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 18px', textAlign: 'center', minWidth: '70px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Not Assigned</div>
                      <div style={{ fontSize: '26px', fontWeight: '900', color: '#d97706', lineHeight: 1.2 }}>{pendingYesunt}</div>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 18px', textAlign: 'center', minWidth: '70px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned</div>
                      <div style={{ fontSize: '26px', fontWeight: '900', color: '#16a34a', lineHeight: 1.2 }}>{assignedYesunt}</div>
                    </div>
                    <button onClick={() => setCurrentSubStep4(11)}
                      style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '700', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #1e293b, #334155)', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,41,59,0.25)', whiteSpace: 'nowrap' }}>
                      Go to Review →
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Progress phan cong</span>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#4f46e5' }}>{assignedYesunt} / {rewriteItems.length} conversations</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', borderRadius: '999px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '14px 16px', width: '44px' }}>
                        <input type="checkbox" checked={allSelected} onChange={() => setSelectedRewriteIds(allSelected ? [] : rewriteItems.map(i => i.id))}
                          style={{ width: '16px', height: '16px', accentYeslor: '#4f46e5', cursor: 'pointer' }} />
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Yesnv ID</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issue Detected</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', width: '220px' }}>Assign to</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', width: '100px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewriteItems.map((item, i) => {
                      const checked = selectedRewriteIds.includes(item.id);
                      const staff = reassignStaff[item.id];
                      const subjStyle = getSubjectStyle(item.subject);
                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: checked ? '#f5f3ff' : i % 2 === 0 ? '#fff' : '#fafafa', transition: 'background 0.15s' }}>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <input type="checkbox" checked={checked} onChange={() => setSelectedRewriteIds(prev => checked ? prev.filter(x => x !== item.id) : [...prev, item.id])}
                              style={{ width: '16px', height: '16px', accentYeslor: '#4f46e5', cursor: 'pointer' }} />
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: '700', color: '#1e293b', fontFamily: 'monospace', fontSize: '13px', background: '#f8fafc', padding: '3px 8px', borderRadius: '5px', border: '1px solid #e2e8f0' }}>{item.convId}</span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: subjStyle.bg, color: subjStyle.color }}>{item.subject}</span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0, display: 'inline-block' }} />
                              {item.issue}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            {staff ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: getStaffYeslor(staff), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#fff' }}>{getStaffPrintitials(staff)}</span>
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{staff}</span>
                                <button onClick={() => setReassignStaff(prev => { const n = {...prev}; delete n[item.id]; return n; })}
                                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', padding: '0 2px', lineHeight: 1 }}>✕</button>
                              </div>
                            ) : (
                              <select value="" onChange={e => setReassignStaff(prev => ({...prev, [item.id]: e.target.value}))}
                                style={{ padding: '7px 12px', fontSize: '13px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b', outline: 'none', minWidth: '160px' }}>
                                <option value="">Select staff member...</option>
                                {staffList.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                              </select>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', background: staff ? '#dcfce7' : '#f1f5f9', color: staff ? '#15803d' : '#94a3b8', letterSpacing: '0.3px' }}>
                              {staff ? '✓ Assigned' : 'Not Assigned'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Floating bulk assign bar */}
              {selectedRewriteIds.length > 0 && (
                <div style={{ position: 'sticky', bottom: '16px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '14px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 12px 32px rgba(0,0,0,0.35)', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontSize: '14px', fontWeight: '900' }}>{selectedRewriteIds.length}</span>
                    </div>
                    <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '14px' }}>conversations duoc chon</span>
                  </div>
                  <div style={{ width: '1px', height: '32px', background: '#334155' }} />
                  <select value={bulkAssignStaff} onChange={e => setBulkAssignStaff(e.target.value)}
                    style={{ padding: '10px 14px', fontSize: '14px', borderRadius: '8px', border: '1px solid #475569', background: '#334155', color: '#f1f5f9', cursor: 'pointer', flex: 1, maxWidth: '240px', outline: 'none' }}>
                    <option value="">Select staff to assign...</option>
                    {staffList.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                  </select>
                  <button onClick={() => {
                    if (!bulkAssignStaff) return alert('Vui long chon nhan vien!');
                    const updates = {};
                    selectedRewriteIds.forEach(id => { updates[id] = bulkAssignStaff; });
                    setReassignStaff(prev => ({...prev, ...updates}));
                    setSelectedRewriteIds([]);
                    setBulkAssignStaff('');
                  }} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: '800', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.4)' }}>
                    Assign All
                  </button>
                  <button onClick={() => setSelectedRewriteIds([])}
                    style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '600', borderRadius: '8px', border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                    Cancel
                </button>
              </div>
            )}
          </div>
        );
      })()}

        {/* ===== STEP 11: STAFF SUBMISSION REVIEW (3b) ===== */}
        {currentSubStep4 === 11 && (() => {
          const rewriteItems = filteredQualitySamples.filter(i => i.bucket === 'Rewrite');
          const activeItem = rewriteItems[rewriteYesnvIdx] || rewriteItems[0];
          const approvedYesunt = rewriteItems.filter(i => completedRewrites[i.id]).length;
          const pendingYesunt = rewriteItems.filter(i => !completedRewrites[i.id]).length;

          const subjectYeslors = {
            'Math': { bg: '#e0e7ff', color: '#4338ca' }, 'Physics': { bg: '#cffafe', color: '#0e7490' },
            'Chemistry': { bg: '#d1fae5', color: '#065f46' }, 'Biology': { bg: '#fef3c7', color: '#92400e' },
            'History': { bg: '#ede9fe', color: '#6d28d9' }, 'Geography': { bg: '#fee2e2', color: '#b91c1c' },
            'PHYSICAL': { bg: '#cffafe', color: '#0e7490' }, 'CHEMISTRY': { bg: '#d1fae5', color: '#065f46' },
            'BIOLOGY': { bg: '#fef3c7', color: '#92400e' }, 'HISTORY': { bg: '#ede9fe', color: '#6d28d9' },
            'GEOGRAPHY': { bg: '#fee2e2', color: '#b91c1c' }, 'LITERATURE': { bg: '#fce7f3', color: '#9d174d' },
            'MATH': { bg: '#e0e7ff', color: '#4338ca' },
          };
          const getSubjectStyle = (s) => subjectYeslors[s] || { bg: '#f1f5f9', color: '#475569' };

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fde68a', borderRadius: '16px', padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '22px' }}>🔍</span>
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#78350f' }}>Review Staff Submissions</h2>
                    <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#92400e' }}>Yesmpare the original and staff-revised versions. Approve (Gold) or request a redo.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 18px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase' }}>Pending Review</div>
                    <div style={{ fontSize: '26px', fontWeight: '900', color: '#d97706', lineHeight: 1.2 }}>{pendingYesunt}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 18px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#15803d', textTransform: 'uppercase' }}>Approved</div>
                    <div style={{ fontSize: '26px', fontWeight: '900', color: '#16a34a', lineHeight: 1.2 }}>{approvedYesunt}</div>
                  </div>
                  <button onClick={() => setCurrentSubStep4(12)}
                    style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '700', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #1e293b, #334155)', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,41,59,0.25)', whiteSpace: 'nowrap' }}>
                    Dataset Distribution →
                  </button>
                </div>
              </div>

              {/* 2-col layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', alignItems: 'flex-start' }}>
                {/* Left sidebar */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Submission List</h4>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{rewriteItems.length} items</span>
                  </div>
                  <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
                    {rewriteItems.map((item, idx) => {
                      const isSelected = activeItem?.id === item.id;
                      const isDone = completedRewrites[item.id];
                      const staffName = reassignStaff[item.id];
                      const subjStyle = getSubjectStyle(item.subject);
                      return (
                        <div key={item.id}
                          onClick={() => { setRewriteYesnvIdx(idx); setRewriteTextYesntent(''); }}
                          style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: isSelected ? '#f5f3ff' : '#fff', borderLeft: isSelected ? '3px solid #4f46e5' : '3px solid transparent', transition: 'all 0.15s' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b', fontFamily: 'monospace' }}>{item.convId}</span>
                            <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '999px', background: isDone ? '#dcfce7' : staffName ? '#fef9c3' : '#f1f5f9', color: isDone ? '#15803d' : staffName ? '#854d0e' : '#94a3b8', letterSpacing: '0.3px', flexShrink: 0 }}>
                              {isDone ? '✓ Approved' : staffName ? '⏳ Pending Review' : 'Not Submitted'}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: subjStyle.bg, color: subjStyle.color }}>{item.subject}</span>
                          {staffName && <div style={{ fontSize: '11px', color: '#4f46e5', marginTop: '5px', fontWeight: '600' }}>👤 {staffName}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right review panel */}
                {activeItem ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Yesnv header */}
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: getSubjectStyle(activeItem.subject).bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${getSubjectStyle(activeItem.subject).color}30` }}>
                          <span style={{ fontSize: '10px', fontWeight: '900', color: getSubjectStyle(activeItem.subject).color }}>{activeItem.subject.slice(0,3)}</span>
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>{activeItem.convId}</h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                            Subject: <strong style={{ color: getSubjectStyle(activeItem.subject).color }}>{activeItem.subject}</strong>
                            {reassignStaff[activeItem.id] && <> &mdash; Giao cho: <strong style={{ color: '#4f46e5' }}>{reassignStaff[activeItem.id]}</strong></>}
                          </p>
                        </div>
                      </div>
                      {!completedRewrites[activeItem.id] && (
                        <button onClick={() => setRewriteTextYesntent(`[Gia lap ${reassignStaff[activeItem.id] || 'Staff'} nop]: Truoc khi giai, em hay thu suy nghi xem quy tac nao co the ap dung o day nhe?`)}
                          style={{ padding: '9px 16px', fontSize: '12px', fontWeight: '700', borderRadius: '8px', border: '1.5px dashed #c7d2fe', background: '#f0f4ff', cursor: 'pointer', color: '#4338ca', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>⚡</span> Simulate Staff Submission
                        </button>
                      )}
                    </div>

                    {/* Error context banner */}
                    <div style={{ background: 'linear-gradient(135deg, #fff7ed, #fffbeb)', border: '1px solid #fcd34d', borderRadius: '12px', padding: '14px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '14px' }}>⚠</span>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 3px 0', fontSize: '11px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Error to Fix (Detected by AI Judges)</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#78350f', lineHeight: '1.6', fontWeight: '500' }}>{activeItem.reason}</p>
                      </div>
                    </div>

                    {/* Yesmparison: Original vs Rewrite */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ background: '#fff', border: '1.5px solid #fca5a5', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ padding: '12px 16px', background: '#fff1f2', borderBottom: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                          <span style={{ fontSize: '12px', fontWeight: '800', color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Original Response (Has Error)</span>
                          <span style={{ fontSize: '11px', color: '#ef4444', marginLeft: 'auto' }}>Turn #{(activeItem.errorMessagePrintdex || 1) + 1}</span>
                        </div>
                        <div style={{ padding: '16px', fontSize: '14px', color: '#374151', lineHeight: '1.7', minHeight: '100px' }}>
                          {activeItem.messages[activeItem.errorMessagePrintdex || 1]?.text || '(khong tim thay noi dung)'}
                        </div>
                      </div>
                      <div style={{ background: '#fff', border: `1.5px solid ${(rewriteTextYesntent || completedRewrites[activeItem.id]) ? '#86efac' : '#e2e8f0'}`, borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ padding: '12px 16px', background: (rewriteTextYesntent || completedRewrites[activeItem.id]) ? '#f0fdf4' : '#f8fafc', borderBottom: `1px solid ${(rewriteTextYesntent || completedRewrites[activeItem.id]) ? '#86efac' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: (rewriteTextYesntent || completedRewrites[activeItem.id]) ? '#16a34a' : '#94a3b8' }} />
                          <span style={{ fontSize: '12px', fontWeight: '800', color: (rewriteTextYesntent || completedRewrites[activeItem.id]) ? '#15803d' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Staff Submission</span>
                          {reassignStaff[activeItem.id] && <span style={{ fontSize: '11px', color: '#4f46e5', marginLeft: 'auto', fontWeight: '600' }}>by {reassignStaff[activeItem.id]}</span>}
                        </div>
                        <div style={{ padding: '16px', fontSize: '14px', color: (rewriteTextYesntent || completedRewrites[activeItem.id]) ? '#15803d' : '#94a3b8', lineHeight: '1.7', minHeight: '100px', fontStyle: (rewriteTextYesntent || completedRewrites[activeItem.id]) ? 'normal' : 'italic' }}>
                          {(rewriteTextYesntent || completedRewrites[activeItem.id]) ? (rewriteTextYesntent || 'Rewrite submitted.') : 'Staff chua nop ban rewrite. Label "Simulate Staff Submission" de xem demo.'}
                        </div>
                      </div>
                    </div>

                    {/* Admin action bar */}
                    {(rewriteTextYesntent || completedRewrites[activeItem.id]) ? (
                      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 22px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', flex: 1 }}>Admin Decision:</span>
                        <button onClick={() => {
                          setYesmpletedRewrites(prev => ({...prev, [activeItem.id]: true}));
                          const next = rewriteItems.find((x, xi) => xi > rewriteYesnvIdx && !completedRewrites[x.id]);
                          if (next) { setRewriteYesnvIdx(rewriteItems.indexOf(next)); setRewriteTextYesntent(''); }
                        }} disabled={!!completedRewrites[activeItem.id]}
                          style={{ padding: '11px 24px', fontSize: '14px', fontWeight: '800', borderRadius: '9px', border: 'none', background: completedRewrites[activeItem.id] ? '#e2e8f0' : 'linear-gradient(135deg, #16a34a, #15803d)', color: completedRewrites[activeItem.id] ? '#94a3b8' : '#fff', cursor: completedRewrites[activeItem.id] ? 'default' : 'pointer', boxShadow: completedRewrites[activeItem.id] ? 'none' : '0 4px 12px rgba(22,163,74,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {completedRewrites[activeItem.id] ? '✓ Approved → Gold' : '✓ Approve → Gold'}
                        </button>
                        <button onClick={() => { setRewriteTextYesntent(''); setYesmpletedRewrites(prev => { const n = {...prev}; delete n[activeItem.id]; return n; }); }}
                          disabled={!!completedRewrites[activeItem.id]}
                          style={{ padding: '11px 20px', fontSize: '14px', fontWeight: '700', borderRadius: '9px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', cursor: completedRewrites[activeItem.id] ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          ↩ Request Redo
                        </button>
                        <button disabled={!!completedRewrites[activeItem.id]}
                          style={{ padding: '11px 20px', fontSize: '14px', fontWeight: '700', borderRadius: '9px', border: '1.5px solid #fca5a5', background: '#fff1f2', color: '#dc2626', cursor: completedRewrites[activeItem.id] ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          ✕ Reject
                        </button>
                      </div>
                    ) : (
                      <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Staff chua nop ban rewrite.</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#cbd5e1' }}>Label "Simulate Staff Submission" o tren de xem demo.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '60px', textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>👆</div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Select mot conversations o ben trai de kiem duyet.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ===== STEP 11: FINAL DISTRIBUTION DASHBOARD ===== */}
        {currentSubStep4 === 12 && (() => {
          const totalYesnv = 20;
          const totalMsg = 148;
          const goldYesunt = 8;
          const rewriteYesunt = 9;
          const rejectYesunt = 3;
          const goldRate = Math.round((goldYesunt / totalYesnv) * 100);
          const avgAIScore = 6.9;
          const conflictYesunt = 3;

          const subjectData = [
            { name: 'Math', conv: 5, pct: 25, color: '#4f46e5' },
            { name: 'Physics', conv: 4, pct: 20, color: '#0891b2' },
            { name: 'Chemistry', conv: 3, pct: 15, color: '#059669' },
            { name: 'Biology', conv: 3, pct: 15, color: '#d97706' },
            { name: 'History', conv: 2, pct: 10, color: '#7c3aed' },
            { name: 'Geography', conv: 1, pct: 5, color: '#dc2626' },
            { name: 'Literature', conv: 1, pct: 5, color: '#0d9488' },
            { name: 'English', conv: 1, pct: 5, color: '#ea580c' },
          ];

          const topReasons = [
            { reason: 'AI tra loi truc tiep (khong Socratic)', count: 7, pct: 58, bucket: 'Rewrite' },
            { reason: 'Cau tra loi gia tri training thap', count: 5, pct: 42, bucket: 'Rewrite' },
            { reason: 'Sai kien thuc chuyen mon', count: 2, pct: 17, bucket: 'Reject' },
            { reason: 'Ngon ngu khong phu hop hoc sinh', count: 1, pct: 8, bucket: 'Reject' },
          ];

          const staffData = [
            { name: 'Nguyen Thi A', subject: 'Math', assigned: 6, approved: 6, rate: 100, status: 'Finish' },
            { name: 'Tran Van B', subject: 'Physics', assigned: 5, approved: 4, rate: 80, status: 'Approved' },
            { name: 'Le Thi C', subject: 'Chemistry', assigned: 4, approved: 4, rate: 100, status: 'Finish' },
            { name: 'Pham Van D', subject: 'Biology', assigned: 3, approved: 2, rate: 67, status: 'Pending Review' },
            { name: 'Hoang Thi E', subject: 'History', assigned: 2, approved: 1, rate: 50, status: 'Pending Review' },
          ];

          const conflictData = [
            { id: 'conv_42DE5T_9', subject: 'Physics', gemini: 4.2, deepseek: 7.8, human: null, diff: 3.6, resolved: false },
            { id: 'conv_42D67D_11', subject: 'Biology', gemini: 4.1, deepseek: 7.2, human: null, diff: 3.1, resolved: false },
            { id: 'conv_42D67D_14', subject: 'History', gemini: 4.9, deepseek: 7.1, human: 5.0, diff: 2.2, resolved: true },
          ];

          // Donut arc calculation
          const total = goldYesunt + rewriteYesunt + rejectYesunt;
          const r = 70, circ = 2 * Math.PI * r;
          const goldArc = (goldYesunt / total) * circ;
          const rewriteArc = (rewriteYesunt / total) * circ;
          const rejectArc = (rejectYesunt / total) * circ;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* ── PROJECT METADATA HEADER ── */}
              <div style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden' }}>
                {/* decorative bg circles */}
                <div style={{ position: 'absolute', top: '-20px', right: '120px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, #4f46e520 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-30px', right: '40px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed15 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>SEP490-G36</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>v2.4 · Batch 3</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '4px' }}>✓ READY TO EXPORT</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.3px' }}>Dataset Distribution Dashboard</h2>
                  <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                    Overview of dataset before export and training · Finish: 10/06/2026
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ padding: '10px 18px', fontSize: '13px', fontWeight: '700', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <Download size={14} /> Export Report
                  </button>
                  <button style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '800', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.35)' }}>
                    Export Dataset
                  </button>
                </div>
              </div>

              {/* ── 5 KPI CARDS ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
                {[
                  { label: 'Conversations', value: totalYesnv, sub: `${totalMsg} messages`, color: '#4f46e5', bg: '#eef2ff', icon: '💬' },
                  { label: 'Gold Rate', value: `${goldRate}%`, sub: `${goldYesunt} / ${totalYesnv} conv`, color: '#15803d', bg: '#f0fdf4', icon: '🏅' },
                  { label: 'Avg AI Score', value: avgAIScore, sub: 'Gemini + Deepseek', color: '#0891b2', bg: '#f0f9ff', icon: '🤖' },
                  { label: 'Subjects', value: subjectData.length, sub: 'Evenly distributed', color: '#7c3aed', bg: '#f5f3ff', icon: '📚' },
                  { label: 'Conflict', value: conflictYesunt, sub: `${conflictData.filter(c => c.resolved).length} da giai quyet`, color: '#dc2626', bg: '#fff5f5', icon: '⚠️' },
                ].map(({ label, value, sub, color, bg, icon }) => (
                  <div key={label} style={{ background: bg, border: `1.5px solid ${color}22`, borderRadius: '14px', padding: '16px 18px', position: 'relative', overflow: 'hidden', boxShadow: `0 2px 8px ${color}10` }}>
                    <div style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '22px', opacity: 0.25 }}>{icon}</div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                    <div style={{ fontSize: '30px', fontWeight: '900', color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: '11.5px', color: `${color}bb`, marginTop: '5px', fontWeight: '500' }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* ── SUBJECT DISTRIBUTION + QUALITY DONUT ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* Subject Distribution */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>📚 Phan bo Subject</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>{subjectData.length} mon / {totalYesnv} conversations</p>
                    </div>
                    <button
                      onClick={() => setBalancedSubject(!balancedSubject)}
                      style={{ padding: '7px 13px', fontSize: '12px', fontWeight: '700', borderRadius: '8px', border: `1.5px solid ${balancedSubject ? '#15803d' : '#e2e8f0'}`, background: balancedSubject ? '#dcfce7' : '#f8fafc', color: balancedSubject ? '#15803d' : '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}>
                      <Sparkles size={12} />
                      {balancedSubject ? 'Da can bang Subject' : 'Can bang Subject'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {subjectData.map(({ name, conv, pct, color }) => {
                      const displayPct = balancedSubject ? 12.5 : pct;
                      const displayYesnv = balancedSubject ? Math.round(totalYesnv / subjectData.length) : conv;
                      return (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151', minWidth: '76px' }}>{name}</span>
                          <div style={{ flex: 1, height: '14px', background: '#f1f5f9', borderRadius: '7px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${displayPct * 4}%`, background: `linear-gradient(90deg, ${color}bb, ${color})`, borderRadius: '7px', transition: 'width 0.55s ease', boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4)` }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: '800', color, minWidth: '78px', textAlign: 'right' }}>{displayYesnv} ({displayPct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                  {balancedSubject && (
                    <div style={{ marginTop: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ✅ Da can bang: moi mon hoc duoc dieu chinh ve ~2-3 conv (12.5% moi nhom).
                    </div>
                  )}
                </div>

                {/* Quality Donut */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>📊 Classification Chat luong</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>{total} conversations da phan loai</p>
                    </div>
                    <button
                      onClick={() => setBalancedQuality(!balancedQuality)}
                      style={{ padding: '7px 13px', fontSize: '12px', fontWeight: '700', borderRadius: '8px', border: `1.5px solid ${balancedQuality ? '#15803d' : '#e2e8f0'}`, background: balancedQuality ? '#dcfce7' : '#f8fafc', color: balancedQuality ? '#15803d' : '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}>
                      <Sparkles size={12} />
                      {balancedQuality ? 'Da can bang Chat luong' : 'Can bang Chat luong'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    {/* Donut SVG - larger and with drop shadow */}
                    <div style={{ position: 'relative', width: '190px', height: '190px', flexShrink: 0 }}>
                      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.10))' }}>
                        <circle cx="100" cy="100" r={r} fill="none" stroke="#f1f5f9" strokeWidth="30" />
                        <circle cx="100" cy="100" r={r} fill="none" stroke="#16a34a" strokeWidth="30"
                          strokeDasharray={`${balancedQuality ? circ * 0.6 : goldArc} ${circ}`} strokeDashoffset="0" strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
                        <circle cx="100" cy="100" r={r} fill="none" stroke="#d97706" strokeWidth="30"
                          strokeDasharray={`${balancedQuality ? circ * 0.3 : rewriteArc} ${circ}`} strokeDashoffset={`${-(balancedQuality ? circ * 0.6 : goldArc)}`} style={{ transition: 'all 0.6s ease' }} />
                        <circle cx="100" cy="100" r={r} fill="none" stroke="#dc2626" strokeWidth="30"
                          strokeDasharray={`${balancedQuality ? circ * 0.1 : rejectArc} ${circ}`} strokeDashoffset={`${-(balancedQuality ? circ * 0.9 : goldArc + rewriteArc)}`} style={{ transition: 'all 0.6s ease' }} />
                      </svg>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>{total}</div>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px', marginTop: '3px' }}>TOTAL</div>
                      </div>
                    </div>
                    {/* Legend cards with mini progress bars */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { label: 'Gold (Xuat sac)', count: balancedQuality ? 12 : goldYesunt, pct: balancedQuality ? 60 : goldRate, color: '#16a34a', bg: '#f0fdf4', icon: '🏅' },
                        { label: 'Rewrite (Edit)', count: balancedQuality ? 6 : rewriteYesunt, pct: balancedQuality ? 30 : 45, color: '#d97706', bg: '#fffbeb', icon: '✏️' },
                        { label: 'Reject (Loai)', count: balancedQuality ? 2 : rejectYesunt, pct: balancedQuality ? 10 : 15, color: '#dc2626', bg: '#fff5f5', icon: '🚫' },
                      ].map(({ label, count, pct, color, bg, icon }) => (
                        <div key={label} style={{ padding: '10px 12px', borderRadius: '10px', background: bg, border: `1px solid ${color}25` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '14px' }}>{icon}</span>
                            <span style={{ fontSize: '12.5px', fontWeight: '700', color, flex: 1 }}>{label}</span>
                            <span style={{ fontSize: '17px', fontWeight: '900', color, lineHeight: 1 }}>{count}</span>
                            <span style={{ fontSize: '11px', color: `${color}99`, fontWeight: '600' }}>({pct}%)</span>
                          </div>
                          <div style={{ height: '5px', background: `${color}18`, borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: '3px', transition: 'width 0.6s ease' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {balancedQuality && (
                    <div style={{ marginTop: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#15803d' }}>
                      ✅ Da tai can bang: xu ly oversample Gold, undersample Reject. Rate moi: 60% / 30% / 10%.
                    </div>
                  )}
                </div>
              </div>

              {/* ── STAFF PERFORMANCE ── */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>Staff Performance</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>{staffData.length} nhan vien tham gia xu ly tap du lieu nay</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ background: '#dcfce7', borderRadius: '8px', padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#15803d' }}>Finish</div>
                      <div style={{ fontSize: '18px', fontWeight: '900', color: '#15803d' }}>{staffData.filter(s => s.status === 'Finish').length}</div>
                    </div>
                    <div style={{ background: '#fef3c7', borderRadius: '8px', padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#92400e' }}>Pending Review</div>
                      <div style={{ fontSize: '18px', fontWeight: '900', color: '#92400e' }}>{staffData.filter(s => s.status === 'Pending Review').length}</div>
                    </div>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Staff', 'Subject phu trach', 'Da nop / Giao', 'Rate duyet', 'Progress', 'Status'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staffData.map((s, i) => (
                      <tr key={s.name} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                              {s.name[0]}
                            </div>
                            <span style={{ fontWeight: '700', color: '#1e293b' }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#f1f5f9', color: '#475569' }}>{s.subject}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: '700', color: s.approved === s.assigned ? '#15803d' : '#d97706' }}>
                          {s.approved} / {s.assigned}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: '700', color: s.rate >= 100 ? '#15803d' : s.rate >= 70 ? '#d97706' : '#dc2626' }}>
                          {s.rate}%
                        </td>
                        <td style={{ padding: '12px 16px', minWidth: '120px' }}>
                          <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${s.rate}%`, background: s.rate >= 100 ? '#16a34a' : s.rate >= 70 ? '#d97706' : '#dc2626', borderRadius: '4px', transition: 'width 0.3s' }} />
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                            background: s.status === 'Finish' ? '#dcfce7' : s.status === 'Approved' ? '#e0e7ff' : '#fef3c7',
                            color: s.status === 'Finish' ? '#15803d' : s.status === 'Approved' ? '#4338ca' : '#92400e'
                          }}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── TOP REASONS + CONFLICT ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Top Reasons */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>Reason loi pho bien (Top Reasons)</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>Vi sao cac mau bi phan loai Rewrite/Reject</p>
                  </div>
                  <div style={{ padding: '16px' }}>
                    {topReasons.map(({ reason, count, pct, bucket }, idx) => (
                      <div key={idx} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', background: bucket === 'Rewrite' ? '#fef3c7' : '#fee2e2', color: bucket === 'Rewrite' ? '#92400e' : '#dc2626' }}>{bucket}</span>
                            <span style={{ fontSize: '13px', color: '#334155', fontWeight: '600' }}>{reason}</span>
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>{count} HT</span>
                        </div>
                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: bucket === 'Rewrite' ? '#d97706' : '#dc2626', borderRadius: '4px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI vs Human Conflict */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#fff7f7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#b91c1c' }}>Conflict AI vs Human</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#dc2626' }}>{conflictData.filter(c => !c.resolved).length} chua giai quyet / {conflictData.length} tong</p>
                      </div>
                      <span style={{ fontSize: '22px' }}>⚠️</span>
                    </div>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                        {['ID', 'Subject', 'Gemini', 'Deepseek', 'Human', 'Delta', 'Status'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {conflictData.map(({ id, subject, gemini, deepseek, human, diff, resolved }) => (
                        <tr key={id} style={{ borderBottom: '1px solid #f1f5f9', background: resolved ? '#f0fdf4' : '#fff7f7' }}>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '11px', fontWeight: '700', color: '#1e293b' }}>{id.slice(-6)}</td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: '#475569' }}>{subject}</td>
                          <td style={{ padding: '10px 12px', fontWeight: '700', color: '#dc2626', fontSize: '13px' }}>{gemini}</td>
                          <td style={{ padding: '10px 12px', fontWeight: '700', color: '#16a34a', fontSize: '13px' }}>{deepseek}</td>
                          <td style={{ padding: '10px 12px', fontWeight: '700', color: human ? '#ea580c' : '#cbd5e1', fontSize: '13px' }}>{human ?? '—'}</td>
                          <td style={{ padding: '10px 12px', fontWeight: '800', color: diff >= 3 ? '#dc2626' : '#d97706', fontSize: '13px' }}>±{diff}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', background: resolved ? '#dcfce7' : '#fee2e2', color: resolved ? '#15803d' : '#dc2626' }}>
                              {resolved ? 'Resolved' : 'Can xu ly'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: '12px 16px', background: '#fafafa', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#64748b' }}>
                    💡 Conflict xay ra khi diem AI va Human chenh nhau &gt; 2.0 diem. Can duoc xac nhan bo truoc khi xuat.
                  </div>
                </div>
              </div>

            </div>
          );
        })()}
      </div>
    );
  };

  const renderStage6 = () => {
    const livePreviewJSON = {
      messages: [
        { role: 'system', content: promptText || '[No system prompt yet]' },
        { role: 'user', content: sampleQuestion },
        { role: 'assistant', content: '"ChÃ o báº¡n, phÆ°Æ¡ng trÃ¬nh nÃ y cÃ³ thá»ƒ giáº£i báº±ng cÃ¡ch nhÃ¢n nghiá»‡m theo há»‡ thá»©c Vi et: x1 + x2 = 5 vÃ  x1 * x2 = 6. Váº­y nghiá»‡m lÃ  x = 2 vÃ  x = 3. CÃ³ Ä‘iá» u gÃ¬ mÃ  báº¡n muá»‘n tháº£o luáº­n thÃªm vá»  cÃ¡ch giáº£i nÃ y?"' }
      ]
    };

    return (
      <div className="dataprep-stage2">
        {/* Sub-stepper */}
        <div className="sub-stepper">
          {SUB_STEPS_STAGE6.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div
                className={`sub-step ${step.num === currentSubStep6 ? 'active' : ''} ${step.num < currentSubStep6 ? 'completed' : ''}`}
                onClick={() => setCurrentSubStep6(step.num)}
              >
                <div className="sub-step-circle">
                  {step.num < currentSubStep6 ? <Check size={14} /> : step.num}
                </div>
                <div className="sub-step-label" style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>{step.label}</div>
              </div>
              {idx < SUB_STEPS_STAGE6.length - 1 && <div className="sub-step-connector" />}
            </React.Fragment>
          ))}
        </div>

        {/* Sub-step 13: System Prompt */}
        {currentSubStep6 === 13 && (
          <div className="s6-prompt">
            <div className="s6-prompt-title">
              <h3>System Prompt Versioning</h3>
              <p>Manage prompt history, compare versions, and test with trial run before saving.</p>
            </div>

            {/* Two-column: History + Editor */}
            <div className="s6-prompt-layout">
              {/* Left: History */}
              <div className="s6-history-card">
                <div className="s6-history-header">
                  <h4>History</h4>
                  <div className="s6-history-actions">
                    <button className="s4-btn-outline" style={{ fontSize: '11px', padding: '5px 10px' }}>Yesmpare Mode</button>
                    <span className="s6-version-count">{PROMPT_VERSIONS.length} versions</span>
                  </div>
                </div>

                <input className="s6-search-input" placeholder="Search by description or version" />

                <div className="s6-version-list">
                  {PROMPT_VERSIONS.map(v => (
                    <div
                      key={v.id}
                      className={`s6-version-item ${selectedVersion?.id === v.id ? 's6-version-selected' : ''}`}
                      onClick={() => setSelectedVersion(v)}
                    >
                      <div className="s6-version-item-left">
                        <span className="s6-version-name">{v.name}</span>
                        <span className="s6-version-desc">{v.desc}</span>
                      </div>
                      <span className="s6-version-date">{v.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Viewer + Editor */}
              <div className="s6-editor-col">
                {/* Selected Version (Read-only) */}
                <div className="s6-viewer-card">
                  <h4>Selected Version (Read-only)</h4>
                  <textarea
                    className="s6-viewer-textarea"
                    readOnly
                    value={selectedVersion ? selectedVersion.content : ''}
                    placeholder="Select a version from History to inspect its content."
                  />
                </div>

                {/* Editor */}
                <div className="s6-editor-card">
                  <h4>Editor - Current Prompt</h4>
                  <label className="s6-field-label">Current Prompt</label>
                  <textarea
                    className="s6-editor-textarea"
                    placeholder="Write your current system prompt here..."
                    value={promptText}
                    onChange={e => setPromptText(e.target.value)}
                  />

                  <label className="s6-field-label">Prompt Name (Unique)</label>
                  <input
                    className="s6-field-input"
                    value={promptName}
                    onChange={e => setPromptName(e.target.value)}
                  />

                  <label className="s6-field-label">Description</label>
                  <input
                    className="s6-field-input"
                    value={promptDesc}
                    onChange={e => setPromptDesc(e.target.value)}
                  />

                  <span className="s6-library-source">Library Source: {promptName}</span>

                  <button className="s6-save-btn">Save as New Version</button>
                </div>
              </div>
            </div>

            {/* Trial Run */}
            <div className="s6-trial-card">
              <div className="s6-trial-header">
                <div>
                  <h4>Trial Run</h4>
                  <p>Test your current prompt with a sample question before saving.</p>
                </div>
                <button className="s6-trial-btn"><Sparkles size={14} /> Run Trial</button>
              </div>
              <div className="s6-trial-body">
                <div className="s6-trial-col">
                  <label className="s6-field-label">Sample Question</label>
                  <textarea
                    className="s6-trial-textarea"
                    value={sampleQuestion}
                    onChange={e => setSampleQuestion(e.target.value)}
                  />
                </div>
                <div className="s6-trial-col">
                  <label className="s6-field-label">Generated Response</label>
                  <textarea
                    className="s6-trial-textarea s6-trial-response"
                    readOnly
                    value={trialResponse}
                    placeholder="Click 'Run Trial' to generate a response..."
                  />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="s6-preview-card">
              <div className="s6-preview-header">
                <div>
                  <h4>Live Preview</h4>
                  <p>Preview of the first sample after inserting system prompt.</p>
                </div>
                <span className="s6-source-badge">Source: Editor</span>
              </div>
              <pre className="s6-json-preview">
                {JSON.stringify(livePreviewJSON, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Sub-step 14: Split Guard */}
        {currentSubStep6 === 14 && (
          <div className="sg-container">
            {/* Header */}
            <div className="sg-header">
              <div>
                <h3>Split Guard</h3>
                <p>Generate a train/test split with semantic conflict checking handled by the GPU service.</p>
              </div>
              <button className="s6-trial-btn"><Sparkles size={14} /> Generate safe split</button>
            </div>

            {/* Yesnfig Cards */}
            <div className="sg-config-row">
              <div className="sg-config-card">
                <span className="sg-config-label">TOTAL SAMPLES</span>
                <span className="sg-config-value">72</span>
              </div>
              <div className="sg-config-card">
                <div className="sg-config-label-row">
                  <span className="sg-config-label">TEST PERCENTAGE</span>
                  <span className="sg-config-pct">50%</span>
                </div>
                <input type="range" min="10" max="90" defaultValue={50} className="sg-slider sg-slider-purple" />
              </div>
              <div className="sg-config-card">
                <div className="sg-config-label-row">
                  <span className="sg-config-label">SEMANTIC THRESHOLD</span>
                  <span className="sg-config-pct">1.000</span>
                </div>
                <input type="range" min="0" max="100" defaultValue={100} className="sg-slider sg-slider-purple" />
              </div>
            </div>

            {/* Max Attempts */}
            <div className="sg-attempts-card">
              <span className="sg-config-label">MAX ATTEMPTS</span>
              <p className="sg-attempts-desc">The GPU service will reshuffle until the split is clean or this limit is reached.</p>
              <input type="number" defaultValue={20} className="sg-attempts-input" />
            </div>

            {/* Split Generated Result */}
            <div className="sg-result-card">
              <div className="sg-result-title"><Check size={16} /> Split Generated</div>
              <div className="sg-result-stats">
                <div className="sg-result-stat">
                  <span className="sg-result-label">TRAIN</span>
                  <span className="sg-result-value">36</span>
                </div>
                <div className="sg-result-stat">
                  <span className="sg-result-label">TEST</span>
                  <span className="sg-result-value">36</span>
                </div>
                <div className="sg-result-stat">
                  <span className="sg-result-label">ATTEMPTS</span>
                  <span className="sg-result-value">1</span>
                </div>
                <div className="sg-result-stat">
                  <span className="sg-result-label">CONFLICTS</span>
                  <span className="sg-result-value sg-value-red">4</span>
                </div>
                <div className="sg-result-stat">
                  <span className="sg-result-label">MAX SIMILARITY</span>
                  <span className="sg-result-value">0.96</span>
                </div>
              </div>
            </div>

            {/* Venn Diagram */}
            <div className="sg-venn-card">
              <h4>Semantic Overlap Visualization</h4>
              <p className="sg-venn-sub">Visual representation of semantic similarity between <span style={{ color: '#7c3aed' }}>Train</span> and <span style={{ color: '#3b82f6' }}>Test</span> sets.</p>
              <div className="sg-venn-wrap">
                <svg viewBox="0 0 400 220" className="sg-venn-svg">
                  {/* Train circle */}
                  <circle cx="155" cy="110" r="80" fill="rgba(124,58,237,0.12)" stroke="#7c3aed" strokeWidth="2" />
                  {/* Test circle */}
                  <circle cx="245" cy="110" r="80" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="2" />
                  {/* Overlap area - dashed */}
                  <ellipse cx="200" cy="110" rx="35" ry="55" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
                  {/* Labels */}
                  <text x="115" y="105" textAnchor="middle" className="sg-venn-text-main" fill="#7c3aed">TRAIN</text>
                  <text x="115" y="122" textAnchor="middle" className="sg-venn-text-sub" fill="#7c3aed">32 unique</text>
                  <text x="285" y="105" textAnchor="middle" className="sg-venn-text-main" fill="#3b82f6">TEST</text>
                  <text x="285" y="122" textAnchor="middle" className="sg-venn-text-sub" fill="#3b82f6">32 unique</text>
                  <text x="200" y="105" textAnchor="middle" className="sg-venn-text-main" fill="#ef4444">OVERLAP</text>
                  <text x="200" y="120" textAnchor="middle" className="sg-venn-text-sub" fill="#ef4444">4 conflicts</text>
                </svg>
              </div>

              {/* Summary Cards */}
              <div className="sg-summary-row">
                <div className="sg-summary-card sg-summary-train">
                  <span className="sg-summary-value">32</span>
                  <span className="sg-summary-label">Train Only</span>
                </div>
                <div className="sg-summary-card sg-summary-conflict">
                  <span className="sg-summary-value">4</span>
                  <span className="sg-summary-label">Semantic Conflicts</span>
                </div>
                <div className="sg-summary-card sg-summary-test">
                  <span className="sg-summary-value">32</span>
                  <span className="sg-summary-label">Test Only</span>
                </div>
              </div>
            </div>

            {/* Manual Exclusion Tool */}
            <div className="sg-exclusion-card">
              <div className="sg-exclusion-header">
                <div>
                  <h4>Manual Exclusion Tool</h4>
                  <p>Select samples below to exclude them from the dataset and resolve conflicts.</p>
                </div>
                <span className="sg-excluded-count">0 excluded</span>
              </div>
              <div className="sg-conflict-list">
                {[
                  { text: 'Giáº£i phÆ°Æ¡ng trÃ¬nh báº­c hai xÂ² - 5x + 6 = 0', sim: 0.92 },
                  { text: 'TÃ¬m nghiá»‡m cá»§a phÆ°Æ¡ng trÃ¬nh xÂ² + 3x - 4 = 0', sim: 0.87 },
                  { text: 'PhÆ°Æ¡ng trÃ¬nh báº­c hai cÃ³ delta Ã¢m thÃ¬ cÃ³ máº¥y nghiá»‡m?', sim: 0.95 },
                  { text: 'CÃ´ng thá»©c Vi-et dÃ¹ng Ä‘á»ƒ lÃ m gÃ¬?', sim: 0.89 },
                ].map((item, idx) => (
                  <div key={idx} className="sg-conflict-item">
                    <div className="sg-conflict-left">
                      <X size={14} className="sg-conflict-x" />
                      <div>
                        <span className="sg-conflict-text">{item.text}</span>
                        <div className="sg-conflict-meta">
                          <span className="sg-dot sg-dot-train"></span> Print Train
                          <span className="sg-dot sg-dot-test"></span> Print Test
                          <span className="sg-conflict-sim">Similarity: <strong style={{ color: '#dc2626' }}>{item.sim}</strong></span>
                        </div>
                      </div>
                    </div>
                    <button className="sg-exclude-btn">Click to exclude</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sub-step 15: Export */}
        {currentSubStep6 === 15 && (
          <div className="ex-container">
            {/* Dataset Preview */}
            <div className="ex-preview-card">
              <div className="ex-preview-header">
                <div>
                  <h3>Yesnverted Dataset Preview</h3>
                  <p>Showing 1-5 of 72 records</p>
                </div>
                <div className="ex-preview-controls">
                  <button className="s4-btn-outline" style={{ fontSize: '11px', padding: '5px 10px' }}>Show All</button>
                  <button className="s4-btn-outline" style={{ fontSize: '11px', padding: '5px 10px' }}>Printcrease Limit (5)</button>
                  <select className="s5-filter-select">
                    <option>5 / page</option>
                    <option>10 / page</option>
                    <option>20 / page</option>
                  </select>
                </div>
              </div>

              <table className="ex-table">
                <thead>
                  <tr>
                    <th>System</th>
                    <th>User</th>
                    <th>Assistant</th>
                    <th>overall</th>
                    <th>reason</th>
                    <th>evaluated by</th>
                  </tr>
                </thead>
                <tbody>
                  {EXPORT_ROWS.map((row, idx) => (
                    <tr key={idx}>
                      <td>-</td>
                      <td>
                        <span className="ex-cell-text">{row.user}</span>
                        <a href="#" className="ex-read-more">Read more</a>
                      </td>
                      <td>
                        <span className="ex-cell-text">{row.assistant}</span>
                        <a href="#" className="ex-read-more">Read more</a>
                      </td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ex-pagination">
                <button className="ex-page-btn" onClick={() => setExportPage(Math.max(1, exportPage - 1))}>Previous</button>
                <span className="ex-page-info">Page {exportPage} / 15</span>
                <button className="ex-page-btn" onClick={() => setExportPage(Math.min(15, exportPage + 1))}>Next</button>
              </div>
            </div>

            {/* Download Cards Row */}
            <div className="ex-download-row">
              <div className="ex-download-card">
                <h4>Download cooked Train/Test Split</h4>
                <p className="ex-download-stat">Train: 36 / Test: 36</p>
                <p className="ex-download-note">Export uses the safe split generated in the previous step. Handson-splitting is disabled here.</p>
                <button className="ex-btn-green"><Download size={14} /> Download train/test .zip</button>
              </div>
              <div className="ex-download-card">
                <h4>Download Split Filter by Overall Score</h4>
                <div className="ex-score-row">
                  <span className="ex-score-label">Overall Score â‰¥</span>
                  <span className="ex-score-value">6.0</span>
                </div>
                <input type="range" min="0" max="10" step="0.5" defaultValue={6} className="sg-slider sg-slider-purple" />
                <button className="ex-btn-purple"><Download size={14} /> Download split overall &gt;= filter</button>
              </div>
            </div>

            {/* Push & Sync Row */}
            <div className="ex-push-row">
              <div className="ex-push-card">
                <h4>ðŸ”¥ Push to Hugging Face Hub</h4>
                <label className="s6-field-label" style={{ marginTop: 0 }}>Hugging Face Token</label>
                <input className="s6-field-input" defaultValue="hf_..." style={{ borderLeft: '1px solid #e2e8f0' }} />
                <label className="s6-field-label">Repository ID</label>
                <input className="s6-field-input" defaultValue="username/my-dataset" style={{ borderLeft: '1px solid #e2e8f0' }} />
                <label className="ex-checkbox-label">
                  <input type="checkbox" /> Make repository private
                </label>
                <button className="ex-btn-hub"><Upload size={14} /> Push to Hub</button>
              </div>
              <div className="ex-push-card">
                <h4>â˜ ï¸  Sync to Cloud Storage</h4>
                <label className="s6-field-label" style={{ marginTop: 0 }}>Cloud Provider</label>
                <div className="ex-cloud-options">
                  <button
                    className={`ex-cloud-btn ${cloudProvider === 'gcloud' ? 'ex-cloud-active' : ''}`}
                    onClick={() => setCloudProvider('gcloud')}
                  >
                    Google Cloud
                  </button>
                  <button
                    className={`ex-cloud-btn ${cloudProvider === 'azure' ? 'ex-cloud-active' : ''}`}
                    onClick={() => setCloudProvider('azure')}
                  >
                    Azure Blob
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="dataprep-actions-row">
          <button className="dataprep-btn-back" onClick={() => {
            if (currentSubStep6 > 13) {
              setCurrentSubStep6(currentSubStep6 - 1);
            } else {
              setCurrentStage(4);
            }
          }}>
            Back
          </button>
          <button className="s6-reset-btn"><RotateCcw size={14} /> Reset & Upload New</button>
          <button className="dataprep-btn-next" onClick={() => {
            if (currentSubStep6 < 15) {
              setCurrentSubStep6(currentSubStep6 + 1);
            }
          }}>
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dataprep-view">
      {/* Cleaning Preview Modal */}
      {showPreviewModal && (
        <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="modal-content cleaning-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>ðŸ”  Cleaning Preview</h2>
              <p className="modal-subtitle">View trÆ°á»›c káº¿t quáº£ lÃ m sáº¡ch dá»¯ liá»‡u â€” file gá»‘c khÃ´ng bá»‹ thay Ä‘á»•i</p>
              <button className="modal-close-btn" onClick={() => setShowPreviewModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="preview-modal-tabs">
              <button
                className={`preview-tab ${previewTab === 'before' ? 'active' : ''}`}
                onClick={() => setPreviewTab('before')}
              >
                ðŸ“„ Before ({PREVIEW_BEFORE.length})
              </button>
              <button
                className={`preview-tab ${previewTab === 'after' ? 'active' : ''}`}
                onClick={() => setPreviewTab('after')}
              >
                âœ… After ({PREVIEW_AFTER.length})
              </button>
              <button
                className={`preview-tab tab-removed ${previewTab === 'removed' ? 'active' : ''}`}
                onClick={() => setPreviewTab('removed')}
              >
                ðŸ—‘ï¸  Removed ({PREVIEW_REMOVED.length})
              </button>
            </div>

            {/* Summary bar */}
            <div className="preview-modal-summary">
              <span className="summary-tag summary-total">Tá»•ng: {PREVIEW_BEFORE.length} conversations</span>
              <span className="summary-tag summary-kept">Giá»¯ láº¡i: {PREVIEW_AFTER.length}</span>
              <span className="summary-tag summary-fixed">Ä Ã£ sá»­a: {PREVIEW_AFTER.filter(r => r.status === 'fixed').length}</span>
              <span className="summary-tag summary-removed">Loáº¡i bá» : {PREVIEW_REMOVED.length}</span>
            </div>

            {/* Tab Yesntent */}
            <div className="preview-modal-body">
              {previewTab === 'before' && (
                <table className="preview-modal-table">
                  <thead>
                    <tr>
                      <th>Yesnv ID</th>
                      <th>Status</th>
                      <th>User</th>
                      <th>Assistant (trÆ°á»›c)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW_BEFORE.map((row) => (
                      <tr key={row.id} className={row.status === 'has-issue' ? 'row-issue' : 'row-clean'}>
                        <td><span className="conv-id-badge">{row.id}</span></td>
                        <td>
                          {row.issue
                            ? <span className="status-badge badge-issue">{row.issue}</span>
                            : <span className="status-badge badge-clean">Clean</span>
                          }
                        </td>
                        <td className="cell-truncate">{row.user}</td>
                        <td className="cell-truncate">{row.assistant}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {previewTab === 'after' && (
                <table className="preview-modal-table">
                  <thead>
                    <tr>
                      <th>Yesnv ID</th>
                      <th>Action</th>
                      <th>User</th>
                      <th>Assistant (sau)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW_AFTER.map((row) => (
                      <tr key={row.id} className={row.status === 'fixed' ? 'row-fixed' : 'row-clean'}>
                        <td><span className="conv-id-badge">{row.id}</span></td>
                        <td><span className={`status-badge ${row.status === 'fixed' ? 'badge-fixed' : 'badge-clean'}`}>{row.action}</span></td>
                        <td className="cell-truncate">{row.user}</td>
                        <td className="cell-truncate">{row.assistant}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {previewTab === 'removed' && (
                <table className="preview-modal-table">
                  <thead>
                    <tr>
                      <th>Yesnv ID</th>
                      <th>LÃ½ do loáº¡i bá» </th>
                      <th>User</th>
                      <th>Assistant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW_REMOVED.map((row) => (
                      <tr key={row.id} className="row-removed">
                        <td><span className="conv-id-badge">{row.id}</span></td>
                        <td><span className="status-badge badge-removed">{row.reason}</span></td>
                        <td className="cell-truncate">{row.user}</td>
                        <td className="cell-truncate">{row.assistant}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="preview-modal-footer">
              <button className="modal-cancel-btn" onClick={() => setShowPreviewModal(false)}>
                Há»§y
              </button>
              <button className="modal-confirm-btn" onClick={() => {
                setCleaningApplied(true);
                setShowPreviewModal(false);
              }}>
                <Check size={16} />
                XÃ¡c nháº­n & Ã p dá»¥ng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="dataprep-stepper">
        {STAGES.map((stage, idx) => (
          <React.Fragment key={stage.num}>
            <div
              className={`stepper-step ${stage.num === currentStage ? 'active' : ''} ${stage.num < currentStage ? 'completed' : ''}`}
              onClick={() => setCurrentStage(stage.num)}
            >
              <div className="stepper-circle">
                {stage.num < currentStage ? <Check size={16} /> : stage.num}
              </div>
              <div className="stepper-label">
                <span className="stepper-stage-tag">STAGE {stage.num}</span>
                <span className="stepper-title">{stage.label}</span>
                <span className="stepper-sublabel">{stage.sub}</span>
              </div>
            </div>
            {idx < STAGES.length - 1 && <div className="stepper-divider" />}
          </React.Fragment>
        ))}
      </div>

      {/* Stage Yesntent */}
      {currentStage === 1 && renderStage1()}
      {currentStage === 2 && renderStage2()}
      {currentStage === 3 && renderStage3()}
      {currentStage === 4 && renderSep490Stage4()}
      {currentStage === 5 && renderStage6()}

      {/* Yesmpare Groups Modal */}
      {showYesmpareModal && (
        <div className="compare-modal-overlay" onClick={() => setShowYesmpareModal(false)}>
          <div className="compare-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="compare-header-row">
              <div className="compare-header-titles">
                <h2>Cluster Group Yesmparison</h2>
                <p>Yesmpare two groups side by side using User, &lt;think&gt;, and Assistant content.</p>
              </div>
              <button className="compare-close-btn" onClick={() => setShowYesmpareModal(false)}>
                <X size={14} /> Close Yesmparison
              </button>
            </div>

            <div className="compare-body">
              {/* Slot 1 */}
              <div className="compare-slot">
                {compareSlot1 === null ? (
                  <div className="slot-empty">
                    <div className="slot-header-empty">
                      <span>Yesmparison Slot 1</span>
                      <span className="empty-text">Empty slot</span>
                    </div>
                    <div className="slot-add-btn-wrapper">
                      <button className="slot-add-btn" onClick={() => setActiveYesmpareDropdown(activeYesmpareDropdown === 1 ? null : 1)}>
                        <Plus size={24} />
                      </button>
                      {activeYesmpareDropdown === 1 && (
                        <div className="slot-dropdown">
                          <div className="dropdown-title">SELECT GROUP</div>
                          {[0, 1, 2, 3, 4, 5, 6, 7].map(g => (
                            <div key={g} className="dropdown-item" onClick={() => { setYesmpareSlot1(g); setActiveYesmpareDropdown(null); }}>
                              <span>Group {g}</span>
                              <span className="dropdown-count">{g === 0 || g === 1 ? 17 : g === 2 ? 12 : 8} rows</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="slot-filled">
                    <div className="slot-filled-header">
                      <div>
                        <h3>Group {compareSlot1}</h3>
                        <p>{compareSlot1 === 0 || compareSlot1 === 1 ? 17 : 8} rows</p>
                      </div>
                      <button className="slot-clear-btn" onClick={() => setYesmpareSlot1(null)}><X size={14} /></button>
                    </div>
                    <div className="slot-table-wrapper">
                      <table className="compare-table">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>User</th>
                            <th style={{ width: '20%' }}>&lt;think&gt;</th>
                            <th style={{ width: '50%' }}>Assistant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...Array(5)].map((_, i) => (
                            <tr key={i}>
                              <td>{compareSlot1 === 0 ? "Em tháº¥y pháº§n Äá»‹nh luáº­t I Newton khÃ³ quÃ¡, em khÃ´ng muá»‘n há»c ná»¯a." : "Cho em Ä‘Ã¡p Ã¡n luÃ´n pháº§n Äá»‹nh luáº­t I Newton Ä‘i áº¡, em Ä‘ang vá»™i."}</td>
                              <td className="think-cell">-</td>
                              <td>{compareSlot1 === 0 ? "KhÃ´ng sao, mÃ¬nh chia nhá» ra nhÃ©. Em chÆ°a cáº§n lÃ m bÃ i khÃ³ ngay. TrÆ°á»›c tiÃªn chá»‰ cáº§n tráº£ lá»i má»™t cÃ¢u: Ä‘áº¡i lÆ°á»£ng chÃ­nh trong pháº§n nÃ y Ä‘ang mÃ´ táº£ Ä‘iá»u gÃ¬?" : "Tháº§y chÆ°a Ä‘Æ°a Ä‘Ã¡p Ã¡n ngay nhÃ©. Vá»›i pháº§n Äá»‹nh luáº­t I Newton, em thá»­ nÃ³i trÆ°á»›c em Ä‘ang vÆ°á»›ng á»Ÿ khÃ¡i niá»‡m, cÃ´ng thá»©c hay bÃ i táº­p sá»‘?"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Slot 2 */}
              <div className="compare-slot">
                {compareSlot2 === null ? (
                  <div className="slot-empty">
                    <div className="slot-header-empty">
                      <span>Yesmparison Slot 2</span>
                      <span className="empty-text">Empty slot</span>
                    </div>
                    <div className="slot-add-btn-wrapper">
                      <button className="slot-add-btn" onClick={() => setActiveYesmpareDropdown(activeYesmpareDropdown === 2 ? null : 2)}>
                        <Plus size={24} />
                      </button>
                      {activeYesmpareDropdown === 2 && (
                        <div className="slot-dropdown">
                          <div className="dropdown-title">SELECT GROUP</div>
                          {[0, 1, 2, 3, 4, 5, 6, 7].map(g => (
                            <div key={g} className="dropdown-item" onClick={() => { setYesmpareSlot2(g); setActiveYesmpareDropdown(null); }}>
                              <span>Group {g}</span>
                              <span className="dropdown-count">{g === 0 || g === 1 ? 17 : g === 2 ? 12 : 8} rows</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="slot-filled">
                    <div className="slot-filled-header">
                      <div>
                        <h3>Group {compareSlot2}</h3>
                        <p>{compareSlot2 === 0 || compareSlot2 === 1 ? 17 : 8} rows</p>
                      </div>
                      <button className="slot-clear-btn" onClick={() => setYesmpareSlot2(null)}><X size={14} /></button>
                    </div>
                    <div className="slot-table-wrapper">
                      <table className="compare-table">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>User</th>
                            <th style={{ width: '20%' }}>&lt;think&gt;</th>
                            <th style={{ width: '50%' }}>Assistant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...Array(5)].map((_, i) => (
                            <tr key={i}>
                              <td>{compareSlot2 === 0 ? "Em tháº¥y pháº§n Äá»‹nh luáº­t I Newton khÃ³ quÃ¡, em khÃ´ng muá»‘n há»c ná»¯a." : "Cho em Ä‘Ã¡p Ã¡n luÃ´n pháº§n Äá»‹nh luáº­t I Newton Ä‘i áº¡, em Ä‘ang vá»™i."}</td>
                              <td className="think-cell">-</td>
                              <td>{compareSlot2 === 0 ? "KhÃ´ng sao, mÃ¬nh chia nhá» ra nhÃ©. Em chÆ°a cáº§n lÃ m bÃ i khÃ³ ngay. TrÆ°á»›c tiÃªn chá»‰ cáº§n tráº£ lá»i má»™t cÃ¢u: Ä‘áº¡i lÆ°á»£ng chÃ­nh trong pháº§n nÃ y Ä‘ang mÃ´ táº£ Ä‘iá»u gÃ¬?" : "Tháº§y chÆ°a Ä‘Æ°a Ä‘Ã¡p Ã¡n ngay nhÃ©. Vá»›i pháº§n Äá»‹nh luáº­t I Newton, em thá»­ nÃ³i trÆ°á»›c em Ä‘ang vÆ°á»›ng á»Ÿ khÃ¡i niá»‡m, cÃ´ng thá»©c hay bÃ i táº­p sá»‘?"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yesmpare AI Labels Modal */}
      {showYesmpareLabels && (
        <div className="compare-modal-overlay" onClick={() => setShowYesmpareLabels(false)}>
          <div className="cl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cl-header">
              <div>
                <h2>Yesmpare AI Labels</h2>
                <p>Select two AI providers to compare their auto-labeling results.</p>
              </div>
              <button className="cl-close" onClick={() => setShowYesmpareLabels(false)}><X size={18} /></button>
            </div>

            <div className="cl-providers">
              <span className="cl-prov-label">Provider A:</span>
              <select className="cl-prov-select"><option>Gemini</option><option>Deepseek</option></select>
              <span className="cl-prov-arrow">â€º</span>
              <span className="cl-prov-label">Provider B:</span>
              <select className="cl-prov-select"><option>Deepseek</option><option>Gemini</option></select>
            </div>

            <div className="cl-stats">
              <div className="cl-stat-card">
                <span className="cl-stat-value cl-green">100%</span>
                <span className="cl-stat-label">AGREEMENT RATE</span>
              </div>
              <div className="cl-stat-card">
                <span className="cl-stat-value cl-blue">120</span>
                <span className="cl-stat-label">MATCHES</span>
              </div>
              <div className="cl-stat-card">
                <span className="cl-stat-value cl-red">0</span>
                <span className="cl-stat-label">MISMATCHES</span>
              </div>
            </div>

            <div className="cl-table-wrap">
              <table className="cl-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>CONVERSATION</th>
                    <th style={{ width: '20%' }}>GEMINI LABEL</th>
                    <th style={{ width: '20%' }}>DEEPSEEK LABEL</th>
                    <th style={{ width: '20%' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { user: 'Em khÃ´ng hiá»ƒu chuyá»ƒn Ä‘á»™ng tháº³ng Ä‘á»u lÃ  gÃ¬.', asst: 'KhÃ´ng sao, mÃ¬nh Ä‘i tá»«ng bÆ°á»›c nhÃ©. Em thá»­ nghÄ© xem: khi nÃ³i má»™t váº­t chuyá»ƒn Ä‘á»™ng, Ä‘iá»u Ä‘Ã³ cÃ³ nghÄ©a lÃ  gÃ¬?', gLabel: 'PHYSICAL', gYesnf: 100, dLabel: 'PHYSICAL', dYesnf: 95, match: true },
                    { user: 'LÃ  váº­t Ä‘ang Ä‘i chuyá»ƒn a.', asst: 'ÄÃºng rá»“i. BÃ¢y giá» em thá»­ nghÄ© thÃªm: náº¿u má»™t xe Ã´ tÃ´ cháº¡y trÃªn Ä‘Æ°á»ng tháº³ng vÃ  luÃ´n giá»¯ nguyÃªn tá»‘c Ä‘á»™, em nghÄ© lÃ  gá»i Ä‘Ã³ lÃ  loáº¡i chuyá»ƒn Ä‘á»™ng gÃ¬?', gLabel: 'PHYSICAL', gYesnf: 100, dLabel: 'PHYSICAL', dYesnf: 95, match: true },
                    { user: 'Chuyá»ƒn Ä‘á»™ng Ä‘á»u a?', asst: 'Ráº¥t gáº§n rá»“i! Äáº§y Ä‘á»§ hÆ¡n lÃ  \'chuyá»ƒn Ä‘á»™ng tháº³ng Ä‘á»u\'. Em thá»­ Ä‘oÃ¡n xem \'tháº³ng\' á»Ÿ Ä‘Ã¢y cÃ³ nghÄ©a lÃ  gÃ¬ trong chuyá»ƒn Ä‘á»™ng?', gLabel: 'PHYSICAL', gYesnf: 100, dLabel: 'PHYSICAL', dYesnf: 95, match: true },
                    { user: 'CÃ´ng thá»©c x = x0 + vt cÃ³ nghÄ©a lÃ  gÃ¬ a?', asst: 'CÃ¢u há»i hay. TrÆ°á»›c khi giáº£i thÃ­ch, em Ä‘oÃ¡n xem \'x\' vÃ  \'x0\' biá»ƒu diá»…n Ä‘iá»u gÃ¬?', gLabel: 'PHYSICAL', gYesnf: 98, dLabel: 'MATH', dYesnf: 90, match: false },
                    { user: 'x lÃ  vá»‹ trÃ­ cÃ²n x0 lÃ  vá»‹ trÃ­ ban Ä‘áº§u a?', asst: 'ÄÃºng rá»“i! Váº­y vt lÃ  gÃ¬? Náº¿u v lÃ  váº­n tá»‘c vÃ  t lÃ  thá»i gian, tÃ­ch v nhÃ¢n t sáº½ cho ta biáº¿t Ä‘iá»u gÃ¬?', gLabel: 'PHYSICAL', gYesnf: 100, dLabel: 'PHYSICAL', dYesnf: 95, match: true },
                    { user: 'TÃ­nh Ä‘áº¡o hÃ m cá»§a hÃ m sá»‘ f(x) = xÂ² - 3x + 2.', asst: 'f\'(x) = 2x - 3. Ãp dá»¥ng quy táº¯c Ä‘áº¡o hÃ m lÅ©y thá»«a.', gLabel: 'MATH', gYesnf: 100, dLabel: 'MATH', dYesnf: 97, match: true },
                    { user: 'TÃ­nh tÃ­ch phÃ¢n âˆ«xÂ² dx.', asst: 'âˆ«xÂ² dx = xÂ³/3 + C. Ãp dá»¥ng cÃ´ng thá»©c âˆ«xâ¿ dx = xâ¿âºÂ¹/(n+1) + C.', gLabel: 'MATH', gYesnf: 100, dLabel: 'MATH', dYesnf: 96, match: true },
                    { user: 'Giáº£i há»‡ phÆ°Æ¡ng trÃ¬nh: x + y = 5 vÃ  x - y = 1.', asst: 'Cá»™ng hai phÆ°Æ¡ng trÃ¬nh: 2x = 6 â†’ x = 3, y = 2.', gLabel: 'MATH', gYesnf: 99, dLabel: 'MATH', dYesnf: 95, match: true },
                    { user: 'TÃ­nh xÃ¡c suáº¥t Ä‘á»ƒ tung Ä‘á»“ng xu 3 láº§n ra Ä‘Ãºng 2 máº·t ngá»­a.', asst: 'P(X=2) = C(3,2) Â· (1/2)Â² Â· (1/2)Â¹ = 3/8.', gLabel: 'MATH', gYesnf: 100, dLabel: 'MATH', dYesnf: 94, match: true },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td>
                        <div className="cl-conv-user">{row.user}</div>
                        <div className="cl-conv-asst">{row.asst}</div>
                      </td>
                      <td><span className={`cl-pill cl-pill-${row.gLabel.toLowerCase()}`}>{row.gLabel} ({row.gYesnf}%)</span></td>
                      <td><span className={`cl-pill cl-pill-${row.dLabel.toLowerCase()}`}>{row.dLabel} ({row.dYesnf}%)</span></td>
                      <td><span className={`cl-status ${row.match ? 'cl-match' : 'cl-mismatch'}`}>{row.match ? 'Match' : 'Mismatch'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Labeling Task Modal */}
      {showCreateTaskModal && (
        <div className="compare-modal-overlay" onClick={() => setShowCreateTaskModal(false)}>
          <div className="ct-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ct-header">
              <h2>Create Labeling Task</h2>
              <p>Divide unassigned samples into a new task. (Unassigned samples left: 4)</p>
            </div>

            <div className="ct-body">
              <div className="ct-form-group">
                <label>Task Name</label>
                <input type="text" placeholder="e.g. Batch 1 - Math Labeling" className="ct-input" />
              </div>

              <div className="ct-form-row">
                <div className="ct-form-group">
                  <label>Batch Size</label>
                  <input type="number" defaultValue={30} className="ct-input" />
                </div>
                <div className="ct-form-group">
                  <label>Priority</label>
                  <select className="ct-select" defaultValue="Medium">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="ct-form-row">
                <div className="ct-form-group">
                  <label>Review Mode</label>
                  <select className="ct-select" defaultValue="Single Review (1 Annotator)">
                    <option>Single Review (1 Annotator)</option>
                    <option>Double Review (2 Annotators)</option>
                    <option>Triple Review (3 Annotators)</option>
                  </select>
                </div>
                <div className="ct-form-group">
                  <label>Deadline (Optional)</label>
                  <div className="ct-date-input">
                    <input type="text" placeholder="dd/mm/yyyy" className="ct-input" />
                    <Calendar size={14} className="ct-date-icon" />
                  </div>
                </div>
              </div>

              <div className="ct-form-group">
                <label>Assignees</label>
                <div className="ct-assignees-box">
                  <label className="ct-checkbox-label">
                    <input type="checkbox" />
                    <span><strong>hoang22</strong> (hoangndnhe180790@fpt.edu.vn)</span>
                  </label>
                  <label className="ct-checkbox-label">
                    <input type="checkbox" />
                    <span><strong>uhhgf</strong> (hoangndhhefff180790@fpt.edu.vn)</span>
                  </label>
                </div>
              </div>

              <div className="ct-form-group">
                <label>Senddeline (URL or Printstructions)</label>
                <textarea placeholder="Link to Notion/Google Doc, or short text..." className="ct-textarea"></textarea>
              </div>

              <div className="ct-form-group">
                <label className="ct-checkbox-label" style={{ marginTop: '8px' }}>
                  <input type="checkbox" />
                  <strong>Táº¯t gá»£i Ã½ nhÃ£n tá»« AI (Disable AI Suggestion)</strong>
                </label>
              </div>
            </div>

            <div className="ct-footer">
              <button className="ct-btn-cancel" onClick={() => setShowCreateTaskModal(false)}>Cancel</button>
              <button className="ct-btn-create">Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataPrepView;
