// 由于 ts 不支持 vue 文件的识别, 所以需要引入 vue 模块
declare module '*.vue' {
    
}

// 引入第三方模块时,显示未找到 -- 解决方案
declare module 'vue3-emoji'
declare module '@wangeditor/editor-for-vue'