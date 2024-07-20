<template>
  <div class="HeatMap">
    <div id="map"></div>
    <div id="tool">
      <div>
        <label for="radius">radius size</label>
        <input
          id="radius"
          type="range"
          min="1"
          max="50"
          step="1"
          v-model="radius"
          @input="changeRadius"
        />
        <label for="blur">blur size</label>
        <input
          id="blur"
          type="range"
          min="1"
          max="50"
          step="1"
          value="15"
          v-model="blur"
          @input="changeBlur"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import initMap from '@/hooks/useMap.vue'
import { Feature, Map, View } from 'ol'
import { onMounted, ref } from 'vue'
import Vector from 'ol/source/Vector.js'
import Heatmap from 'ol/layer/Heatmap.js'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { Point } from 'ol/geom'

const radius = ref('8')
const blur = ref('1')

let map: Map

// 创建视图
const view = new View({
  // 视图的初始中心
  center: [139.6, 36.9],
  // 默认为 EPSG:3857
  projection: 'EPSG:4326',
  // 初始视图分辨率
  zoom: 5.6,
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

const pointList = [
  [139.6, 36.9],
  [141.199, 39.93],
  [137.2, 35.28],
  [138.95, 35.05],
  [132.677, 34.71],
  [139.775, 36.645],
  [137.7, 35.05],
  [138.88, 35.54],
  [138.3, 35.19],
  [141.07, 39.54],
  [133.09, 34.84],
  [138.02, 36.118],
  [140.37, 39.004],
  [137.71, 35.59]
]

// 创建热点图层
// 热点图,在地图上绘制多个点,然后通过设置每个点的半径与模糊大小.
// 再根据计算出来的权重值来设置每个点的透明度.
const heatMapLayer = new Heatmap({
  source: new Vector({}),
  // 模糊大小
  blur: parseInt(blur.value, 10),
  // 点半径
  radius: parseInt(`${radius.value}`, 10),
  // 权重
  weight: (feature) => {
    return feature.get('index') / pointList.length
  }
})

function addPoint() {
  pointList.map((coordinates, index) => {
    var pointFeature = new Feature({
      geometry: new Point(coordinates)
    })
    pointFeature.set('index', index)
    heatMapLayer.getSource()?.addFeature(pointFeature)
  })
}

addPoint()

function changeBlur() {
  heatMapLayer.setBlur(parseInt(blur.value, 10))
}

function changeRadius() {
  heatMapLayer.setRadius(parseInt(radius.value, 10))
}

onMounted(() => {
  map = initMap('map')
  map.setView(view)
  map.addLayer(newLayer)
  map.addLayer(heatMapLayer)
})
</script>

<style scoped></style>
