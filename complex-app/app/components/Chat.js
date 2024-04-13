import React, { useEffect } from "react";

function Chat() {
  return (
    <>
      <div
        id="chat-wrapper"
        class="chat-wrapper chat-wrapper--is-visible shadow border-top border-left border-right"
      >
        <div class="chat-title-bar bg-primary">
          Chat
          <span class="chat-title-bar-close">
            <i class="fas fa-times-circle"></i>
          </span>
        </div>
        <div id="chat" class="chat-log">
          <div class="chat-self">
            <div class="chat-message">
              <div class="chat-message-inner">Hey, how are you?</div>
            </div>
            <img
              class="chat-avatar avatar-tiny"
              src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
            />
          </div>

          <div class="chat-other">
            <a href="#">
              <img
                class="avatar-tiny"
                src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
              />
            </a>
            <div class="chat-message">
              <div class="chat-message-inner">
                <a href="#">
                  <strong>barksalot:</strong>
                </a>
                Hey, I am good, how about you?
              </div>
            </div>
          </div>
        </div>
        <form id="chatForm" class="chat-form border-top">
          <input
            type="text"
            class="chat-field"
            id="chatField"
            placeholder="Type a message…"
            autocomplete="off"
          />
        </form>
      </div>
    </>
  );
}

export default Chat;
