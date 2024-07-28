<template>
  <div class="measure-page">
    <div id="map"></div>
    <form>
      <label for="type">绘画类型 &nbsp;</label>
      <select id="type" v-model="value" @change="changeType">
        <option v-for="{ value, label } in types" :value="value" :key="value">{{ label }}</option>
      </select>
    </form>
  </div>
</template>

<script lang="ts" setup>
import initMap from '@/hooks/useMap.vue'
import { Map, Overlay, VectorTile, View } from 'ol'
import Draw from 'ol/interaction/Draw'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { onMounted, ref } from 'vue'
import Vector from 'ol/source/Vector.js'
import VectorLayer from 'ol/layer/Vector'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import CircleStyle from 'ol/style/Circle'
import { unByKey } from 'ol/Observable'
import type { EventsKey } from 'ol/events'
import { getArea, getLength } from 'ol/sphere'
import type { Geometry } from 'ol/geom'
import type { Type } from 'ol/geom/Geometry'
import type { Coordinate } from 'ol/coordinate'

const types = [
  {
    value: 'LineString',
    label: 'Length (LineString)'
  },
  {
    value: 'Polygon',
    label: 'Area (Polygon)'
  }
]
const value = ref(types[0].value)

// 创建视图
const view = new View({
  // 视图的初始中心
  center: [114.3, 30.5],
  // 默认为 EPSG:3857
  projection: 'EPSG:4326',
  // 初始视图分辨率
  zoom: 14,
  // 地图旋卷角度
  rotation: 0
})
// 创建图层
const newLayer = new TileLayer({
  // 设置图层数据源
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    // Feature format for reading and writing data in the GeoJSON format.
  })
})
const drawSource = new Vector()

// 创建绘图
let draw: Draw

const drawStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)'
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    // 描边设置为虚线
    lineDash: [10, 10],
    width: 2
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)'
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, .3)'
    })
  })
})

let map: Map
// 设置覆盖物基础信息

let listener: EventsKey
let drawendListener: EventsKey

let measureTooltipElement: HTMLElement | undefined
let measureTooltip: Overlay

// 距离转换
function formatLength(geom: Geometry) {
  let length = getLength(geom, {
    projection: 'EPSG:4326'
  })
  if (length < 1000) {
    return `${Math.round(length * 100) / 100}m`
  } else {
    return `${Math.round((length / 1000) * 100) / 100}km`
  }
}
// 面积转换
const formatArea = function (geom: Geometry) {
  const area = getArea(geom, {
    projection: 'EPSG:4326'
  })
  let output
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + '' + 'km<sup>2</sup>'
  } else {
    output = Math.round(area * 100) / 100 + '' + 'm<sup>2</sup>'
  }
  return output
}

function changeType() {
  map?.removeInteraction(draw)
  addInteraction()
}

// 绘画事件
function addInteraction() {
  draw = new Draw({
    type: value.value as Type,
    source: drawSource,
    style: () => {
      if (value.value === types[0].value) return drawStyle
      let newDrawStyle = drawStyle.clone()
      newDrawStyle.setFill(
        new Fill({
          color: 'rgba(255, 255, 255, 0.8)'
        })
      )
      return newDrawStyle
    }
  })

  draw.on('drawstart', (event) => {
    // map.addOverlay(overlay)
    createMeasureTooltip()
    listener = event?.feature?.getGeometry().on('change', (evt) => {
      const geom: Geometry = evt.target
      let Coordinate: Coordinate
      let distance: string
      if (value.value === types[0].value) {
        // 获取绘制几何图的最后一个坐标
        Coordinate = evt.target.getLastCoordinate()
        distance = formatLength(geom)
      } else {
        Coordinate = evt.target.getInteriorPoint().getCoordinates()

        console.log(evt.target.getArea())
        distance = formatArea(geom)
      }
      ;(measureTooltipElement as HTMLElement).innerHTML = distance
      measureTooltip.setPosition(Coordinate)
    })

    drawendListener = draw.on('drawend', (event) => {
      let vector = new VectorLayer({
        source: drawSource,
        style: new Style({
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2
          })
        })
      })
      map.addLayer(vector)
      // 取消监听change事件
      unByKey(listener)
      unByKey(drawendListener)
      // debugger
      createMeasureTooltip()
      measureTooltipElement = undefined

      console.log(map.getLayers())
    })
  })

  map.addInteraction(draw)
}

// 绘制距离/面积提示
function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.classList.add('measure')
  } else {
    measureTooltipElement = document.createElement('div')
    measureTooltipElement.classList.add('tool')
    measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false
    })
    map.addOverlay(measureTooltip)
  }
}

onMounted(() => {
  map = initMap('map')

  map.setView(view)
  map.addLayer(newLayer)
  // 添加绘图对象
  addInteraction()
})
</script>

<style>
.measure-page {
  position: relative;
}
.tool {
  position: absolute;
  padding-left: 6px;
  padding-right: 6px;
  background-color: rgba(000, 000, 000, 0.3);
}

.tool.measure {
  background-color: rgba(176, 61, 61, 0.516);
}
</style>
