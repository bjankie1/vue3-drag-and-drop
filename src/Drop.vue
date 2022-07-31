<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <component
    ref="rootRef"
    :is="tag"
    @dragenter="emitEvent(EventType.DragEnter, $event)"
    @dragleave="emitEvent(EventType.DragLeave, $event)"
    @dragover.prevent="emitEvent(EventType.DragOver, $event)"
    @drop.prevent="emitEvent(EventType.Drop, $event)"
  >
    <slot :transfer-data="scopedData"></slot>
  </component>
</template>

<script lang="ts" setup>
import transferDataStore from "./transferDataStore";
import { EventType } from "./constants";
import { ref } from "vue";

const rootRef = ref<HTMLElement | null>(null);

const insideElements = new Set();

const transferData = ref<object | undefined>(undefined);
const isDraggingOver = ref(false);

defineProps<{
  tag: string;
}>();

function scopedData() {
  return isDraggingOver.value && transferData.value;
}

const emits = defineEmits<{
  (
    e: EventType,
    transferData: object | undefined,
    nativeEvent: DragEvent
  ): void;
}>();

function emitEvent(name: EventType, nativeEvent: DragEvent) {
  transferData.value = transferDataStore.data;
  emits(name, transferData.value, nativeEvent);

  /**
   * After emitting the event, we need to determine if we're still
   * dragging inside this Drop. We keep a Set of all elements that we've
   * dragged into, then clear the data if that set is empty.
   */

  // Add to the set on dragenter.
  if (name === EventType.DragEnter) {
    if (insideElements.size || nativeEvent.target === rootRef.value) {
      insideElements.add(nativeEvent.target);
    }
  }

  // Remove from the set on dragleave.
  if (name === EventType.DragLeave) {
    insideElements.delete(nativeEvent.target);
  }

  // A drop resets everything.
  if (name === EventType.Drop) {
    insideElements.clear();
  }

  // Finally, since Vue can't react to Set changes, set a flag indicating drag status.
  isDraggingOver.value = Boolean(insideElements.size);
}
</script>
