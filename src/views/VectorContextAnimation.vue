<template>
  <div class="vector-context-animation">
    <div id="map"></div>
    <div class="tool">
      <button @click="addPoint">add point</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import initMap from '@/hooks/useMap.vue'
import { Feature, Map, View } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import { onMounted } from 'vue'
import Vector from 'ol/source/Vector.js'
import { GeoJSON } from 'ol/format'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import CircleStyle from 'ol/style/Circle'
import { Point } from 'ol/geom'
import type RenderEvent from 'ol/render/Event'
import { easeOut } from 'ol/easing'
import type { FrameState } from 'ol/Map'
import { unByKey } from 'ol/Observable'
import { getVectorContext } from 'ol/render'

let map: Map

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
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
    // Feature format for reading and writing data in the GeoJSON format.
    format: new GeoJSON()
  })
})
// 点集合视图
let pointLayer = new VectorLayer({
  source: new Vector({})
})

pointLayer.set('name', '点集合视图')

onMounted(() => {
  map = initMap('map')

  // 添加视图
  map.setView(view)
  // 添加图层
  map.addLayer(newLayer)
  map.addLayer(pointLayer)

  map.on('click', (e) => {
    console.log('click', e)
    console.log(map.getEventPixel(e.originalEvent))
    console.log(e.coordinate)
    map.getView().animate({
      center: e.coordinate,
      zoom: 10,
      duration: 2000
    })
  })
})

function pointStyle() {
  return new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: 'red'
      }),
      stroke: new Stroke({
        color: 'red',
        width: 1
      })
    })
  })
}

const pointPool = [
  [114.3, 30.5],
  [114.3, 30.6],
  [114.3, 30.7],
  [114.3, 30.8],
  [114.3, 30.9],
  [114.3, 31.0]
]

function addPoint() {
  if (pointPool.length === 0) {
    return false
  }
  const feature = new Feature({
    geometry: new Point(pointPool.pop() || [])
  })
  feature.setStyle(pointStyle())
  pointLayer.getSource()?.addFeature(feature)
}

const duration = 3000
function flash(feature: Feature) {
  const start = Date.now()
  // 复制几何图形信息
  const geometry = feature.getGeometry()?.clone()
  // 监听图层的渲染
  let listenerKey = pointLayer.on('postrender', animate)

  function animate(event: RenderEvent) {
    // 获取当前地图chanvas渲染上下文
    // vectorContext绘画只会修改一帧,当切换到下一帧的时候就会被清除.
    const vectorContext = getVectorContext(event)
    // 当前呈现帧的状态
    const frameState = event.frameState as FrameState
    const elapsed = frameState?.time - start
    if (duration <= elapsed) {
      // 取消监听
      unByKey(listenerKey)
      return
    }
    // 动画的进度
    const elapsedRatio = elapsed / duration
    // 圆的半径为5开始到30结束
    const radius = easeOut(elapsedRatio) * 25 + 5
    const opacity = easeOut(1 - elapsedRatio)
    const style = new Style({
      image: new CircleStyle({
        radius: radius,
        stroke: new Stroke({
          color: `rgba(255, 0, 0, ${opacity})`,
          width: 1 + opacity
        })
      })
    })
    // 设置渲染样式
    vectorContext.setStyle(style)
    // 在画布中渲染几何图形
    vectorContext.drawGeometry(geometry as Point)
    // 请求地图渲染(在下一个动画帧处)
    // OL使用双缓存(即缓存当前一帧,与下一帧),当vectorContext更改视图之后并不会马上渲染地图,
    // 需要调用render函数,当地图切换到下一帧,使动画效果流畅
    map.render()
  }
}

pointLayer.getSource()?.on('addfeature', function (e) {
  console.log(e)
  flash(e.feature as Feature)
})
</script>

<style scoped></style>
