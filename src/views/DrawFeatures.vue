<template>
  <div class="draw-featrue">
    <div id="map"></div>
    <div class="group">
      <label for="drawType">画画</label>
      <select name="drawType" id="drawType" v-model="draw" @change="changeDrawType">
        <option :value="item" v-for="item in drawType" :key="item">{{ item }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import initMap from '@/hooks/useMap.vue'
import { Map, View } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import Vector from 'ol/source/Vector.js'
import { GeoJSON } from 'ol/format'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Draw from 'ol/interaction/Draw.js'
import type { Type } from 'ol/geom/Geometry'

const drawType = ['Point', 'LineString', 'Circle', 'Polygon']

const draw = ref(drawType[0])
const source = new Vector({})
let map: Map

onMounted(() => {
  map = initMap('map')
  // 创建视图
  const view = new View({
    // 视图的初始中心
    center: [114.3, 30.5],
    // 默认为 EPSG:3857
    projection: 'EPSG:4326',
    // 初始视图分辨率
    zoom: 10,
    // 地图旋卷角度
    rotation: 0
  })
  // 创建图层
  let newLayer = new VectorLayer({
    // 设置图层数据源
    source: new Vector({
      url: 'https://openlayers.org/data/vector/ecoregions.json',
      // Feature format for reading and writing data in the GeoJSON format.
      format: new GeoJSON()
    }),
    // 设置图层样式
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(25,222,252,.1)',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 255, .4)'
      })
    })
  })

  const style = new Style({
    stroke: new Stroke({
      color: 'rgba(25,222,252,.1)',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, .4)'
    })
  })

  console.log(style.getFill(), style.getStroke())

  // 画画图层
  const drawLayer = new VectorLayer({
    source: source,
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.2)',
      'stroke-color': '#ffcc33',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#ffcc33'
    }
  })

  map.setView(view)
  map.addLayer(newLayer)
  map.addLayer(drawLayer)
  changeDrawType()
})

let drawSource: Draw
function changeDrawType() {
  if (drawSource) {
    // 清除未画完的图形
    map.removeInteraction(drawSource)
  }
  drawSource = new Draw({
    type: draw.value as Type,
    source: source
  })

  map.addInteraction(drawSource)
}
</script>

<style lang="scss" scoped></style>
