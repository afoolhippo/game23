const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const titleButton = document.getElementById("titleButton");
const leaveButton = document.getElementById("leaveButton");
const bgm = document.getElementById("bgm");

const speakerName = document.getElementById("speakerName");
const messageText = document.getElementById("messageText");
const choiceButtons = document.querySelectorAll(".choiceButton");
const timeDisplay = document.getElementById("timeDisplay");

const drunkStat = document.getElementById("drunkStat");
const regularStat = document.getElementById("regularStat");
const stayStat = document.getElementById("stayStat");

const resultTitle = document.getElementById("resultTitle");
const resultComment = document.getElementById("resultComment");

const masterImg = document.getElementById("masterImg");
const regularImg = document.getElementById("regularImg");
const ojisanImg = document.getElementById("ojisanImg");

let eventIndex = 0;

let drunk = 0;
let regular = 0;
let stay = 0;

let typingTimer = null;

const events = [
  {
    time:"19:00",
    customers:1,
    speaker:"マスター",
    text:"いらっしゃいませ。お好きな席どうぞ。",
    choices:[
      { text:"カウンターで", drunk:1, regular:2, stay:1 },
      { text:"奥の席で", drunk:1, regular:0, stay:0 },
      { text:"……まだ空いてます？", drunk:0, regular:1, stay:1 }
    ]
  },
  {
    time:"19:30",
    customers:2,
    speaker:"マスター",
    text:"今日はまだ、みんな少し静かですね。",
    choices:[
      { text:"落ち着きますね", drunk:1, regular:1, stay:1 },
      { text:"少し緊張します", drunk:0, regular:0, stay:0 },
      { text:"静かな店、好きです", drunk:1, regular:2, stay:2 }
    ]
  },
  {
    time:"20:00",
    customers:3,
    speaker:"常連客",
    text:"隣、座っていいですか。……もう座ってますけど。",
    choices:[
      { text:"どうぞ", drunk:1, regular:1, stay:1 },
      { text:"びっくりしました", drunk:0, regular:0, stay:0 },
      { text:"最初からいましたよね", drunk:1, regular:2, stay:2 }
    ]
  },
  {
    time:"20:30",
    customers:4,
    speaker:"地元のおじさん",
    text:"兄ちゃん、このへん初めて？……違ったらごめんね。",
    choices:[
      { text:"初めてです", drunk:1, regular:0, stay:1 },
      { text:"わりと来ます", drunk:1, regular:2, stay:2 },
      { text:"自分でもよく分かってません", drunk:2, regular:1, stay:3 }
    ]
  },
  {
    time:"21:00",
    customers:5,
    speaker:"マスター",
    text:"この時間から来る人、だいたい変なんですよ。",
    choices:[
      { text:"自分もですか？", drunk:1, regular:1, stay:2 },
      { text:"安心しました", drunk:2, regular:2, stay:2 },
      { text:"急に不安になりました", drunk:1, regular:0, stay:1 }
    ]
  },
  {
    time:"21:30",
    customers:6,
    speaker:"地元のおじさん",
    text:"昔はこのへん、もっと変な店ばっかりだったんだけどねぇ。",
    choices:[
      { text:"来てみたかったです", drunk:1, regular:1, stay:2 },
      { text:"今も十分変ですよ", drunk:2, regular:2, stay:2 },
      { text:"変な店って何ですか？", drunk:1, regular:0, stay:1 }
    ]
  },
  {
    time:"22:00",
    customers:6,
    speaker:"マスター",
    text:"22時を過ぎると、注文より沈黙が増えます。",
    choices:[
      { text:"わかる気がします", drunk:1, regular:2, stay:2 },
      { text:"もう眠いです", drunk:1, regular:0, stay:0 },
      { text:"もう一杯ください", drunk:3, regular:1, stay:3 }
    ]
  },
  {
    time:"22:30",
    customers:4,
    speaker:"地元のおじさん",
    text:"兄ちゃん、まだ帰らんでしょ。顔でわかるよ。",
    choices:[
      { text:"そんな顔してます？", drunk:1, regular:1, stay:2 },
      { text:"もう少しだけ", drunk:2, regular:2, stay:3 },
      { text:"終電だけ見てます", drunk:1, regular:0, stay:1 }
    ]
  },
  {
    time:"23:00",
    customers:2,
    speaker:"常連客",
    text:"……。",
    choices:[
      { text:"……。", drunk:1, regular:2, stay:2 },
      { text:"静かですね", drunk:1, regular:1, stay:1 },
      { text:"そろそろ帰ります？", drunk:0, regular:0, stay:0 }
    ]
  },
  {
    time:"23:30",
    customers:1,
    speaker:"マスター",
    text:"今日は、ここまでにしておきます？",
    choices:[
      { text:"そうします", drunk:0, regular:1, stay:0 },
      { text:"もう少しだけ", drunk:2, regular:2, stay:3 },
      { text:"その言い方ずるいです", drunk:1, regular:3, stay:4 }
    ]
  }
];

function showSpeakerImage(speaker){
  document.querySelectorAll(".personImg").forEach(img=>{
    img.classList.remove("show");
  });

  if(speaker === "マスター"){
    masterImg.classList.add("show");
  }

  if(speaker === "常連客"){
    regularImg.classList.add("show");
  }

  if(speaker === "地元のおじさん"){
    ojisanImg.classList.add("show");
  }
}

function typeWriter(text){
  if(typingTimer){
    clearInterval(typingTimer);
  }

  messageText.innerText = "";
  messageText.classList.add("typingCursor");

  let i = 0;

  typingTimer = setInterval(()=>{
    messageText.innerText += text.charAt(i);
    i++;

    if(i >= text.length){
      clearInterval(typingTimer);
      typingTimer = null;
      messageText.classList.remove("typingCursor");
    }
  },34);
}

function updateClock(){
  const e = events[eventIndex];
  timeDisplay.innerText = `🕒 ${e.time}　👥 ${e.customers}`;
}

function showEvent(){
  if(eventIndex >= events.length){
    finishGame(true);
    return;
  }

  const e = events[eventIndex];

  speakerName.innerText = e.speaker;
  typeWriter(e.text);
  updateClock();
  showSpeakerImage(e.speaker);

  choiceButtons.forEach((btn,i)=>{
    const choice = e.choices[i];

    btn.innerText = choice.text;

    btn.onclick = ()=>{
      drunk += choice.drunk;
      regular += choice.regular;
      stay += choice.stay;

      eventIndex++;
      showEvent();
    };
  });
}

function makeBar(value){
  const max = 5;
  const level = Math.max(0, Math.min(max, Math.round(value / 5)));
  return "■".repeat(level) + "□".repeat(max - level);
}

function finishGame(isClosed=false){
  if(typingTimer){
    clearInterval(typingTimer);
    typingTimer = null;
  }

  if(bgm){
    bgm.pause();
    bgm.currentTime = 0;
  }

  gameScreen.classList.remove("active");
  resultScreen.classList.add("active");

  drunkStat.innerText = makeBar(drunk);
  regularStat.innerText = makeBar(regular);
  stayStat.innerText = makeBar(stay);

  let title = "一杯だけの人";
  let comment = "まだ夜に飲まれていなかった。";

  if(stay >= 8){
    title = "なんとなく常連";
    comment = "気づけば同じ席に座っていた。";
  }

  if(stay >= 14){
    title = "カウンターの住人";
    comment = "グラスの氷だけが時間を知っていた。";
  }

  if(stay >= 20){
    title = "カジュアルバー";
    comment = "結局、夜の方が先に終わった。";
  }

  if(isClosed){
    title = "閉店を見た人";
    comment = "最後のネオンが消えるまで、そこにいた。";
  }

  resultTitle.innerText = title;
  resultComment.innerText = comment;
}

function startGame(){
  titleScreen.classList.remove("active");
  gameScreen.classList.add("active");

  if(bgm){
    bgm.volume = 0.45;
    bgm.currentTime = 0;
    bgm.play().catch(()=>{});
  }

  eventIndex = 0;
  drunk = 0;
  regular = 0;
  stay = 0;

  showEvent();
}

startButton.onclick = startGame;
document.getElementById("titleImage").onclick = startGame;

titleButton.onclick = ()=>{
  location.reload();
};

leaveButton.onclick = ()=>{
  finishGame(false);
};

document.getElementById("retryButton").onclick = ()=>{
  location.reload();
};

document.getElementById("homeButton").onclick = ()=>{
  location.href = "https://afoolhippo.github.io/home/?skipTitle=1";
};

document.getElementById("shareButton").onclick = ()=>{
  const text =
`今夜も、
なんとなく帰れなかった。🍷

静かなバーで、
少し変な人たちと話した。

無料ブラウザゲーム
「カジュアルバー」

https://afoolhippo.github.io/game23/

#カジュアルバー
#カバゲーセン`;

  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url,"_blank");
};