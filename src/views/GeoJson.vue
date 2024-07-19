<template>
  <div class="geoJson">
    <div id="map"></div>
    <div id="info"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import initMap from '@/hooks/useMap.vue'
import View from 'ol/View.js'
import Fill from 'ol/style/Fill.js'
import Style from 'ol/style/Style.js'
import Stroke from 'ol/style/Stroke.js'
import Vector from 'ol/source/Vector.js'
import VectorLayer from 'ol/layer/Vector.js'
import { GeoJSON } from 'ol/format.js'
import type { Pixel } from 'ol/pixel.d.ts'
import type Feature from 'ol/Feature.d.ts'

onMounted(() => {
  let map = initMap('map')
  // 创建视图
  const view = new View({
    // 视图的初始中心
    center: [114.3, 30.5],
    // 默认为 EPSG:3857
    projection: 'EPSG:4326',
    // 初始视图分辨率
    zoom: 4,
    // 地图旋卷角度
    rotation: 0
  })
  // 创建图层
  let newLayer = new VectorLayer({
    // 设置图层数据源
    source: new Vector({
      url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
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

  let highlightVectorLayer = new VectorLayer({
    source: new Vector({}),
    style: new Style({
      fill: new Fill({
        color: 'rgba(25,222,252,.8)'
      })
    })
  })

  const infoDom = document.getElementById('info') as HTMLElement

  let lastFeature: Feature | undefinde

  function displayFeatureInfo(pixel: Pixel) {
    const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
      return feature as Feature
    })
    // 设置提示框信息
    if (feature) {
      // 此处通过get函数获取的数据,是通过GeoJSON数据中的对应的字段来获取的
      // 估计是通过获取feature上的values_内的数据来实现的get方法
      const cityName = feature.get('name')
      const cityLevel = feature.get('level')
      const cityChildNum = feature.get('childrenNum')
      infoDom.innerHTML = `name:${cityName},cityLevel:${cityLevel}, childrenNum:${cityChildNum}`
    } else {
      infoDom.innerHTML = ''
    }
    // 设置提示框位置
    if (feature) {
      info.style.left = pixel[0] - infoDom.offsetWidth / 2 + 'px'
      info.style.top = pixel[1] + 30 + 'px'
      info.style.display = 'visible'
    } else {
      info.style.display = 'hidden'
    }

    // 设置高亮图层信息
    if (lastFeature !== feature) {
      if (lastFeature) {
        highlightVectorLayer.getSource()?.removeFeature(lastFeature)
      }
      if (feature) {
        highlightVectorLayer.getSource()?.addFeature(feature)
      }
      lastFeature = feature
    }
  }

  // 添加图层
  map.addLayer(newLayer)
  map.addLayer(highlightVectorLayer)
  // 添加视图
  map.setView(view)

  map.on('pointermove', function (e) {
    // 检测当前是否为地图的拖动
    if (e.dragging) return false
    // 返回浏览器事件相对于视口的地图像素位置。
    const pixel = map.getEventPixel(e.originalEvent)
    displayFeatureInfo(pixel)
  })
})
</script>

<style scoped>
#geoJson {
  position: relative;
}
#info {
  position: absolute;
  background: rgba(000, 000, 000, 0.6);
  color: #fff;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
