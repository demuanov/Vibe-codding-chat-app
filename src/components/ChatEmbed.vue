<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import ChatApp from "./ChatApp.vue";

// Get URL parameters
const urlParams = ref(new URLSearchParams(window.location.search));
const projectKey = ref(urlParams.value.get("projectKey") || "");
const initialCollapsed = ref(urlParams.value.get("collapsed") === "true");

// State management
const isCollapsed = ref(initialCollapsed.value);
const isKeyboardOpen = ref(false);

// Listen for window messages from parent frame
const handleWindowMessage = (event: MessageEvent) => {
  if (!event.data || typeof event.data !== "object") return;

  if (event.data.type === "expanded") {
    isCollapsed.value = false;
  } else if (event.data.type === "collapsed") {
    isCollapsed.value = true;
  } else if (event.data.type === "window-resize") {
    // Handle resize events if needed
    checkKeyboardStatus();
  }
};

// Handle keyboard open/close detection
const checkKeyboardStatus = () => {
  const windowHeight = window.innerHeight;
  const threshold = window.screen.height * 0.75;
  const keyboardOpen = windowHeight < threshold;

  if (isKeyboardOpen.value !== keyboardOpen) {
    isKeyboardOpen.value = keyboardOpen;

    // Notify parent window about keyboard status change
    window.parent.postMessage(
      {
        type: "keyboard-status",
        isOpen: keyboardOpen,
      },
      "*"
    );
  }
};

// Toggle collapsed state and notify parent
const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;

  // Notify parent window about collapse state change
  window.parent.postMessage(
    {
      type: "toggle-collapse",
      collapsed: isCollapsed.value,
    },
    "*"
  );
};

onMounted(() => {
  // Listen for messages from parent frame
  window.addEventListener("message", handleWindowMessage);
  window.addEventListener("resize", checkKeyboardStatus);

  // Apply full-page styling
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";
  document.body.style.height = "100vh";
  document.body.style.width = "100vw";
});

onUnmounted(() => {
  window.removeEventListener("message", handleWindowMessage);
  window.removeEventListener("resize", checkKeyboardStatus);
});
</script>

<template>
  <div class="chat-embed-container">
    <ChatApp
      title="Support Chat"
      subtitle="How can we help today?"
      avatarSrc="https://via.placeholder.com/40"
      :collapsed="isCollapsed"
      @toggle-collapsed="toggleCollapsed"
    />
  </div>
</template>

<style scoped>
.chat-embed-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
