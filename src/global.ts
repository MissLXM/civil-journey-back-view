// 全局 TS 设置
export const breadcrumbListChange = ([
    {
        name: '主页',
        routerPath: '/layout',
    },
    {
        name: '首页',
        routerPath: '/home',
    },
    {
        name: '个人中心',
        routerPath: '/userInfo',
    },
    {
        name: '人员管理',
        routerPath: '/person',
    },
    {
        name: '用户管理',
        routerPath: '/person/user',
    },
    {
        name: '讲师管理',
        routerPath: '/person/teacher',
    },
    {
        name: '管理员管理',
        routerPath: '/person/admin',
    },
    {
        name: '讲师审批管理',
        routerPath: '/person/teacherApply',
    },
    {
        name: '登录日志管理',
        routerPath: '/person/loginLog',
    },
    {
        name: '文章管理',
        routerPath: '/article',
    },
    {
        name: '所有文章管理',
        routerPath: '/article/all',
    },
    {
        name: '文章审批管理',
        routerPath: '/article/apply',
    },
    {
        name: '文章详情页',
        routerPath: '/articleInfo/:articleInfo',
    },
    {
        name: '课程管理',
        routerPath: '/course',
    },
    {
        name: '所有课程管理',
        routerPath: '/course/all',
    },
    {
        name: '课程审批管理',
        routerPath: '/course/apply',
    },
    {
        name: '权限管理',
        routerPath: '/authority',
    },
    {
        name: '分类权限管理',
        routerPath: '/authority/zone',
    },
    {
        name: '菜单权限管理',
        routerPath: '/authority/menu',
    },
    {
        name: '角色权限管理',
        routerPath: '/authority/role',
    },
    {
        name: '勋章权限管理',
        routerPath: '/authority/medal',
    },
    {
        name: '订单管理',
        routerPath: '/order',
    },
    {
        name: '通知管理',
        routerPath: '/message',
    },
    {
        name: '资讯管理',
        routerPath: '/technical',
    },
    {
        name: '反馈管理',
        routerPath: '/feedback',
    },
    {
        name: '在线客服',
        routerPath: '/onlineCustom',
    },
    {
        name: '轮播图管理',
        routerPath: '/carousel',
    },
    {
      name: '考试时间管理',
      routerPath: '/exam',
  },

])

// 所有省份
export const allCityOnChina = ([
    {
        name: '北京'
    },
    {
        name: '天津'
    },
    {
        name: '上海'
    },
    {
        name: '重庆'
    },
    {
        name: '河北'
    },
    {
        name: '山西'
    },
    {
        name: '辽宁'
    },
    {
        name: '吉林'
    },
    {
        name: '黑龙江'
    },
    {
        name: '江苏'
    },
    {
        name: '浙江'
    },
    {
        name: '安徽'
    },
    {
        name: '福建'
    },
    {
        name: '江西'
    },
    {
        name: '山东'
    },
    {
        name: '河南'
    },
    {
        name: '湖北'
    },
    {
        name: '湖南'
    },
    {
        name: '广东'
    },
    {
        name: '广西'
    },
    {
        name: '海南'
    },
    {
        name: '四川'
    },
    {
        name: '贵州'
    },
    {
        name: '云南'
    },
    {
        name: '西藏'
    },
    {
        name: '陕西'
    },
    {
        name: '甘肃'
    },
    {
        name: '青海'
    },
    {
        name: '宁夏'
    },
    {
        name: '新疆'
    },
    {
        name: '香港'
    },
    {
        name: '澳门'
    },
    {
        name: '台湾'
    }
])

// 字段判空
export function isNotEmpty(str: any) {
    if (str === undefined || str === null || str === '') {
        return false
    } else {
        return true
    }
}

// 表格自适应
export function flexColumnWidth(str: any, arr1: any, flag = 'max') {
    str = str + ''
    let columnContent = ''
    if (!arr1 || !arr1.length || arr1.length === 0 || arr1 === undefined) {
      return '80px' // 给个默认的
    }
    if (!str || !str.length || str.length === 0 || str === undefined) {
      return '80px' // 给个默认的
    }
    if (flag === 'equal') {
      // 获取该列中第一个不为空的数据(内容)
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i][str].length > 0) {
          // console.log('该列数据[0]:', arr1[0]['obj1']['string'])
          columnContent = arr1[i][str]
          break
        }
      }
    } else {
      // 获取该列中最长的数据(内容)
      let index = 0
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i][str] === null) {
          return
        }
        const now_temp = arr1[i][str] + ''
        const max_temp = arr1[index][str] + ''
        if (now_temp.length > max_temp.length) {
          index = i
        }
      }
      columnContent = arr1[index][str]
    }
    // console.log('该列数据[i]:', columnContent)
    // 以下分配的单位长度可根据实际需求进行调整
    let flexWidth = 0
    for (const char of columnContent) {
      if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
        // 如果是英文字符，为字符分配8个单位宽度
        flexWidth += 8
      } else if (char >= '\u4e00' && char <= '\u9fa5') {
        // 如果是中文字符，为字符分配15个单位宽度
        flexWidth += 15
      } else {
        // 其他种类字符，为字符分配8个单位宽度
        flexWidth += 8
      }
    }
    if (flexWidth < 80) {
      // 设置最小宽度
      flexWidth = 80
    }

    // 可以再多留部分的padding
    flexWidth += 30
    return flexWidth + 'px'
}
