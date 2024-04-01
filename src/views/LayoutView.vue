<template>
    <el-container class="layout-view-container">
        <el-aside class="aside-layout-container">
            <!-- 菜单 -->
            <el-menu router :default-active="menuIndex">
                <!-- 图标 -->
                <div class="icon-container">
                    <el-image src="../../src/assets/img/logo.png"/>
                </div>
                <template 
                    v-for="(item, index) in menu"
                >
                    <el-sub-menu 
                        :key="item.menuId"
                        :index="item.menuId"
                        v-if="item.childrenMenu.length != 0"
                    >
                        <template #title>
                            <el-icon>
                                <component  
                                    v-if="item.menuIcon" 
                                    :is="item.menuIcon"
                                />
                            </el-icon>
                            <span>{{ item.menuName }}</span>
                        </template>
                        
                        <el-menu-item 
                            :key="index"
                            :index="itemChildren.routerPath"
                            @click="routerViewEvent(itemChildren.routerPath)"
                            v-for="(itemChildren, index) in item.childrenMenu"
                        >
                            <el-icon>
                                <component  
                                    v-if="itemChildren.menuIcon" 
                                    :is="itemChildren.menuIcon"
                                />
                            </el-icon>
                            <span>{{ itemChildren.menuName }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item 
                        v-else
                        :key="index"
                        :index="item.routerPath"
                        @click="routerViewEvent(item.routerPath)"
                    >
                        <el-icon>
                            <component  
                                v-if="item.menuIcon" 
                                :is="item.menuIcon"
                            />
                        </el-icon>
                        <span>{{ item.menuName }}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-aside>
        
        <el-container class="body-view-container">
            <el-header class="header-layout-container">
                <el-card class="header-card-container">
                    <div class="header-card-content">
                        <!-- 下拉菜单 -->
                        <div class="user-menu-container">
                            <el-dropdown>
                                <div class="user-base-info-container">
                                    <el-avatar 
                                        :size="45"
                                        :src="admin.userAvatar"
                                    />
                                    <div class="user-name-container">
                                        <div class="user-name">{{ admin.nickname }}</div>
                                        <el-icon class="icon-arrow-down"><ArrowDown /></el-icon>
                                    </div>
                                </div>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="routerUserInfo">个人中心</el-dropdown-item>
                                        <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                </el-card>
            </el-header>
            <el-main>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="item.path" v-for="(item, index) in breadcrumbList" :key="index">
                        {{ item.name }}
                    </el-breadcrumb-item>
                </el-breadcrumb>

                <RouterView />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import router from '@/router';
import { useRoute } from 'vue-router';
import { RouterView } from 'vue-router';
import { adminLogout } from '@/api/login';
import { ref, watch, onMounted  } from 'vue'
import { showAsideMenu } from '@/api/menu';
import { adminStore } from '@/stores/admin';
import { breadcrumbListChange } from '@/global';

// 菜单参数
const menu = ref()
// 选中路由
const menuIndex = ref()
// 路由信息
const route = useRoute()
// 管理员参数
const admin = adminStore()
// 面包屑数据
const breadcrumbList = ref()
// 面包屑转换
const change = breadcrumbListChange
// 初始化面包屑数据
const initBreadcrumbList = () => {
    breadcrumbList.value = route.matched
    menuIndex.value = route.fullPath

    for(let i = 0; i < change.length; i++ ) {
        for(let j = 0; j < route.matched.length; j++ ) {
            if (change[i].routerPath === route.matched[j].path) {
                breadcrumbList.value[j].name = change[i].name
            }
        }
    }
}

 
// 监听 
watch(
    route, 
    () => {
        initBreadcrumbList()
    },
    {
        deep: true,
        immediate: true
    }
)

// 挂载函数  
onMounted(() => {
    // 加载菜单
    loadMenu()
})

// 登出   
function logout() {
    adminLogout().then(response => {
        if (response.data.code === 200) {
            ElMessage.success('登出成功')
            admin.resetParams()
            router.push({
                path: '/login'
            })
        } else {
            ElMessage.error('登出失败')
        }
    })
    
}

// 加载菜单 
function loadMenu() {
    showAsideMenu().then(response => {
        if (response.data.code === 200) {
            menu.value = response.data.data
        }
    })
}

// 个人中心
function routerUserInfo() {
    console.log(123)
    router.push({
        path: '/userInfo'
    })
}

// 路由视图事件  
function routerViewEvent(routerPath: any) {
    router.push({
        path: routerPath
    })
}
</script>

<style lang="less" scoped>
// 布局视图容器
.layout-view-container {

    // 顶部布局布满
    :deep(.el-header) {
        --el-header-padding: 0;
    }

    // 侧边布局容器
    .aside-layout-container {
        width: 12vw;
        height: 100vh;
        text-align: center;

        // 导航栏菜单
        .el-menu {
            width: 100%;
            height: 100%;
            text-align: center;
            border-bottom: none;
            background-color: #fff;
            background-color: #374955;

            // 图标容器
            .icon-container {
                width: 8vw;
                height: 7vh;
                margin-left: 1.8vw;
                padding-bottom: 1vh;

                // 图标
                .el-image {
                    width: 100%;
                }
            }

        
            // 平台图标
            img {
                width: 6rem;
                height: 3rem;
                margin-right: 1rem;
                margin-left: 13.5rem;
            }

            // 导航栏元素
            .el-menu-item {
                transition: none;
                color: #ffbe61 !important;
                
            }

            :deep(.el-sub-menu) {

                .el-menu-item {
                    background-color: #374955;
                }
            }

            // 导航栏元素(有子菜单的)
            :deep(.el-sub-menu__title) {
                transition: none;
                color: #ffbe61 !important;
            }

            // 导航栏元素(有子菜单的悬停)
            :deep(.el-sub-menu__title:hover) {
                color: #ffbe61 !important;
                background-color:  #8D7257;
            }

            // 导航栏元素(悬停)
            .el-menu-item:hover {
                color: #ffbe61 !important;
                background-color:  #8D7257;
            }

            // 导航栏元素(聚焦)
            .el-menu-item:focus {
                background-color:  #1e2f39; 
            }

            // 导航栏元素(激活)
            .el-menu-item.is-active {
                color: #677987 !important;
                background-color:  #1e2f39; 
            }

        }
    }

    // 主体布局容器
    .body-view-container {
        height: 100vh;
            
        // 头部布局容器
        .header-layout-container {
            height: 7.5vh;
            margin-bottom: 0.3vh;
            

            // 卡片顶部
            :deep(.el-card__body) {
                padding-top: 0;
            }

            // 头部卡片容器
            .header-card-container {
                height: 100%;
                
                // 卡片内容
                .header-card-content {
                    display: flex;
                    justify-content: right;

                    // 下拉容器
                    .user-menu-container {
                        font-size: 14px;
                        margin-top: 1.5vh;
                        cursor: pointer;
                        text-align: right;

                        // 通知图标
                        .icon-bell {
                            margin-top: 0.3rem;
                        }

                        // 用户信息容器
                        .user-base-info-container {
                            display: flex;
                            align-items: center;
                            margin-left: 1.5rem;

                            // 用户名称容器
                            .user-name-container {
                                display: flex;
                                font-size: 12px;
                                margin-left: 0.6rem;
                                
                                // 下拉图标容器
                                .icon-arrow-down {
                                    margin-left: 0.2rem;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 主体布局容器
        .el-main {
            height: 100%;

            // 面包屑容器
            .el-breadcrumb {
                margin-bottom: 2vh;
            }
        }
    }
}

// 面包屑文本颜色
:deep(.el-breadcrumb__inner.is-link) {
    color: #ffa200 !important;
}
</style>