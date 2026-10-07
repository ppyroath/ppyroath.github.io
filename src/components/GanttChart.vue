<template>
  <div v-if="patch" class="gantt-card">
    <div class="gantt-card-header">
      <div class="gantt-title-wrap">
        <h3 class="gantt-card-title">Version {{ patch.patchVersion }} Timeline</h3>
        <span class="gantt-card-subtitle">{{ patch.patchName }}</span>
      </div>
      <div class="gantt-legend" aria-label="Legend">
        <span class="legend-item"><span class="legend-dot legend-dot--gacha"></span>Gacha</span>
        <span class="legend-item"><span class="legend-dot legend-dot--event"></span>Event</span>
        <span class="legend-item"><span class="legend-dot legend-dot--drop"></span>Double Drop</span>
        <span class="legend-item"><span class="legend-dot legend-dot--web"></span>Web Event</span>
      </div>
    </div>

    <!-- Scrollable timeline board -->
    <div 
      class="gantt-scroll-container" 
      ref="scrollContainer"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMoveContainer"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseLeaveContainer"
      :class="{ 'gantt-scroll-container--dragging': isDragging }"
    >
      <div class="gantt-board" :style="{ width: boardWidth + 'px' }">
        
        <!-- Grid Vertical Lines & Headers -->
        <div class="gantt-grid-header">
          <!-- Month labels row -->
          <div class="gantt-month-row">
            <div 
              v-for="(group, idx) in monthGroups" 
              :key="'month-' + idx" 
              class="month-header-cell"
              :style="{ left: group.left + '%', width: group.width + '%' }"
            >
              {{ group.month }}
            </div>
          </div>
          
          <!-- Day names and numbers row -->
          <div class="gantt-day-row">
            <div 
              v-for="(day, idx) in dayCells" 
              :key="'day-' + idx" 
              class="day-header-cell"
              :class="{ 
                'day-header-cell--weekend': day.isWeekend,
                'day-header-cell--today': day.isToday 
              }"
              :style="{ left: day.left + '%', width: cellWidthPercent + '%' }"
            >
              <span class="day-name">{{ day.dayName }}</span>
              <span class="day-number">{{ day.dateNumber }}</span>
            </div>
          </div>
        </div>

        <!-- The timeline content -->
        <div class="gantt-timeline-content">
          
          <!-- Background Grid Lines -->
          <div class="gantt-grid-lines">
            <div 
              v-for="(day, idx) in dayCells" 
              :key="'line-' + idx" 
              class="grid-line"
              :class="{ 'grid-line--weekend': day.isWeekend }"
              :style="{ left: day.left + '%', width: cellWidthPercent + '%' }"
            ></div>
          </div>

          <!-- Today Highlight Column Block -->
          <div 
            v-if="todayIndex !== -1" 
            class="today-column-block" 
            :style="{ left: (todayIndex / totalDays) * 100 + '%', width: cellWidthPercent + '%' }"
          >
            <div class="today-block-tag">Today</div>
          </div>

          <!-- Section: Gacha/Banners -->
          <div v-if="gachaEvents.length > 0" class="gantt-section">
            <div class="section-label">Gacha & Banners</div>
            <div class="gantt-rows">
              <div
                v-for="(lane, laneIdx) in gachaLanes"
                :key="laneIdx"
                class="gantt-row"
              >
                <div class="gantt-bar-container">
                  <button
                    v-for="event in lane"
                    :key="getEventKey(event)"
                    type="button"
                    class="gantt-bar gantt-bar--gacha"
                    :class="{ 
                      'gantt-bar--past': isPast(event),
                      'gantt-bar--overflowing': overflowingEvents[getEventKey(event)] !== undefined
                    }"
                    :style="{
                      ...getBarStyles(event),
                      '--scroll-dist': overflowingEvents[getEventKey(event)] ? `-${overflowingEvents[getEventKey(event)]}px` : '0px'
                    }"
                    :data-event-key="getEventKey(event)"
                    @mouseenter="handleMouseEnter(event, $event)"
                    @mousemove="handleMouseMove"
                    @mouseleave="handleMouseLeave"
                    @click="handleEventClick(event, $event)"
                  >
                    <span class="bar-title">{{ event.name }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Events -->
          <div v-if="otherEvents.length > 0" class="gantt-section">
            <div class="section-label">Events & Activities</div>
            <div class="gantt-rows">
              <div
                v-for="(lane, laneIdx) in otherLanes"
                :key="laneIdx"
                class="gantt-row"
              >
                <div class="gantt-bar-container">
                  <button
                    v-for="event in lane"
                    :key="getEventKey(event)"
                    type="button"
                    class="gantt-bar"
                    :class="[
                      'gantt-bar--' + event.type,
                      { 
                        'gantt-bar--past': isPast(event),
                        'gantt-bar--overflowing': overflowingEvents[getEventKey(event)] !== undefined
                      }
                    ]"
                    :style="{
                      ...getBarStyles(event),
                      '--scroll-dist': overflowingEvents[getEventKey(event)] ? `-${overflowingEvents[getEventKey(event)]}px` : '0px'
                    }"
                    :data-event-key="getEventKey(event)"
                    @mouseenter="handleMouseEnter(event, $event)"
                    @mousemove="handleMouseMove"
                    @mouseleave="handleMouseLeave"
                    @click="handleEventClick(event, $event)"
                  >
                    <span class="bar-title">{{ event.name }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
    
    <div class="gantt-mobile-hint">
      <svg class="swipe-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>
      </svg>
      Swipe sideways to see the whole patch
    </div>

    <!-- Custom Floating Tooltip (Desktop Hover) -->
    <div 
      v-if="hoveredEvent" 
      class="gantt-custom-tooltip"
      :style="{ top: tooltipPosition.y + 'px', left: tooltipPosition.x + 'px' }"
    >
      <div class="tooltip-badge-row">
        <span class="tooltip-badge" :class="'tooltip-badge--' + hoveredEvent.type">
          {{ hoveredEvent.type }}
        </span>
        <span v-if="isPast(hoveredEvent)" class="tooltip-badge tooltip-badge--ended">
          Ended
        </span>
        <span v-else-if="isOngoing(hoveredEvent)" class="tooltip-badge tooltip-badge--active">
          Ongoing
        </span>
        <span v-else class="tooltip-badge tooltip-badge--upcoming">
          Upcoming
        </span>
      </div>
      <h4 class="tooltip-title">{{ hoveredEvent.name }}</h4>
      <div class="tooltip-time">
        <div class="tooltip-time-section">
          <span class="tooltip-time-heading">Main</span>
          <span class="tooltip-time-value">{{ formatBaseServerTime(hoveredEvent.startTime) }} to {{ formatBaseServerTime(hoveredEvent.endTime) }}</span>
        </div>
        <div class="tooltip-time-section">
          <span class="tooltip-time-heading">Server</span>
          <span class="tooltip-time-value">{{ formatServerTime(hoveredEvent.startTime, hoveredEvent) }} to {{ formatServerTime(hoveredEvent.endTime, hoveredEvent) }}</span>
        </div>
        <div v-if="showBrowserTime" class="tooltip-time-section tooltip-time-section--browser">
          <span class="tooltip-time-heading">Local</span>
          <span class="tooltip-time-value tooltip-time-value--browser">{{ formatBrowserTime(hoveredEvent.startTime, hoveredEvent) }} to {{ formatBrowserTime(hoveredEvent.endTime, hoveredEvent) }}</span>
        </div>
      </div>
      <p v-if="hoveredEvent.description" class="tooltip-desc">{{ hoveredEvent.description }}</p>
    </div>

    <!-- Custom Modal/Dialog for Clicked Event Details -->
    <div v-if="clickedEvent" class="gantt-modal-backdrop" @click="clickedEvent = null">
      <div
        class="gantt-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gantt-modal-title"
        @click.stop
      >
        <button ref="modalClose" type="button" class="gantt-modal-close" aria-label="Close" @click="clickedEvent = null">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        <div class="modal-badge-row">
          <span class="tooltip-badge" :class="'tooltip-badge--' + clickedEvent.type">
            {{ clickedEvent.type }}
          </span>
          <span v-if="isPast(clickedEvent)" class="tooltip-badge tooltip-badge--ended">
            Ended
          </span>
          <span v-else-if="isOngoing(clickedEvent)" class="tooltip-badge tooltip-badge--active">
            Ongoing
          </span>
          <span v-else class="tooltip-badge tooltip-badge--upcoming">
            Upcoming
          </span>
        </div>
        <h3 id="gantt-modal-title" class="modal-title">{{ clickedEvent.name }}</h3>
        <div class="modal-time-box">
          <div class="modal-time-section">
            <span class="modal-time-heading">Main</span>
            <div class="modal-time-detail">Start: {{ formatBaseServerTime(clickedEvent.startTime) }}</div>
            <div class="modal-time-detail">End: {{ formatBaseServerTime(clickedEvent.endTime) }}</div>
          </div>
          <div class="modal-time-section">
            <span class="modal-time-heading">Server</span>
            <div class="modal-time-detail">Start: {{ formatServerTime(clickedEvent.startTime, clickedEvent) }}</div>
            <div class="modal-time-detail">End: {{ formatServerTime(clickedEvent.endTime, clickedEvent) }}</div>
          </div>
          <div v-if="showBrowserTime" class="modal-time-section modal-time-section--browser">
            <span class="modal-time-heading">Local</span>
            <div class="modal-time-detail">Start: {{ formatBrowserTime(clickedEvent.startTime, clickedEvent) }}</div>
            <div class="modal-time-detail">End: {{ formatBrowserTime(clickedEvent.endTime, clickedEvent) }}</div>
          </div>
        </div>
        <div v-if="clickedEvent.description" class="modal-desc-box">
          <h4 class="modal-desc-title">Description</h4>
          <p class="modal-desc-text">{{ clickedEvent.description }}</p>
        </div>
        <div v-if="clickedEvent.link" class="modal-link-box">
          <a 
            :href="clickedEvent.link" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="modal-link-button"
          >
            <span>Open official news post</span>
            <svg class="external-link-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import type { TimelineEvent, PatchTimeline } from '../data/wuwaTimeline';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getTzTime as getTzTimeUtil, getTzOffsetMinutes } from '../utils/timezone';

dayjs.extend(utc);

const props = defineProps<{
  patch: PatchTimeline | null;
  timezone: string;
  now?: dayjs.Dayjs;
  showBrowserTime?: boolean;
  gameTimezone?: string;
}>();



const DAY_CELL_WIDTH = 34; // Width of a single day cell in pixels
const scrollContainer = ref<HTMLElement | null>(null);

// Hover Tooltip States
const hoveredEvent = ref<TimelineEvent | null>(null);
const tooltipPosition = ref({ x: 0, y: 0 });

// Clicked Details Modal State
const clickedEvent = ref<TimelineEvent | null>(null);
const modalClose = ref<HTMLButtonElement | null>(null);
let focusBeforeModal: HTMLElement | null = null;

// Move focus into the dialog on open and give it back to the bar on close
watch(clickedEvent, async (event, previous) => {
  if (event && !previous) {
    focusBeforeModal = document.activeElement as HTMLElement | null;
    await nextTick();
    modalClose.value?.focus();
  } else if (!event && previous) {
    focusBeforeModal?.focus();
    focusBeforeModal = null;
  }
});

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && clickedEvent.value) clickedEvent.value = null;
};

// Overflow track for marquee text
const overflowingEvents = ref<Record<string, number>>({});

// Timer fallback for reactivity
const localNow = ref(dayjs());
const currentNow = computed(() => props.now || localNow.value);

let localTimer: number | undefined;

// Mouse Drag-to-Scroll (Panning) States
const isDragging = ref(false);
const startX = ref(0);
const scrollLeftStart = ref(0);
let dragMoved = false;

// Check if a sub-event is local or simultaneous
const isLocalEvent = (event: TimelineEvent) => {
  if (props.timezone === 'Etc/UTC') return false;
  // If the event starts at the same time as the patch, it is simultaneous (Phase 1)
  if (props.patch && event.startTime === props.patch.startTime) return false;
  // Web events are simultaneous
  if (event.type === 'web') return false;
  return true;
};

// Convert ISO strings timezone-adjusted to make coordinate positions absolute/correct
const getTzTime = (dateStr: string, isLocal: boolean = false) => {
  return getTzTimeUtil(dateStr, props.timezone, isLocal);
};


// Normalized patch range boundary (start of day & end of day)
const patchStart = computed(() => props.patch ? getTzTime(props.patch.startTime).startOf('day') : null);
const patchEnd = computed(() => props.patch ? getTzTime(props.patch.endTime).endOf('day') : null);
const patchDuration = computed(() => {
  if (!patchStart.value || !patchEnd.value) return 0;
  return patchEnd.value.diff(patchStart.value, 'second');
});

// Group events
const gachaEvents = computed(() => {
  if (!props.patch) return [];
  return props.patch.events.filter(e => e.type === 'gacha');
});

const otherEvents = computed(() => {
  if (!props.patch) return [];
  return props.patch.events.filter(e => e.type !== 'gacha');
});

// Pack events into as few rows as possible: an event goes into the first row
// whose last event has already ended, so back-to-back events share a row.
const packLanes = (events: TimelineEvent[]) => {
  const sorted = events
    .map((event, idx) => ({
      event,
      idx,
      start: getTzTime(event.startTime, isLocalEvent(event)).valueOf(),
      end: getTzTime(event.endTime, isLocalEvent(event)).valueOf(),
    }))
    .sort((a, b) => a.start - b.start || a.idx - b.idx);

  const lanes: { end: number; events: TimelineEvent[] }[] = [];
  for (const item of sorted) {
    const lane = lanes.find(l => l.end <= item.start);
    if (lane) {
      lane.events.push(item.event);
      lane.end = item.end;
    } else {
      lanes.push({ end: item.end, events: [item.event] });
    }
  }
  return lanes.map(l => l.events);
};

const gachaLanes = computed(() => packLanes(gachaEvents.value));
const otherLanes = computed(() => packLanes(otherEvents.value));

// Total days in the patch (inclusive)
const totalDays = computed(() => {
  if (!patchStart.value || !patchEnd.value) return 0;
  return patchEnd.value.diff(patchStart.value, 'day') + 1;
});

// Dynamic board width based on days
const boardWidth = computed(() => {
  return Math.max(720, totalDays.value * DAY_CELL_WIDTH);
});

// Width of a single cell in percentage
const cellWidthPercent = computed(() => {
  return totalDays.value > 0 ? (1 / totalDays.value) * 100 : 0;
});

// Group days by month name
const monthGroups = computed(() => {
  if (!patchStart.value || totalDays.value <= 0) return [];
  
  const groups: { month: string; left: number; width: number }[] = [];
  let currentMonthName = '';
  let currentGroup: { month: string; startDayIdx: number; endDayIdx: number } | null = null;
  
  for (let i = 0; i < totalDays.value; i++) {
    const currentDay = patchStart.value.add(i, 'day');
    const monthName = currentDay.format('MMMM'); // Full month name, e.g., "May"
    
    if (monthName !== currentMonthName) {
      if (currentGroup) {
        currentGroup.endDayIdx = i - 1;
        const left = (currentGroup.startDayIdx / totalDays.value) * 100;
        const width = ((currentGroup.endDayIdx - currentGroup.startDayIdx + 1) / totalDays.value) * 100;
        groups.push({
          month: currentGroup.month,
          left,
          width
        });
      }
      currentMonthName = monthName;
      currentGroup = {
        month: monthName,
        startDayIdx: i,
        endDayIdx: i
      };
    }
  }
  
  // Set for the last group
  if (currentGroup) {
    currentGroup.endDayIdx = totalDays.value - 1;
    const left = (currentGroup.startDayIdx / totalDays.value) * 100;
    const width = ((currentGroup.endDayIdx - currentGroup.startDayIdx + 1) / totalDays.value) * 100;
    groups.push({
      month: currentGroup.month,
      left,
      width
    });
  }
  
  return groups;
});

// Generate day cells for headers & grid lines
const dayCells = computed(() => {
  if (!patchStart.value || totalDays.value <= 0) return [];
  
  const list = [];
  const offset = getTzOffsetMinutes(props.timezone);
  const nowInTz = currentNow.value.utc().utcOffset(offset);
  
  for (let i = 0; i < totalDays.value; i++) {
    const currentDay = patchStart.value.add(i, 'day');
    const leftPercent = (i / totalDays.value) * 100;
    
    const dayOfWeek = currentDay.day(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayName = currentDay.format('dd'); // "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"
    const isToday = currentDay.isSame(nowInTz, 'day');

    list.push({
      left: leftPercent,
      dateNumber: currentDay.date(),
      dayName,
      isWeekend,
      isToday
    });
  }
  return list;
});

// Calculate Today's column index for the block layout
const todayIndex = computed(() => {
  if (!patchStart.value || !patchEnd.value || totalDays.value <= 0) return -1;
  
  const offset = getTzOffsetMinutes(props.timezone);
  const nowInTz = currentNow.value.utc().utcOffset(offset);
  const startDay = patchStart.value.startOf('day');
  const todayDay = nowInTz.startOf('day');
  
  const diffDays = todayDay.diff(startDay, 'day');
  if (diffDays >= 0 && diffDays < totalDays.value) {
    return diffDays;
  }
  return -1;
});

// Calculate left & width percentage for event bars
const getBarStyles = (event: TimelineEvent) => {
  if (!patchStart.value || !patchEnd.value || patchDuration.value <= 0) return {};
  
  const isLocal = isLocalEvent(event);
  const start = getTzTime(event.startTime, isLocal);
  const end = getTzTime(event.endTime, isLocal);
  
  // Clamp start and end inside the patch duration
  const clampedStart = start.isBefore(patchStart.value) ? patchStart.value : start;
  const clampedEnd = end.isAfter(patchEnd.value) ? patchEnd.value : end;
  
  const leftSeconds = clampedStart.diff(patchStart.value, 'second');
  const barSeconds = clampedEnd.diff(clampedStart, 'second');
  
  const left = (leftSeconds / patchDuration.value) * 100;
  const width = (barSeconds / patchDuration.value) * 100;
  
  // 3px shorter so back-to-back bars in a shared row stay visibly separate
  return {
    left: Math.max(0, left) + '%',
    width: `calc(${Math.min(100 - left, Math.max(0.5, width))}% - 3px)`
  };
};

// Event key generator for tracking elements
const getEventKey = (event: TimelineEvent) => {
  return `${event.name}-${event.startTime}-${event.endTime}`;
};

// Measure title text overflows to apply marquee animations
const checkOverflows = () => {
  nextTick(() => {
    const bars = document.querySelectorAll('.gantt-bar');
    bars.forEach((bar) => {
      const title = bar.querySelector('.bar-title') as HTMLElement;
      if (title && bar) {
        const textWidth = title.scrollWidth;
        const barWidth = bar.clientWidth - 16; // minus padding
        const key = bar.getAttribute('data-event-key');
        if (key && barWidth > 0) {
          if (textWidth > barWidth) {
            overflowingEvents.value[key] = textWidth - barWidth;
          } else {
            delete overflowingEvents.value[key];
          }
        }
      }
    });
  });
};

// Event status checks
const isPast = (event: TimelineEvent) => {
  const isLocal = isLocalEvent(event);
  return getTzTime(event.endTime, isLocal).isBefore(currentNow.value);
};

const isOngoing = (event: TimelineEvent) => {
  const now = currentNow.value;
  const isLocal = isLocalEvent(event);
  return now.isAfter(getTzTime(event.startTime, isLocal)) && now.isBefore(getTzTime(event.endTime, isLocal));
};

// Tooltip events handler
const handleMouseEnter = (event: TimelineEvent, e: MouseEvent) => {
  if (clickedEvent.value) return; // Disable hover if modal is active
  hoveredEvent.value = event;
  updateTooltipPosition(e);
};

const handleMouseMove = (e: MouseEvent) => {
  if (clickedEvent.value) return;
  updateTooltipPosition(e);
};

const handleMouseLeave = () => {
  hoveredEvent.value = null;
};

const handleEventClick = (event: TimelineEvent, e: MouseEvent) => {
  if (dragMoved) {
    return; // Block click trigger if mouse was dragged
  }
  e.stopPropagation();
  hoveredEvent.value = null; // hide tooltip
  clickedEvent.value = event;
};

// Drag-to-Scroll event handlers
const handleMouseDown = (e: MouseEvent) => {
  if (!scrollContainer.value) return;
  isDragging.value = true;
  startX.value = e.pageX - scrollContainer.value.offsetLeft;
  scrollLeftStart.value = scrollContainer.value.scrollLeft;
  dragMoved = false;
};

const handleMouseMoveContainer = (e: MouseEvent) => {
  if (!isDragging.value || !scrollContainer.value) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.value.offsetLeft;
  const walk = (x - startX.value) * 1.5; // multiplier for scroll speed
  if (Math.abs(x - startX.value) > 4) {
    dragMoved = true;
  }
  scrollContainer.value.scrollLeft = scrollLeftStart.value - walk;
};

const handleMouseUp = () => {
  isDragging.value = false;
};

const handleMouseLeaveContainer = () => {
  isDragging.value = false;
};

const updateTooltipPosition = (e: MouseEvent) => {
  const tooltipWidth = 280;
  const tooltipHeight = 180;
  
  let x = e.clientX + 15;
  let y = e.clientY + 15;
  
  if (x + tooltipWidth > window.innerWidth) {
    x = e.clientX - tooltipWidth - 15;
  }
  if (y + tooltipHeight > window.innerHeight) {
    y = e.clientY - tooltipHeight - 15;
  }
  
  tooltipPosition.value = { x, y };
};


// Base server time — applies game's primary timezone (UTC+8 for WuWa, UTC for PGR)
// wuwaTimeline stores real UTC (T03:00:00Z = 11:00 UTC+8), so we must apply the offset
const formatBaseServerTime = (date: string) => {
  const tz = props.gameTimezone ?? 'Etc/UTC';
  const offset = getTzOffsetMinutes(tz);
  return dayjs.utc(date).utcOffset(offset).format('DD MMM YYYY HH:mm');
};

// Selected game server time (e.g. Asia UTC+8, America UTC-5)
const formatServerTime = (date: string, event: TimelineEvent) => {
  const isLocal = isLocalEvent(event);
  return getTzTime(date, isLocal).format('DD MMM YYYY HH:mm');
};

// Browser device local time — optional
const formatBrowserTime = (date: string, event: TimelineEvent) => {
  const isLocal = isLocalEvent(event);
  const localTime = getTzTime(date, isLocal).local();
  const offset = localTime.format('Z');
  return `${localTime.format('DD MMM YYYY HH:mm')} (GMT${offset})`;
};

watch(() => props.patch, () => {
  checkOverflows();
}, { deep: true });

watch(() => props.timezone, () => {
  checkOverflows();
});

let boardResizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (!props.now) {
    localTimer = window.setInterval(() => {
      localNow.value = dayjs();
    }, 30000);
  }
  
  checkOverflows();
  window.addEventListener('resize', checkOverflows);
  window.addEventListener('keydown', handleKeydown);
  
  // Recalculate overflows once fonts are loaded
  if (document.fonts) {
    document.fonts.ready.then(() => {
      checkOverflows();
    });
  }

  // Set up ResizeObserver to recalculate marquee scroll distances on container size changes
  if (window.ResizeObserver) {
    const boardElement = document.querySelector('.gantt-board');
    if (boardElement) {
      boardResizeObserver = new ResizeObserver(() => {
        checkOverflows();
      });
      boardResizeObserver.observe(boardElement);
    }
  }
  
  nextTick(() => {
    // Initial scroll auto-center on Today
    if (scrollContainer.value && todayIndex.value !== -1) {
      const container = scrollContainer.value;
      const todayPosPercent = todayIndex.value / totalDays.value;
      const scrollAmount = (boardWidth.value * todayPosPercent) - (container.clientWidth / 2);
      if (scrollAmount > 0) {
        container.scrollLeft = scrollAmount;
      }
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', checkOverflows);
  window.removeEventListener('keydown', handleKeydown);
  if (boardResizeObserver) {
    boardResizeObserver.disconnect();
  }
  if (localTimer) clearInterval(localTimer);
});
</script>

<style scoped>
.gantt-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.gantt-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.gantt-title-wrap {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.gantt-card-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.gantt-card-subtitle {
  font-size: 13px;
  color: var(--muted-fg);
  margin-top: 2px;
}

.gantt-legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.legend-item {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-fg);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Legend swatches match the bar colors below */
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}

.legend-dot--gacha { background: var(--primary); }
.legend-dot--event { background: var(--chart-event); }
.legend-dot--drop  { background: var(--chart-drop); }
.legend-dot--web   { background: var(--chart-web); }

/* Scrollboard Container */
.gantt-scroll-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  position: relative;
  cursor: grab;
}

.gantt-scroll-container--dragging {
  cursor: grabbing;
  user-select: none;
}

.gantt-board {
  position: relative;
  padding-bottom: 8px;
}

/* Time Headers */
.gantt-grid-header {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--border);
  background: var(--muted);
  position: relative;
}

.gantt-month-row {
  display: flex;
  height: 24px;
  position: relative;
  border-bottom: 1px solid var(--border);
}

.month-header-cell {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-fg);
  border-right: 1px solid var(--border);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;
}

.gantt-day-row {
  display: flex;
  height: 36px;
  position: relative;
}

.day-header-cell {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  box-sizing: border-box;
}

.day-name {
  font-size: 10px;
  font-weight: 500;
  color: var(--muted-fg);
}

.day-number {
  font-size: 11px;
  font-weight: 700;
  color: var(--fg);
  line-height: 1.1;
  margin-top: 1px;
  font-variant-numeric: tabular-nums;
}

.day-header-cell--weekend .day-number {
  color: var(--muted-fg);
}

.day-header-cell--today .day-name {
  color: var(--fg);
  font-weight: 700;
}

.day-header-cell--today .day-number {
  color: var(--primary-fg);
  background: var(--primary);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Timeline Content area */
.gantt-timeline-content {
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Vertical Grid Lines */
.gantt-grid-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.grid-line {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px solid var(--border);
  opacity: 0.5;
  pointer-events: none;
}

.grid-line--weekend {
  background: color-mix(in srgb, var(--muted) 60%, transparent);
}

/* Today column: the one place on the board that marks "now" */
.today-column-block {
  position: absolute;
  top: 0;
  bottom: 0;
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  border-left: 1px solid color-mix(in srgb, var(--primary) 50%, transparent);
  pointer-events: none;
  z-index: 1;
}

.today-block-tag {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: var(--primary-fg);
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  z-index: 10;
  white-space: nowrap;
}

/* Sections & Rows */
.gantt-section {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--border);
}

.gantt-section:last-child {
  border-bottom: none;
}

.section-label {
  position: sticky;
  left: 0;
  width: max-content;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-fg);
  padding: 8px 16px 4px;
  z-index: 3;
}

.gantt-rows {
  display: flex;
  flex-direction: column;
}

.gantt-row {
  display: flex;
  align-items: stretch;
  min-height: 34px;
  position: relative;
}

.gantt-bar-container {
  flex: 1;
  position: relative;
  padding: 5px 0;
  display: flex;
  align-items: center;
}

/* Event Bars */
.gantt-bar {
  position: absolute;
  height: 24px;
  border: none;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  text-align: left;
  color: #fff;
  cursor: pointer;
  transition: filter 0.15s ease, opacity 0.15s ease;
  /* clip (not hidden) so the bar is not a scroll container and the sticky title below can work */
  overflow: clip;
  z-index: 2;
}

.gantt-bar:hover {
  filter: brightness(1.1);
  z-index: 4;
}

.gantt-bar:focus-visible {
  outline: 2px solid var(--fg);
  outline-offset: 2px;
  z-index: 4;
}

/* The title sticks to the left edge of the visible board, so a bar that
   starts off-screen still shows its name */
.bar-title {
  position: sticky;
  left: 8px;
  flex-shrink: 0;
  white-space: nowrap;
}

/* Long names scroll only while the bar is hovered or focused */
.gantt-bar--overflowing:hover .bar-title,
.gantt-bar--overflowing:focus-visible .bar-title {
  animation: marquee-scroll 6s linear infinite;
}

@keyframes marquee-scroll {
  0%, 15%  { transform: translateX(0); }
  45%, 60% { transform: translateX(var(--scroll-dist)); }
  90%, 100% { transform: translateX(0); }
}

/* Category colors (flat; the legend above uses the same tokens) */
.gantt-bar--gacha {
  background: var(--primary);
  color: var(--primary-fg);
}

.gantt-bar--event       { background: var(--chart-event); color: var(--chart-on); }
.gantt-bar--double-drop { background: var(--chart-drop); color: var(--chart-on); }
.gantt-bar--web         { background: var(--chart-web); color: #1c1917; }

/* Ended bars step back to the muted surface but keep readable text */
.gantt-bar.gantt-bar--past {
  background: var(--muted);
  color: var(--muted-fg);
  box-shadow: inset 0 0 0 1px var(--border);
}

.gantt-bar.gantt-bar--past:hover {
  filter: none;
  color: var(--fg);
}

.gantt-mobile-hint {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted-fg);
  padding: 8px 16px 12px;
  border-top: 1px solid var(--border);
}

.swipe-icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .gantt-mobile-hint {
    display: flex;
  }
}

/* Tooltip (desktop hover) */
.gantt-custom-tooltip {
  position: fixed;
  z-index: 9999;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--card);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-float);
  pointer-events: none;
}

.tooltip-badge-row,
.modal-badge-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.tooltip-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 8px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--fg);
}

/* Type badges carry the same swatch as the legend */
.tooltip-badge--gacha::before,
.tooltip-badge--event::before,
.tooltip-badge--double-drop::before,
.tooltip-badge--web::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.tooltip-badge--gacha::before       { background: var(--primary); }
.tooltip-badge--event::before       { background: var(--chart-event); }
.tooltip-badge--double-drop::before { background: var(--chart-drop); }
.tooltip-badge--web::before         { background: var(--chart-web); }

.tooltip-badge--active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--primary-fg);
}

.tooltip-badge--ended {
  background: var(--muted);
  border-color: var(--muted);
}

.tooltip-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.tooltip-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.tooltip-time-section {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.tooltip-time-heading {
  font-size: 12px;
  color: var(--muted-fg);
}

.tooltip-time-value {
  font-size: 12px;
  font-weight: 500;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.tooltip-desc {
  font-size: 12px;
  color: var(--muted-fg);
  line-height: 1.45;
}

/* Dialog */
.gantt-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgb(0 0 0 / 0.5);
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.gantt-modal-content {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--card);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-float);
}

.gantt-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--muted-fg);
  transition: background 0.15s ease, color 0.15s ease;
}

.gantt-modal-close svg {
  width: 18px;
  height: 18px;
}

.gantt-modal-close:hover {
  background: var(--muted);
  color: var(--fg);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.35;
  padding-right: 32px;
}

.modal-time-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 14px;
  background: var(--muted);
  border-radius: var(--radius-lg);
}

.modal-time-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.modal-time-section--browser {
  border-top: 1px solid var(--border);
  padding-top: 10px;
}

.modal-time-heading {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-fg);
}

.modal-time-detail {
  font-size: 14px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.modal-desc-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-desc-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-fg);
}

.modal-desc-text {
  font-size: 14px;
  line-height: 1.5;
}

.modal-link-box {
  display: flex;
  justify-content: flex-end;
}

.modal-link-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  background: var(--primary);
  color: var(--primary-fg);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s ease;
}

.modal-link-button:hover {
  background: color-mix(in srgb, var(--primary) 88%, var(--bg));
}

.external-link-icon {
  width: 14px;
  height: 14px;
}

/* Touch screens get 44px tap targets */
@media (pointer: coarse) {
  .gantt-modal-close { width: 44px; height: 44px; top: 8px; right: 8px; }
}
</style>
