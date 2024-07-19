<script lang="ts">
import Map from 'ol/Map.js'
import TileLayer from 'ol/layer/Tile.js'
import XYZ from 'ol/source/XYZ.js'
import { defaults } from 'ol/control/defaults.js'
import View from 'ol/View.js'

function initMap(target: string): Map {
  return new Map({
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
      })
    ],
    target: target,
    controls: defaults({
      // 取消默认控制器
      attribution: false,
      rotate: false,
      zoom: false
    })
  })
}

export default initMap
</script>
