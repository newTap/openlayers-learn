<template>
  <div class="cluster-page">
    <div id="map"></div>
    <button @click="changeLayer(0)">平面图</button>
    <button @click="changeLayer(1)">卫星图</button>
  </div>
</template>

<script lang="ts" setup>
import initMap from '@/hooks/useMap.vue'
import Cluster from 'ol/source/Cluster'
import { View, type Map } from 'ol'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import XYZ from 'ol/source/XYZ'
import { onMounted } from 'vue'
import VectorSource from 'ol/source/Vector'
import { GeoJSON } from 'ol/format'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import CircleStyle from 'ol/style/Circle'
import Text from 'ol/style/Text'

let map: Map

let currentType: number = 0

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
    url: `https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=US&x={x}&y={y}&z={z}`
    // Feature format for reading and writing data in the GeoJSON format.
  })
})

// 卫星图层
const newLayer2 = new TileLayer({
  // 设置图层数据源
  source: new XYZ({
    url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
  })
})

const layer = new VectorLayer({
  source: new Cluster({
    // 集群要素聚在一起的距离
    distance: 40,
    source: new VectorSource({
      url: './geoJson.json',
      format: new GeoJSON()
    })
  }),
  zIndex: 2,
  style: styleFunction
})

const baseStyle = new Style({
  image: new CircleStyle({
    radius: 10,
    fill: new Fill({
      color: '#ff0000'
    })
  })
})

function styleFunction(feature) {
  const size = feature.get('features').length
  if (size > 1) {
    const style = baseStyle.clone()
    style.getImage().setScale(size / 20 + 1)
    style.setText(
      new Text({
        text: size.toString(),
        fill: new Fill({
          color: '#fff'
        }),
        scale: 1.4
      })
    )
    return style
  } else {
    return baseStyle
  }
}

function changeLayer(type: number) {
  console.log('type', type)
  console.log('currentType', currentType)

  if (type == currentType) return false
  currentType = type
  if (type) {
    map.removeLayer(newLayer)
    map.addLayer(newLayer2)
  } else {
    map.removeLayer(newLayer2)
    map.addLayer(newLayer)
  }
  console.log(map.getLayers())
  // map.removeLayer(newLayer2)
}

onMounted(() => {
  map = initMap('map')
  map.addLayer(layer)
  map.addLayer(newLayer)
  map.setView(view)
})
</script>

<style scoped></style>
