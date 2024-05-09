<template>
    <div>
        <div class="content">
            <div class="lsItem" v-for="item in list" :key="parseInt(item.id)" @click="handleItemClick(item)"
                :style="{ backgroundColor: roomId === item.id ? 'lightblue' : 'transparent' }">
                <el-image style="width: 80px; height: 80px" :src="item.user.avatar" :fit="fit"></el-image>
                <div style="margin-top:0px; margin-left: 10px;">
                    {{ item.user.username }}
                </div>
                未读消息:{{ item.docUnread }}
            </div>
        </div>
        <div class="chatFrame">
            <div v-for="item in messages" :key="item">
                <div class="chat" style="width: 100%;float: left;" v-if="item.from1 === 'user'">
                    <div class="avatar" style="float: left;width: 100%;">
                        <div class="avatar" style="display: flex; align-items: center;">
                            <el-avatar :size="size" :src="avatar" style="margin-right: 10px;"></el-avatar>
                            <span>{{ username }}</span>
                        </div>
                    </div>
                    <div class="text" style="background-color: darkseagreen;width: 30%;float: left;margin-left: 5%">
                        {{ item.text }}
                    </div>
                </div>
                <div class="chat" style="width: 100%;float: left;" v-if="item.from1 === 'doctor'">
                    <div class="avatar" style="float: right;">
                        <div class="avatar" style="display: flex; align-items: center;">
                            <span>{{ name }}</span>
                            <el-avatar :size="size" :src="img" style="margin-left: 10px;"></el-avatar>
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
            username: '',
            list: [],
            value: '',
            size: 'small',
            roomId: '',
            docName: this.$store.state.username,
            fit: 'fill',
            name: this.$store.state.username
        };
    },
    components: {
    },
    mounted() {
        this.roomId=this.$store.state.roomId
        this.queryList()
        // this.queryMsg()
        // this.connectWebSocket()

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
        connectWebSocket() {
            const socket = new SockJS('/websocket/ws');
            this.stompClient = Stomp.over(socket);
            this.stompClient.connect({}, () => {
                // 使用动态的 roomId 值订阅消息
                this.stompClient.subscribe(`/user/${this.roomId}/queue/msg`, (message) => {
                    this.messages.push(JSON.parse(message.body));
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
                from1: 'doctor'
            }
            this.stompClient.send('/app/sendDoctorMessage', JSON.stringify(msg), { 'content-type': 'application/json' });
        },
        queryList() {
            request({
                url: '/chat/queryDoctorList',
                method: 'get',
                params: {
                    id: this.$store.state.docId
                }
            }).then(res => {
                this.list = res.data.data
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
                msg.map(i => {
                    this.messages.push(i)
                })
                this.queryList()
            })

        },
        delUnread(){
            request({
                url:'/chat/del',
                method:'put',
                params:{
                    id:this.roomId
                }
            }).then(res=>{

            })
        },
        handleItemClick(item) {
            this.roomId = item.id;
            this.$store.commit('setId', item.user.id)
            this.username = item.user.username
            this.avatar = item.user.avatar
            this.img = item.doctor.img
            this.delUnread()
            this.queryMsg()
        }
    },

};
</script>

<style>
.content {
    display: flexbox;
    position: fixed;
    top: 10%;
    bottom: 0;
    right: 0;
    left: 13%;
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
    /* 垂直方向溢出时显示滚动条 */
}

.chatFrame {
    flex: 1;
    position: fixed;
    margin-left: 0;
    right: 5%;
    width: 64%;
    height: 80%;
    background-color: rgb(255, 255, 255);
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
    left: 40%;
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
</style>