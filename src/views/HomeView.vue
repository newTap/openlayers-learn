<template>
  <div>
    <button type="button" @click="rotate">恢复旋卷</button>
  </div>
  <main id="map"></main>
  <div id="attr"></div>
  <div id="overlay"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Map from 'ol/Map.js'
import XYZ from 'ol/source/XYZ.js'
import TileLayer from 'ol/layer/Tile.js'
import View from 'ol/View.js'
import ImageLayer from 'ol/layer/Image.js'
import ImageWMS from 'ol/source/ImageWMS.js'
import { defaults } from 'ol/control/defaults.js'
import FullScreen from 'ol/control/FullScreen.js'
import MousePosition from 'ol/control/MousePosition.js'
import OverviewMap from 'ol/control/OverviewMap.js'
import Rotate from 'ol/control/Rotate.js'
import ScaleLine from 'ol/control/ScaleLine.js'
import ZoomSlider from 'ol/control/ZoomSlider.js'
import ZoomToExtent from 'ol/control/ZoomToExtent.js'
import Zoom from 'ol/control/Zoom.js'
import VectorLayer from 'ol/layer/Vector.js'
import Vector from 'ol/source/Vector.js'
import { GeoJSON } from 'ol/format.js'
import Feature from 'ol/Feature.js'
import Point from 'ol/geom/Point.js'
import Polygon from 'ol/geom/Polygon.js'
import Style from 'ol/style/Style.js'
import Icon from 'ol/style/Icon.js'
import Text from 'ol/style/Text.js'
import Fill from 'ol/style/Fill.js'
import CirCle from 'ol/style/Circle.js'
import Stroke from 'ol/style/Stroke.js'
import Overlay from 'ol/Overlay.js'

let map: Map

function rotate() {
  map.getView().setRotation(0)
}

onMounted(() => {
  map = new Map({
    // 在layers图层中,如果都未设置zIndex，那么后面的图层会覆盖前面的图层
    layers: [
      // 瓦片图层
      new TileLayer({
        // 地图具体的数据来源
        source: new XYZ({
          url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
          // 是否水平
          wrapX: false
        })
      }),
      // 矢量图层
      new VectorLayer({
        background: '#1a2b39',
        style: {
          'fill-color': ['string', ['get', 'COLOR'], '#eee']
        },
        source: new Vector({
          url: 'https://openlayers.org/data/vector/ecoregions.json',
          format: new GeoJSON()
        })
      }),
      // image图层
      new ImageLayer({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new ImageWMS({
          url: 'https://ahocevar.com/geoserver/wms',
          params: { LAYERS: 'topp:states' },
          ratio: 1,
          // 服务类型 远程WMS服务器的类型:mapserver、geoserver、carmentasserver或qgis。只有hidpi为真时才需要。
          serverType: 'geoserver'
        })
      })
    ],
    target: 'map',
    view: new View({
      // 视图的初始中心
      center: [-10670028.5, 4604280],
      // 限制制图范围,即超出范围的内容将不会渲染
      // extent: [-13884991, 2870341, -7455066, 6338219],
      // 初始视图分辨率
      zoom: 5,
      // 地图旋卷角度
      rotation: 20
    }),
    controls: defaults({
      // 取消默认控制器
      attribution: false,
      rotate: false,
      zoom: false
    }).extend([
      new FullScreen(),
      new MousePosition(),
      // ????
      new OverviewMap(),
      new ScaleLine(),
      new ZoomSlider(),
      new ZoomToExtent({
        extent: [-13884991, 2870341, -7455066, 6338219]
      }),
      new Zoom()
    ])
  })

  //! 覆盖物的添加
  const element = document.getElementById('overlay') as HTMLElement

  // 设置覆盖物基础信息
  const overlay = new Overlay({
    element: element,
    positioning: 'bottom-center',
    autoPan: true,
    stopEvent: false,
    offset: [0, -40]
  })

  // 定义Overlay的地理信息
  overlay.setPosition([-10670028.5, 4604280])
  // 设置覆盖物的样式与内容
  element.innerHTML = 'Hello Overlay'
  element.style.background = '#000'
  // 将覆盖物添加到地图中
  map.addOverlay(overlay)

  //! 点要素的添加

  let newLayer = new VectorLayer({
    source: new Vector()
    // background: '#fff'
  })

  const point = new Feature(new Point([-10670028.5, 4604280]))

  // 点要素的集合信息
  const textPoint = new Feature({
    geometry: new Point([-10670028.5, 4604280])
  })

  const circlePoint = new Feature({
    geometry: new Point([-10670028.5, 4604280]),
    properties: {
      name: 'circle'
    }
  })
  const points = [
    [
      [-11349878.5, 4849814],
      [-10539626.5, 4834164],
      [-10512931.5, 4453163],
      [-11334827.5, 4471459],
      [-11349878.5, 4849814]
    ]
  ]
  var feature = new Feature({
    geometry: new Polygon(points),
    zIndex: 1
  })

  // 点要素的样式信息
  feature.setStyle(
    new Style({
      fill: new Fill({ color: '#c6287b' }),
      stroke: new Stroke({
        color: '#3399CC',
        width: 1.25
      })
    })
  )
  point.setStyle(
    new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        color: '#fff',
        src: '../../public/favicon.ico',
        width: 25
      })
    })
  )
  textPoint.setStyle(
    new Style({
      text: new Text({
        text: '标记点',
        scale: 1.8,
        offsetY: -20,
        fill: new Fill({ color: '#fff' })
      })
    })
  )
  circlePoint.setStyle(
    new Style({
      // image属性设置点要素的样式
      image: new CirCle({
        // 设置圆的半径
        radius: 40,
        stroke: new Stroke({
          width: 4,
          color: '#fff'
        }),
        fill: new Fill({
          color: '#3399CC'
        }),
        displacement: [40, 80]
      })
    })
  )
  // 将要素添加到矢量数据源中
  newLayer.getSource()?.addFeatures([feature, point, textPoint, circlePoint])
  // 将矢量数据源添加到矢量图层中渲染
  map.addLayer(newLayer)

  // 添加控件
  map.addControl(new Rotate())

  map.on('moveend', () => {
    console.log('moveend')
  })
  console.log('map', map)
})
</script>

<style scoped>
#map {
  width: 100vw;
  height: 500px;
}
#attr {
  width: 100%;
  height: 40px;
}
</style>
