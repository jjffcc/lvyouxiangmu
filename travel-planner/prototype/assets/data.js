/* 演示数据：全部为虚构示例，未接入真实服务，不能用于实际出行。 */
window.DEMO = {
  meta: {
    builtAt: "2026-10-05",
    requirementsVersion: "1.1",
    notice: "演示原型：数据为虚构示例，未接入地图、天气、账户、AI、OCR 等真实服务。"
  },

  roleLabels: {
    owner: "旅行负责人",
    editor: "可编辑成员",
    readonly: "只读成员"
  },

  trips: [
    {
      id: "hz-family",
      title: "杭州亲子三日游",
      cities: ["杭州"],
      start: "2026-10-17",
      end: "2026-10-19",
      status: "规划中",
      pace: "舒适",
      owner: "我",
      people: 4,
      budget: { total: 6000, spent: 1860, perPerson: 1500 },
      hard: [
        "每天 13:00–14:30 安排午休",
        "10-18 16:00 浙江省博物馆预约（已确认）",
        "童童不吃辣；外婆需要低盐"
      ],
      prefs: ["舒适节奏", "每天步行不超过 8000 步", "尽量少换酒店"],
      note: "博物馆预约是硬性条件；请勿在没有确认的情况下改动。"
    },
    {
      id: "cd-cq-friends",
      title: "成都重庆朋友行",
      cities: ["成都", "重庆"],
      start: "2026-11-06",
      end: "2026-11-10",
      status: "待出发",
      pace: "丰富",
      owner: "我",
      people: 3,
      budget: { total: 9000, spent: 4200, perPerson: 3000 },
      hard: ["11-08 成都→重庆高铁已出票", "11-10 重庆返程航班"],
      prefs: ["多逛景点", "夜宵优先", "接受较多步行"],
      note: "跨城衔接使用已出票班次；其余安排可调整。"
    }
  ],

  members: {
    "hz-family": [
      { name: "我", role: "owner", note: "演示账号", shareDocs: true, shareContact: true },
      { name: "爱人", role: "editor", note: "可修改行程草稿", shareDocs: true, shareContact: true },
      { name: "童童", role: "readonly", note: "8 岁，忌辣", shareDocs: false, shareContact: false },
      { name: "外婆", role: "readonly", note: "步行较慢，需低盐", shareDocs: false, shareContact: false }
    ],
    "cd-cq-friends": [
      { name: "我", role: "owner", note: "演示账号", shareDocs: true, shareContact: true },
      { name: "阿哲", role: "editor", note: "负责交通", shareDocs: true, shareContact: true },
      { name: "小林", role: "readonly", note: "只查看行程", shareDocs: false, shareContact: false }
    ]
  },

  tabs: {
    features: [
      { id: "human", label: "人文" },
      { id: "nature", label: "自然景观" },
      { id: "food", label: "美食" },
      { id: "fishing", label: "钓鱼" },
      { id: "geo", label: "地理特色" },
      { id: "other", label: "其他" }
    ],
    meals: [
      { id: "all", label: "全部" },
      { id: "breakfast", label: "早餐" },
      { id: "lunch", label: "午餐" },
      { id: "dinner", label: "晚餐" },
      { id: "night", label: "夜宵" },
      { id: "snack", label: "小吃" }
    ]
  },

  features: {
    "杭州": {
      human: [
        {
          title: "南宋御街与河坊街",
          summary: "杭州老城轴线，沿街是传统商铺与老字号，适合半日步行了解市井文化。",
          where: "上城区 · 中山中路一带",
          season: "全年；节假日人流较大",
          duration: "2–3 小时",
          cost: "免费；餐饮人均约 ¥40–80",
          tips: "石板路多，婴儿车推行略颠簸。",
          source: "示例来源：杭州市文化和旅游资料（演示）",
          sourceDate: "适用 2026-10",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容"
        },
        {
          title: "浙江省博物馆（之江馆）",
          summary: "常设浙江历史与文物展，适合亲子，室内可避雨避晒。",
          where: "西湖区 · 之江文化中心",
          season: "全年；周一通常闭馆（需核实）",
          duration: "2–3 小时",
          cost: "免费预约（演示）",
          tips: "10-18 16:00 已预约，属硬性安排。",
          source: "示例来源：场馆预约页（演示）",
          sourceDate: "适用 2026-10-18",
          checkedAt: "查询 2026-10-02",
          status: "ok",
          statusText: "已确认预约（演示）"
        }
      ],
      nature: [
        {
          title: "西湖 · 苏堤与断桥",
          summary: "经典湖景步道，清晨人少，适合慢走与拍照。",
          where: "西湖区 · 苏堤 / 白堤",
          season: "四季；10 月秋色较好",
          duration: "半日",
          cost: "免费",
          tips: "全程约 3 公里，建议留出休息点。",
          source: "示例来源：西湖景区介绍（演示）",
          sourceDate: "适用 2026-10",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容"
        },
        {
          title: "九溪烟树",
          summary: "溪谷步道与茶山，树荫多，适合带孩子的轻松徒步。",
          where: "西湖区 · 九溪路",
          season: "春秋最佳",
          duration: "2–3 小时",
          cost: "免费",
          tips: "雨后路面湿滑，需防滑鞋。",
          source: "示例来源：景区公开资料（演示）",
          sourceDate: "适用 2026-10",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容"
        }
      ],
      food: [
        {
          title: "杭帮菜与杭州小吃",
          summary: "口味清爽偏鲜甜，代表菜有西湖醋鱼、龙井虾仁、片儿川、葱包桧。",
          where: "全市；老城与西湖周边较集中",
          season: "全年",
          duration: "按用餐安排",
          cost: "小吃人均 ¥15–40；正餐人均 ¥80–150",
          tips: "多数菜品可不辣；点菜前说明忌口。",
          source: "示例来源：饮食文化资料（演示）",
          sourceDate: "适用 2026-10",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容",
          link: "#/trip/hz-family/food",
          linkText: "进入城市美食页面"
        }
      ],
      fishing: [
        {
          title: "千岛湖路亚与休闲垂钓体验",
          summary: "距杭州约 2 小时车程的湖区体验项目，含装备与服务；适合安排半天到一天。",
          where: "淳安 · 千岛湖周边（具体点位需向服务方确认）",
          season: "春季与秋季较常见（需核实）",
          duration: "半天–1 天",
          cost: "参考 ¥300–600/人（演示，待核实）",
          tips: "水域准入、开放时间与是否允许垂钓需以场地与主管部门信息为准，本页不做可直接前往的结论。",
          source: "示例来源：场地与服务方页面（演示，未核验）",
          sourceDate: "待核实",
          checkedAt: "查询 2026-10-04",
          status: "warn",
          statusText: "准入条件待核实"
        }
      ],
      geo: [
        {
          title: "西湖的成因与钱塘江涌潮",
          summary: "西湖由泻湖演变而来；钱塘江涌潮受河口地形与天文潮影响，农历八月前后常见。",
          where: "西湖区 / 钱塘江沿岸",
          season: "涌潮以农历八月前后较常见",
          duration: "背景知识，不单独占用行程",
          cost: "—",
          tips: "属于理解当地景观的背景信息，不等同于当天天气或观潮安全提示。",
          source: "示例来源：地理科普资料（演示）",
          sourceDate: "长期资料",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容"
        }
      ],
      other: []
    },
    "成都": {
      human: [
        {
          title: "宽窄巷子与川西民居",
          summary: "老城院落与街巷格局，适合傍晚散步与拍照。",
          where: "青羊区",
          season: "全年",
          duration: "2 小时",
          cost: "免费",
          tips: "夜间人流密集，注意同行者走散。",
          source: "示例来源：街区公开资料（演示）",
          sourceDate: "适用 2026-11",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容"
        }
      ],
      nature: [
        {
          title: "龙泉山观景",
          summary: "俯瞰成都平原的观景点，适合傍晚。",
          where: "龙泉驿区",
          season: "春秋",
          duration: "半日",
          cost: "交通自理",
          tips: "夜间下山交通需提前安排。",
          source: "示例来源：公开资料（演示）",
          sourceDate: "适用 2026-11",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容"
        }
      ],
      food: [
        {
          title: "川菜与成都小吃",
          summary: "火锅、串串、担担面、钟水饺、甜水面等，口味偏麻辣。",
          where: "全市",
          season: "全年",
          duration: "按用餐安排",
          cost: "小吃人均 ¥15–40；火锅人均 ¥80–150",
          tips: "可要求微辣或清汤锅；过敏原需询问店家。",
          source: "示例来源：饮食文化资料（演示）",
          sourceDate: "适用 2026-11",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容",
          link: "#/trip/cd-cq-friends/food",
          linkText: "进入城市美食页面"
        }
      ],
      fishing: [],
      geo: [
        {
          title: "成都平原与都江堰水系",
          summary: "平原由河流冲积形成，都江堰水利工程影响了成都的水系与农业。",
          where: "都江堰 / 成都平原",
          season: "长期资料",
          duration: "背景知识",
          cost: "—",
          tips: "用于理解当地地形与行程分布。",
          source: "示例来源：地理科普资料（演示）",
          sourceDate: "长期资料",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容"
        }
      ],
      other: []
    },
    "重庆": {
      human: [
        {
          title: "山城步道与吊脚楼",
          summary: "沿江坡地街巷，体现山城立体交通与居住形态。",
          where: "渝中区",
          season: "全年",
          duration: "2–3 小时",
          cost: "免费",
          tips: "台阶较多，不适合推车。",
          source: "示例来源：公开资料（演示）",
          sourceDate: "适用 2026-11",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容"
        }
      ],
      nature: [
        {
          title: "两江交汇夜景",
          summary: "长江与嘉陵江交汇处，夜间灯光集中。",
          where: "渝中区 · 朝天门一带",
          season: "全年",
          duration: "1–2 小时",
          cost: "免费（观景平台收费情况需核实）",
          tips: "夜间返程交通较拥堵。",
          source: "示例来源：公开资料（演示）",
          sourceDate: "适用 2026-11",
          checkedAt: "查询 2026-10-04",
          status: "warn",
          statusText: "收费情况待核实"
        }
      ],
      food: [
        {
          title: "重庆火锅与小面",
          summary: "牛油火锅、小面、酸辣粉等，口味重麻重辣。",
          where: "全市",
          season: "全年",
          duration: "按用餐安排",
          cost: "小面人均 ¥10–20；火锅人均 ¥80–140",
          tips: "可要求微辣；说明过敏原与忌口。",
          source: "示例来源：饮食文化资料（演示）",
          sourceDate: "适用 2026-11",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容",
          link: "#/trip/cd-cq-friends/food",
          linkText: "进入城市美食页面"
        }
      ],
      fishing: [],
      geo: [
        {
          title: "平行岭谷与立体城市",
          summary: "四川盆地东部的平行岭谷地形，造就了山城的高低落差与立体交通。",
          where: "重庆主城",
          season: "长期资料",
          duration: "背景知识",
          cost: "—",
          tips: "用于理解路线坡度与体力安排。",
          source: "示例来源：地理科普资料（演示）",
          sourceDate: "长期资料",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容"
        }
      ],
      other: []
    }
  },

  cityFood: {
    "杭州": {
      style: {
        name: "杭帮菜（浙菜分支）",
        summary: "口味清爽、偏鲜甜，讲究时令与河鲜，做法以清蒸、糟卤、慢焖为主。",
        flavors: ["清爽", "鲜甜", "少辣", "重时令"],
        source: "示例来源：饮食文化资料（演示）",
        checkedAt: "查询 2026-10-04",
        status: "demo",
        statusText: "演示内容"
      },
      dishes: [
        { name: "西湖醋鱼", meal: "dinner", summary: "草鱼配糖醋汁，酸甜口。", note: "可要求少糖；鱼刺较多。" },
        { name: "龙井虾仁", meal: "lunch", summary: "虾仁配龙井茶，清淡。", note: "适合孩子与老人。" },
        { name: "片儿川", meal: "breakfast", summary: "雪菜笋片肉丝面，本地常见早餐。", note: "汤面偏咸，可要求少盐。" },
        { name: "葱包桧", meal: "snack", summary: "面饼夹油条与葱，街头小吃。", note: "现做现吃。" },
        { name: "定胜糕", meal: "snack", summary: "米粉蒸制糕点，微甜。", note: "适合孩子。" },
        { name: "猫耳朵", meal: "lunch", summary: "面食小粒配汤或炒制。", note: "口感软，适合老人。" }
      ],
      shops: [
        {
          name: "巷口片儿川（示例店）",
          meal: "breakfast",
          area: "上城区 · 中山中路一带",
          dish: "片儿川、拌川",
          cost: "人均 ¥25",
          hours: "06:30–14:00",
          fit: ["少盐可选", "儿童可吃"],
          note: "旺季早晨可能需要排队。",
          source: "示例来源：商家页面（演示）",
          sourceDate: "适用 2026-10-01 至 10-31",
          checkedAt: "查询 2026-10-04",
          status: "warn",
          statusText: "营业时间待核实",
          link: "#"
        },
        {
          name: "老字号杭帮菜馆（示例店）",
          meal: "lunch",
          area: "西湖区 · 孤山路一带",
          dish: "西湖醋鱼、龙井虾仁",
          cost: "人均 ¥120",
          hours: "11:00–20:30",
          fit: ["少油少盐可选", "可做不辣"],
          note: "午市 12:00–13:00 为高峰，建议 11:00 到店或提前取号。",
          source: "示例来源：商家页面（演示）",
          sourceDate: "适用 2026-10",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容",
          link: "#"
        },
        {
          name: "夜市小吃摊群（示例点位）",
          meal: "night",
          area: "上城区 · 河坊街周边",
          dish: "葱包桧、定胜糕、糖炒栗子",
          cost: "人均 ¥30",
          hours: "17:00–22:00（个别摊位时间不同）",
          fit: ["儿童可吃", "可打包"],
          note: "摊位各自经营，价格与营业时间需现场确认。",
          source: "示例来源：街区公开资料（演示）",
          sourceDate: "适用 2026-10",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容",
          link: "#"
        },
        {
          name: "外婆家（示例连锁）",
          meal: "dinner",
          area: "多商圈有店",
          dish: "招牌红烧肉、茶香鸡",
          cost: "人均 ¥70",
          hours: "10:30–21:00",
          fit: ["可做不辣", "有儿童座椅"],
          note: "连锁门店情况可能不同，请以到店信息为准。",
          source: "示例来源：品牌页面（演示）",
          sourceDate: "待核实",
          checkedAt: "查询 2026-10-04",
          status: "warn",
          statusText: "门店信息待核实",
          link: "#"
        }
      ],
      allergies: ["童童：不吃辣", "外婆：低盐", "过敏原需向店家确认"]
    },
    "成都": {
      style: {
        name: "川菜（上河帮 / 小河帮）",
        summary: "麻辣鲜香为主，也有清鲜的蒸菜与汤品，小吃种类多。",
        flavors: ["麻辣", "鲜香", "可微辣", "小吃多"],
        source: "示例来源：饮食文化资料（演示）",
        checkedAt: "查询 2026-10-04",
        status: "demo",
        statusText: "演示内容"
      },
      dishes: [
        { name: "担担面", meal: "breakfast", summary: "麻辣干拌面。", note: "可要求少辣。" },
        { name: "钟水饺", meal: "snack", summary: "红油水饺，微甜辣。", note: "—" },
        { name: "甜水面", meal: "snack", summary: "粗面配甜辣酱。", note: "—" },
        { name: "火锅", meal: "dinner", summary: "牛油或清油锅底。", note: "可选鸳鸯锅。" },
        { name: "串串香", meal: "night", summary: "按签计价的火锅变体。", note: "注意计费方式。" }
      ],
      shops: [
        {
          name: "宽窄巷子小吃点位（示例）",
          meal: "snack",
          area: "青羊区 · 宽窄巷子",
          dish: "钟水饺、甜水面",
          cost: "人均 ¥30",
          hours: "10:00–21:00（各摊不同）",
          fit: ["可打包"],
          note: "游客集中，价格偏高。",
          source: "示例来源：街区公开资料（演示）",
          sourceDate: "适用 2026-11",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容",
          link: "#"
        },
        {
          name: "本地火锅店（示例）",
          meal: "dinner",
          area: "武侯区",
          dish: "鸳鸯锅、毛肚、黄喉",
          cost: "人均 ¥110",
          hours: "11:00–次日 02:00",
          fit: ["可微辣", "可选清汤"],
          note: "晚市排队明显。",
          source: "示例来源：商家页面（演示）",
          sourceDate: "待核实",
          checkedAt: "查询 2026-10-04",
          status: "warn",
          statusText: "营业信息待核实",
          link: "#"
        }
      ],
      allergies: ["阿哲：不忌口", "小林：不吃香菜"]
    },
    "重庆": {
      style: {
        name: "渝派川菜",
        summary: "重麻重辣，牛油火锅与小面最具代表性。",
        flavors: ["重麻", "重辣", "可选微辣"],
        source: "示例来源：饮食文化资料（演示）",
        checkedAt: "查询 2026-10-04",
        status: "demo",
        statusText: "演示内容"
      },
      dishes: [
        { name: "重庆小面", meal: "breakfast", summary: "麻辣汤面或干拌。", note: "可要求少辣。" },
        { name: "酸辣粉", meal: "snack", summary: "红薯粉配酸辣汤。", note: "—" },
        { name: "牛油火锅", meal: "dinner", summary: "牛油锅底，味重。", note: "可选鸳鸯锅。" },
        { name: "烤鱼 / 江湖菜", meal: "night", summary: "夜间常见选择。", note: "分量较大，适合结伴。" }
      ],
      shops: [
        {
          name: "解放碑小面店（示例）",
          meal: "breakfast",
          area: "渝中区 · 解放碑周边",
          dish: "小面、豌杂面",
          cost: "人均 ¥15",
          hours: "06:00–14:00",
          fit: ["可少辣"],
          note: "早高峰排队。",
          source: "示例来源：商家页面（演示）",
          sourceDate: "适用 2026-11",
          checkedAt: "查询 2026-10-04",
          status: "demo",
          statusText: "演示内容",
          link: "#"
        }
      ],
      allergies: ["小林：不吃香菜"]
    }
  },

  discover: {
    "杭州": {
      spots: [
        { name: "西湖风景名胜区", type: "景点", area: "西湖区", note: "经典湖景，清晨人少。", status: "demo", statusText: "演示内容" },
        { name: "灵隐寺", type: "景点", area: "西湖区", note: "排队与山路较多，需预留时间。", status: "warn", statusText: "开放信息待核实" },
        { name: "西溪湿地", type: "景点", area: "余杭区", note: "水网湿地，可乘船。", status: "demo", statusText: "演示内容" },
        { name: "九溪烟树", type: "景点", area: "西湖区", note: "树荫多，适合亲子步行。", status: "demo", statusText: "演示内容" }
      ],
      stays: [
        { name: "西湖东侧酒店（示例）", type: "住宿", area: "上城区", note: "距地铁 400 米，含早餐。", status: "warn", statusText: "价格待核实" },
        { name: "龙井路民宿（示例）", type: "住宿", area: "西湖区", note: "环境安静，交通依赖打车。", status: "demo", statusText: "演示内容" }
      ],
      eats: [
        { name: "河坊街小吃", type: "餐饮", area: "上城区", note: "夜间摊位多。", status: "demo", statusText: "演示内容" },
        { name: "老字号杭帮菜馆（示例）", type: "餐饮", area: "西湖区", note: "午市高峰需提前。", status: "demo", statusText: "演示内容" }
      ]
    },
    "成都": {
      spots: [
        { name: "宽窄巷子", type: "景点", area: "青羊区", note: "傍晚散步。", status: "demo", statusText: "演示内容" },
        { name: "大熊猫繁育研究基地", type: "景点", area: "成华区", note: "建议早到。", status: "warn", statusText: "预约方式待核实" }
      ],
      stays: [{ name: "春熙路附近酒店（示例）", type: "住宿", area: "锦江区", note: "交通方便。", status: "demo", statusText: "演示内容" }],
      eats: [{ name: "火锅一条街（示例）", type: "餐饮", area: "武侯区", note: "晚市排队。", status: "demo", statusText: "演示内容" }]
    },
    "重庆": {
      spots: [
        { name: "洪崖洞", type: "景点", area: "渝中区", note: "夜景人多。", status: "demo", statusText: "演示内容" },
        { name: "解放碑", type: "景点", area: "渝中区", note: "步行可达多个点位。", status: "demo", statusText: "演示内容" }
      ],
      stays: [{ name: "解放碑附近酒店（示例）", type: "住宿", area: "渝中区", note: "夜间交通拥堵。", status: "warn", statusText: "价格待核实" }],
      eats: [{ name: "小面馆（示例）", type: "餐饮", area: "渝中区", note: "早餐高峰。", status: "demo", statusText: "演示内容" }]
    }
  },

  plans: {
    "hz-family": [
      { id: "a", name: "方案 A · 舒适版", pace: "舒适", perDay: "3 个活动", walk: "约 7000 步/天", budget: 6000, risk: ["10-18 博物馆预约固定"], note: "每天保留午休，交通以打车和地铁为主。" },
      { id: "b", name: "方案 B · 丰富版", pace: "丰富", perDay: "4–5 个活动", walk: "约 11000 步/天", budget: 6800, risk: ["超出预算 ¥800", "午休时间被压缩"], note: "增加西溪湿地与九溪，步行强度明显上升。" }
    ],
    "cd-cq-friends": [
      { id: "a", name: "方案 A · 均衡", pace: "适中", perDay: "4 个活动", walk: "约 12000 步/天", budget: 9000, risk: ["11-08 高铁时间固定"], note: "成都 3 天、重庆 2 天。" },
      { id: "b", name: "方案 B · 夜宵优先", pace: "丰富", perDay: "4 个活动 + 夜宵", walk: "约 12000 步/天", budget: 9600, risk: ["超出预算 ¥600"], note: "白天减少安排，夜间活动增加。" }
    ]
  },

  planDays: {
    "hz-family": [
      {
        date: "2026-10-17",
        label: "10月17日 周六",
        city: "杭州",
        items: [
          { time: "08:00", title: "高铁抵达杭州东站", type: "交通", locked: true, status: "已确认订单", statusKind: "ok" },
          { time: "09:30", title: "酒店寄存行李", type: "住宿", locked: false, status: "演示内容", statusKind: "demo" },
          { time: "10:30", title: "西湖 · 断桥与白堤漫步", type: "景点", locked: false, status: "演示内容", statusKind: "demo" },
          { time: "12:00", title: "孤山路杭帮菜馆午餐", type: "餐饮", locked: false, status: "参考费用待核实", statusKind: "warn" },
          { time: "13:00", title: "回酒店午休", type: "休息", locked: true, status: "硬性条件", statusKind: "lock" },
          { time: "15:30", title: "河坊街与南宋御街", type: "景点", locked: false, status: "演示内容", statusKind: "demo" },
          { time: "18:00", title: "夜市小吃", type: "餐饮", locked: false, status: "演示内容", statusKind: "demo" }
        ]
      },
      {
        date: "2026-10-18",
        label: "10月18日 周日",
        city: "杭州",
        conflict: "计划包含灵隐寺与 16:00 博物馆预约，两者通勤与排队时间相加超过可用时间，需要删减或分头行动。",
        items: [
          { time: "08:30", title: "灵隐寺", type: "景点", locked: false, status: "开放信息待核实", statusKind: "warn" },
          { time: "11:30", title: "午餐（灵隐周边）", type: "餐饮", locked: false, status: "演示内容", statusKind: "demo" },
          { time: "13:00", title: "午休", type: "休息", locked: true, status: "硬性条件", statusKind: "lock" },
          { time: "16:00", title: "浙江省博物馆预约", type: "景点", locked: true, status: "已确认预约（演示）", statusKind: "ok" },
          { time: "18:30", title: "晚餐 · 杭帮菜", type: "餐饮", locked: false, status: "演示内容", statusKind: "demo" }
        ]
      },
      {
        date: "2026-10-19",
        label: "10月19日 周一",
        city: "杭州",
        items: [
          { time: "06:30", title: "前往千岛湖（路亚与垂钓体验）", type: "活动", locked: false, status: "准入条件待核实", statusKind: "warn" },
          { time: "13:00", title: "午餐与休息", type: "休息", locked: true, status: "硬性条件", statusKind: "lock" },
          { time: "16:00", title: "返程杭州东站", type: "交通", locked: true, status: "已确认订单（演示）", statusKind: "ok" }
        ]
      }
    ],
    "cd-cq-friends": [
      {
        date: "2026-11-06",
        label: "11月6日 周五",
        city: "成都",
        items: [
          { time: "11:00", title: "抵达成都", type: "交通", locked: true, status: "已确认订单（演示）", statusKind: "ok" },
          { time: "14:00", title: "宽窄巷子", type: "景点", locked: false, status: "演示内容", statusKind: "demo" },
          { time: "19:00", title: "火锅晚餐", type: "餐饮", locked: false, status: "演示内容", statusKind: "demo" }
        ]
      },
      {
        date: "2026-11-08",
        label: "11月8日 周日",
        city: "成都 → 重庆",
        items: [
          { time: "09:00", title: "成都东站出发", type: "交通", locked: true, status: "已出票（演示）", statusKind: "ok" },
          { time: "11:30", title: "抵达重庆，入住", type: "住宿", locked: false, status: "价格待核实", statusKind: "warn" },
          { time: "17:00", title: "解放碑与洪崖洞", type: "景点", locked: false, status: "演示内容", statusKind: "demo" }
        ]
      }
    ]
  },

  library: {
    "hz-family": [
      { id: "l1", kind: "文字", title: "西湖一日游笔记", detail: "从朋友处复制的行程笔记", status: "ok", statusText: "已解析", items: ["断桥", "苏堤", "楼外楼"] },
      { id: "l2", kind: "截图", title: "博物馆预约截图", detail: "含姓名与手机号，已遮盖", status: "ok", statusText: "已确认", items: ["预约时间 16:00", "入馆凭证"] },
      { id: "l3", kind: "链接", title: "亲子杭州攻略（外部链接）", detail: "尚未解析正文，仅保留链接", status: "warn", statusText: "未解析", items: [] },
      { id: "l4", kind: "文字", title: "千岛湖钓鱼经验帖", detail: "含个人经验与不确定信息", status: "warn", statusText: "待确认", items: ["路亚装备", "季节说法（未核实）"] }
    ],
    "cd-cq-friends": [
      { id: "l1", kind: "文字", title: "成都吃喝清单", detail: "朋友推荐", status: "ok", statusText: "已解析", items: ["火锅", "串串"] }
    ]
  },

  orders: {
    "hz-family": [
      {
        id: "o1", type: "交通", title: "高铁 G1234 北京南 → 杭州东",
        when: "10-17 08:00", status: "ok", statusText: "已确认",
        source: "手动录入", detail: "4 张票，含儿童票",
        updated: "2026-10-02 10:12", sensitive: "身份信息已遮盖", docs: true
      },
      {
        id: "o2", type: "住宿", title: "西湖东侧酒店（示例）",
        when: "10-17 至 10-20，共 3 晚", status: "warn", statusText: "价格待核实",
        source: "截图导入", detail: "含预订号（已遮盖），价格未在截图中体现",
        updated: "2026-10-03 21:40", sensitive: "敏感字段已遮盖", docs: false
      },
      {
        id: "o3", type: "门票", title: "浙江省博物馆预约（之江馆）",
        when: "10-18 16:00", status: "ok", statusText: "已确认",
        source: "截图导入", detail: "4 人预约，属硬性安排",
        updated: "2026-10-02 09:05", sensitive: "姓名与手机号已遮盖", docs: true
      },
      {
        id: "o4", type: "餐饮", title: "杭帮菜馆取号提醒（示例）",
        when: "10-17 12:00", status: "warn", statusText: "时间待确认",
        source: "手动录入", detail: "仅记录计划到店时间，未预约",
        updated: "2026-10-04 08:20", sensitive: "无敏感字段", docs: false
      }
    ],
    "cd-cq-friends": [
      { id: "o1", type: "交通", title: "高铁 成都东 → 重庆北", when: "11-08 09:00", status: "ok", statusText: "已出票（演示）", source: "手动录入", detail: "3 张票", updated: "2026-10-01 12:00", sensitive: "身份信息已遮盖", docs: true },
      { id: "o2", type: "住宿", title: "解放碑附近酒店（示例）", when: "11-08 至 11-10", status: "warn", statusText: "价格待核实", source: "手动录入", detail: "2 晚，价格区间未确认", updated: "2026-10-03 19:30", sensitive: "无敏感字段", docs: false }
    ]
  },

  importSample: {
    fields: [
      { key: "类型", value: "住宿", sensitive: false },
      { key: "名称", value: "西湖东侧酒店（示例）", sensitive: false },
      { key: "入住", value: "2026-10-17", sensitive: false },
      { key: "离店", value: "2026-10-20", sensitive: false },
      { key: "预订号", value: "DM-8823-****", sensitive: true },
      { key: "联系人", value: "张**", sensitive: true },
      { key: "手机号", value: "138****6688", sensitive: true },
      { key: "金额", value: "未识别到", sensitive: false }
    ],
    duplicateOf: "o2",
    duplicateNote: "检测到与已有订单可能重复：同为 10-17 至 10-20 的住宿预订。"
  },

  expenses: {
    "hz-family": {
      budget: { total: 6000, spent: 1860 },
      items: [
        { id: "e1", title: "高铁票 4 张", amount: 1200, payer: "我", share: "全员均摊", kind: "actual", source: "已确认订单" },
        { id: "e2", title: "酒店定金", amount: 600, payer: "爱人", share: "全员均摊", kind: "actual", source: "截图导入" },
        { id: "e3", title: "打车（机场 → 酒店）", amount: 60, payer: "我", share: "全员均摊", kind: "actual", source: "手动记录" },
        { id: "e4", title: "门票退款（示例）", amount: -120, payer: "我", share: "已按均摊更正", kind: "refund", source: "手动记录" },
        { id: "e5", title: "餐饮与门票（预算估算）", amount: 2400, payer: "—", share: "全员均摊", kind: "estimate", source: "预算估算" }
      ],
      settle: [
        { from: "我", to: "爱人", amount: 300, at: "2026-10-03", note: "手动登记已结清" }
      ],
      shares: [
        { name: "我", paid: 1140, should: 435, diff: 705 },
        { name: "爱人", paid: 600, should: 435, diff: 165 },
        { name: "童童", paid: 0, should: 435, diff: -435 },
        { name: "外婆", paid: 0, should: 435, diff: -435 }
      ]
    },
    "cd-cq-friends": {
      budget: { total: 9000, spent: 4200 },
      items: [
        { id: "e1", title: "高铁票 3 张", amount: 900, payer: "阿哲", share: "全员均摊", kind: "actual", source: "已确认订单" },
        { id: "e2", title: "成都住宿 3 晚", amount: 2400, payer: "我", share: "全员均摊", kind: "actual", source: "手动记录" },
        { id: "e3", title: "火锅晚餐", amount: 900, payer: "小林", share: "指定成员：我、阿哲", kind: "actual", source: "手动记录" }
      ],
      settle: [],
      shares: [
        { name: "我", paid: 2400, should: 1100, diff: 1300 },
        { name: "阿哲", paid: 900, should: 1550, diff: -650 },
        { name: "小林", paid: 900, should: 1550, diff: -650 }
      ]
    }
  },

  checklist: {
    "hz-family": [
      { id: "c1", title: "身份证 ×4", group: "证件", owner: "我", done: true },
      { id: "c2", title: "儿童常用药与退烧贴", group: "健康", owner: "爱人", done: false },
      { id: "c3", title: "外婆血压药（带足天数）", group: "健康", owner: "爱人", done: true },
      { id: "c4", title: "雨具与防滑鞋", group: "行李", owner: "我", done: false },
      { id: "c5", title: "充电宝与转换线", group: "行李", owner: "爱人", done: true },
      { id: "c6", title: "儿童推车（可选）", group: "行李", owner: "待分配", done: false }
    ],
    "cd-cq-friends": [
      { id: "c1", title: "身份证", group: "证件", owner: "我", done: true },
      { id: "c2", title: "常用药", group: "健康", owner: "阿哲", done: false }
    ]
  },

  emergency: {
    "hz-family": {
      contacts: [
        { label: "酒店前台（示例）", value: "0571-****1234", note: "演示号码" },
        { label: "同行者 爱人", value: "138****6688", note: "演示号码" }
      ],
      address: "上城区 · 西湖东侧酒店（示例）",
      nearby: [
        { label: "最近医院（示例）", distance: "约 1.8 公里", status: "warn", statusText: "距离与开放时间待核实" },
        { label: "派出所（示例）", distance: "约 2.3 公里", status: "demo", statusText: "演示内容" }
      ]
    },
    "cd-cq-friends": {
      contacts: [{ label: "同行者 阿哲", value: "139****0000", note: "演示号码" }],
      address: "渝中区 · 解放碑附近酒店（示例）",
      nearby: [{ label: "最近医院（示例）", distance: "约 1.2 公里", status: "demo", statusText: "演示内容" }]
    }
  },

  weather: {
    "hz-family": [
      { date: "2026-10-17", label: "10月17日", temp: "18–24℃", text: "多云", status: "demo", statusText: "演示数据", hint: "适合户外，早晚偏凉。" },
      { date: "2026-10-18", label: "10月18日", temp: "17–22℃", text: "小雨", status: "demo", statusText: "演示数据", hint: "安排室内为主，携带雨具。" },
      { date: "2026-10-19", label: "10月19日", temp: "—", text: "尚不可预报", status: "warn", statusText: "超出预报范围", hint: "接近出发后再查看；先准备室内外备选。" }
    ]
  },

  reminders: [
    { id: "r1", label: "出发前 1 天提醒", time: "10-16 20:00", channel: "网页提醒 + 日历导出", status: "ok", statusText: "已设置" },
    { id: "r2", label: "博物馆预约提前 2 小时", time: "10-18 14:00", channel: "网页提醒", status: "ok", statusText: "已设置" },
    { id: "r3", label: "酒店免费取消截止提醒", time: "未知", channel: "—", status: "warn", statusText: "截止时间待核实" }
  ],

  mapRoute: {
    "hz-family": {
      day: "10月17日",
      stops: [
        { name: "酒店", x: 22, y: 74 },
        { name: "断桥", x: 40, y: 52 },
        { name: "苏堤", x: 58, y: 40 },
        { name: "午餐", x: 68, y: 58 },
        { name: "河坊街", x: 46, y: 78 }
      ],
      legs: [
        { from: "酒店", to: "断桥", mode: "步行", time: "18 分钟", cost: "—" },
        { from: "断桥", to: "苏堤", mode: "步行", time: "35 分钟", cost: "—" },
        { from: "苏堤", to: "午餐", mode: "打车", time: "12 分钟", cost: "约 ¥18（估算）" },
        { from: "午餐", to: "河坊街", mode: "地铁 1 号线", time: "25 分钟", cost: "约 ¥4（估算）" }
      ]
    }
  },

  review: {
    "hz-family": {
      photos: ["西湖", "河坊街", "博物馆", "小吃", "合照", "夜景"],
      note: "童童最喜欢的是河坊街的小吃，博物馆里的瓷器展看了很久。外婆走累了在中途休息了两次，节奏还算合适。",
      rating: 4,
      ratingNote: "交通与住宿都顺利，灵隐寺那天时间安排偏紧。",
      total: 5860,
      visibility: "私密（仅受邀成员可见）"
    }
  },

  settings: {
    account: { email: "demo@example.com", sync: "开启（演示）", devices: ["这台电脑", "手机（演示）"] },
    offline: [
      { trip: "杭州亲子三日游", version: "v12", savedAt: "2026-10-04 09:20", size: "约 1.2 MB", note: "含行程、地址、订单摘要与应急联系人" },
      { trip: "成都重庆朋友行", version: "v3", savedAt: "2026-10-01 18:05", size: "约 0.8 MB", note: "版本较旧，联网后建议更新" }
    ],
    uploads: [
      { label: "订单截图识别（OCR）", scope: "仅上传用户选择的截图", masked: true, status: "demo", statusText: "演示，未接入" },
      { label: "AI 行程建议", scope: "仅上传行程与偏好，不上传证件与订单原件", masked: true, status: "demo", statusText: "演示，未接入" }
    ]
  }
};
