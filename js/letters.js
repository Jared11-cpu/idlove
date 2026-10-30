// One letter for each place, written to sit beside that place's painting: each one points at things
// you can see in it, and ends with one small question she can answer whenever she likes.
// The garden letter keeps the confirmed theme and the facts from the first draft (content.js still holds that draft).
// New text for this gift, not quotes from any film or from her. Plain text: edit freely.
//   paras: one string per paragraph   ask: the closing question   sign: the sign-off
export const letters = {
  garden: {
    en: {
      title: 'A letter for you',
      paras: [
        'Lately I have been busy, and I have not been able to talk with you as much as I wanted. But I still missed you, every day.',
        'Look at the girl on the bench, holding a letter she has not opened yet. She is not in a hurry. She knows that whatever it says, it was written by someone who was thinking of her.',
        'So I gathered what you told me you love: the sunset, the kitten at her feet, the tulips, everything small and pink.',
        'I remember the small things you do too. When it gets late, you tell me to go to sleep. You told me not to compare myself with anyone. You said you feel at ease with me, and that you would wait.',
        'You always remember to take care of my feelings. This time, I wanted to carefully remember the little things you love.',
      ],
      ask: 'One thing I would like to know, whenever you feel like telling me: when you watch the sunset, where are you, and what are you thinking about?',
      sign: 'Always thinking of you',
    },
    id: {
      title: 'Surat untukmu',
      paras: [
        'Akhir-akhir ini aku sibuk, dan aku tidak bisa mengobrol denganmu sesering yang aku mau. Tapi aku tetap merindukanmu, setiap hari.',
        'Lihat perempuan di bangku itu, memegang surat yang belum ia buka. Ia tidak terburu-buru. Ia tahu apa pun isinya, surat itu ditulis oleh seseorang yang sedang memikirkannya.',
        'Jadi aku mengumpulkan apa yang pernah kamu ceritakan sebagai kesukaanmu: senja, anak kucing di dekat kakinya, tulip, semua yang kecil dan pink.',
        'Aku juga ingat hal-hal kecil yang kamu lakukan. Kalau sudah larut, kamu menyuruhku tidur. Kamu bilang aku tidak perlu membandingkan diriku dengan siapa pun. Kamu bilang kamu nyaman bersamaku, dan kamu akan menunggu.',
        'Kamu selalu ingat untuk menjaga perasaanku. Kali ini, aku juga ingin mengingat baik-baik hal-hal kecil yang kamu sukai.',
      ],
      ask: 'Ada satu hal yang ingin kutahu, kapan pun kamu mau bercerita: saat kamu melihat senja, kamu ada di mana, dan sedang memikirkan apa?',
      sign: 'Selalu memikirkanmu',
    },
    zh: {
      title: '给你的一封信',
      paras: [
        '最近我忙了一些，陪你聊天的时间少了。但我还是每天都很想你。',
        '看长椅上的那个女孩，手里拿着一封还没拆开的信。她一点也不着急。她知道不管信里写了什么，都是一个正想着她的人写的。',
        '所以我把你说过喜欢的都放了进来：晚霞，她脚边的小猫，郁金香，所有小小的、粉色的东西。',
        '你做过的小事我也都记得。时间晚了，你会叫我去睡觉；你让我别和任何人比较；你说和我在一起很自在，也说你会等我。',
        '你一直记得照顾我的感受。这次，我也想把你喜欢的小事认真记下来。',
      ],
      ask: '有一件事我想知道，你什么时候想说都可以：你看晚霞的时候，人在哪里，在想些什么？',
      sign: '一直想着你',
    },
  },
  'tulip-field': {
    en: {
      title: 'Between the tulips',
      paras: [
        'Some people are remembered for the big things. You are the one who remembers the small ones.',
        'See the kitten in the red scarf, up on her toes for a butterfly she will never catch? She does not mind. She is having the best afternoon of her life.',
        'I would like to learn that from her. And from you: the hour I should be asleep, the days I forgot to be kind to myself. You kept all of it for me.',
        'So I planted every little thing you ever told me about. The pink ones first, and a bouquet tied with a blue ribbon, just in case.',
        'You said them so lightly, as if they were not important. They were all important.',
      ],
      ask: 'She still has no name. Would you give her one? Anything you like, and I will make sure it sticks.',
      sign: 'For you, written in pink',
    },
    id: {
      title: 'Di antara tulip',
      paras: [
        'Ada orang yang diingat karena hal-hal besar. Kamu adalah orang yang mengingat hal-hal kecil.',
        'Lihat anak kucing berkalung merah itu, berjinjit mengejar kupu-kupu yang tidak akan pernah tertangkap? Ia tidak peduli. Ia sedang menikmati sore terbaik dalam hidupnya.',
        'Aku ingin belajar itu darinya. Dan darimu: jam tidurku, hari-hari ketika aku lupa bersikap baik pada diriku sendiri. Kamu menyimpan semuanya untukku.',
        'Jadi aku menanam semua hal kecil yang pernah kamu ceritakan. Yang pink lebih dulu, dan satu buket yang diikat pita biru, untuk berjaga-jaga.',
        'Kamu mengatakannya dengan begitu ringan, seolah tidak penting. Semuanya penting.',
      ],
      ask: 'Ia masih belum punya nama. Maukah kamu memberinya satu? Apa saja yang kamu suka, dan aku akan memastikan nama itu menetap.',
      sign: 'Untukmu, ditulis dengan warna pink',
    },
    zh: {
      title: '在郁金香之间',
      paras: [
        '有的人因为大事被记住。而你，是那个记得小事的人。',
        '看那只系红围巾的小猫，踮着脚去够一只永远抓不到的蝴蝶。她一点也不在意，她正在过她这辈子最好的一个下午。',
        '我想向她学一学。也向你学：我该睡觉的钟点，我忘了对自己好一点的那些日子，你都替我记着。',
        '所以我把你说过的每一件小事都种了下来，粉色的先种，还有一束系着蓝缎带的花，以防万一。',
        '你说起它们的时候总是轻轻的，好像不重要。可它们每一件都重要。',
      ],
      ask: '她还没有名字。你愿意给她取一个吗？随便什么都行，我一定让它叫下去。',
      sign: '给你，用粉色写的',
    },
  },
  'seaside-path': {
    en: {
      title: 'Where the sea keeps the light',
      paras: [
        'There is one hour each day when the sun touches the sea and everything slows down. That is the hour I think of you.',
        'Look at the little pink shell on the sand, and the paw prints that lead past it. Somebody walked here ahead of us, unhurried, looking back now and then to make sure we were still coming.',
        'That is what waiting looks like when it is done kindly. You said you would wait. I noticed, every single time.',
        'We watch the same sun go down at different times, and I still call it ours.',
        'I cannot promise the sea will always be calm. I can promise that whenever I look at it, you are in my mind.',
      ],
      ask: 'Tell me about a sea you love, or one you hope to see someday. Is there one near you?',
      sign: 'Yours, from the other side of the water',
    },
    id: {
      title: 'Tempat laut menyimpan cahaya',
      paras: [
        'Ada satu jam setiap hari ketika matahari menyentuh laut dan segalanya melambat. Di jam itulah aku memikirkanmu.',
        'Lihat kerang pink kecil di pasir itu, dan jejak kaki yang melewatinya. Ada yang berjalan di depan kita, tidak terburu-buru, sesekali menoleh memastikan kita masih mengikuti.',
        'Begitulah menunggu kalau dilakukan dengan baik hati. Kamu bilang kamu akan menunggu. Aku menyadarinya, setiap kali.',
        'Kita melihat matahari yang sama terbenam di jam yang berbeda, dan aku tetap menyebutnya milik kita.',
        'Aku tidak bisa berjanji laut akan selalu tenang. Aku hanya bisa berjanji, setiap kali memandangnya, ada kamu di pikiranku.',
      ],
      ask: 'Ceritakan padaku tentang laut yang kamu sukai, atau yang ingin kamu lihat suatu hari nanti. Apakah ada yang dekat denganmu?',
      sign: 'Milikmu, dari seberang air',
    },
    zh: {
      title: '海替我们留着光',
      paras: [
        '每天有那么一个钟点，太阳碰到海面，万物都慢了下来。我就是在那个钟点想起你的。',
        '看沙滩上那枚小小的粉色贝壳，和从它旁边走过的爪印。有谁走在我们前面，不慌不忙，时不时回头看看我们有没有跟上。',
        '好好地等一个人，大概就是这个样子。你说过你会等，每一次，我都看见了。',
        '我们在不同的钟点看同一个太阳落下，我还是愿意叫它“我们的”。',
        '我不能保证海永远平静。我能保证的是，每次看着它，我心里都有你。',
      ],
      ask: '跟我说说你喜欢的一片海，或者你想有一天去看的那一片。你附近有吗？',
      sign: '你的，来自水的另一边',
    },
  },
  'starry-bench': {
    en: {
      title: 'Goodnight, from here',
      paras: [
        'It is late, and you would be the first to tell me to go to sleep. So tonight I will say it first.',
        'Look at the kitten curled up on the bench, with a letter and two teacups beside her. Nobody is asking her to be brave tonight.',
        'Rest. Tonight you do not have to hold anyone up. Not me, not the day, not yourself.',
        'The star you can see tonight set out long before either of us was born. It still arrived. Some things are worth the wait.',
        'Whatever tomorrow brings, tonight this bench is yours, the cat is warm, and the lantern is lit. Goodnight. I will be here, the way you always are.',
      ],
      ask: 'Before you sleep, tell me one small good thing from your day. I will tell you mine.',
      sign: 'Goodnight',
    },
    id: {
      title: 'Selamat malam, dari sini',
      paras: [
        'Sudah larut, dan kamu pasti yang pertama menyuruhku tidur. Jadi malam ini aku yang bilang lebih dulu.',
        'Lihat anak kucing yang meringkuk di bangku itu, dengan sepucuk surat dan dua cangkir teh di sampingnya. Malam ini tidak ada yang memintanya untuk menjadi kuat.',
        'Istirahatlah. Malam ini kamu tidak perlu menopang siapa pun. Bukan aku, bukan harimu, bukan dirimu sendiri.',
        'Bintang yang kamu lihat malam ini berangkat jauh sebelum kita lahir. Ia tetap sampai. Ada hal yang memang layak ditunggu.',
        'Apa pun yang dibawa esok, malam ini bangku ini milikmu, kucingnya hangat, dan lenteranya menyala. Selamat malam. Aku di sini, seperti kamu yang selalu ada.',
      ],
      ask: 'Sebelum tidur, ceritakan satu hal kecil yang baik dari harimu. Nanti aku ceritakan hal kecilku.',
      sign: 'Selamat malam',
    },
    zh: {
      title: '晚安，从这里',
      paras: [
        '已经很晚了，你一定是第一个叫我去睡觉的人。所以今晚，我先说。',
        '看长椅上蜷成一团的小猫，旁边放着一封信和两只茶杯。今晚没有人要求她勇敢。',
        '睡吧。今晚你不用扶着任何人，不用扶着我，不用扶着这一天，也不用扶着自己。',
        '今晚你看见的那颗星，在我们出生之前就出发了。它还是到了。有些事，值得等。',
        '不管明天带来什么，今晚这张长椅是你的，小猫是暖的，灯是亮着的。晚安。我在这里，像你一直在那样。',
      ],
      ask: '睡之前，告诉我今天发生的一件小小的好事吧。我也告诉你我的。',
      sign: '晚安',
    },
  },
};
