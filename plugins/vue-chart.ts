import Vue, { PropType } from 'vue'
import { ChartData, ChartOptions } from 'chart.js'
import { Doughnut, Bar, mixins } from 'vue-chartjs'
import { Plugin } from '@nuxt/types'

type ChartVCData = { chartData: ChartData }
type ChartVCMethod = {
  renderChart(chartData: ChartData, options: ChartOptions): void
}
type ChartVCComputed = unknown
type ChartVCProps = { options: Object }

const rgba0 = 'rgba(255,255,255,0)'
const rgba1 = 'rgba(255,255,255,1)'

const VueChartPlugin: Plugin = () => {
  const { reactiveProp } = mixins

  Vue.component<ChartVCData, ChartVCMethod, ChartVCComputed, ChartVCProps>(
    'doughnut-chart',
    {
      extends: Doughnut,
      mixins: [reactiveProp],
      props: {
        options: {
          type: Object as PropType<ChartOptions>,
          default: () => {}
        }
      },
      mounted(): void {
        this.renderChart(this.chartData, this.options)
      }
    }
  )

  Vue.component<ChartVCData, ChartVCMethod, ChartVCComputed, ChartVCProps>(
    'bar',
    {
      extends: Bar,
      mixins: [reactiveProp],
      props: {
        options: {
          type: Object,
          default: () => {}
        }
      },
      mounted(): void {
        this.renderChart(this.chartData, this.options)
      }
    }
  )
}

export default VueChartPlugin

export const yAxesBgPlugin: Chart.PluginServiceRegistrationOptions[] = [
  {
    beforeDraw(chartInstance) {
      const ctx = chartInstance.ctx as CanvasRenderingContext2D

      // プロットエリアマスク用
      ctx.fillStyle = '#fff'
      ctx.fillRect(
        0,
        0,
        chartInstance.chartArea.left,
        chartInstance.chartArea.bottom + 1
      )

      // 横軸マスク用
      const gradient = ctx.createLinearGradient(
        0,
        0,
        chartInstance.chartArea.left,
        0
      )
      gradient.addColorStop(0, rgba1)
      gradient.addColorStop(1, rgba0)
      ctx.fillStyle = gradient
      ctx.fillRect(
        0,
        chartInstance.chartArea.bottom + 1,
        chartInstance.chartArea.left,
        (chartInstance.height as number) - chartInstance.chartArea.bottom - 1
      )
    }
  }
]

export const yAxesBgRightPlugin: Chart.PluginServiceRegistrationOptions[] = [
  {
    beforeDraw(chartInstance) {
      const ctx = chartInstance.ctx as CanvasRenderingContext2D

      // プロットエリアマスク用
      ctx.fillStyle = '#fff'
      ctx.fillRect(
        chartInstance.chartArea.right,
        0,
        chartInstance.width as number,
        chartInstance.chartArea.bottom + 1
      )
      ctx.fillRect(
        0,
        0,
        chartInstance.chartArea.left,
        chartInstance.chartArea.bottom + 1
      )
      // 横軸マスク用
      const gradientr = ctx.createLinearGradient(
        chartInstance.chartArea.right,
        0,
        chartInstance.width as number,
        0
      )
      const gradient = ctx.createLinearGradient(
        0,
        0,
        chartInstance.chartArea.left,
        0
      )
      gradient.addColorStop(0, rgba1)
      gradient.addColorStop(1, rgba0)
      gradientr.addColorStop(1, rgba0)
      gradientr.addColorStop(0, rgba1)
      ctx.fillStyle = gradientr
      ctx.fillRect(
        chartInstance.chartArea.right,
        chartInstance.chartArea.bottom + 1,
        chartInstance.width as number,
        (chartInstance.height as number) - chartInstance.chartArea.bottom - 1
      )
      ctx.fillStyle = gradient
      ctx.fillRect(
        0,
        chartInstance.chartArea.bottom + 1,
        chartInstance.chartArea.left,
        (chartInstance.height as number) - chartInstance.chartArea.bottom - 1
      )
    }
  }
]
