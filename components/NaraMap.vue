<template>
  <div ref="wrapper" class="Wrapper">
    <div class="NaraMap">
      <div class="NaraMap-MunicipalitiesContainer">
        <a
          v-for="[k, v] in data"
          :key="k"
          :href="v.href"
          target="_blank"
          rel="noopener"
        >
          <div
            :style="{
              gridColumn: v.column,
              gridRow: v.row
            }"
          >
            <ruby>
              {{ v.name }}
              <rp><br /></rp>
              <rt>{{ v.kana }}</rt>
              <rp><br /></rp>
            </ruby>
          </div>
          <aside
            v-for="(aside, i) in v.asides || []"
            :key="i"
            :class="aside.directions"
            :style="{
              gridColumn: aside.column,
              gridRow: aside.row
            }"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
declare global {
  interface ResizeObserver {
    disconnect(): void
    observe(element: HTMLElement): void
    unobserve(element: HTMLElement): void
  }

  interface ResizeObserverEntry {
    contentRect: DOMRectReadOnly
    target: HTMLElement
  }

  interface ResizeObserverConstructor {
    new (
      callback: (
        entries: ResizeObserverEntry[],
        observer: ResizeObserver
      ) => void
    ): ResizeObserver
  }

  let ResizeObserver: ResizeObserverConstructor | undefined
}

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data(this: {
    readonly tryResize: (target: Element, contentRect: DOMRectReadOnly) => void
  }) {
    return {
      resizeObserver:
        typeof ResizeObserver === 'function' &&
        new ResizeObserver(entries => {
          for (const entry of entries) {
            this.tryResize(entry.target, entry.contentRect)
          }
        })
    }
  },
  mounted(this: {
    readonly $refs: {
      readonly wrapper: HTMLElement
    }
    readonly resizeObserver?: ResizeObserver
    readonly tryResize: (target: Element, contentRect: DOMRectReadOnly) => void
  }) {
    if (this.resizeObserver) {
      this.resizeObserver.observe(this.$refs.wrapper)
    }

    this.tryResize(
      this.$refs.wrapper,
      this.$refs.wrapper.getBoundingClientRect()
    )
  },
  beforeDestroy(this: { readonly resizeObserver?: ResizeObserver }) {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  },
  methods: {
    tryResize(
      this: Vue & {
        readonly $props: {
          readonly hideOnSmall?: boolean
        }
      },
      target: HTMLElement,
      contentRect: DOMRectReadOnly
    ) {
      const percentage = contentRect.width / 384

      if (this.$props.hideOnSmall && percentage < 1) {
        target.classList.add('hidden')
        target.style.removeProperty('font-size')
      } else {
        target.classList.remove('hidden')
        target.style.fontSize = `${percentage}em`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin border($width) {
  > aside {
    &.b {
      border-bottom-width: $width;
      margin-bottom: -$width;
    }

    &.l {
      border-left-width: $width;
      margin-left: -$width;
    }

    &.r {
      border-right-width: $width;
      margin-right: -$width;
    }

    &.t {
      border-top-width: $width;
      margin-top: -$width;
    }
  }

  > div:only-child {
    border-width: $width;
    margin: -$width;
  }
}

.Wrapper {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;

  &.hidden {
    font-size: 0;
    visibility: hidden;
  }
}

.NaraMap {
  box-sizing: border-box;
  line-height: 0;
  position: relative;
  width: 24em;

  &::before {
    content: '';
    display: block;
    padding: 150% 0 0;
  }

  &-MunicipalitiesContainer {
    display: grid;
    grid: 1fr 6fr repeat(17, 2fr 6fr) 1fr/1fr 6fr repeat(11, 2fr 6fr) 1fr;
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;

    > a {
      @include border(0.0625em);

      /* autoprefixer: ignore next */
      display: contents;
      font-size: 1em;

      &[href]:hover {
        @include border(0.125em);

        font-weight: bold;
      }

      &:not([href]) {
        color: $gray-3 !important;
        cursor: default;
      }

      > * {
        border: solid 0 currentColor;
      }

      > div:only-child,
      > aside {
        background: $white;
      }

      > div {
        align-items: center;
        display: flex;
        justify-content: center;
        z-index: 1;

        &:only-child {
          border-radius: 0.125em;
        }

        > ruby {
          font-size: 0.75em;
        }
      }

      > aside {
        &.b {
          &.l {
            border-bottom-left-radius: 0.125em;
          }

          &.r {
            border-bottom-right-radius: 0.125em;
          }
        }

        &.t {
          &.l {
            border-top-left-radius: 0.125em;
          }

          &.r {
            border-top-right-radius: 0.125em;
          }
        }
      }
    }
  }
}
</style>
