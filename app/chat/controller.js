import Ember from 'ember';

const {Controller, set} = Ember

export default Controller.extend({
  canEnter: false,
  socketIOService: Ember.inject.service('socket-io'),
  socket: null,
  user: null,
  members: null,

  init() {
    set(this, 'socket', this.get('socketIOService').socketFor('http://localhost:1993/'))
  },

  actions: {
    enterChat() {
      this.socket.emit('initialize', this.username)

      this.socket.on('userInfo', (user) => {
        if (user) {
          set(this, 'user', user)
          set(this, 'canEnter', true)
        } else {
          Ember.$('#errorMsg').show().html('<em>' + this.username + '</em> username is already taken').fadeOut(5000)
        }
      })

      this.socket.on('members', (members) => {
        set(this, 'members', members)
      })

      this.socket.on('message', (data) => {
        Ember.$('#chat-box').append('<li class="others-msg pull-left"><b>' + data.User.username.toUpperCase() + ': </b>' + data.message + '</li>')
        if (Ember.$('#chat-box') && Ember.$('#chat-box').length > 0) {
          Ember.$('#chat-box').scrollTop(Ember.$('#chat-box')[0].scrollHeight)
        }
      })

      this.socket.on('allMessages', (messages) => {
        messages.forEach((message) => {
          if (this.user.username === message.User.username) {
            Ember.$('#chat-box').append('<li class="my-msg pull-right"><b>ME: </b>' + message.message + '</li>')
          } else {
            Ember.$('#chat-box').append('<li class="others-msg pull-left"><b>' + message.User.username.toUpperCase() + ': </b>' + message.message + '</li>')
          }
        })
        if (Ember.$('#chat-box') && Ember.$('#chat-box').length > 0) {
          Ember.$('#chat-box').scrollTop(Ember.$('#chat-box')[0].scrollHeight)
        }
      })
    },

    sendMessage() {
      Ember.$('#chat-box').append('<li class="my-msg pull-right"><b>ME: </b>' + this.message + '</li>')
      if (Ember.$('#chat-box') && Ember.$('#chat-box').length > 0) {
        Ember.$('#chat-box').scrollTop(Ember.$('#chat-box')[0].scrollHeight)
      }
      this.socket.emit('message', {
        message: this.message,
        userId: this.user.id
      })
      set(this, 'message', '')
    }
  }
});
