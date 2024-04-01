<!-- eslint-disable no-irregular-whitespace -->
<template>
    <div class="user-info-view-container">
        <el-card>
            <!-- 用户基本信息 -->
            <div class="user-base-info">
                <div class="user-base-info-text">个人信息</div>
                <!-- 用户基本信息视图 -->
                <div class="user-base-info-view">
                    <!-- 用户基本信息容器 -->
                    <div class="user-base-info-container">
                        <!-- 顶部布局 -->
                        <div class="user-header-container">
                            <!-- 头像容器 -->
                            <div class="user-avatar-container">
                                <div class="user-avatar-text">头　　像:</div>
                                <el-upload
                                    :action="actionUrl"
                                    :data="adminInfoStore"
                                    class="avatar-uploader"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                >
                                    <img 
                                        v-if="admin.headPortrait" 
                                        :src="admin.headPortrait" 
                                    />
                                    <img 
                                        v-else
                                        src= "@/assets/img/defaultAvatar.png"
                                    />
                                </el-upload>
                                <!-- 介绍文本 -->
                                <div class="instruction-text">
                                    <div class="header-title">上传说明:</div>
                                    <div class="footer-title">建议尺寸为100*100px, 支持JPG, JPEG, PNG格式, 限制2M以内</div>
                                </div>
                            </div>
                        </div>
                        <!-- 基本信息容器 -->
                        <div class="user-info-container">
                            <div class="user-info-item">
                                <div class="user-info-item-text">用户邮箱:</div>
                                <el-input 
                                    disabled
                                    v-model="admin.adminEmail"
                                />
                            </div>
                            <!-- 用户信息 -->
                            <div class="user-info-item">
                                <div class="user-info-item-text">性　　别:</div>
                                <el-radio-group 
                                    disabled
                                    v-model="admin.gender" 
                                >
                                    <el-radio label="1">男</el-radio>
                                    <el-radio label="2">女</el-radio>
                                    <el-radio label="3">未知</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="user-info-item">
                                <div class="user-info-item-text">登录名称:</div>
                                <el-input 
                                    disabled
                                    v-model="admin.username"
                                />
                            </div>
                            <div class="user-info-item">
                                <div class="user-info-item-text">用户昵称:</div>
                                <el-input 
                                    disabled
                                    v-model="admin.nickname"
                                />
                            </div>
                            <div class="user-info-signature">         
                                <div class="user-info-item-text">个性签名:</div>
                                <el-input 
                                    :rows="4"
                                    disabled
                                    type="textarea"
                                    v-model="admin.signature"
                                />
                            </div>
                        </div>
                        <!-- 底部布局 -->
                        <div class="user-footer-container">
                            <div class="button-container">
                                <el-button @click="updatePasswordDialog = true">修改密码</el-button>
                                <el-button @click="updateUserInfoEvent()">修改信息</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
    

    <!-- 修改密码弹出框 -->
    <div class="update-password-dialog-container">
        <el-dialog
            v-model="updatePasswordDialog"
        >
            <div class="update-password-title">修改密码</div>
            <div class="update-password-container">
                <div class="update-password-item">
                    <div class="update-password-item-text">密　　码:</div>
                    <el-input 
                        show-password
                        type="password"
                        v-model="updatePassword"
                    />
                </div>
                <div class="update-password-item">
                    <div class="update-password-item-text">确认密码:</div>
                    <el-input 
                        show-password
                        type="password"
                        v-model="updatePasswordConfirm"
                    />
                </div>
            </div>
            <div class="button-container">
                <el-button type="primary" @click="updatePasswordEvent()">确定</el-button>
                <el-button @click="updatePasswordDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>

    <!-- 修改基本信息弹出框 -->
    <div class="update-user-info-dialog-container">
        <el-dialog
            v-model="updateUserInfoDialog"
        >
            <div class="update-user-info-text">修改基本信息</div>
            <div class="update-user-info-container">
                <div class="update-user-info-item-container">
                    <div class="update-user-info-item">
                        <div class="update-user-info-item-text">用户邮箱:</div>
                        <el-input 
                            v-model="updateAdmin.adminEmail"
                        />
                    </div>
                    <!-- 用户信息 -->
                    <div class="update-user-info-item">
                        <div class="update-user-info-item-text">性　　别:</div>
                        <el-radio-group 
                            v-model="updateAdmin.gender" 
                        >
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                            <el-radio label="3">未知</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="update-user-info-item">
                        <div class="update-user-info-item-text">登录名称:</div>
                        <el-input 
                            v-model="updateAdmin.username"
                        />
                    </div>
                    <div class="update-user-info-item">
                        <div class="update-user-info-item-text">用户昵称:</div>
                        <el-input 
                            v-model="updateAdmin.nickname"
                        />
                    </div>
                    <div class="update-user-info-signature">         
                        <div class="update-user-info-item-text">个性签名</div>
                        <el-input 
                            :rows="4"
                            type="textarea"
                            v-model="updateAdmin.signature"
                        />
                    </div>
                </div>
            </div>
            <div class="button-container">
                <el-button type="primary" @click="updateUserInfoOperation()">确定</el-button>
                <el-button @click="updateUserInfoDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminStore } from '@/stores/admin'
import { adminInfo, updateAdminPassword, updateAdminInfo } from '@/api/user';

// 管理员信息
const admin = ref({
    gender: '',
    nickname: '',
    username: '',
    signature: '',
    adminEmail: '',
    headPortrait: '',
    viewVideoNumber: 0,
})
// 修改管理员信息
const updateAdmin = ref({
    gender: '',
    username: '',
    nickname: '',
    signature: '',
    adminEmail: '',
})
const updatePassword = ref()
// 管理员存储信息
const adminInfoStore = adminStore()
const updatePasswordConfirm = ref()
// 弹出框标识
const updatePasswordDialog = ref(false)
const updateUserInfoDialog = ref(false)
// 修改头像地址
const actionUrl = 'http://localhost:8000/user-center-service/backend/admin/updateAdminAvatar'


// 挂载函数
onMounted(() => {
    // 加载用户基本信息
    loadUserInfo()
})

// 加载用户基本信息  
function loadUserInfo() {
    adminInfo().then(response => {
        if (response.data.code === 200) {
            // 基本信息赋值
            admin.value = response.data.data
            adminInfoStore.username = response.data.data.username
            adminInfoStore.nickname = response.data.data.nickname
            
            // 判断性别
            if (response.data.data.gender === '男') {
                admin.value.gender = '1'
            } else if (response.data.data.gender === '女') {
                admin.value.gender = '2'
            } else {
                admin.value.gender = '3'
            }

        } else {
            ElMessage.error('用户信息载入失败')
        }
    })
} 
 
// 修改密码操作事件
function updatePasswordEvent() {
    // 判空
    if (updatePassword.value === '' || updatePassword.value === undefined || updatePassword.value === null) {
        ElMessage.info('请输入密码')
        return 
    }
    // 判断
    if (!(updatePassword.value.length >= 6 && updatePassword.value.length <= 15)) {
        ElMessage.info('密码的有效范围为6-15个字符')
        return
    }
    // 判断两个密码是否相同
    if (updatePassword.value === updatePasswordConfirm.value) {
        // 修改请求
        updateAdminPassword(updatePassword.value).then(response => {
            if (response.data.code === 200) {
                ElMessage.success('修改密码成功')
                // 关闭弹出框
                updatePasswordDialog.value = false
                // 清空用户存储信息
                adminInfoStore.resetParams()
                // 跳转首页
                adminInfoStore.routerLogin() 
            } else {
                ElMessage.error(response.data.message)
            }
        })
    } else {
        ElMessage.info('两次输入的密码不相同')
    }
}

// 修改用户信息事件
function updateUserInfoEvent() {
    // 数据回显
    updateAdmin.value.gender = admin.value.gender
    updateAdmin.value.username = admin.value.username
    updateAdmin.value.nickname = admin.value.nickname
    updateAdmin.value.signature = admin.value.signature
    updateAdmin.value.adminEmail = admin.value.adminEmail

    // 弹出框
    updateUserInfoDialog.value = true
}

// 修改用户信息操作
function updateUserInfoOperation() {
    // 判断性别
    if (updateAdmin.value.gender === '1') {
        updateAdmin.value.gender = '男'
    } else if (updateAdmin.value.gender === '2') {
        updateAdmin.value.gender = '女'
    } else {
        updateAdmin.value.gender = '未知'
    }

    updateAdminInfo(updateAdmin.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success(response.data.message)
            // 更新用户信息
            loadUserInfo()
            // 关闭弹出框
            updateUserInfoDialog.value = false
        } else {
            ElMessage.error(response.data.message)
        }
    })
}

// 上传头像之前的回调函数
function beforeAvatarUpload(file: any) {
    // 判断文件大小
    if ((file.size / 1024 / 1024 ) > 2) {
        ElMessage.info('图片大小不能超过2MB')
        return false;
    }

    // 判断文件类型
    if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
        ElMessage.info('图片格式仅支持jpg、jpeg、png')
        return false;
    }

    return true;
}

// 上传头像成功回调函数
function handleAvatarSuccess(result: any) {
    console.log(result);
    
    // 头像
    admin.value.headPortrait = result.data
    // 用户存储的头像
    adminInfoStore.userAvatar = result.data
} 

</script>

<style lang="less" scoped>
// 用户信息视图
.user-info-view-container {
    height: 70%;

    :deep(.el-card) {
        width: 68rem;
        height: 100%;
    }

    // 用户基本信息
    .user-base-info {
        width: 70rem;
        height: 34rem;
        background-color: #fff;
        // 文本
        .user-base-info-text {
            font-size: 20px;
            font-weight: 600;
            padding-left: 2rem;
            padding-top: 1.5rem;
        }

        // 用户基本信息视图
        .user-base-info-view {
            display: flex;
            color: #333;
            font-size: 13px;
            font-weight: 400;
            line-height: 35px;
            margin-top: 2.5rem;
            font-style: normal;
            align-items: center;
            justify-content: center;
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE软雅黑", Arial;
            // 用户基本信息容器
            .user-base-info-container {
                width: 48rem;
                height: 25rem;

                // 顶部容器
                .user-header-container {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    margin-bottom: 1.5rem;

                    // 头像容器
                    .user-avatar-container {
                        width: 68%;
                        display: flex;

                        // 文本
                        .user-avatar-text {
                            display: flex;
                            margin-top: -1rem;
                            margin-right: 1rem;
                            align-items: center;
                            justify-content: center;
                        }

                        // 上传
                        .el-upload {

                            img {
                                width: 80px;
                                height: 80px;
                                border-radius: 10rem;
                            }
                        }

                        // 介绍文本
                        .instruction-text {
                            font-size: 12px;
                            color: #9b9b9b;
                            line-height: 25px;
                            margin-top: 1.8rem;
                            margin-left: 0.8rem;
                        }
                    }
                    
                }

                // 基本信息容器
                .user-info-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;

                    // 用户信息元素
                    .user-info-item {
                        width: 20rem;
                        display: flex;
                        margin-right: 2rem;
                        margin-bottom: 2rem;

                        &:nth-child(2n) {
                            margin-right: 0rem;
                        }

                        // 文本
                        .user-info-item-text {
                            width: 4.5rem;
                            margin-right: 1rem;
                        }

                        .el-radio-group {
                            margin-left: -0.8rem;
                        }
                    }

                    // 个性签名
                    .user-info-signature {
                        display: flex;
                        width: 87.5%;
                        .user-info-item-text {
                            width: 4.5rem;
                            margin-right: 0.5rem;
                        }

                        :deep(.el-textarea__inner) {
                            resize: none;
                        }
                    }
                }

                // 底部容器
                .user-footer-container {
                    width: 87.5%;
                    display: flex;
                    margin-top: 2rem;
                    align-items: center;
                    justify-content: center;

                    // 按钮容器
                    .button-container {
                        
                        .el-button {
                            margin-left: 5rem;

                            &:nth-child(1) {
                                margin-left: 0rem;
                            }
                        }
                    }

                }
            }
        }
    }
}


// 修改密码弹出框
.update-password-dialog-container {

    // 对话框
    :deep(.el-dialog) {
        width: 30%; 
        border-radius: 0.8rem;
    }

    // 对话框顶部
    :deep(.el-dialog__header) {
        padding: 0;
    }

    // 修改密码容器
    .update-password-container {
        width: 60%;
        margin-top: 2rem;
        margin-left: 6rem;

        // 元素
        .update-password-item {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            
            // 文本
            .update-password-item-text {
                width: 5rem;
            }
        }
    }

    // 按钮容器
    .button-container {
        width: 100%;
        margin-top: 2rem;
        margin-left: 9.5rem;

        .el-button {
            width: 5rem;
            margin-right: 3rem;
            border-radius: 1rem;
        }
    }

}


// 修改基本信息弹出框
.update-user-info-dialog-container {
    // 对话框
    :deep(.el-dialog) {
        width: 40%; 
        border-radius: 0.8rem;
        
    }

    // 对话框顶部
    :deep(.el-dialog__header) {
        padding: 0;
    }

    // 修改信息容器
    .update-user-info-container {
        display: flex;
        margin-top: 1.5rem;
        align-items: center;
        justify-content: center;

        // 元素容器
        .update-user-info-item-container {
            width: 25rem;

            // 元素
            .update-user-info-item {
                display: flex;
                align-items: center;
                margin-bottom: 1rem;

                &:nth-child(2) {
                    // 元素文本
                    .update-user-info-item-text {
                        width: 4.2rem;
                        margin-right: 0.5rem;
                    }
                }

                // 元素文本
                .update-user-info-item-text {
                    width: 5rem;
                    margin-right: 0.5rem;
                }

            }

            // 个性签名
            .update-user-info-signature {
                .update-user-info-item-text {
                    margin-bottom: 0.5rem;
                }
                :deep(.el-textarea__inner) {
                    resize: none;
                }
            }
        }
    }

    // 按钮容器
    .button-container {
        width: 100%;
        margin-top: 2rem;
        margin-left: 14.5rem;

        .el-button {
            width: 5rem;
            margin-right: 3rem;
            border-radius: 1rem;
        }
    }
}
</style>