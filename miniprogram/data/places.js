/* Names and numbered locations transcribed from the UNNC official 2025-10-16 map.
   x/y are PDF illustration percentages, not GPS coordinates. */
const categories = [
{id:'all',name:'全部',symbol:''},{id:'study',name:'教学',symbol:''},
{id:'residence',name:'宿舍',symbol:''},{id:'life',name:'生活',symbol:''},
{id:'sport',name:'运动',symbol:''},{id:'sight',name:'景观',symbol:''}
];
const places = [
  {
    "id": "trent",
    "code": "1",
    "name": "行政楼",
    "en": "Trent Building (TRENT)",
    "category": "study",
    "alias": "trent 钟楼 clock tower",
    "sourceX": 1277.038,
    "sourceY": 978.756,
    "x": 23.8054,
    "y": 22.3072,
    "mapLabel": "行政楼",
    "major": true,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 1",
    "description": "校方 2025 年 10 月 16 日版地图名称为「行政楼」，编号为 1。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 1",
      "2025.10 版地图"
    ],
    "hasChildren": true
  },
  {
    "id": "pmb",
    "code": "2",
    "name": "理工楼",
    "en": "The Sir Peter Mansfield Building (PMB)",
    "category": "study",
    "alias": "pmb 理工 mansfield 曼斯菲尔德",
    "sourceX": 1448.585,
    "sourceY": 1635.292,
    "x": 30.5328,
    "y": 48.9956,
    "mapLabel": "理工楼",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 2",
    "description": "校方 2025 年 10 月 16 日版地图名称为「理工楼」，编号为 2。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 2",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "tb",
    "code": "3",
    "name": "杨福家楼",
    "en": "YANG Fujia Building",
    "category": "study",
    "alias": "tb 教学楼 yang fujia",
    "sourceX": 1640.064,
    "sourceY": 1475.544,
    "x": 38.0417,
    "y": 42.5018,
    "mapLabel": "杨福家楼",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 3",
    "description": "校方 2025 年 10 月 16 日版地图名称为「杨福家楼」，编号为 3。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 3",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "auditorium",
    "code": "4",
    "name": "思源报告厅",
    "en": "Auditorium",
    "category": "study",
    "alias": "audi auditorium 思源",
    "sourceX": 1763.363,
    "sourceY": 1409.501,
    "x": 42.877,
    "y": 39.8171,
    "mapLabel": "思源报告厅",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 4",
    "description": "校方 2025 年 10 月 16 日版地图名称为「思源报告厅」，编号为 4。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 4",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "pb",
    "code": "5",
    "name": "学生服务楼",
    "en": "The Portland Building (PB)",
    "category": "life",
    "alias": "pb portland",
    "sourceX": 1869.684,
    "sourceY": 1317.725,
    "x": 47.0464,
    "y": 36.0864,
    "mapLabel": "学生服务楼",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 5",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生服务楼」，编号为 5。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 5",
      "2025.10 版地图"
    ],
    "hasChildren": true
  },
  {
    "id": "library",
    "code": "6",
    "name": "李达三叶耀珍伉俪李本俊图书馆",
    "en": "Li Dak Sum Yip Yio Chin Kenneth Li Library",
    "category": "study",
    "alias": "图书馆 library lib 自习",
    "sourceX": 2051.329,
    "sourceY": 1055.895,
    "x": 54.1698,
    "y": 25.4429,
    "mapLabel": "图书馆",
    "shortName": "图书馆",
    "shortEn": "Library",
    "major": true,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 6",
    "description": "校方 2025 年 10 月 16 日版地图名称为「李达三叶耀珍伉俪李本俊图书馆」，编号为 6。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 6",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "hotel",
    "code": "7",
    "name": "教师宾馆",
    "en": "Staff Hotel",
    "category": "life",
    "alias": "hotel 教师 宾馆",
    "sourceX": 2228.554,
    "sourceY": 752.965,
    "x": 61.1198,
    "y": 13.1287,
    "mapLabel": "教师宾馆",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 7",
    "description": "校方 2025 年 10 月 16 日版地图名称为「教师宾馆」，编号为 7。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 7",
      "2025.10 版地图"
    ],
    "hasChildren": true
  },
  {
    "id": "canteen",
    "code": "8",
    "name": "学生餐厅",
    "en": "Student Canteen",
    "category": "life",
    "alias": "食堂 餐饮 吃饭 canteen food",
    "sourceX": 2538.271,
    "sourceY": 808.025,
    "x": 73.2655,
    "y": 15.3669,
    "mapLabel": "学生餐厅",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 8",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生餐厅」，编号为 8。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 8",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "villa-9",
    "code": "9",
    "name": "别墅",
    "en": "Villas",
    "category": "residence",
    "alias": "9号 9号楼 villa",
    "sourceX": 2279.225,
    "sourceY": 965.649,
    "x": 63.1069,
    "y": 21.7744,
    "mapLabel": "别墅",
    "major": false,
    "parentId": "",
    "locationHint": "9号楼",
    "subtitle": "官方编号 9 · 9号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「别墅」，编号为 9。图中位置：9号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 9",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "villa-10",
    "code": "10",
    "name": "别墅",
    "en": "Villas",
    "category": "residence",
    "alias": "10号 10号楼 villa",
    "sourceX": 2372.717,
    "sourceY": 894.884,
    "x": 66.7732,
    "y": 18.8977,
    "mapLabel": "别墅",
    "major": false,
    "parentId": "",
    "locationHint": "10号楼",
    "subtitle": "官方编号 10 · 10号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「别墅」，编号为 10。图中位置：10号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 10",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-11",
    "code": "11",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 11号 11号楼",
    "sourceX": 2744.499,
    "sourceY": 862.75,
    "x": 81.3529,
    "y": 17.5915,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "11号楼",
    "subtitle": "官方编号 11 · 11号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 11。图中位置：11号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 11",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-12",
    "code": "12",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 12号 12号楼",
    "sourceX": 2619.007,
    "sourceY": 1076.762,
    "x": 76.4316,
    "y": 26.2911,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "12号楼",
    "subtitle": "官方编号 12 · 12号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 12。图中位置：12号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 12",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-13",
    "code": "13",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 13号 13号楼",
    "sourceX": 2957.472,
    "sourceY": 881.736,
    "x": 89.7048,
    "y": 18.3633,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "13号楼",
    "subtitle": "官方编号 13 · 13号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 13。图中位置：13号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 13",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-14",
    "code": "14",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 14号 14号楼",
    "sourceX": 2919.427,
    "sourceY": 1035.318,
    "x": 88.2128,
    "y": 24.6064,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "14号楼",
    "subtitle": "官方编号 14 · 14号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 14。图中位置：14号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 14",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-15",
    "code": "15",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 15号 15号楼",
    "sourceX": 2880.319,
    "sourceY": 1188.889,
    "x": 86.6792,
    "y": 30.8491,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "15号楼",
    "subtitle": "官方编号 15 · 15号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 15。图中位置：15号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 15",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-16",
    "code": "16",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 16号 16号楼",
    "sourceX": 2556.17,
    "sourceY": 1303.889,
    "x": 73.9675,
    "y": 35.5239,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "16号楼",
    "subtitle": "官方编号 16 · 16号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 16。图中位置：16号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 16",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-17",
    "code": "17",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 17号 17号楼",
    "sourceX": 2520.863,
    "sourceY": 1442.058,
    "x": 72.5829,
    "y": 41.1406,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "17号楼",
    "subtitle": "官方编号 17 · 17号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 17。图中位置：17号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 17",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-18",
    "code": "18",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 18号 18号楼",
    "sourceX": 2482.646,
    "sourceY": 1599.618,
    "x": 71.0842,
    "y": 47.5455,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "18号楼",
    "subtitle": "官方编号 18 · 18号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 18。图中位置：18号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 18",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence",
    "code": "19",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 19号 19号楼",
    "sourceX": 2820.236,
    "sourceY": 1358.177,
    "x": 84.323,
    "y": 37.7308,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "19号楼",
    "subtitle": "官方编号 19 · 19号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 19。图中位置：19号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 19",
      "2025.10 版地图"
    ],
    "hasChildren": true
  },
  {
    "id": "residence-20",
    "code": "20",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 20号 20号楼",
    "sourceX": 2789.01,
    "sourceY": 1510.535,
    "x": 83.0984,
    "y": 43.9242,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "20号楼",
    "subtitle": "官方编号 20 · 20号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 20。图中位置：20号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 20",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-22",
    "code": "22",
    "name": "学生宿舍",
    "en": "Student Residences",
    "category": "residence",
    "alias": "宿舍 寝室 dorm residence 22号 22号楼",
    "sourceX": 2750.81,
    "sourceY": 1665.415,
    "x": 81.6004,
    "y": 50.2201,
    "mapLabel": "学生宿舍",
    "major": false,
    "parentId": "",
    "locationHint": "22号楼",
    "subtitle": "官方编号 22 · 22号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生宿舍」，编号为 22。图中位置：22号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 22",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "sports",
    "code": "21",
    "name": "体育馆",
    "en": "Sir Colin Campbell Building (Sports Centre)",
    "category": "sport",
    "alias": "体育中心 gym sport colin",
    "sourceX": 2479.59,
    "sourceY": 2180.754,
    "x": 70.9643,
    "y": 71.1689,
    "mapLabel": "体育馆",
    "major": true,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 21",
    "description": "校方 2025 年 10 月 16 日版地图名称为「体育馆」，编号为 21。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 21",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residence-23",
    "code": "23",
    "name": "宿舍楼",
    "en": "Residence",
    "category": "residence",
    "alias": "23号 23号楼 学生宿舍 dorm residence",
    "sourceX": 2709.6,
    "sourceY": 1905.117,
    "x": 79.9843,
    "y": 59.9641,
    "mapLabel": "宿舍楼",
    "major": false,
    "parentId": "",
    "locationHint": "23号楼",
    "subtitle": "官方编号 23 · 23号楼",
    "description": "校方 2025 年 10 月 16 日版地图名称为「宿舍楼」，编号为 23。图中位置：23号楼。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 23",
      "2025.10 版地图"
    ],
    "hasChildren": true
  },
  {
    "id": "db",
    "code": "24",
    "name": "新教学楼",
    "en": "The Lord Dearing Building (DB)",
    "category": "study",
    "alias": "db dearing 德林",
    "sourceX": 1473.829,
    "sourceY": 2053.972,
    "x": 31.5227,
    "y": 66.0151,
    "mapLabel": "新教学楼",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 24",
    "description": "校方 2025 年 10 月 16 日版地图名称为「新教学楼」，编号为 24。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 24",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "new-auditorium",
    "code": "25",
    "name": "新报告厅",
    "en": "The D.H. Lawrence Auditorium (New Audi)",
    "category": "study",
    "alias": "new audi lawrence 报告厅",
    "sourceX": 1808.4,
    "sourceY": 1922.547,
    "x": 44.6431,
    "y": 60.6726,
    "mapLabel": "新报告厅",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 25",
    "description": "校方 2025 年 10 月 16 日版地图名称为「新报告厅」，编号为 25。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 25",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "nicc",
    "code": "26",
    "name": "新国际会议中心",
    "en": "New International Conference Centre (NICC)",
    "category": "life",
    "alias": "nicc conference 会议",
    "sourceX": 1876.215,
    "sourceY": 2025.663,
    "x": 47.3026,
    "y": 64.8644,
    "mapLabel": "新国际会议中心",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 26",
    "description": "校方 2025 年 10 月 16 日版地图名称为「新国际会议中心」，编号为 26。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 26",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "staff-apartments",
    "code": "28",
    "name": "教师公寓",
    "en": "Staff Apartments",
    "category": "residence",
    "alias": "教师 公寓 staff apartment",
    "sourceX": 1962.464,
    "sourceY": 586.188,
    "x": 50.6849,
    "y": 6.3491,
    "mapLabel": "教师公寓",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 28",
    "description": "校方 2025 年 10 月 16 日版地图名称为「教师公寓」，编号为 28。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 28",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "iamet",
    "code": "29",
    "name": "海洋经济研究院",
    "en": "Sir David and Lady Susan Greenaway Building (IAMET)",
    "category": "study",
    "alias": "iamet greenaway 海洋",
    "sourceX": 1120.774,
    "sourceY": 1756.077,
    "x": 17.6774,
    "y": 53.9056,
    "mapLabel": "海洋经济研究院",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 29",
    "description": "校方 2025 年 10 月 16 日版地图名称为「海洋经济研究院」，编号为 29。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 29",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "ieb",
    "code": "30",
    "name": "国际创新创业大楼",
    "en": "Innovation and Enterprise Building (IEB)",
    "category": "study",
    "alias": "ieb 创新 创业",
    "sourceX": 1238.148,
    "sourceY": 2215.611,
    "x": 22.2803,
    "y": 72.5858,
    "mapLabel": "国际创新创业大楼",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 30",
    "description": "校方 2025 年 10 月 16 日版地图名称为「国际创新创业大楼」，编号为 30。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 30",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "icc",
    "code": "35",
    "name": "国际会议中心",
    "en": "International Conference Centre (ICC)",
    "category": "life",
    "alias": "icc conference 会议",
    "sourceX": 1876.633,
    "sourceY": 670.819,
    "x": 47.319,
    "y": 9.7894,
    "mapLabel": "国际会议中心",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 35",
    "description": "校方 2025 年 10 月 16 日版地图名称为「国际会议中心」，编号为 35。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 35",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "field",
    "code": "37",
    "name": "Pitch",
    "en": "Pitch",
    "category": "sport",
    "alias": "室外运动场地 操场 足球 跑步 field outdoor pitch",
    "sourceX": 2358.681,
    "sourceY": 2487.226,
    "x": 66.2228,
    "y": 83.6271,
    "mapLabel": "Pitch",
    "major": false,
    "parentId": null,
    "locationHint": "东侧场地",
    "subtitle": "官方编号 37 · 东侧场地",
    "description": "按用户提供的校园称呼标为 Pitch，位于图面右侧、带跑道的运动场。校方 2025 年 10 月 16 日版地图统称「室外运动场地」，编号为 37。标记依据原图面位置，不代表实际入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 37",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "field-west",
    "code": "37",
    "markerText": "3G",
    "name": "3G人造草地",
    "shortName": "3G",
    "en": "3G Artificial Turf",
    "category": "sport",
    "alias": "室外运动场地 球场 人造草坪 足球 field outdoor 3G artificial turf",
    "sourceX": 1919.612,
    "sourceY": 2418.439,
    "x": 49.0044,
    "y": 80.8309,
    "mapLabel": "3G",
    "major": false,
    "parentId": null,
    "locationHint": "西侧场地",
    "subtitle": "官方编号 37 · 西侧场地",
    "description": "按用户提供的校园称呼标为「3G人造草地」，简称 3G，位于图面左侧。校方 2025 年 10 月 16 日版地图统称「室外运动场地」，编号为 37。标记依据原图面位置，不代表实际入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 37",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "garden-south",
    "code": "38",
    "name": "公园",
    "en": "Ornamental Gardens",
    "category": "sight",
    "alias": "花园 garden 公园",
    "sourceX": 1462.738,
    "sourceY": 1282.908,
    "x": 31.0878,
    "y": 34.671,
    "mapLabel": "公园",
    "major": false,
    "parentId": null,
    "locationHint": "南侧园地",
    "subtitle": "官方编号 38 · 南侧园地",
    "description": "校方 2025 年 10 月 16 日版地图名称为「公园」，编号为 38。图中位置：南侧园地。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 38",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "garden-north",
    "code": "38",
    "name": "公园",
    "en": "Ornamental Gardens",
    "category": "sight",
    "alias": "花园 garden 公园",
    "sourceX": 1672.321,
    "sourceY": 1088.793,
    "x": 39.3067,
    "y": 26.7802,
    "mapLabel": "公园",
    "major": false,
    "parentId": null,
    "locationHint": "北侧园地",
    "subtitle": "官方编号 38 · 北侧园地",
    "description": "校方 2025 年 10 月 16 日版地图名称为「公园」，编号为 38。图中位置：北侧园地。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 38",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "admissions",
    "code": "A",
    "name": "招生办",
    "en": "Student Recruitment and Admission Office",
    "category": "life",
    "alias": "招生 admissions",
    "sourceX": 1270.046,
    "sourceY": 1091.708,
    "x": 23.5312,
    "y": 26.8987,
    "mapLabel": "招生办",
    "major": false,
    "parentId": "trent",
    "locationHint": "行政楼内",
    "subtitle": "官方编号 A · 行政楼内",
    "description": "校方 2025 年 10 月 16 日版地图名称为「招生办」，编号为 A。图中位置：行政楼内。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 A",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "museum",
    "code": "B",
    "name": "校史馆",
    "en": "UNNC Museum",
    "category": "sight",
    "alias": "校史 museum",
    "sourceX": 1451.785,
    "sourceY": 857.605,
    "x": 30.6582,
    "y": 17.3823,
    "mapLabel": "校史馆",
    "major": false,
    "parentId": "trent",
    "locationHint": "行政楼内",
    "subtitle": "官方编号 B · 行政楼内",
    "description": "校方 2025 年 10 月 16 日版地图名称为「校史馆」，编号为 B。图中位置：行政楼内。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 B",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "hub",
    "code": "C",
    "name": "学生服务中心",
    "en": "The Hub",
    "category": "life",
    "alias": "hub 学生服务",
    "sourceX": 1824.896,
    "sourceY": 1288.915,
    "x": 45.29,
    "y": 34.9152,
    "mapLabel": "学生服务中心",
    "major": false,
    "parentId": "pb",
    "locationHint": "学生服务楼内",
    "subtitle": "官方编号 C · 学生服务楼内",
    "description": "校方 2025 年 10 月 16 日版地图名称为「学生服务中心」，编号为 C。图中位置：学生服务楼内。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 C",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "la-hotel",
    "code": "D",
    "name": "博雅国际交流中心",
    "en": "LA Hotel",
    "category": "life",
    "alias": "la hotel 博雅",
    "sourceX": 2265.888,
    "sourceY": 707.018,
    "x": 62.5839,
    "y": 11.2609,
    "mapLabel": "博雅国际交流中心",
    "major": false,
    "parentId": "hotel",
    "locationHint": "教师宾馆内",
    "subtitle": "官方编号 D · 教师宾馆内",
    "description": "校方 2025 年 10 月 16 日版地图名称为「博雅国际交流中心」，编号为 D。图中位置：教师宾馆内。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 D",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "residential-hub",
    "code": "E",
    "name": "生活驿站",
    "en": "Residential Hub",
    "category": "life",
    "alias": "生活驿站 residential hub",
    "sourceX": 2783.653,
    "sourceY": 1140.881,
    "x": 82.8884,
    "y": 28.8976,
    "mapLabel": "生活驿站",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 E",
    "description": "校方 2025 年 10 月 16 日版地图名称为「生活驿站」，编号为 E。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 E",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "third-canteen",
    "code": "F",
    "name": "第三餐厅",
    "en": "The Third Canteen",
    "category": "life",
    "alias": "第三 食堂 餐饮 吃饭",
    "sourceX": 2775.555,
    "sourceY": 1404.501,
    "x": 82.5708,
    "y": 39.6139,
    "mapLabel": "第三餐厅",
    "major": false,
    "parentId": "residence",
    "locationHint": "19号楼内",
    "subtitle": "官方编号 F · 19号楼内",
    "description": "校方 2025 年 10 月 16 日版地图名称为「第三餐厅」，编号为 F。图中位置：19号楼内。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 F",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "third-space",
    "code": "G",
    "name": "第三空间（四食堂）",
    "en": "The Third Space",
    "category": "life",
    "alias": "第四 四食堂 食堂 餐饮 吃饭",
    "sourceX": 2817.033,
    "sourceY": 1402.953,
    "x": 84.1974,
    "y": 39.5509,
    "mapLabel": "第三空间（四食堂）",
    "major": false,
    "parentId": "residence",
    "locationHint": "19号楼内",
    "subtitle": "官方编号 G · 19号楼内",
    "description": "校方 2025 年 10 月 16 日版地图名称为「第三空间（四食堂）」，编号为 G。图中位置：19号楼内。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 G",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "health",
    "code": "H",
    "name": "身心健康中心",
    "en": "Health and Wellbeing Centre",
    "category": "life",
    "alias": "诊所 clinic health wellbeing 医疗",
    "sourceX": 2738.888,
    "sourceY": 1870.175,
    "x": 81.1328,
    "y": 58.5437,
    "mapLabel": "身心健康中心",
    "major": false,
    "parentId": "residence-23",
    "locationHint": "23号楼内",
    "subtitle": "官方编号 H · 23号楼内",
    "description": "校方 2025 年 10 月 16 日版地图名称为「身心健康中心」，编号为 H。图中位置：23号楼内。标记依据官方图面定位，不代表实际建筑入口；开放时间和进入要求以学校信息为准。",
    "tags": [
      "官方编号 H",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "gate",
    "code": "G1",
    "name": "1号门",
    "en": "GATE 1",
    "category": "life",
    "alias": "gate 1 校门 1号门",
    "sourceX": 912,
    "sourceY": 958,
    "x": 9.4902,
    "y": 21.4634,
    "mapLabel": "1号门",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 G1",
    "description": "官方地图标注为 GATE 1。点位对照该图手工标注，是否开放及通行要求请以学校信息为准。",
    "tags": [
      "官方编号 G1",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "gate2",
    "code": "G2",
    "name": "2号门",
    "en": "GATE 2",
    "category": "life",
    "alias": "gate 2 校门 2号门",
    "sourceX": 2130,
    "sourceY": 620,
    "x": 57.2549,
    "y": 7.7236,
    "mapLabel": "2号门",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 G2",
    "description": "官方地图标注为 GATE 2。点位对照该图手工标注，是否开放及通行要求请以学校信息为准。",
    "tags": [
      "官方编号 G2",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "gate3",
    "code": "G3",
    "name": "3号门",
    "en": "GATE 3",
    "category": "life",
    "alias": "gate 3 校门 3号门",
    "sourceX": 2850,
    "sourceY": 758,
    "x": 85.4902,
    "y": 13.3333,
    "mapLabel": "3号门",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 G3",
    "description": "官方地图标注为 GATE 3。点位对照该图手工标注，是否开放及通行要求请以学校信息为准。",
    "tags": [
      "官方编号 G3",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "gate4",
    "code": "G4",
    "name": "4号门",
    "en": "GATE 4",
    "category": "life",
    "alias": "gate 4 校门 4号门",
    "sourceX": 3100,
    "sourceY": 825,
    "x": 95.2941,
    "y": 16.0569,
    "mapLabel": "4号门",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方编号 G4",
    "description": "官方地图标注为 GATE 4。点位对照该图手工标注，是否开放及通行要求请以学校信息为准。",
    "tags": [
      "官方编号 G4",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "lake",
    "code": "湖",
    "name": "诺丁汉湖",
    "en": "Nottingham Lake",
    "category": "sight",
    "alias": "湖 lake",
    "sourceX": 1150,
    "sourceY": 755,
    "x": 18.8235,
    "y": 13.2114,
    "mapLabel": "诺丁汉湖",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方地图水系",
    "description": "官方地图标注为 Nottingham Lake。点位表示水域，不代表可通行位置。",
    "tags": [
      "校园水系",
      "2025.10 版地图"
    ],
    "hasChildren": false
  },
  {
    "id": "river",
    "code": "河",
    "name": "诺丁汉河",
    "en": "Nottingham River",
    "category": "sight",
    "alias": "河 river",
    "sourceX": 2030,
    "sourceY": 1580,
    "x": 53.3333,
    "y": 46.748,
    "mapLabel": "诺丁汉河",
    "major": false,
    "parentId": null,
    "locationHint": "",
    "subtitle": "官方地图水系",
    "description": "官方地图标注为 Nottingham River。点位表示水域，不代表可通行位置。",
    "tags": [
      "校园水系",
      "2025.10 版地图"
    ],
    "hasChildren": false
  }
];
const photoServices = require('./photo-services');
for (const [key,name,en,parentId,locationHint,kind,alias] of photoServices) {
 const parent=places.find(p=>p.id===parentId);
 places.push({id:'service-'+key,code:'店',name,en,category:'life',alias,
  x:parent.x,y:parent.y,mapLabel:name,major:false,parentId,locationHint,
  sourceType:'user-photo',approximate:true,
  subtitle:locationHint,
  description:`用户提供的商业街导览牌照片标示「${name}」（${en}）。位置按照片中的楼栋分组或邻近关系录入，地图暂定位到对应楼栋／区域，不代表店铺精确入口。照片未注明日期，营业情况及服务时间请以现场为准。`,
  tags:[kind,'现场导览牌','位置待实测'],hasChildren:false});
 parent.hasChildren=true;
}
const thirdSpace=places.find(p=>p.id==='third-space');
// Compact map labels; official full names stay in search and details.
for(const p of places){
 if(p.category==='residence'){p.mapLabel=/学生宿舍|宿舍楼/.test(p.name)?'Hall '+p.code:p.code==='28'?'Staff':p.name==='别墅'?'Villa '+p.code:p.mapLabel;}
}
for(const [id,label] of Object.entries({trent:'Trent · 行政楼',pmb:'PMB · 理工楼',tb:'3 杨福家楼',auditorium:'4 思源报告厅',pb:'5 学生服务楼',library:'Library · 图书馆',db:'DB · 新教学楼'})){
 places.find(p=>p.id===id).mapLabel=label;
}
const serviceAreas=[
 {id:'canteen',title:'8 · DINING',brands:'McDonald’s · 万诺\nUNNC Taste · 宁诺味道'},
 {id:'residence-12',title:'12 · CAFÉ & SHOPS',brands:'7-Eleven · luckin\nParis Baguette · Pizza Hut'},
 {id:'residence-16',title:'16 · FOOD & TEA',brands:'KFC · CHAGEE\n小灶台 Xiaozaotai'},
 {id:'residence',title:'19 · DINING',brands:'Nolan · 诺兰餐厅\n东城厨房 · 第三空间'}
];
thirdSpace.description+=' 用户提供的商业街导览牌另标示“第三空间（二楼）”；此信息来自未注明日期的现场照片，保留官方图名称供对照。';
const officialMap = 'https://www.nottingham.edu.cn/en/estates/space-management/campus-map.aspx';
function searchPlaces(query, category, ids) {
 const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 return places.filter(p=>(category==='all'||p.category===category) && (!ids||ids.includes(p.id)) && terms.every(t=>{
  const number=t.match(/^(\d+)(?:号(?:楼|宿舍)?)?$/);
  if(number)return p.code===number[1];
  return `${p.name} ${p.en} ${p.alias} ${p.code} ${p.locationHint}`.toLowerCase().includes(t);
 }));
}
// All buildings stay on the overview. Co-located services are available via
// their building detail, and appear individually when filtering/searching.
function mapPlaces(list, category, selected) {
 return list.filter(p=>p.sourceType==='user-photo'
  ? !!selected&&selected.id===p.id
  : !p.parentId||category!=='all'||(selected&&selected.id===p.id));
}
module.exports={categories,places,officialMap,searchPlaces,mapPlaces,serviceAreas};
