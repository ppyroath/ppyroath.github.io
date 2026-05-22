<template>
  <div v-if="patch" class="gantt-card">
    <div class="gantt-card-header">
      <div class="gantt-title-wrap">
        <h3 class="gantt-card-title">Version {{ patch.patchVersion }} Timeline</h3>
        <span class="gantt-card-subtitle">{{ patch.patchName }}</span>
      </div>
      <div class="gantt-legend">
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
                v-for="event in gachaEvents" 
                :key="event.name" 
                class="gantt-row"
              >
                <div class="gantt-bar-container">
                  <div 
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Events -->
          <div v-if="otherEvents.length > 0" class="gantt-section">
            <div class="section-label">Events & Activities</div>
            <div class="gantt-rows">
              <div 
                v-for="event in otherEvents" 
                :key="event.name" 
                class="gantt-row"
              >
                <div class="gantt-bar-container">
                  <div 
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
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
    
    <div class="gantt-mobile-hint">
      <svg class="swipe-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>
      </svg>
      Swipe horizontally to view full calendar
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
          <span class="tooltip-time-heading">MAIN</span>
          <span class="tooltip-time-value">{{ formatBaseServerTime(hoveredEvent.startTime) }} – {{ formatBaseServerTime(hoveredEvent.endTime) }}</span>
        </div>
        <div class="tooltip-time-section">
          <span class="tooltip-time-heading">SERVER</span>
          <span class="tooltip-time-value">{{ formatServerTime(hoveredEvent.startTime, hoveredEvent) }} – {{ formatServerTime(hoveredEvent.endTime, hoveredEvent) }}</span>
        </div>
        <div v-if="showBrowserTime" class="tooltip-time-section tooltip-time-section--browser">
          <span class="tooltip-time-heading">LOCAL</span>
          <span class="tooltip-time-value tooltip-time-value--browser">{{ formatBrowserTime(hoveredEvent.startTime, hoveredEvent) }} – {{ formatBrowserTime(hoveredEvent.endTime, hoveredEvent) }}</span>
        </div>
      </div>
      <p v-if="hoveredEvent.description" class="tooltip-desc">{{ hoveredEvent.description }}</p>
    </div>

    <!-- Custom Modal/Dialog for Clicked Event Details -->
    <div v-if="clickedEvent" class="gantt-modal-backdrop" @click="clickedEvent = null">
      <div class="gantt-modal-content" :style="{ borderColor: 'var(--md-primary)' }" @click.stop>
        <button class="gantt-modal-close" @click="clickedEvent = null">&times;</button>
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
        <h3 class="modal-title">{{ clickedEvent.name }}</h3>
        <div class="modal-time-box">
          <div class="modal-time-section">
            <span class="modal-time-heading">MAIN:</span>
            <div class="modal-time-detail">Start: {{ formatBaseServerTime(clickedEvent.startTime) }}</div>
            <div class="modal-time-detail">End: &nbsp;{{ formatBaseServerTime(clickedEvent.endTime) }}</div>
          </div>
          <div class="modal-time-section">
            <span class="modal-time-heading">SERVER:</span>
            <div class="modal-time-detail">Start: {{ formatServerTime(clickedEvent.startTime, clickedEvent) }}</div>
            <div class="modal-time-detail">End: &nbsp;{{ formatServerTime(clickedEvent.endTime, clickedEvent) }}</div>
          </div>
          <div v-if="showBrowserTime" class="modal-time-section modal-time-section--browser">
            <span class="modal-time-heading">LOCAL:</span>
            <div class="modal-time-detail">Start: {{ formatBrowserTime(clickedEvent.startTime, clickedEvent) }}</div>
            <div class="modal-time-detail">End: &nbsp;{{ formatBrowserTime(clickedEvent.endTime, clickedEvent) }}</div>
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
            <span>Visit Event Page</span>
            <svg class="external-link-icon" viewBox="0 0 24 24" fill="currentColor">
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
  
  return {
    left: Math.max(0, left) + '%',
    width: Math.min(100 - left, Math.max(0.5, width)) + '%'
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
  if (boardResizeObserver) {
    boardResizeObserver.disconnect();
  }
  if (localTimer) clearInterval(localTimer);
});
</script>

<style scoped>
.gantt-card {
  background: var(--md-surface-container);
  border-radius: var(--radius-xl);
  border: 1px solid var(--md-outline-variant);
  padding: 18px 0 10px 0;
  margin-top: 12px;
  margin-bottom: 24px;
  box-shadow: var(--elev-1);
  overflow: hidden;
}

.gantt-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 18px 14px 18px;
  border-bottom: 1px solid var(--md-outline-variant);
}

.gantt-title-wrap {
  display: flex;
  flex-direction: column;
}

.gantt-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--md-on-surface);
}

.gantt-card-subtitle {
  font-size: 0.8rem;
  color: var(--md-on-surface-variant);
  font-weight: 500;
  margin-top: 2px;
}

.gantt-legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.legend-item {
  font-size: 11px;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot--gacha { background: var(--md-primary); }
.legend-dot--event { background: #3b82f6; }
.legend-dot--drop { background: #10b981; }
.legend-dot--web { background: #f59e0b; }

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
  border-bottom: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-low);
  position: relative;
}

.gantt-month-row {
  display: flex;
  height: 22px;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.month-header-cell {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--md-on-surface-variant);
  border-right: 1px solid var(--md-outline-variant);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;
}

.gantt-day-row {
  display: flex;
  height: 32px;
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
  border-right: 1px solid rgba(255, 255, 255, 0.04);
  pointer-events: none;
  box-sizing: border-box;
}

.day-header-cell--today {
  background: color-mix(in srgb, var(--md-primary) 10%, transparent);
}

.day-header-cell--today .day-name {
  color: var(--md-primary) !important;
  opacity: 1 !important;
  font-weight: 800;
}

.day-header-cell--today .day-number {
  color: var(--md-on-primary) !important;
  background: var(--md-primary);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.day-header-cell--weekend {
  background: rgba(255, 255, 255, 0.02);
}

.day-name {
  font-size: 8px;
  font-weight: 700;
  color: var(--md-on-surface-variant);
  text-transform: uppercase;
  opacity: 0.8;
}

.day-header-cell--weekend .day-name {
  color: var(--md-primary);
  opacity: 1;
}

.day-number {
  font-size: 10px;
  font-weight: 800;
  color: var(--md-on-surface);
  line-height: 1.1;
  margin-top: 1px;
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
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 1;
}

.grid-line {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px solid var(--md-outline-variant);
  opacity: 0.15;
  pointer-events: none;
}

.grid-line--weekend {
  background: rgba(255, 255, 255, 0.015);
}

/* Today Highlight Column Block */
.today-column-block {
  position: absolute;
  top: 0;
  bottom: 0;
  background: color-mix(in srgb, var(--md-primary) 10%, transparent);
  pointer-events: none;
  z-index: 1;
}

.today-block-tag {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--md-primary);
  color: var(--md-on-primary);
  font-size: 7px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 1px 3px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  z-index: 10;
  white-space: nowrap;
}

/* Sections & Rows */
.gantt-section {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--md-outline-variant);
}

.section-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--md-primary);
  background: var(--md-surface-container-high);
  padding: 4px 12px;
  border-bottom: 1px solid var(--md-outline-variant);
  z-index: 3;
}

.gantt-rows {
  display: flex;
  flex-direction: column;
}

.gantt-row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--md-outline-variant);
  min-height: 38px;
  position: relative;
}

.gantt-row:last-child {
  border-bottom: none;
}

.gantt-bar-container {
  flex: 1;
  position: relative;
  background: transparent;
  padding: 6px 0;
  display: flex;
  align-items: center;
}

/* Event Bars */
.gantt-bar {
  position: absolute;
  height: 22px;
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease, opacity 0.25s ease;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

/* Faded Style for Past Events */
.gantt-bar--past {
  opacity: 0.3;
  filter: grayscale(1) brightness(0.75);
}

.gantt-bar:hover {
  transform: scaleY(1.05);
  filter: brightness(1.15);
  z-index: 4;
}

.gantt-bar--past:hover {
  opacity: 0.8;
  filter: grayscale(0.2) brightness(1.0);
}

/* Auto-Marquee text if name is too long */
.bar-title {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gantt-bar--overflowing .bar-title {
  animation: marquee-scroll 10s linear infinite;
  display: inline-block;
  width: auto;
  text-overflow: clip;
}

.gantt-bar:hover .bar-title {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  15% { transform: translateX(0); } /* pause at start */
  45% { transform: translateX(var(--scroll-dist)); }
  60% { transform: translateX(var(--scroll-dist)); } /* pause at end */
  90% { transform: translateX(0); }
  100% { transform: translateX(0); }
}

/* Event Types Colors */
.gantt-bar--gacha {
  background: linear-gradient(90deg, var(--md-primary) 0%, color-mix(in srgb, var(--md-primary) 85%, #000) 100%);
  color: var(--md-on-primary);
}

.gantt-bar--event {
  background: linear-gradient(90deg, hsl(217, 91%, 60%) 0%, hsl(224, 76%, 48%) 100%);
}

.gantt-bar--double-drop {
  background: linear-gradient(90deg, hsl(160, 84%, 39%) 0%, hsl(163, 94%, 24%) 100%);
}

.gantt-bar--web {
  background: linear-gradient(90deg, hsl(38, 92%, 50%) 0%, hsl(32, 95%, 44%) 100%);
}

.gantt-mobile-hint {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: var(--md-on-surface-variant);
  margin-top: 8px;
  text-align: center;
}

.swipe-icon {
  width: 14px;
  height: 14px;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .gantt-mobile-hint {
    display: flex;
  }
}

/* Custom Tooltip Styling */
.gantt-custom-tooltip {
  position: fixed;
  z-index: 9999;
  background: rgba(16, 16, 24, 0.96);
  border: 1px solid var(--md-outline);
  border-radius: var(--radius-lg);
  padding: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  pointer-events: none;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 4px solid var(--md-primary);
  transition: opacity 0.15s ease;
}

.tooltip-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tooltip-badge {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.tooltip-badge--gacha {
  background: rgba(176, 176, 208, 0.15);
  color: var(--md-primary);
}
.tooltip-badge--event {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}
.tooltip-badge--double-drop {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}
.tooltip-badge--web {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.tooltip-badge--ended {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}
.tooltip-badge--active {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}
.tooltip-badge--upcoming {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.tooltip-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.35;
}

.tooltip-time {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tooltip-time-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tooltip-time-heading {
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
}

.tooltip-time-value {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.tooltip-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.45;
  margin: 0;
}

.tooltip-time-section--browser {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 4px;
  margin-top: 2px;
}

.tooltip-time-value--browser {
  color: rgba(147, 204, 255, 0.85);
}

.modal-time-section--browser {
  border-top: 1px solid var(--md-outline-variant);
  padding-top: 8px;
  margin-top: 4px;
}

.modal-time-section--browser .modal-time-heading {
  color: rgba(147, 204, 255, 0.9);
}

.modal-time-section--browser .modal-time-detail {
  color: rgba(147, 204, 255, 0.75);
}

/* Modal Backdrop & Contents */
.gantt-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 14, 0.7);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.gantt-modal-content {
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline);
  border-radius: var(--radius-xl);
  padding: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: var(--elev-3);
  position: relative;
  border-left: 6px solid var(--md-primary);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.gantt-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: var(--md-on-surface-variant);
  font-size: 24px;
  font-weight: 500;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: background 0.15s ease, color 0.15s ease;
}

.gantt-modal-close:hover {
  background: var(--state-hover);
  color: var(--md-on-surface);
}

.gantt-modal-close:active {
  background: var(--state-pressed);
}

.modal-badge-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
  margin-top: 4px;
}

.modal-time-box {
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-time-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-time-heading {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--md-primary);
}

.modal-time-detail {
  font-size: 12px;
  font-weight: 600;
  color: var(--md-on-surface);
  white-space: pre-wrap;
}

.modal-desc-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-desc-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--md-on-surface-variant);
}

.modal-desc-text {
  font-size: 13px;
  color: var(--md-on-surface);
  line-height: 1.5;
}

/* Modal CTA Link Button */
.modal-link-box {
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
}

.modal-link-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--md-primary) 0%, color-mix(in srgb, var(--md-primary) 85%, #000) 100%);
  color: var(--md-on-primary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.modal-link-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
  filter: brightness(1.08);
}

.modal-link-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.external-link-icon {
  width: 14px;
  height: 14px;
}
</style>
