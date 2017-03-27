import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember'

//Stub socket-io service
const socketIOStub = Ember.Service.extend({
  socketFor() {
    return socketFunctions
  }
});

const user = {user: {username: 'testUserName', id: 1}}

const socketFunctions = {
  on(eventName, cb) {
    switch(eventName) {
      case 'message':
        cb({User: {username: 'testUserName'}, message: 'some message'})
        break;
      case 'userInfo':
        cb(user)
        break;
      case 'members':
        cb(['member1', 'member2'])
        break;
      case 'allMessages':
        cb([{User: {username: 'testUserName'}, message: 'some message'}, {User: {username: 'testUserName2'}, message: 'some other message'}])
        break;
    default:
        cb(false)
        break;
    }
  },

  emit(eventName, data) {
    return data
  }
};

moduleFor('controller:chat', 'Unit | Controller | chat', {
  // Specify the other units that are required for this test.
  // needs: ['service:socket-io']
  beforeEach: function () {
    this.register('service:socket-io', socketIOStub);
    this.inject.service('socket-io', { as: 'socketIOService' });
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);

  assert.equal(controller.get('canEnter'), false, 'canEnter property checked before entering chat');
  assert.equal(controller.get('socket'), socketFunctions, 'socket property checked before entering chat');
  assert.equal(controller.get('user'), null, 'user property checked before entering chat');
  assert.equal(controller.get('members'), null, 'members property checked before entering chat');

  controller.set('username', 'aUser')
  controller.set('message', 'something')
  controller.send('enterChat')
  
  assert.equal(controller.get('canEnter'), true, 'canEnter property checked after entering chat');
  assert.equal(controller.get('username'), 'aUser', 'username property checked after entering chat');
  assert.deepEqual(controller.get('user'), user, 'user property checked after entering chat');
  assert.equal(controller.get('message'), 'something', 'message property checked after entering chat');

  controller.send('sendMessage')
  assert.equal(controller.get('message'), '', 'message property checked after sending message');

});
