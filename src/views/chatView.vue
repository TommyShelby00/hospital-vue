<template>
  <div>
    {{ this.messages }}
  </div>
</template>

<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
// Import the required libraries
    export default {
  data() {
    return {
      stompClient: null,
      messages: []
    };
  },
  mounted() {
    // Connect to the WebSocket endpoint
    const socket = new SockJS('/websocket/ws');
    this.stompClient = Stomp.over(socket);

    // Subscribe to a destination (topic or queue)
    this.stompClient.connect({}, () => {
        let userId=1
        this.sendMessage()
      this.stompClient.subscribe(`/user/${userId}/queue/test`, (message) => {
        // Handle incoming messages
        console.log(message)
        this.messages.push(message.body);
        
      });

    });
    
  },
  methods: {
    sendMessage() {
      // Send a message to the WebSocket endpoint
      this.stompClient.send('/app/sendMessage', JSON.stringify("nb"), {'content-type': 'application/json'});
    }
  },

};
</script>

<style>

</style>

