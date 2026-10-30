// The little world is a row of painted places. The garden is always there; every other place
// appears automatically once its painting exists in assets/img/chapters/ (see PROMPTS.md there).
// Positions are fractions of each painting: [x, y] for landscape and portrait art.
// `copy: 'content'` means the words come from content.js (the original garden notes).
// `hit` is the clickable area on the painting as [width, height] fractions (default .15 x .12).
// Coordinates were checked against the paintings delivered on 2026-10-26.
const garden = {
  id: 'garden',
  art: { landscape: 'assets/img/anime-2d-v1/garden-landscape.webp', portrait: 'assets/img/anime-2d-v1/garden-portrait.webp' },
  mask: { landscape: 'assets/img/anime-2d-v1/living-mask-landscape.png', portrait: 'assets/img/anime-2d-v1/living-mask-portrait.png' },
  sun: { landscape: [0.105, 0.22], portrait: [0.16, 0.28] },
  lantern: { landscape: [0.97, 0.09], portrait: [0.957, 0.195] },
  name: { en: 'The garden', id: 'Taman', zh: '花园' },
  dock: 'right',
  spots: [
    { id: 'tulips', icon: '❀', copy: 'content', burst: '❀', at: { landscape: [.22, .75], portrait: [.15, .82] }, focus: { landscape: [.20, .77], portrait: [.17, .83] } },
    { id: 'cat', icon: '♡', copy: 'content', burst: '♡', at: { landscape: [.58, .76], portrait: [.40, .69] }, focus: { landscape: [.53, .83], portrait: [.29, .74] }, hit: [.10, .10] },
    { id: 'sunset', icon: '☼', copy: 'content', warm: true, at: { landscape: [.13, .28], portrait: [.21, .29] }, focus: { landscape: [.10, .23], portrait: [.17, .28] } },
    { id: 'letter', icon: '✉', letter: true, at: { landscape: [.69, .54], portrait: [.48, .58] }, focus: { landscape: [.69, .52], portrait: [.55, .57] } },
    { id: 'lantern', secret: true, burst: '✦', at: { landscape: [.965, .09], portrait: [.955, .195] }, hit: [.07, .09],
      copy: {
        en: { label: '', title: "A lantern that lights itself", body: "Every evening this lantern lights itself, in case you stay a little longer." },
        id: { label: '', title: "Lentera yang menyala sendiri", body: "Setiap sore lentera ini menyala sendiri, kalau-kalau kamu ingin tinggal lebih lama." },
        zh: { label: '', title: "会自己亮起来的灯", body: "每到傍晚，这盏灯会自己亮起来，以防你想多待一会儿。" } } },
    { id: 'boat', secret: true, burst: '✦', at: { landscape: [.28, .31], portrait: [.31, .36] }, hit: [.07, .09],
      copy: {
        en: { label: '', title: "A little sailboat", body: "It is not going anywhere in particular. It is just out on the water, the way this afternoon is." },
        id: { label: '', title: "Perahu layar kecil", body: "Perahu itu tidak menuju ke mana-mana. Ia hanya ada di atas air, seperti sore ini." },
        zh: { label: '', title: "一只小帆船", body: "它不赶着去哪里，只是停在水面上，就像今天下午一样。" } } },
  ],
};

const chapter = (id, name, spots, extra = {}) => ({
  id,
  art: { landscape: `assets/img/chapters/${id}-landscape.webp`, portrait: `assets/img/chapters/${id}-portrait.webp` },
  mask: { landscape: `assets/img/chapters/${id}-mask-landscape.png`, portrait: `assets/img/chapters/${id}-mask-portrait.png` },
  name, spots, ...extra,
});

export const chapters = [
  garden,
  chapter('tulip-field', { en: 'Tulip field', id: 'Ladang tulip', zh: '郁金香花田' }, [
    { id: 'pinkest', icon: '❀', burst: '❀', at: { landscape: [.31, .56], portrait: [.28, .57] }, hit: [.10, .16],
      copy: {
        en: { label: 'The pinkest one', title: 'The pinkest one', body: 'Out of the whole field, this one is the pinkest. I saved it for you.' },
        id: { label: 'Yang paling pink', title: 'Yang paling pink', body: 'Dari seluruh ladang, yang ini paling pink. Aku simpan untukmu.' },
        zh: { label: '最粉的那一朵', title: '最粉的那一朵', body: '整片花田里，这一朵最粉。我把它留给你。' } } },
    { id: 'butterfly', icon: '♡', burst: '♡', at: { landscape: [.66, .52], portrait: [.72, .56] }, focus: { landscape: [.64, .54], portrait: [.60, .60] }, hit: [.18, .30],
      copy: {
        en: { label: 'Cat and butterfly', title: 'Not in a hurry', body: 'The cat has been following the same butterfly all afternoon. Nobody here is in a hurry.' },
        id: { label: 'Kucing dan kupu-kupu', title: 'Tidak terburu-buru', body: 'Kucing itu mengikuti kupu-kupu yang sama sepanjang sore. Tidak ada yang terburu-buru di sini.' },
        zh: { label: '小猫和蝴蝶', title: '不用着急', body: '小猫跟着同一只蝴蝶玩了一整个下午。这里谁都不用着急。' } } },
    { id: 'ribbon', icon: '✿', burst: '✿', at: { landscape: [.90, .47], portrait: [.85, .47] }, hit: [.12, .16],
      copy: {
        en: { label: 'Ribbon', title: 'A bouquet with a blue ribbon', body: 'Pink tulips, tied with a soft blue ribbon. Not for any special day. Just because you like them.' },
        id: { label: 'Pita', title: 'Buket dengan pita biru', body: 'Tulip pink, diikat pita biru yang lembut. Bukan untuk hari spesial. Hanya karena kamu menyukainya.' },
        zh: { label: '缎带花束', title: '系着蓝缎带的花束', body: '粉色郁金香，用浅蓝色缎带系好。不是为了什么特别的日子，只是因为你喜欢。' } } },
    { id: 'sun', secret: true, burst: '✦', at: { landscape: [.13, .29], portrait: [.23, .22] }, hit: [.07, .09],
      copy: {
        en: { label: '', title: "The sun, in no hurry", body: "It sets slowly here, so that nobody has to rush." },
        id: { label: '', title: "Matahari yang tidak terburu-buru", body: "Di sini ia terbenam pelan-pelan, supaya tidak ada yang perlu bergegas." },
        zh: { label: '', title: "不着急的太阳", body: "在这里它落得很慢，这样谁都不用赶。" } } },
  ], { sun: { landscape: [.13, .29], portrait: [.23, .22] }, lantern: { landscape: [-1, -1], portrait: [-1, -1] } }),
  chapter('seaside-path', { en: 'Seaside path', id: 'Jalan tepi laut', zh: '海边小路' }, [
    { id: 'shell', icon: '❁', burst: '❀', at: { landscape: [.46, .88], portrait: [.34, .79] }, hit: [.10, .10],
      copy: {
        en: { label: 'Pink shell', title: 'A small pink shell', body: 'A tiny pink shell, the cute kind you like. It fits right in your palm.' },
        id: { label: 'Kerang pink', title: 'Kerang pink kecil', body: 'Kerang pink yang mungil, yang lucu seperti kesukaanmu. Pas sekali di telapak tanganmu.' },
        zh: { label: '粉色贝壳', title: '一枚小小的粉色贝壳', body: '一枚小小的粉色贝壳，是你喜欢的那种可爱。刚好放在你手心里。' } } },
    { id: 'waves', icon: '≈', warm: true, at: { landscape: [.28, .40], portrait: [.21, .45] }, hit: [.22, .16],
      copy: {
        en: { label: 'The sea', title: 'The sun touching the sea', body: 'Right at this moment the sun touches the water. It only lasts a little while, so this place keeps it for you.' },
        id: { label: 'Laut', title: 'Matahari menyentuh laut', body: 'Tepat di saat ini matahari menyentuh air. Hanya sebentar, jadi tempat ini menyimpannya untukmu.' },
        zh: { label: '大海', title: '太阳碰到海面的那一刻', body: '就在这一刻，太阳碰到了海面。这样的时刻很短，所以这里替你留住它。' } } },
    { id: 'pawprints', icon: '∴', burst: '♡', at: { landscape: [.60, .84], portrait: [.66, .80] }, focus: { landscape: [.62, .76], portrait: [.52, .76] }, hit: [.20, .34],
      copy: {
        en: { label: 'Paw prints', title: 'Little paw prints', body: 'The cat walked ahead and left a line of tiny paw prints in the sand, as if showing you the way.' },
        id: { label: 'Jejak kaki', title: 'Jejak kaki kecil', body: 'Kucing itu berjalan di depan dan meninggalkan jejak kaki kecil di pasir, seperti menunjukkan jalan untukmu.' },
        zh: { label: '小爪印', title: '一串小爪印', body: '小猫走在前面，在沙滩上留下一串小爪印，好像在给你带路。' } } },
    { id: 'boat', secret: true, burst: '✦', at: { landscape: [.60, .31], portrait: [.39, .365] }, hit: [.07, .09],
      copy: {
        en: { label: '', title: "An empty boat", body: "Nobody is on it. It is just resting on the water, and you can rest too." },
        id: { label: '', title: "Perahu kosong", body: "Tidak ada siapa-siapa di atasnya. Ia hanya beristirahat di atas air, dan kamu juga boleh." },
        zh: { label: '', title: "一条空船", body: "船上没有人，它只是在水面上休息，你也可以休息。" } } },
  ], { sun: { landscape: [.28, .29], portrait: [.21, .34] }, lantern: { landscape: [-1, -1], portrait: [-1, -1] }, dock: 'right' }),
  chapter('starry-bench', { en: 'Under the stars', id: 'Di bawah bintang', zh: '星空下' }, [
    { id: 'shootingstar', icon: '✧', burst: '✧', at: { landscape: [.21, .19], portrait: [.22, .19] }, hit: [.16, .12],
      copy: {
        en: { label: 'Shooting star', title: 'Make a wish', body: 'A shooting star, just now. You don’t have to tell anyone what you wished for.' },
        id: { label: 'Bintang jatuh', title: 'Buat permohonan', body: 'Ada bintang jatuh barusan. Kamu tidak perlu memberi tahu siapa pun apa permohonanmu.' },
        zh: { label: '流星', title: '许个愿吧', body: '刚刚划过一颗流星。你许了什么愿，不用告诉任何人。' } } },
    { id: 'sleepycat', icon: '☾', burst: '♡', at: { landscape: [.70, .60], portrait: [.50, .57] }, focus: { landscape: [.71, .69], portrait: [.56, .65] }, hit: [.12, .12],
      copy: {
        en: { label: 'Sleepy cat', title: 'Fast asleep', body: 'The cat fell asleep on the warm bench. You can rest too. It’s been a long day.' },
        id: { label: 'Kucing mengantuk', title: 'Tertidur lelap', body: 'Kucing itu tertidur di bangku yang hangat. Kamu juga boleh istirahat. Hari ini panjang.' },
        zh: { label: '睡着的小猫', title: '睡熟了', body: '小猫在暖暖的长椅上睡着了。你也可以休息一下，今天辛苦了。' } } },
    { id: 'letter', icon: '✉', letter: true, at: { landscape: [.88, .70], portrait: [.85, .66] }, hit: [.10, .10] },
    { id: 'moon', secret: true, burst: '✦', at: { landscape: [.74, .13], portrait: [.85, .14] }, hit: [.07, .09],
      copy: {
        en: { label: '', title: "The moon says", body: "It is okay to rest now. Tomorrow will find you anyway." },
        id: { label: '', title: "Kata bulan", body: "Tidak apa-apa istirahat sekarang. Besok akan datang sendiri." },
        zh: { label: '', title: "月亮说", body: "现在可以休息了。明天自己会来的。" } } },
    { id: 'lamp', secret: true, burst: '✦', at: { landscape: [.965, .17], portrait: [.94, .31] }, hit: [.07, .09],
      copy: {
        en: { label: '', title: "A lantern that waits", body: "It stays lit until you leave. Take as long as you like." },
        id: { label: '', title: "Lentera yang menunggu", body: "Ia tetap menyala sampai kamu pergi. Tidak perlu terburu-buru." },
        zh: { label: '', title: "等着你的灯", body: "它会一直亮到你离开。慢慢来，不用着急。" } } },
  ], { sun: { landscape: [-1, -1], portrait: [-1, -1] }, lantern: { landscape: [.97, .18], portrait: [.94, .31] }, night: true, paintedNight: true, dock: 'left' }),
];

// Which paintings exist is listed in assets/img/chapters/available.json, written by
// tools/add_chapter_art.py (so the site never probes for missing files):
// { places: ['tulip-field', ...], closeups: ['garden-cat', ...] }
export async function availableArt() {
  let data = {};
  try { const r = await fetch('assets/img/chapters/available.json', { cache: 'no-cache' }); if (r.ok) data = await r.json(); } catch { /* garden only */ }
  if (Array.isArray(data)) data = { places: data };
  const places = data.places || [], closeups = new Set(data.closeups || []);
  return { places: chapters.filter((c) => c === garden || places.includes(c.id)), closeups };
}
export const closeupUrl = (placeId, spotId) => `assets/img/closeups/${placeId}-${spotId}.webp`;
