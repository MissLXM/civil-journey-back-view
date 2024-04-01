<template>
    <div class="online-custom-view-container">
        <el-card>
            <!-- 在线客服容器 -->
            <div class="online-customer-container">
                <div class="online-customer-left">
                    <div
                        :key="item.id"
                        class="customer-item"
                        v-for="item in userList"
                        @click="checkOnlineUser(item)"
                        :class="{ 'check-item': onlineUser.nickname === item.nickname}"
                    >
                        <el-avatar :src="item.userAvatar"/>
                        <div style="margin-left: 10px;">{{ item.nickname }}</div>
                    </div>
                </div>
                <div class="online-customer-right">
                    <!-- 在线客服布局 -->
                    <div class="online-customer-content">
                        <!-- 在线客服顶部 -->
                        <div class="online-customer-content-header">
                            <div class="online-customer-content-header-text">
                                {{ onlineUser.nickname }}
                            </div>
                        </div>
                        
                        <!-- 聊天内容 -->
                        <div class="online-customer-content-body">
                            <div
                                :key="index"
                                class="chat-message-container"
                                v-for="(item, index) in chatMessage"
                            >
                                <!-- 用户发送的信息 -->
                                <div class="user-send-message" v-if="item.acceptRole == 'user'" >
                                    <div class="user-send-message-text" v-if="isNotEmpty(item.message)" >
                                        {{ item.message }}
                                    </div>
                                    <el-avatar :src="admin.userAvatar" v-if="isNotEmpty(item.message)"/>
                                </div>
                                <!-- 客服发送的信息 -->
                                <div class="custom-send-message" v-else>
                                    <el-avatar :src="onlineUser.userAvatar" v-if="isNotEmpty(item.message)" />
                                    <div class="custom-send-message-text" v-if="isNotEmpty(item.message)" >
                                        {{ item.message }} 
                                    </div>
                                </div>
                                
                            </div>
                            
                        </div>
                        
                        <!-- 输入框布局 -->
                        <div class="online-customer-content-bottom">

                            <!-- 菜单栏布局 -->
                            <div class="chat-nav">
                                <V3Emoji 
                                    :recent="true"
                                    v-model="message"
                                    @click-emoji="appendEmoji"
                                    :options-name="optionsName"
                                    :disable-group="disableGroup"
                                    default-select="Animals & Nature"
                                />
                            </div>

                            <el-input 
                                :rows="4"
                                type="textarea" 
                                v-model="message" 
                            />
                            <el-button type="info" @click="sendMessage">发送</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import  V3Emoji  from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'
import { ref, onMounted } from 'vue';
import { adminStore } from '@/stores/admin'; 
import { getOnlineCustom } from '@/api/user'
import { getAllChatRecords } from '@/api/user';


// 长连接
const socket = ref()
// 信息内容
const message = ref()
// 更换文本
const optionsName = ref({
    'Smileys & Emotion': '笑脸&表情',
    'Food & Drink': '食物&饮料',
    'Animals & Nature': '动物&自然',
    'Travel & Places': '旅行&地点',
    'People & Body': '人物&身体',
    Objects: '物品',
    Symbols: '符号',
    Flags: '旗帜',
    Activities: '活动'
})
// 管理员信息
const admin = adminStore()
// 禁用的表情组
const disableGroup = ref([
    '食物&饮料',
    '动物&自然',
    '旅行&地点',
    '人物&身体',
    '物品',
    '符号',
    '旗帜',
    '活动'
])
// 用户列表
const userList = ref()
// 选中用户
const onlineUser = ref<any>({
    id: null,
    nickname: null,
    userAvatar: null
})
// 聊天内容
const chatMessage = ref<any>([])
// 判空方法
const isNotEmpty = (str: string) => {
    return str != '' && str != undefined && str != null
}
// Emoji表情单击事件
function appendEmoji(emoji: string) {
    message.value += emoji
}




// 挂载函数
onMounted(() => {
    // 加载长连接
    loadWebSocket()
    // 加载用户列表
    loadOnlineUser()
})

// 定时加载
setInterval(() => {
    if (isNotEmpty(onlineUser.value.id) && isNotEmpty(admin.adminId)) {
        // 加载此客服和该用户的聊天记录
        loadCustomAndUserChat()
    } 
}, 2000)


// 发送消息
function sendMessage() {
    // 发送
    if (isNotEmpty(message.value)) {

        if (isNotEmpty(onlineUser.value)) {
            const senderParams = {
                "senderRole": "admin",
                "acceptRole": "user",
                "senderId": admin.adminId,
                "message": message.value,
                "acceptId": onlineUser.value.id,
            }

            console.log(senderParams)
            socket.value.send(JSON.stringify(senderParams))
            chatMessage.value.push(senderParams)

            // 滚动到最下方
            scrollTopBottom()

            message.value = ''
        } else {
            ElMessage.info('请选择在线客服')
        }
    } else {
        ElMessage.info('请输入内容')
    }
    // chatMessage.value.push({"acceptId": onlineUser.value.id,"message": message.value})
}

// 加载长连接
function loadWebSocket() {
    socket.value = new WebSocket(`${import.meta.env.VITE_WS_URL}/websocket/admin/${admin.adminId}`)
    socket.value.onmessage = (event: any) => {
        chatMessage.value.push(JSON.parse(event.data))
    }
}

// 加载用户列表
function loadOnlineUser() {
    getOnlineCustom().then(response => {
        if (response.data.code === 200) {
            userList.value = response.data.data
        } 
    })
}

// 滚动到最下方
function scrollTopBottom() {
    // 滚动条始终为最下方
    const chatContent = document.querySelector('.online-customer-content-body')
    // 滚动到最底部
    if (chatContent != null) {
        chatContent.scrollTop = chatContent.scrollHeight
    }
}

// 加载此客服和该用户的聊天记录
function loadCustomAndUserChat() {
    getAllChatRecords(admin.adminId,onlineUser.value.id).then(response => {
        chatMessage.value = response.data.data
    })
}

// 选中需要进行聊天的用户,并加载记录
function checkOnlineUser(item: any) {
    onlineUser.value = item
    // 加载此客服和该用户的聊天记录
    loadCustomAndUserChat()
}
</script>

<style lang="less" scoped>
.online-custom-view-container {
    height: 96%;

    :deep(.el-card) {
        height: 100%;
    }

    // 在线客服容器
    .online-customer-container {
        width: 90%;
        height: 92%;
        display: flex;
        margin-top: 1rem;
        padding: 1rem 2rem;
        border-radius: 0.3rem; 
        justify-content: center;
        background-color: #fff;

        .online-customer-left {
            width: 14rem;
            height: 44.15rem;
            margin-top: 3rem;
            overflow-y: scroll;
            border: 1px solid #eee;

            // 客服容器
            .customer-item {
                display: flex;
                height: 4.5rem;
                cursor: pointer;
                margin-left: 1rem;
                align-items: center;
                margin: 0 0 0.5rem 0;
                
                justify-content: center;
            }

            // 客服容器
            .check-item {
                background-color: aquamarine;
            }
        }

        .online-customer-right {
            margin-top: 3rem;

            // 在线客服布局
            .online-customer-content {
                width: 45rem;

                // 在线客服顶部
                .online-customer-content-header {
                    width: 100%;
                    height: 3rem;
                    display: flex;
                    align-items: center;
                    border: 1px solid #eee;
                    border-bottom: none;
                    justify-content: flex-start;
                    border-radius: 0 0.5rem 0 0;

                    .online-customer-content-header-text {
                        margin-left: 1rem;
                        font-size: 20px;
                    }

                    .online-customer-connect {
                        margin-left: 1rem;
                    }
                }
                
                // 聊天内容
                .online-customer-content-body {
                    width: 100%;
                    height: 30rem;
                    overflow-y: scroll;
                    border-bottom: none;

                    border: 1px solid #eee;

                    // 聊天信息容器
                    .chat-message-container {
                        margin: 1.5rem;
                        .custom-send-message {
                            margin: 1rem;

                            display: flex;
                            align-items: center;
                            justify-content: left;

                            .custom-send-message-text {
                                padding: 0.8rem;
                                margin-left: 0.5rem;
                                border-radius: 0.3rem;
                                background-color: #eee;
                            }
                        }

                        .user-send-message {
                            margin: 1rem;

                            display: flex;
                            align-items: center;
                            justify-content: right;

                            .user-send-message-text {
                                color: #fff;
                                padding: 0.8rem;
                                margin-right: 0.5rem;
                                border-radius: 0.3rem;
                                background-color: #1e6ee1;
                            }
                        }
                    }
                }

                // 输入框布局
                .online-customer-content-bottom {
                    width: 100%;
                    height: 11rem;
                    position: relative;
                    background-color: #fff;
                    border: 1px solid #ddd;

                    // 菜单栏布局
                    .chat-nav {
                        display: flex;
                        background-color: #fff;
                        border-bottom: 1px solid #eee;

                        :deep(.emoji-container) {
                            padding: 0.2rem 0.5rem;
                            background-color: #fff;
                        }
                    }

                    :deep(.el-textarea__inner) {
                        resize: none;
                        border: none;
                        box-shadow: none;
                    }

                    :deep(.el-textarea__inner:focus) {
                        box-shadow: none;
                    }


                    .el-button {
                        top: 8rem;
                        right: 0.8rem;
                        width: 5.5rem;
                        height: 1.9rem;
                        position: absolute;
                    }
                }
            }
        } 
    }
}
</style>