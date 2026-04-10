const RANGE_DEFS = [
  { key: 'kangxi', start: 0x2f00, end: 0x2fd5 },
  { key: 'radicals-supplement', start: 0x2e80, end: 0x2eff },
  { key: 'compat-ideographs', start: 0xf900, end: 0xfaff },
  { key: 'compat-ideographs-supplement', start: 0x2f800, end: 0x2fa1f },
]

const RANGE_STORAGE_KEY = 'ocr-fix:selected-ranges'

function getSelectedRangeKeys() {
  return Array.from(document.querySelectorAll('[data-range-key]'))
    .filter((el) => el.checked)
    .map((el) => el.dataset.rangeKey)
}

function getSelectedRanges() {
  const selectedKeys = new Set(getSelectedRangeKeys())
  return RANGE_DEFS.filter((range) => selectedKeys.has(range.key))
}

function isCodePointInRanges(cp, ranges) {
  return ranges.some((range) => cp >= range.start && cp <= range.end)
}

function isSelectedSuspiciousChar(ch, selectedRanges) {
  const cp = ch.codePointAt(0)
  return isCodePointInRanges(cp, selectedRanges)
}

function loadRangePreferences() {
  const raw = localStorage.getItem(RANGE_STORAGE_KEY)
  if (!raw) return

  try {
    const selectedKeys = new Set(JSON.parse(raw))
    document.querySelectorAll('[data-range-key]').forEach((el) => {
      el.checked = selectedKeys.has(el.dataset.rangeKey)
    })
  } catch {
    // Ignore invalid persisted data and keep defaults.
  }
}

function saveRangePreferences() {
  localStorage.setItem(RANGE_STORAGE_KEY, JSON.stringify(getSelectedRangeKeys()))
}

// ────────────────────────────────────────────────
// Unicode 伪中文映射：用于检测到的字符转换与预览
// ────────────────────────────────────────────────
const UNICODE_FIX_MAP = {
  '\u2F00': '\u4E00', // ⼀ → 一
  '\u2F01': '\u4E28', // ⼁ → 丨
  '\u2F02': '\u4E36', // ⼂ → 丶
  '\u2F03': '\u4E3F', // ⼃ → 丿
  '\u2F04': '\u4E59', // ⼄ → 乙
  '\u2F05': '\u4E85', // ⼅ → 亅
  '\u2F06': '\u4E8C', // ⼆ → 二
  '\u2F07': '\u4EA0', // ⼇ → 亠
  '\u2F08': '\u4EBA', // ⼈ → 人
  '\u2F09': '\u513F', // ⼉ → 儿
  '\u2F0A': '\u5165', // ⼊ → 入
  '\u2F0B': '\u516B', // ⼋ → 八
  '\u2F0C': '\u5182', // ⼌ → 冂
  '\u2F0D': '\u5196', // ⼍ → 冖
  '\u2F0E': '\u51AB', // ⼎ → 冫
  '\u2F0F': '\u51E0', // ⼏ → 几
  '\u2F10': '\u51F5', // ⼐ → 凵
  '\u2F11': '\u5200', // ⼑ → 刀
  '\u2F12': '\u529B', // ⼒ → 力
  '\u2F13': '\u52F9', // ⼓ → 勹
  '\u2F14': '\u5315', // ⼔ → 匕
  '\u2F15': '\u531A', // ⼕ → 匚
  '\u2F16': '\u5338', // ⼖ → 匸
  '\u2F17': '\u5341', // ⼗ → 十
  '\u2F18': '\u535C', // ⼘ → 卜
  '\u2F19': '\u5369', // ⼙ → 卩
  '\u2F1A': '\u5382', // ⼚ → 厂
  '\u2F1B': '\u53B6', // ⼛ → 厶
  '\u2F1C': '\u53C8', // ⼜ → 又
  '\u2F1D': '\u53E3', // ⼝ → 口
  '\u2F1E': '\u56D7', // ⼞ → 囗
  '\u2F1F': '\u571F', // ⼟ → 土
  '\u2F20': '\u58EB', // ⼠ → 士
  '\u2F21': '\u5902', // ⼡ → 夂
  '\u2F22': '\u590A', // ⼢ → 夊
  '\u2F23': '\u5915', // ⼣ → 夕
  '\u2F24': '\u5927', // ⼤ → 大
  '\u2F25': '\u5973', // ⼥ → 女
  '\u2F26': '\u5B50', // ⼦ → 子
  '\u2F27': '\u5B80', // ⼧ → 宀
  '\u2F28': '\u5BF8', // ⼨ → 寸
  '\u2F29': '\u5C0F', // ⼩ → 小
  '\u2F2A': '\u5C22', // ⼪ → 尢
  '\u2F2B': '\u5C38', // ⼫ → 尸
  '\u2F2C': '\u5C6E', // ⼬ → 屮
  '\u2F2D': '\u5C71', // ⼭ → 山
  '\u2F2E': '\u5DDB', // ⼮ → 巛
  '\u2F2F': '\u5DE5', // ⼯ → 工
  '\u2F30': '\u5DF1', // ⼰ → 己
  '\u2F31': '\u5DFE', // ⼱ → 巾
  '\u2F32': '\u5E72', // ⼲ → 干
  '\u2F33': '\u5E7A', // ⼳ → 幺
  '\u2F34': '\u5E9F', // ⼴ → 广
  '\u2F35': '\u5EF4', // ⼵ → 廴
  '\u2F36': '\u5EFE', // ⼶ → 廾
  '\u2F37': '\u5F0B', // ⼷ → 弋
  '\u2F38': '\u5F13', // ⼸ → 弓
  '\u2F39': '\u5F50', // ⼹ → 彐
  '\u2F3A': '\u5F61', // ⼺ → 彡
  '\u2F3B': '\u5F73', // ⼻ → 彳
  '\u2F3C': '\u5FC3', // ⼼ → 心
  '\u2F3D': '\u6208', // ⼽ → 戈
  '\u2F3E': '\u6236', // ⼾ → 户
  '\u2F3F': '\u624B', // ⼿ → 手
  '\u2F40': '\u652F', // ⽀ → 支
  '\u2F41': '\u6534', // ⽁ → 攴
  '\u2F42': '\u6587', // ⽂ → 文
  '\u2F43': '\u6597', // ⽃ → 斗
  '\u2F44': '\u65A4', // ⽄ → 斤
  '\u2F45': '\u65B9', // ⽅ → 方
  '\u2F46': '\u65E0', // ⽆ → 无
  '\u2F47': '\u65E5', // ⽇ → 日
  '\u2F48': '\u66F0', // ⽈ → 曰
  '\u2F49': '\u6708', // ⽉ → 月
  '\u2F4A': '\u6728', // ⽊ → 木
  '\u2F4B': '\u6B20', // ⽋ → 欠
  '\u2F4C': '\u6B62', // ⽌ → 止
  '\u2F4D': '\u6B79', // ⽍ → 歹
  '\u2F4E': '\u6BB3', // ⽎ → 殳
  '\u2F4F': '\u6BCB', // ⽏ → 毋
  '\u2F50': '\u6BD4', // ⽐ → 比
  '\u2F51': '\u6BDB', // ⽑ → 毛
  '\u2F52': '\u6C0F', // ⽒ → 氏
  '\u2F53': '\u6C14', // ⽓ → 气
  '\u2F54': '\u6C34', // ⽔ → 水
  '\u2F55': '\u706B', // ⽕ → 火
  '\u2F56': '\u722A', // ⽖ → 爪
  '\u2F57': '\u7236', // ⽗ → 父
  '\u2F58': '\u723B', // ⽘ → 爻
  '\u2F59': '\u723F', // ⽙ → 爿
  '\u2F5A': '\u7247', // ⽚ → 片
  '\u2F5B': '\u7259', // ⽛ → 牙
  '\u2F5C': '\u725B', // ⽜ → 牛
  '\u2F5D': '\u72AC', // ⽝ → 犬
  '\u2F5E': '\u7384', // ⽞ → 玄
  '\u2F5F': '\u7389', // ⽟ → 玉
  '\u2F60': '\u74DC', // ⽠ → 瓜
  '\u2F61': '\u74E6', // ⽡ → 瓦
  '\u2F62': '\u7518', // ⽢ → 甘
  '\u2F63': '\u751F', // ⽣ → 生
  '\u2F64': '\u7528', // ⽤ → 用
  '\u2F65': '\u7530', // ⽥ → 田
  '\u2F66': '\u758B', // ⽦ → 疋
  '\u2F67': '\u7592', // ⽧ → 疒
  '\u2F68': '\u7676', // ⽨ → 癶
  '\u2F69': '\u767D', // ⽩ → 白
  '\u2F6A': '\u76AE', // ⽪ → 皮
  '\u2F6B': '\u76BF', // ⽫ → 皿
  '\u2F6C': '\u76EE', // ⽬ → 目
  '\u2F6D': '\u77DB', // ⽭ → 矛
  '\u2F6E': '\u77E2', // ⽮ → 矢
  '\u2F6F': '\u77F3', // ⽯ → 石
  '\u2F70': '\u793A', // ⽰ → 示
  '\u2F71': '\u79B8', // ⽱ → 禸
  '\u2F72': '\u79BE', // ⽲ → 禾
  '\u2F73': '\u7A74', // ⽳ → 穴
  '\u2F74': '\u7ACB', // ⽴ → 立
  '\u2F75': '\u7AF9', // ⽵ → 竹
  '\u2F76': '\u7C73', // ⽶ → 米
  '\u2F77': '\u7CF8', // ⽷ → 糸
  '\u2F78': '\u7F36', // ⽸ → 缶
  '\u2F79': '\u7F51', // ⽹ → 网
  '\u2F7A': '\u7F8A', // ⽺ → 羊
  '\u2F7B': '\u7FBD', // ⽻ → 羽
  '\u2F7C': '\u8001', // ⽼ → 老
  '\u2F7D': '\u800C', // ⽽ → 而
  '\u2F7E': '\u8012', // ⽾ → 耒
  '\u2F7F': '\u8033', // ⽿ → 耳
  '\u2F80': '\u807F', // ⾀ → 聿
  '\u2F81': '\u8089', // ⾁ → 肉
  '\u2F82': '\u81E3', // ⾂ → 臣
  '\u2F83': '\u81EA', // ⾃ → 自
  '\u2F84': '\u81F3', // ⾄ → 至
  '\u2F85': '\u81FC', // ⾅ → 臼
  '\u2F86': '\u820C', // ⾆ → 舌
  '\u2F87': '\u821B', // ⾇ → 舛
  '\u2F88': '\u821F', // ⾈ → 舟
  '\u2F89': '\u826E', // ⾉ → 艮
  '\u2F8A': '\u8272', // ⾊ → 色
  '\u2F8B': '\u8278', // ⾋ → 艸
  '\u2F8C': '\u864D', // ⾌ → 虍
  '\u2F8D': '\u866B', // ⾍ → 虫
  '\u2F8E': '\u8840', // ⾎ → 血
  '\u2F8F': '\u884C', // ⾏ → 行
  '\u2F90': '\u8863', // ⾐ → 衣
  '\u2F91': '\u897E', // ⾑ → 襾
  '\u2F92': '\u898B', // ⾒ → 見
  '\u2F93': '\u89D2', // ⾓ → 角
  '\u2F94': '\u8A00', // ⾔ → 言
  '\u2F95': '\u8C37', // ⾕ → 谷
  '\u2F96': '\u8C46', // ⾖ → 豆
  '\u2F97': '\u8C55', // ⾗ → 豕
  '\u2F98': '\u8C78', // ⾘ → 豸
  '\u2F99': '\u8C9D', // ⾙ → 貝
  '\u2F9A': '\u8D64', // ⾚ → 赤
  '\u2F9B': '\u8D70', // ⾛ → 走
  '\u2F9C': '\u8DB3', // ⾜ → 足
  '\u2F9D': '\u8EAB', // ⾝ → 身
  '\u2F9E': '\u8ECA', // ⾞ → 車
  '\u2F9F': '\u8F9B', // ⾟ → 辛
  '\u2FA0': '\u8FB0', // ⾠ → 辰
  '\u2FA1': '\u8FB5', // ⾡ → 辵
  '\u2FA2': '\u9091', // ⾢ → 邑
  '\u2FA3': '\u9149', // ⾣ → 酉
  '\u2FA4': '\u91C6', // ⾤ → 釆
  '\u2FA5': '\u91CC', // ⾥ → 里
  '\u2FA6': '\u91D1', // ⾦ → 金
  '\u2FA7': '\u9577', // ⾧ → 長
  '\u2FA8': '\u9580', // ⾨ → 門
  '\u2FA9': '\u961C', // ⾩ → 阜
  '\u2FAA': '\u96B6', // ⾪ → 隶
  '\u2FAB': '\u96B9', // ⾫ → 隹
  '\u2FAC': '\u96E8', // ⾬ → 雨
  '\u2FAD': '\u9751', // ⾭ → 青
  '\u2FAE': '\u975E', // ⾮ → 非
  '\u2FAF': '\u9762', // ⾯ → 面
  '\u2FB0': '\u9769', // ⾰ → 革
  '\u2FB1': '\u97CB', // ⾱ → 韋
  '\u2FB2': '\u97ED', // ⾲ → 韭
  '\u2FB3': '\u97F3', // ⾳ → 音
  '\u2FB4': '\u9875', // ⾴ → 頁
  '\u2FB5': '\u98A8', // ⾵ → 風
  '\u2FB6': '\u98DB', // ⾶ → 飛
  '\u2FB7': '\u98DF', // ⾷ → 食
  '\u2FB8': '\u9996', // ⾸ → 首
  '\u2FB9': '\u9999', // ⾹ → 香
  '\u2FBA': '\u99AC', // ⾺ → 馬
  '\u2FBB': '\u9AA8', // ⾻ → 骨
  '\u2FBC': '\u9AD8', // ⾼ → 高
  '\u2FBD': '\u9ADF', // ⾽ → 髟
  '\u2FBE': '\u9B25', // ⾾ → 鬥
  '\u2FBF': '\u9B2F', // ⾿ → 鬯
  '\u2FC0': '\u9B32', // ⿀ → 鬲
  '\u2FC1': '\u9B3C', // ⿁ → 鬼
  '\u2FC2': '\u9B5A', // ⿂ → 魚
  '\u2FC3': '\u9CE5', // ⿃ → 鳥
  '\u2FC4': '\u9E75', // ⿄ → 鹵
  '\u2FC5': '\u9E7F', // ⿅ → 鹿
  '\u2FC6': '\u9EA5', // ⿆ → 麥
  '\u2FC7': '\u9EBB', // ⿇ → 麻
  '\u2FC8': '\u9EC3', // ⿈ → 黃
  '\u2FC9': '\u9ECD', // ⿉ → 黍
  '\u2FCA': '\u9ED1', // ⿊ → 黑
  '\u2FCB': '\u9EF9', // ⿋ → 黹
  '\u2FCC': '\u9EFD', // ⿌ → 黽
  '\u2FCD': '\u9F0E', // ⿍ → 鼎
  '\u2FCE': '\u9F13', // ⿎ → 鼓
  '\u2FCF': '\u9F20', // ⿏ → 鼠
  '\u2FD0': '\u9F3B', // ⿐ → 鼻
  '\u2FD1': '\u9F4A', // ⿑ → 齊
  '\u2FD2': '\u9F52', // ⿒ → 齒
  '\u2FD3': '\u9F8D', // ⿓ → 龍
  '\u2FD4': '\u9F9C', // ⿔ → 龜
  '\u2FD5': '\u9FA0', // ⿕ → 龠

  // CJK Compatibility Ideographs (常见 OCR 错误)
  '\uF900': '\u8c48',
  '\uF901': '\u66f4',
  '\uF902': '\u8eca',
  '\uF903': '\u8cc8',
  '\uF904': '\u6ed1',
  '\uF905': '\u4e32',
  '\uF906': '\u53e5',
  '\uF907': '\u9f9c',
  '\uF908': '\u9f9c',
  '\uF909': '\u5951',
  '\uF90A': '\u91d1',
  '\uF90B': '\u5587',
  '\uF90C': '\u5948',
  '\uF90D': '\u61f6',
  '\uF90E': '\u7669',
  '\uF90F': '\u7f85',
  '\uF910': '\u863f',
  '\uF911': '\u87ba',
  '\uF912': '\u88f8',
  '\uF913': '\u908f',
  '\uF914': '\u6a02',
  '\uF915': '\u6d1b',
  '\uF916': '\u70d9',
  '\uF917': '\u73de',
  '\uF918': '\u843d',
  '\uF919': '\u916a',
  '\uF91A': '\u99f1',
  '\uF91B': '\u4e82',
  '\uF91C': '\u5375',
  '\uF91D': '\u6b04',
  '\uF91E': '\u721b',
  '\uF91F': '\u862d',
  '\uF920': '\u9e1e',
  '\uF921': '\u5d50',
  '\uF922': '\u6feb',
  '\uF923': '\u85cd',
  '\uF924': '\u8964',
  '\uF925': '\u62c9',
  '\uF926': '\u81d8',
  '\uF927': '\u881f',
  '\uF928': '\u5eca',
  '\uF929': '\u6717',
  '\uF92A': '\u6d6a',
  '\uF92B': '\u72fc',
  '\uF92C': '\u90ce',
  '\uF92D': '\u4f86',
  '\uF92E': '\u51b7',
  '\uF92F': '\u52de',
  '\uF930': '\u64c4',
  '\uF931': '\u6ad3',
  '\uF932': '\u7210',
  '\uF933': '\u76e7',
  '\uF934': '\u8001',
  '\uF935': '\u8606',
  '\uF936': '\u865c',
  '\uF937': '\u8def',
  '\uF938': '\u9732',
  '\uF939': '\u9b6f',
  '\uF93A': '\u9dfa',
  '\uF93B': '\u788c',
  '\uF93C': '\u797f',
  '\uF93D': '\u7da0',
  '\uF93E': '\u83c9',
  '\uF93F': '\u9304',
  '\uF940': '\u9e7f',
  '\uF941': '\u8ad6',
  '\uF942': '\u58df',
  '\uF943': '\u5f04',
  '\uF944': '\u7c60',
  '\uF945': '\u807e',
  '\uF946': '\u7262',
  '\uF947': '\u78ca',
  '\uF948': '\u8cca',
  '\uF949': '\u4e57',
  '\uF94A': '\u5764',
  '\uF94B': '\u5d14',
  '\uF94C': '\u843d',

  // 半角→全角数字（OCR常见）
  // 其他常见 OCR 错字可按需补充

  // ── CJK Radicals Supplement (U+2E80–U+2EFF) ──
  // 这些是简化字偏旁部首形式，OCR 扫描 PDF 时经常混入
  '\u2E81': '\u5382', // ⺁ → 厂
  '\u2E84': '\u4E59', // ⺄ → 乙
  '\u2E85': '\u4EBA', // ⺅ → 人 (亻)
  '\u2E86': '\u513F', // ⺆ → 儿
  '\u2E87': '\u6208', // ⺇ → 戈
  '\u2E88': '\u5200', // ⺈ → 刀 (刂)
  '\u2E89': '\u535C', // ⺉ → 卜
  '\u2E8A': '\u5369', // ⺊ → 卩
  '\u2E8B': '\u529B', // ⺋ → 力
  '\u2E8C': '\u5C0F', // ⺌ → 小
  '\u2E8D': '\u5C0F', // ⺍ → 小
  '\u2E8E': '\u65E0', // ⺎ → 无 (尢变体)
  '\u2E93': '\u5E7A', // ⺓ → 幺
  '\u2E96': '\u5FC3', // ⺖ → 心 (忄)
  '\u2E97': '\u5FC3', // ⺗ → 心
  '\u2E98': '\u624B', // ⺘ → 手 (扌)
  '\u2E99': '\u6534', // ⺙ → 攴
  '\u2E9B': '\u652F', // ⺛ → 支
  '\u2E9D': '\u6708', // ⺝ → 月 (肉旁)
  '\u2E9E': '\u6728', // ⺞ → 木
  '\u2E9F': '\u6BCD', // ⺟ → 母
  '\u2EA0': '\u6C11', // ⺠ → 民
  '\u2EA1': '\u6C34', // ⺡ → 水 (氵)
  '\u2EA2': '\u6C34', // ⺢ → 水
  '\u2EA3': '\u706B', // ⺣ → 火 (灬)
  '\u2EA4': '\u722A', // ⺤ → 爪
  '\u2EA5': '\u722A', // ⺥ → 爪
  '\u2EA6': '\u6728', // ⺦ → 木
  '\u2EA7': '\u725B', // ⺧ → 牛 (牜)
  '\u2EA8': '\u72AC', // ⺨ → 犬 (犭)
  '\u2EA9': '\u738B', // ⺩ → 王
  '\u2EAA': '\u5E02', // ⺪ → 市
  '\u2EAB': '\u76EE', // ⺫ → 目
  '\u2EAC': '\u793A', // ⺬ → 示 (礻)
  '\u2EAD': '\u793A', // ⺭ → 示
  '\u2EAE': '\u7AF9', // ⺮ → 竹
  '\u2EAF': '\u7CF8', // ⺯ → 糸
  '\u2EB0': '\u7CF8', // ⺰ → 糸 (纟)
  '\u2EB1': '\u7F51', // ⺱ → 网
  '\u2EB2': '\u7F51', // ⺲ → 网
  '\u2EB3': '\u7F51', // ⺳ → 网
  '\u2EB4': '\u7F51', // ⺴ → 网
  '\u2EB5': '\u7F51', // ⺵ → 网
  '\u2EB6': '\u7F8A', // ⺶ → 羊
  '\u2EB7': '\u7F8A', // ⺷ → 羊
  '\u2EB8': '\u7F8A', // ⺸ → 羊
  '\u2EB9': '\u8001', // ⺹ → 老 (耂)
  '\u2EBA': '\u800C', // ⺺ → 而
  '\u2EBB': '\u800C', // ⺻ → 而
  '\u2EBC': '\u8089', // ⺼ → 肉 (月旁体部)
  '\u2EBD': '\u81FC', // ⺽ → 臼
  '\u2EBE': '\u8349', // ⺾ → 草 (艹)
  '\u2EBF': '\u8349', // ⺿ → 草
  '\u2EC0': '\u8349', // ⻀ → 草
  '\u2EC1': '\u864E', // ⻁ → 虎
  '\u2EC2': '\u8863', // ⻂ → 衣 (衤)
  '\u2EC3': '\u897F', // ⻃ → 西
  '\u2EC4': '\u897F', // ⻄ → 西
  '\u2EC5': '\u89C1', // ⻅ → 见 (简体見)
  '\u2EC6': '\u89D2', // ⻆ → 角
  '\u2EC7': '\u89D2', // ⻇ → 角
  '\u2EC8': '\u8BF4', // ⻈ → 说 (讠= 言简体)
  '\u2EC9': '\u8D1D', // ⻉ → 贝 (简体貝)
  '\u2ECA': '\u8DB3', // ⻊ → 足
  '\u2ECB': '\u8F66', // ⻋ → 车 (简体車)
  '\u2ECC': '\u8FB5', // ⻌ → 辵 (辶)
  '\u2ECD': '\u8FB5', // ⻍ → 辵
  '\u2ECE': '\u8FB5', // ⻎ → 辵
  '\u2ECF': '\u9091', // ⻏ → 邑 (阝right)
  '\u2ED0': '\u91D1', // ⻐ → 金 (钅)
  '\u2ED1': '\u957F', // ⻑ → 长 (简体長)
  '\u2ED2': '\u957F', // ⻒ → 长
  '\u2ED3': '\u957F', // ⻓ → 长
  '\u2ED4': '\u95E8', // ⻔ → 门 (简体門) ★
  '\u2ED5': '\u961C', // ⻕ → 阜 (阝left)
  '\u2ED6': '\u961C', // ⻖ → 阜
  '\u2ED7': '\u9752', // ⻗ → 青
  '\u2ED8': '\u9752', // ⻘ → 青
  '\u2ED9': '\u97E6', // ⻙ → 韦
  '\u2EDA': '\u9875', // ⻚ → 页
  '\u2EDB': '\u98CE', // ⻛ → 风
  '\u2EDC': '\u98DE', // ⻜ → 飞
  '\u2EDD': '\u98DF', // ⻝ → 食
  '\u2EDE': '\u98E0', // ⻞ → 飠
  '\u2EDF': '\u9963', // ⻟ → 饣
  '\u2EE0': '\u9996', // ⻠ → 首
  '\u2EE1': '\u9999', // ⻡ → 香
  '\u2EE2': '\u9A6C', // ⻢ → 马
  '\u2EE3': '\u9AA8', // ⻣ → 骨
  '\u2EE4': '\u9B3C', // ⻤ → 鬼
  '\u2EE5': '\u9C7C', // ⻥ → 鱼
  '\u2EE6': '\u9E1F', // ⻦ → 鸟
  '\u2EE7': '\u5364', // ⻧ → 卤
  '\u2EE8': '\u9EA6', // ⻨ → 麦
  '\u2EE9': '\u9EC4', // ⻩ → 黄
  '\u2EEA': '\u9EFE', // ⻪ → 黾
  '\u2EEB': '\u9F50', // ⻫ → 齐
  '\u2EEC': '\u9F7F', // ⻬ → 齿
  '\u2EED': '\u9F7F', // ⻭ → 齿
  '\u2EEE': '\u9F99', // ⻮ → 龙
  '\u2EEF': '\u9F99', // ⻯ → 龙
  '\u2EF0': '\u9F99', // ⻰ → 龙
  '\u2EF1': '\u9F9F', // ⻱ → 龟
  '\u2EF2': '\u9F9F', // ⻲ → 龟
  '\u2EF3': '\u9F9F', // ⻳ → 龟
}

function buildSectionFixMap(start, end) {
  return Object.fromEntries(
    Object.entries(UNICODE_FIX_MAP).filter(([ch]) => {
      const cp = ch.codePointAt(0)
      return cp >= start && cp <= end
    }),
  )
}

const KANGXI_FIX_MAP = buildSectionFixMap(0x2f00, 0x2fd5)
const RADICALS_SUPPLEMENT_FIX_MAP = buildSectionFixMap(0x2e80, 0x2eff)
const COMPAT_IDEO_FIX_MAP = buildSectionFixMap(0xf900, 0xfaff)
const COMPAT_IDEO_SUPPLEMENT_FIX_MAP = buildSectionFixMap(0x2f800, 0x2fa1f)

const UNICODE_FIX_MAPS_BY_RANGE = {
  'kangxi': KANGXI_FIX_MAP,
  'radicals-supplement': RADICALS_SUPPLEMENT_FIX_MAP,
  'compat-ideographs': COMPAT_IDEO_FIX_MAP,
  'compat-ideographs-supplement': COMPAT_IDEO_SUPPLEMENT_FIX_MAP,
}

function getFixMapForRanges(selectedRanges) {
  return Object.assign({}, ...selectedRanges.map((range) => UNICODE_FIX_MAPS_BY_RANGE[range.key] ?? {}))
}

// ────────────────────────────────────────────────
// Convert text
// ────────────────────────────────────────────────
function convertText(input, selectedRanges = getSelectedRanges()) {
  const fixMap = getFixMapForRanges(selectedRanges)
  let result = ''
  let badCount = 0
  let fixCount = 0
  for (const ch of [...input]) {
    if (isSelectedSuspiciousChar(ch, selectedRanges)) {
      badCount++
      if (fixMap[ch]) {
        result += fixMap[ch]
        fixCount++
      } else {
        result += ch // unknown, keep
      }
    } else {
      result += ch
    }
  }
  return { result, badCount, fixCount }
}

// ────────────────────────────────────────────────
// Build highlighted HTML for ORIGINAL text
// ────────────────────────────────────────────────
function buildHighlightHTML(input, selectedRanges = getSelectedRanges()) {
  const fixMap = getFixMapForRanges(selectedRanges)
  let html = ''
  for (const ch of [...input]) {
    if (isSelectedSuspiciousChar(ch, selectedRanges)) {
      const fix = fixMap[ch]
      const cp = '\\u' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')
      if (fix) {
        html += `<mark class="highlight-bad" title="原: ${ch} (${cp})  →  替换为: ${fix}">${fix}</mark>`
      } else {
        html += `<mark class="highlight-bad" style="border-bottom-color:#f59e0b;color:#f59e0b;background:rgba(245,158,11,0.12);" title="可疑字符: ${ch} (${cp})  无映射">${ch}</mark>`
      }
    } else {
      // escape HTML
      html +=
        ch === '&' ? '&amp;'
        : ch === '<' ? '&lt;'
        : ch === '>' ? '&gt;'
        : ch
    }
  }
  return html
}

// ────────────────────────────────────────────────
// Realtime analysis on input
// ────────────────────────────────────────────────
const inputEl = document.getElementById('input-text')
const inputCount = document.getElementById('input-count')
const inputStats = document.getElementById('input-stats')
const badCountEl = document.getElementById('bad-count')
const fixCountEl = document.getElementById('fix-count')
const btnCopy = document.getElementById('btn-copy')
const rangeInputs = Array.from(document.querySelectorAll('[data-range-key]'))
const rangeTooltip = document.getElementById('range-tooltip')

loadRangePreferences()

function getRangeLabelFromControl(control) {
  return control?.closest('.range-option') ?? null
}

function getTooltipText(control) {
  const label = getRangeLabelFromControl(control)
  return label?.dataset.tooltip?.trim() ?? ''
}

function hideRangeTooltip() {
  rangeTooltip.classList.remove('show')
  rangeTooltip.setAttribute('aria-hidden', 'true')
}

function positionRangeTooltip(anchorRect) {
  const tooltipRect = rangeTooltip.getBoundingClientRect()
  const gap = 12
  const margin = 12
  let left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2
  let top = anchorRect.top - tooltipRect.height - gap
  let placeBelow = false

  if (left < margin) {
    left = margin
  }

  if (left + tooltipRect.width > window.innerWidth - margin) {
    left = window.innerWidth - tooltipRect.width - margin
  }

  if (top < margin) {
    top = anchorRect.bottom + gap
    placeBelow = true
  }

  if (top + tooltipRect.height > window.innerHeight - margin) {
    top = Math.max(margin, window.innerHeight - tooltipRect.height - margin)
  }

  rangeTooltip.style.left = `${Math.max(margin, left)}px`
  rangeTooltip.style.top = `${Math.max(margin, top)}px`
  rangeTooltip.classList.toggle('place-below', placeBelow)
}

function showRangeTooltip(text, anchorRect) {
  if (!text) return
  rangeTooltip.textContent = text
  rangeTooltip.setAttribute('aria-hidden', 'false')
  rangeTooltip.classList.add('show')

  requestAnimationFrame(() => {
    positionRangeTooltip(anchorRect)
  })
}

function wireRangeTooltip(control) {
  const label = getRangeLabelFromControl(control)
  if (!label) return

  label.addEventListener('mouseenter', () => {
    const text = getTooltipText(control)
    if (text) showRangeTooltip(text, label.getBoundingClientRect())
  })

  label.addEventListener('mouseleave', hideRangeTooltip)

  control.addEventListener('focus', () => {
    const text = getTooltipText(control)
    if (!text) return
    const rect = label.getBoundingClientRect()
    showRangeTooltip(text, rect)
  })

  control.addEventListener('blur', hideRangeTooltip)
}

rangeInputs.forEach(wireRangeTooltip)

window.addEventListener('scroll', hideRangeTooltip, true)
window.addEventListener('resize', hideRangeTooltip)
document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest?.('.range-option')) hideRangeTooltip()
})

function refreshAnalysis() {
  const val = inputEl.value
  inputCount.textContent = [...val].length + ' 字符'
  if (val.trim()) {
    const selectedRanges = getSelectedRanges()
    const { badCount, fixCount } = convertText(val, selectedRanges)
    inputStats.style.display = 'flex'
    badCountEl.textContent = badCount
    fixCountEl.textContent = fixCount
    btnCopy.disabled = false
  } else {
    inputStats.style.display = 'none'
    btnCopy.disabled = true
  }
}

rangeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    saveRangePreferences()
    refreshAnalysis()
  })
})

inputEl.addEventListener('input', refreshAnalysis)

refreshAnalysis()

// ────────────────────────────────────────────────
// Convert action
// ────────────────────────────────────────────────
let lastConverted = ''

function convert(andCopy) {
  const input = inputEl.value
  if (!input.trim()) return

  const selectedRanges = getSelectedRanges()
  const { result, badCount, fixCount } = convertText(input, selectedRanges)
  lastConverted = result

  const outputSection = document.getElementById('output-section')
  const outputContent = document.getElementById('output-content')
  const outputMeta = document.getElementById('output-meta')
  const legendBad = document.getElementById('legend-bad')
  const legendUnk = document.getElementById('legend-unk')

  outputSection.classList.add('visible')
  outputContent.innerHTML = buildHighlightHTML(input, selectedRanges)
  outputMeta.textContent = `替换 ${fixCount} 个字符`

  legendBad.style.display = fixCount > 0 ? 'flex' : 'none'
  legendUnk.style.display = badCount > fixCount ? 'flex' : 'none'

  if (andCopy) {
    navigator.clipboard.writeText(result).then(() => showToast('✓ 已复制纯文本到剪贴板'))
  }
}

// ────────────────────────────────────────────────
// Clear
// ────────────────────────────────────────────────
function clearAll() {
  inputEl.value = ''
  inputCount.textContent = '0 字符'
  inputStats.style.display = 'none'
  document.getElementById('output-section').classList.remove('visible')
  btnCopy.disabled = true
  inputEl.focus()
}

// ────────────────────────────────────────────────
// Toast
// ────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2500)
}

// ────────────────────────────────────────────────
// Theme Toggle Logic
// ────────────────────────────────────────────────
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}
