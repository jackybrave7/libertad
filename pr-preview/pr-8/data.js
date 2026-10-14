// Данные персонажей
const characters = [
  {
    id: "peter_munk",
    name: "Петер Мунк",
    image: "images/peter_munk.jpg",
    tagline: "Храбрый и любопытный юноша",
    description: "Герой сказки 'Холодное сердце', который искал счастья, но понял, что доброе сердце важнее богатства.",
    story: "Холодное сердце",
    isMandatory: true,
  },
  {
    id: "glass_man",
    name: "Стеклянный человек",
    image: "images/glass_man.jpg",
    tagline: "Мудрый дух леса",
    description: "Добрый волшебник, помогающий тем, кто родился в воскресенье и имеет чистое сердце.",
    story: "Холодное сердце",
    isMandatory: true,
  },
  {
    id: "michel_hollunder",
    name: "Михель Голландец",
    image: "images/michel_hollunder.jpg",
    tagline: "Грозный великан-плотовщик",
    description: "Злой дух, предлагающий богатство в обмен на живое сердце.",
    story: "Холодное сердце",
    isMandatory: true,
  },
  {
    id: "little_muck",
    name: "Маленький Мук",
    image: "images/little_muck.jpg",
    tagline: "Скороход в волшебных туфлях",
    story: "Маленький Мук",
  },
  {
    id: "caliph_stork",
    name: "Халиф-аист",
    image: "images/caliph_stork.jpg",
    tagline: "Правитель, ставший птицей",
    story: "Халиф-аист",
  },
  {
    id: "dwarf_nose",
    name: "Карлик Нос",
    image: "images/dwarf_nose.jpg",
    tagline: "Талантливый повар",
    story: "Карлик Нос",
  },
  {
    id: "nutcracker",
    name: "Щелкунчик",
    image: "images/nutcracker.jpg",
    tagline: "Заколдованный принц",
    story: "Щелкунчик и Мышиный король",
  },
  {
    id: "snow_queen",
    name: "Снежная Королева",
    image: "images/snow_queen.jpg",
    tagline: "Владычица льдов",
    story: "Снежная королева",
  },
  {
    id: "puss_in_boots",
    name: "Кот в сапогах",
    image: "images/puss_in_boots.jpg",
    tagline: "Хитрый и преданный друг",
    story: "Кот в сапогах",
  },
  {
    id: "red_riding_hood",
    name: "Красная Шапочка",
    image: "images/red_riding_hood.jpg",
    tagline: "Девочка с пирожками",
    story: "Красная Шапочка",
  },
  {
    id: "cinderella",
    name: "Золушка",
    image: "images/cinderella.jpg",
    tagline: "Принцесса в хрустальной туфельке",
    story: "Золушка",
  },
  {
    id: "aladdin",
    name: "Аладдин",
    image: "images/aladdin.jpg",
    tagline: "Владелец волшебной лампы",
    story: "Аладдин и волшебная лампа",
  },
  {
    id: "alice",
    name: "Алиса",
    image: "images/alice.jpg",
    tagline: "Путешественница в Страну Чудес",
    story: "Алиса в Стране чудес",
  },
  {
    id: "pinocchio",
    name: "Пиноккио",
    image: "images/pinocchio.jpg",
    tagline: "Деревянный мальчик",
    story: "Приключения Пиноккио",
  },
  {
    id: "peter_pan",
    name: "Питер Пэн",
    image: "images/peter_pan.jpg",
    tagline: "Мальчик, который не хотел взрослеть",
    story: "Питер Пэн",
  },
  {
    id: "mermaid",
    name: "Русалочка",
    image: "images/mermaid.jpg",
    tagline: "Дочь морского царя",
    story: "Русалочка",
  },
  {
    id: "rapunzel",
    name: "Рапунцель",
    image: "images/rapunzel.jpg",
    tagline: "Девушка с длинными волосами",
    story: "Рапунцель",
  },
  {
    id: "snow_white_2",
    name: "Белоснежка",
    image: "images/snow_white.jpg",
    tagline: "Прекраснейшая на свете",
    story: "Белоснежка и семь гномов",
  },
  {
    id: "thumbelina",
    name: "Дюймовочка",
    image: "images/thumbelina.jpg",
    tagline: "Девочка из цветка",
    story: "Дюймовочка",
  },
  {
    id: "gerda",
    name: "Герда",
    image: "images/gerda.jpg",
    tagline: "Смелая спасительница Кая",
    story: "Снежная королева",
  },
  {
    id: "frog_prince",
    name: "Принц-лягушка",
    image: "images/frog_prince.jpg",
    tagline: "Заколдованный принц",
    story: "Принц-лягушка",
  },
  {
    id: "hansel_gretel",
    name: "Гензель и Гретель",
    image: "images/hansel_gretel.jpg",
    tagline: "Брат и сестра в лесу",
    story: "Гензель и Гретель",
  },
  {
    id: "jack_beanstalk",
    name: "Джек",
    image: "images/jack_beanstalk.jpg",
    tagline: "Мальчик с волшебными бобами",
    story: "Джек и бобовый стебель",
  },
  {
    id: "princess_frog",
    name: "Царевна-лягушка",
    image: "images/princess_frog.jpg",
    tagline: "Заколдованная принцесса",
    story: "Царевна-лягушка",
  },
  {
    id: "ugly_duckling",
    name: "Гадкий утёнок",
    image: "images/ugly_duckling.jpg",
    tagline: "Будущий прекрасный лебедь",
    story: "Гадкий утёнок",
  },
];

// Данные вопросов для игры "Сундук"
// Опции ответов теперь будут генерироваться динамически, чтобы избежать повторений из одной сказки
const chestQuestions = [
  {
    id: 1,
    itemImage: "images/glass_slipper.webp",
    itemName: "Хрустальная туфелька",
    correctCharacterId: "cinderella",
  },
  {
    id: 2,
    itemImage: "images/magic_lamp.webp",
    itemName: "Волшебная лампа",
    correctCharacterId: "aladdin",
  },
  {
    id: 3,
    itemImage: "images/basket.webp",
    itemName: "Корзинка с пирожками",
    correctCharacterId: "red_riding_hood",
  },
  {
    id: 4,
    itemImage: "images/abc_book.webp",
    itemName: "Азбука",
    correctCharacterId: "pinocchio",
  },
  {
    id: 5,
    itemImage: "images/coal_sack.webp",
    itemName: "Мешок с углем",
    correctCharacterId: "peter_munk",
  },
  {
    id: 6,
    itemImage: "images/magic_shoes.webp",
    itemName: "Волшебные туфли",
    correctCharacterId: "little_muck",
  },
  {
    id: 7,
    itemImage: "images/magic_powder.webp",
    itemName: "Волшебный порошок",
    correctCharacterId: "caliph_stork",
  },
  {
    id: 8,
    itemImage: "images/goose.webp",
    itemName: "Гусыня Мими",
    correctCharacterId: "dwarf_nose",
  },
  {
    id: 9,
    itemImage: "images/saber.webp",
    itemName: "Сабля",
    correctCharacterId: "nutcracker",
  },
  {
    id: 10,
    itemImage: "images/ice_shard.webp",
    itemName: "Осколок льда",
    correctCharacterId: "snow_queen",
  },
  {
    id: 11,
    itemImage: "images/boots.webp",
    itemName: "Сапоги",
    correctCharacterId: "puss_in_boots",
  },
  {
    id: 12,
    itemImage: "images/drink_me.webp",
    itemName: "Пузырек 'Выпей меня'",
    correctCharacterId: "alice",
  },
  {
    id: 13,
    itemImage: "images/fairy_dust.webp",
    itemName: "Пыльца феи",
    correctCharacterId: "peter_pan",
  },
  {
    id: 14,
    itemImage: "images/shell.webp",
    itemName: "Морская раковина",
    correctCharacterId: "mermaid",
  },
  {
    id: 15,
    itemImage: "images/hairbrush.webp",
    itemName: "Гребень",
    correctCharacterId: "rapunzel",
  },
  {
    id: 16,
    itemImage: "images/apple.webp",
    itemName: "Наливное яблочко",
    correctCharacterId: "snow_white_2",
  },
  {
    id: 17,
    itemImage: "images/flower.webp",
    itemName: "Цветок тюльпана",
    correctCharacterId: "thumbelina",
  },
  {
    id: 18,
    itemImage: "images/rose.webp",
    itemName: "Роза",
    correctCharacterId: "gerda",
  },
  {
    id: 19,
    itemImage: "images/glass_heart.webp",
    itemName: "Каменное сердце",
    correctCharacterId: "michel_hollunder",
  },
  {
    id: 20,
    itemImage: "images/pine_cone.webp",
    itemName: "Еловая шишка",
    correctCharacterId: "glass_man"
  },
  {
    id: 21,
    itemImage: "images/spinning_wheel.webp",
    itemName: "Прялка",
    correctCharacterId: "snow_white_2"
  },
  {
    id: 22,
    itemImage: "images/mirror.webp",
    itemName: "Волшебное зеркало",
    correctCharacterId: "snow_white_2"
  },
  {
    id: 23,
    itemImage: "images/glass_coffin.webp",
    itemName: "Хрустальный гроб",
    correctCharacterId: "snow_white_2"
  },
  {
    id: 24,
    itemImage: "images/seven_dwarfs.webp",
    itemName: "Семь гномов",
    correctCharacterId: "snow_white_2"
  },
  {
    id: 25,
    itemImage: "images/teapot.webp",
    itemName: "Чайник",
    correctCharacterId: "dwarf_nose"
  },
  {
    id: 26,
    itemImage: "images/cooking_pot.webp",
    itemName: "Кастрюля",
    correctCharacterId: "dwarf_nose"
  },
  {
    id: 27,
    itemImage: "images/enchanted_ring.webp",
    itemName: "Волшебное кольцо",
    correctCharacterId: "caliph_stork"
  },
  {
    id: 28,
    itemImage: "images/stork.webp",
    itemName: "Аист",
    correctCharacterId: "caliph_stork"
  },
  {
    id: 29,
    itemImage: "images/crown.webp",
    itemName: "Корона",
    correctCharacterId: "caliph_stork"
  },
  {
    id: 31,
    itemImage: "images/treasure_chest.webp",
    itemName: "Сундук с сокровищами",
    correctCharacterId: "aladdin"
  },
  {
    id: 32,
    itemImage: "images/genie.webp",
    itemName: "Джинн",
    correctCharacterId: "aladdin"
  },
  {
    id: 33,
    itemImage: "images/carpet.webp",
    itemName: "Волшебный ковер",
    correctCharacterId: "aladdin"
  },
  {
    id: 34,
    itemImage: "images/pocket_watch.webp",
    itemName: "Карманные часы",
    correctCharacterId: "alice"
  },
  {
    id: 35,
    itemImage: "images/teacup.webp",
    itemName: "Чашка чая",
    correctCharacterId: "alice"
  },
  {
    id: 36,
    itemImage: "images/mushroom.webp",
    itemName: "Волшебный гриб",
    correctCharacterId: "alice"
  },
  {
    id: 37,
    itemImage: "images/playing_cards.webp",
    itemName: "Карты королевы",
    correctCharacterId: "alice"
  },
  {
    id: 38,
    itemImage: "images/puppet_strings.webp",
    itemName: "Кукольные нити",
    correctCharacterId: "pinocchio"
  },
  {
    id: 39,
    itemImage: "images/whale.webp",
    itemName: "Кит",
    correctCharacterId: "pinocchio"
  },
  {
    id: 40,
    itemImage: "images/donkey_ears.webp",
    itemName: "Ослиные уши",
    correctCharacterId: "pinocchio"
  },
  {
    id: 41,
    itemImage: "images/neverland_map.webp",
    itemName: "Карта Нетландии",
    correctCharacterId: "peter_pan"
  },
  {
    id: 42,
    itemImage: "images/crocodile.webp",
    itemName: "Крокодил",
    correctCharacterId: "peter_pan"
  },
  {
    id: 43,
    itemImage: "images/lost_boys.webp",
    itemName: "Потерянные мальчики",
    correctCharacterId: "peter_pan"
  },
  {
    id: 44,
    itemImage: "images/trident.webp",
    itemName: "Трезубец",
    correctCharacterId: "mermaid"
  },
  {
    id: 45,
    itemImage: "images/sea_palace.webp",
    itemName: "Морской дворец",
    correctCharacterId: "mermaid"
  },
  {
    id: 46,
    itemImage: "images/sea_witch.webp",
    itemName: "Морская ведьма",
    correctCharacterId: "mermaid"
  },
  {
    id: 47,
    itemImage: "images/long_hair.webp",
    itemName: "Длинные волосы",
    correctCharacterId: "rapunzel"
  },
  {
    id: 48,
    itemImage: "images/tower.webp",
    itemName: "Башня",
    correctCharacterId: "rapunzel"
  },
  {
    id: 49,
    itemImage: "images/paintbrush.webp",
    itemName: "Кисточка для рисования",
    correctCharacterId: "rapunzel"
  },
  {
    id: 50,
    itemImage: "images/flower_seed.webp",
    itemName: "Семя цветка",
    correctCharacterId: "thumbelina"
  },
  {
    id: 51,
    itemImage: "images/walnut_shell.webp",
    itemName: "Ореховая скорлупа",
    correctCharacterId: "thumbelina"
  },
  {
    id: 52,
    itemImage: "images/swallow.webp",
    itemName: "Ласточка",
    correctCharacterId: "thumbelina"
  },
  {
    id: 53,
    itemImage: "images/ice_palace.webp",
    itemName: "Ледяной дворец",
    correctCharacterId: "snow_queen"
  },
  {
    id: 54,
    itemImage: "images/snowflake.webp",
    itemName: "Снежинка",
    correctCharacterId: "snow_queen"
  },
  {
    id: 55,
    itemImage: "images/reindeer.webp",
    itemName: "Олень",
    correctCharacterId: "snow_queen"
  },
  {
    id: 56,
    itemImage: "images/whip.webp",
    itemName: "Кнут",
    correctCharacterId: "puss_in_boots"
  },
  {
    id: 57,
    itemImage: "images/marquis_castle.webp",
    itemName: "Замок маркиза",
    correctCharacterId: "puss_in_boots"
  },
  {
    id: 58,
    itemImage: "images/mouse.webp",
    itemName: "Мышка",
    correctCharacterId: "puss_in_boots"
  },
  {
    id: 59,
    itemImage: "images/red_cloak.webp",
    itemName: "Красный плащ",
    correctCharacterId: "red_riding_hood"
  },
  {
    id: 60,
    itemImage: "images/wolf.webp",
    itemName: "Волк",
    correctCharacterId: "red_riding_hood"
  }
];
