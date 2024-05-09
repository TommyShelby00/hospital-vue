<template>
    <div>

        <div class="content">
            <div class="videoContainer">
                <video class="fullscreenVideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
                    <source src="../../mp4/1.mp4" type="video/mp4">
                </video>
            </div>
            <div class="lsItem" v-for="(item, index) in list" :key="index" @click="handleItemClick(item)"
                :style="{ backgroundColor: roomId === item.id ? 'lightblue' : 'transparent' }">
                <el-image style="width: 80px; height: 80px" :src="item.doctor.img" :fit="fit"></el-image>
                <div style="margin-top:0px; margin-left: 10px;"> <!-- 可以调整间距 -->
                    {{ item.doctor.name }}
                </div>
                <div v-if="item.userUnread != 0" style="font-size: small;color: red;left: 50%;">
                    <i class="el-icon-message"></i>未读消息:{{ item.userUnread }}
                </div>
            </div>
        </div>
        <div class="chatFrame" id="chat">

            <div v-for="item in messages" :key="item">
                <div class="chat" style="width: 100%;float: left;" v-if="item.from1 === 'doctor'">
                    <div class="avatar" style="float: left;width: 100%;">
                        <div class="avatar" style="display: flex; align-items: center;">
                            <el-avatar :size="size" :src="img" style="margin-right: 10px;"></el-avatar>
                            <span>{{ docName }}</span>
                        </div>
                    </div>
                    <div class="text" style="background-color: darkseagreen;width: 30%;float: left;margin-left: 5%">
                        {{ item.text }}
                    </div>
                </div>
                <div class="chat" style="width: 100%;float: left;" v-if="item.from1 === 'user'">
                    <div class="avatar" style="float: right;">
                        <div class="avatar" style="display: flex; align-items: center;">
                            <span>{{ username }}</span>
                            <el-avatar :size="size" :src="avatar" style="margin-left: 10px;"></el-avatar>
                        </div>
                    </div>
                    <div class="text" style="border:solid 1px;width: 30%;float: right;margin-top: 5%;margin-right: 1%">
                        {{ item.text }}
                    </div>
                </div>
            </div>
        </div>
        <div class="input-content">
            <el-input id="input" v-model="value"></el-input>
            <el-button id="btn" type="primary" @click="sendMessage()">发送</el-button>
        </div>
    </div>

</template>

<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { request } from '@/network/gateway';
import store from '@/store';
export default {
    data() {
        return {
            stompClient: null,
            messages: [],
            avatar: '',
            img: '',
            docName: this.$store.state.docName,
            list: [],
            value: '',
            roomId: '',
            username: this.$store.state.username,
            sig: 1
        };
    },
    mounted() {
        this.queryMsg()
        this.queryList()
        this.connectWebSocket()
        // // Connect to the WebSocket endpoint
        // const socket = new SockJS('/websocket/ws');
        // this.stompClient = Stomp.over(socket);

        // // Subscribe to a destination (topic or queue)
        // this.stompClient.connect({}, () => {
        //     this.stompClient.subscribe(`/user/${this.$store.state.roomId}/queue/msg`, (message) => {
        //         // Handle incoming messages
        //         this.messages.push(JSON.parse(message.body));
        //     });
        // });
    },
    watch: {
        // 监听 roomId 的变化，当 roomId 变化时执行重新连接 WebSocket 的操作
        roomId(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.disconnectWebSocket(); // 先断开旧的连接
                this.connectWebSocket(); // 再重新连接 WebSocket
            }
        },
    },
    methods: {
        //设置滚动条到最底部
        setToBottom() {
            this.$nextTick(function () {
                const box = document.getElementById("chat")
                box.scrollTop = box.scrollHeight
            })
        },
        connectWebSocket() {
            const socket = new SockJS('/websocket/ws');
            this.stompClient = Stomp.over(socket);
            this.stompClient.connect({}, () => {
                // 使用动态的 roomId 值订阅消息
                this.stompClient.subscribe(`/user/${this.roomId}/queue/msg`, (message) => {
                    this.messages.push(JSON.parse(message.body));
                    this.delUnread()
                    this.setToBottom()
                });
            });

        },
        disconnectWebSocket() {
            if (this.stompClient) {
                this.stompClient.disconnect(); // 断开 WebSocket 连接
            }
        },
        sendMessage() {
            // Send a message to the WebSocket endpoint
            const msg = {
                roomId: this.roomId,
                text: this.value,
                from1: 'user'
            }
            this.stompClient.send('/app/sendUserMessage', JSON.stringify(msg), { 'content-type': 'application/json' });
            this.value = ''
            this.setToBottom()
        },
        queryList() {
            request({
                url: '/chat/queryUserList',
                method: 'get',
                params: {
                    id: this.$store.state.id
                }
            }).then(res => {
                this.list = res.data.data
                if (this.sig === 1) {
                    const specialItem = this.list.find(item => item.id === this.roomId);
                    const otherItems = this.list.filter(item => item.id !== this.roomId);
                    // 对未读项进行倒序排序
                    otherItems.sort((a, b) => b.userUnread - a.userUnread);
                    this.list = [specialItem, ...otherItems];
                    this.sig=0
                }
            })
        },
        queryMsg() {
            this.messages = []
            request({
                url: '/chat/enterRoom',
                method: 'post',
                data: {
                    userId: this.$store.state.id,
                    doctorId: this.$store.state.docId
                }
            }).then(res => {
                const msg = res.data.data.messages
                this.roomId = res.data.data.id
                msg.map(i => {
                    this.messages.push(i)
                })
                this.setToBottom()

            })
        },
        handleItemClick(item) {
            this.roomId = item.id;
            this.$store.commit('setRoomId', item.id)
            this.$store.commit('setDocId', item.doctor.id)
            this.$store.commit('setDocName', item.doctor.name)
            this.docName = item.doctor.name
            this.avatar = item.user.avatar
            this.img = item.doctor.img
            this.queryMsg()
            this.delUnread()
        },
        delUnread() {
            request({
                url: '/chat/delUser',
                method: 'put',
                params: {
                    id: this.roomId
                }
            }).then(res => {
                this.queryList()
            })
        },
    },

};
</script>

<style>
.content {
    display: flexbox;
    position: fixed;
    top: 8%;
    bottom: 0;
    right: 0;
    left: 0%;
    width: 100%;
    height: 800px;
}

.list {
    position: fixed;
    flex: 1;
    height: 100%;
    width: 20%;
    margin: 0px;
    padding: 0px;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.5);
    /* 垂直方向溢出时显示滚动条 */
}

.chatFrame {
    position: fixed;
    top: 8%;
    left: 20%;
    right: 5%;
    width: 64%;
    height: 80%;
    /* background-color: rgb(255, 255, 255); */
    background-color: rgba(255, 255, 255, 0.5);
    border: solid 1px;
    overflow-y: auto;
    /* 垂直方向溢出时显示滚动条 */
    max-width: 76%;
    word-wrap: break-word;
    /* 允许在长单词或URL地址内部进行换行 */
    overflow-wrap: break-word;
    /* 对于旧浏览器的兼容性 */

}

.input-content {
    position: fixed;
    left: 32%;
    top: 92%;
}

#input {
    width: 500px;
}

#btn {
    position: fixed;
}

.lsItem {
    height: 85px;
    display: flex;
    align-items: center;
    width: 20%;
}

.videoContainer {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -100;
}

.videoContainer:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    z-index: -1;
    top: 0;
    left: 0;
    background: rgba(25, 29, 34, .65);
}
</style>