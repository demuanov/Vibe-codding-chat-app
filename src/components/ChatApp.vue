<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";

// Props for configuration
const props = defineProps<{
  title?: string;
  subtitle?: string;
  avatarSrc?: string;
  collapsed?: boolean;
}>();

// Emit events
const emit = defineEmits<{
  (e: "toggle-collapsed", value: boolean): void;
}>();

// Default values
const title = computed(() => props.title || "Chat");
const subtitle = computed(() => props.subtitle || "Online");
const avatarSrc = computed(
  () => props.avatarSrc || "https://via.placeholder.com/40"
);

// Message state
interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

const messages = ref<Message[]>([
  { id: 1, text: "Hello there!", sender: "other", timestamp: new Date() },
  {
    id: 2,
    text: "Hi! How can I help you today?",
    sender: "user",
    timestamp: new Date(),
  },
]);

const newMessage = ref("");
const isCollapsed = ref(props.collapsed || false);
const isKeyboardOpen = ref(false);
const messagesContainer = ref<HTMLDivElement | null>(null);

// Watch for collapsed prop changes
watch(
  () => props.collapsed,
  (newValue) => {
    if (newValue !== undefined) {
      isCollapsed.value = newValue;
    }
  }
);

// Send a message
const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      text: newMessage.value,
      sender: "user",
      timestamp: new Date(),
    });
    newMessage.value = "";

    // Scroll to bottom after message is added
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  }
};

// Toggle collapsed state
const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
  emit("toggle-collapsed", isCollapsed.value);
};

// Format time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Scroll to bottom of messages
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Handle keyboard events for mobile
const checkKeyboardStatus = () => {
  // Use viewport height as an indicator of keyboard status
  const windowHeight = window.innerHeight;
  const threshold = window.screen.height * 0.75;
  isKeyboardOpen.value = windowHeight < threshold;
};

onMounted(() => {
  scrollToBottom();
  window.addEventListener("resize", checkKeyboardStatus);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkKeyboardStatus);
});
</script>

<template>
  <div
    class="chat-container"
    :class="{ collapsed: isCollapsed, 'keyboard-open': isKeyboardOpen }"
  >
    <!-- Chat header -->
    <div class="chat-header" @click="isCollapsed ? toggleCollapsed() : null">
      <div class="avatar-container" @click.stop="toggleCollapsed">
        <img :src="avatarSrc" alt="Avatar" class="avatar" />
      </div>
      <div v-if="!isCollapsed" class="header-info">
        <h3 class="title">{{ title }}</h3>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Chat messages -->
    <div v-if="!isCollapsed" class="messages-container" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="message.sender"
      >
        <div class="message-content">
          {{ message.text }}
        </div>
        <div class="message-time">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- Chat input -->
    <div v-if="!isCollapsed" class="input-container">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 500px;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Collapsed state - circle with just the avatar */
.chat-container.collapsed {
  width: 60px;
  height: 60px;
  border-radius: 30px;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #4a7dff;
  color: white;
  cursor: pointer;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.header-info {
  margin-left: 12px;
  flex-grow: 1;
  overflow: hidden;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f7fb;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 80%;
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 16px;
  position: relative;
  word-break: break-word;
}

.message.user {
  align-self: flex-end;
  background-color: #4a7dff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.other {
  align-self: flex-start;
  background-color: #e5e5ea;
  color: black;
  border-bottom-left-radius: 4px;
}

.message-content {
  margin-bottom: 4px;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  text-align: right;
}

.input-container {
  display: flex;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #eaeaea;
}

.input-container input {
  flex-grow: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 12px;
  margin-right: 8px;
  outline: none;
}

.input-container button {
  background-color: #4a7dff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
}

/* Mobile responsive styles */
@media (max-width: 640px) {
  .chat-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    margin: 0;
    padding: 0;
    max-width: 100%;
    max-height: 100%;
  }

  /* When keyboard is open, adjust layout but still maintain full screen */
  .chat-container.keyboard-open {
    height: 100vh; /* Still take full height */
    display: flex;
    flex-direction: column;
  }

  .chat-container.keyboard-open .chat-header {
    flex-shrink: 0; /* Don't allow header to shrink */
  }

  .chat-container.keyboard-open .messages-container {
    flex: 1; /* Allow messages to take available space */
    min-height: 100px; /* Ensure some minimum height for messages */
  }

  .chat-container.keyboard-open .input-container {
    flex-shrink: 0; /* Don't allow input to shrink */
  }

  /* Handle collapsed state on mobile */
  .chat-container.collapsed {
    position: fixed;
    width: 60px;
    height: 60px;
    bottom: 20px;
    right: 20px;
    left: auto;
    top: auto;
  }
}

/* Make sure the component takes full space when in an iframe */
:deep(:root),
:deep(html),
:deep(body) {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Target parent elements when in iframe */
@media (max-width: 100%) {
  .chat-container {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
</style>
