<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <component
    :is="tag"
    :draggable="draggable"
    @drag="emitEvent(EventType.Drag, $event)"
    @dragstart="emitEvent(EventType.DragStart, $event)"
    @dragenter="emitEvent(EventType.DragEnter, $event)"
    @dragleave="emitEvent(EventType.DragLeave, $event)"
    @dragend="emitEvent(EventType.DragEnd, $event)"
  >
    <slot :transfer-data="scopedData"></slot>
    <div v-if="hideImageHtml" :style="hideImageStyle">
      <slot name="image" :transfer-data="scopedData"></slot>
    </div>
    <slot
      ref="imageSlot"
      v-else
      name="image"
      :transfer-data="scopedData"
    ></slot>
  </component>
</template>

<script lang="ts" setup>
import transferDataStore from "./transferDataStore";
import { DropEffects, EffectsAllowed, EventType } from "./constants";
import { ref, Slot, useSlots } from "vue";

const props = defineProps<{
  draggable: boolean;
  transferData: any;
  dropEffect: DropEffects;
  effectAllowed: EffectsAllowed;
  image: string;
  imageXOffset: number;
  imageYOffset: number;
  hideImageHtml: boolean;
  tag: string;
}>();

const emits = defineEmits<{
  (
    e: EventType,
    transferData: object | undefined,
    nativeEvent: DragEvent
  ): void;
}>();

const dragging = ref(false);

const imageSlot = ref<HTMLElement | null>(null);

function scopedData() {
  return dragging.value && props.transferData;
}

const hideImageStyle = { position: "fixed", top: "-1000px" };

const slots = useSlots();

function emitEvent(eventType: EventType, nativeEvent: DragEvent) {
  const transfer = nativeEvent.dataTransfer;

  // Set drop effect on dragenter and dragover
  if ([EventType.DragEnter, EventType.DragOver].includes(eventType)) {
    if (props.dropEffect && transfer) {
      transfer.dropEffect = props.dropEffect;
    }
  }

  // A number of things need to happen on drag start
  if (eventType === EventType.DragStart) {
    // Set the allowed effects
    if (props.effectAllowed && transfer) {
      transfer.effectAllowed = props.effectAllowed;
    }

    // Set the drag image
    if (props.image || slots.image) {
      let imageElement: Element | undefined = undefined;
      if (props.image) {
        const image = new Image();
        image.src = props.image;
        imageElement = image;
      } else if (imageSlot.value) {
        imageElement = imageSlot.value;
      }
      if (imageElement && transfer?.setDragImage) {
        transfer.setDragImage(
          imageElement,
          props.imageXOffset,
          props.imageYOffset
        );
      }
    }

    // Set the transfer data
    if (props.transferData !== undefined) {
      transferDataStore.data = props.transferData;
      // Set a dummy string for the real transfer data. Not actually used
      // for anything, but necesssary for browser compatibility.
      //
      // TODO: Maybe this should be the actual data serialized. But since
      // it's not actually used for anything it seems like a waste of CPU.
      nativeEvent.dataTransfer?.setData("text", "");
    }

    // Indicate that we're dragging.
    dragging.value = true;
  }

  // At last, emit the event.
  emits(eventType, props.transferData, nativeEvent);

  // Clean up stored data on drag end after emitting.
  if (eventType === EventType.DragEnd) {
    transferDataStore.data = undefined;
    dragging.value = false;
  }
}
</script>
