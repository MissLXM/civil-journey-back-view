import { ref } from 'vue'
import router from '@/router'
import { defineStore } from 'pinia'

export const adminStore = defineStore('admin',
    () => {
        const adminId = ref()
        const username = ref()
        const nickname = ref()
        const userAvatar = ref()
        const isLogin = ref(false)
        const isSuperAdmin = ref(false)

        const tokenName = ref()
        const tokenValue = ref()

        // 登录界面
        function routerLogin() {
            router.push({
                path: '/login'
            })
        }

        // 重置参数
        function resetParams() {
            isLogin.value = false
            adminId.value = undefined
            isSuperAdmin.value = false
            username.value = undefined
            nickname.value = undefined
            tokenName.value = undefined
            userAvatar.value = undefined
            tokenValue.value = undefined
        }

        return { 
            adminId,
            isLogin,
            username,
            nickname,
            userAvatar,
            isSuperAdmin,
            
            tokenName,
            tokenValue,

            resetParams,
            routerLogin
        }
    },
    {
        persist: {
            storage: sessionStorage
        }
    }
)