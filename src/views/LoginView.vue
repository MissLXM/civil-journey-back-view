<template>
    <div class="background-container">
        <div class="body-container">
            <div class="left-container">
                <!-- 图片布局(上面:平台logo、下面:随便) -->
                <div class="header-image-container">
                    <el-image src="../src/assets/img/logo.png" />
                </div>
                <div class="footer-image-container">
                    <el-image src='../src/assets/img/user.png' />
                </div>
            </div>
            <div class="right-container">
                <!-- 表单 -->
                <el-form 
                    status-icon
                    ref="loginFormRef"
                    :model="loginParams" 
                    :rules="loginFormRules"
                    class="login-form-container"
                >
                    <div class="form-text-container">
                        <span class="title-text">欢迎登录 </span>
                        <span>公途后台管理系统</span>
                    </div>
                    <el-form-item prop="username">
                        <div class="username-container input-container">
                            <el-input 
                                :prefix-icon="User"
                                placeholder="请输入账号"
                                v-model="loginParams.username" 
                            />
                        </div>
                    </el-form-item>
                    <el-form-item prop="password">
                        <div class="password-container input-container">
                            <el-input 
                                show-password
                                type="password"
                                :prefix-icon="Lock"
                                placeholder="请输入密码"
                                v-model="loginParams.password"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item prop="verCode">
                        <div class="input-container"> 
                            <div class="verCode-container">
                                <el-input 
                                    placeholder="验证码"
                                    :prefix-icon="ChatRound"
                                    v-model="loginParams.captchaCode"
                                />
                                <el-image :src="captchaImage" @click="getVerCode"/>
                            </div>
                        </div>
                    </el-form-item>
                    
                    
                    <div class="button-container">
                        <el-button type="primary" :disabled="loading" v-loading="loading" @click="submitForm(loginFormRef)">登录</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { getVerCode } from '@/api/chart';
import { adminLogin } from '@/api/login';
import { adminStore } from '@/stores/admin';
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, ChatRound } from '@element-plus/icons-vue';

// 登录加载
const loading = ref(false)
// 登录参数 
const loginParams = ref({
    // 登录名称
    username: '',
    // 登录密码
    password: '',
    // 验证码
    captchaCode: '',
    // 验证码凭证
    captchaVoucher: '',
})
// 管理员参数
const admin = adminStore()
// 验证码图片
const captchaImage = ref()
// 登录表单属性
const loginFormRef = ref<FormInstance>()
// 登录规则验证
const loginFormRules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入登录名称', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入登录密码', trigger: 'blur' },
    ],
    captchaCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ]
}) 

// 挂载函数 
onMounted(() => {
    // 加载验证码图片
    loadVerCode()
})

// 加载验证码图片 
function loadVerCode() {
    getVerCode().then(response => {
        // 凭证
        loginParams.value.captchaVoucher = response.data.data.captchaVoucher
        // 图形
        captchaImage.value = "data:image/png;base64," + response.data.data.captchaImage
    })
} 

// 提交登录表单      
function submitForm(formRef: any) {
    // 不存在直接返回
    if (!formRef) return
    loading.value = true
    // 验证
    formRef.validate((valid: any, fields: any) => {
        if (valid) {
            // 校验通过(发送请求)
            adminLogin(loginParams.value).then(response => {
                if (response.data.code === 200) {
                    ElMessage.success('登录成功')

                    // 登录信息
                    admin.isLogin = true
                    admin.adminId = response.data.data.loginId
                    admin.username = response.data.data.username
                    admin.nickname = response.data.data.nickname
                    admin.userAvatar = response.data.data.headPortrait

                    admin.tokenName = response.data.data.tokenName
                    admin.tokenValue = response.data.data.tokenValue

                    loading.value = false

                    // 跳转首页
                    router.push({
                        path: '/home'
                    })
                } else {
                    // 重新加载验证码
                    loadVerCode()
                    loading.value = false
                    ElMessage.error(response.data.message)
                }
            })
            
        } else {
            // 校验失败
            console.log('校验失败', fields)
        }
    })
}

</script>

<style lang="less" scoped>
// 背景容器
.background-container {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    background-size: cover;
    justify-content: center;
    background: url('@/assets/img/login-view-bg.jpg') no-repeat center center;

    // 主体布局
    .body-container {
        width: 950px;
        height: 550px;
        display: flex;
        justify-content: space-between;
        border-radius: 3rem 0.5rem 3rem 0.5rem;
        background: url('@/assets/img/login-form-bg.jpg') no-repeat center center;

        // 左边容器
        .left-container {
            width: 440px;

            // 头部图片布局
            .header-image-container {

                .el-image {
                    width: 5vw;             
                    margin: 2vh 2vw;
                }
            }

            // 底部图片布局
            .footer-image-container {
                

                .el-image {
                    width: 20vw;
                    margin-left: 1.5vw;
                }
            }
        }

        // 右边容器
        .right-container {
            width: 500px;

            // 登录表单容器
            .login-form-container {

                // 表单文字布局
                .form-text-container {
                    padding: 8vh 0 6vh 0; 
                    text-align: center;

                    // 标题文字
                    .title-text {
                        font-size: 30px; 
                        font-weight: 520;
                    }
                }

                // 表单元素
                .el-form-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    // 输入框容器
                    .input-container {
                        margin: 0.5vh 0;
                        
                        .el-input {
                            width: 15vw;
                        }
                    }

                    // 验证码容器
                    .verCode-container {
                        width: 15vw;
                        display: flex;
                        justify-content: space-between;

                        // 输入框
                        .el-input {
                            width: 9vw;
                            height: 40px;
                        }

                        // 图片
                        .el-image {
                            width: 105px;
                            height: 40px;
                            border-radius: 0.2rem;
                            background-color: antiquewhite;
                        }
                    }
                }

                // 表单元素
                :deep(.el-form-item__content) {
                    flex: none;
                }

                // 登录按钮容器
                .button-container {
                    display: flex;
                    margin-top: 4vh;
                    justify-content: center;

                    .el-button {
                        width: 15vw;
                    }
                }
            }
        }
    }
    
}

// 加载动画大小
:deep(.el-loading-spinner .circular) {
    width: 1.3rem;
    height: 1.3rem;
    margin-top: 0.7rem;
}

</style>