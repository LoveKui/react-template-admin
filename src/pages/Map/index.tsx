/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-12-28 14:05:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-15 21:26:13
 */
import React, { useEffect, useRef } from "react";
// import * as map3dduk from "map3dduk";
import * as map3dduk from "@loveduk/map3d";

import { Button } from "antd";
import {
  Graphic,
  MapEntityClick,
  ModelEntityStyleOptions,
  ModelEntityStyleOptionslGraphics,
  PointEntityStyleOptions,
  PolygonEntityStyleOptions,
  PolylineEntityStyleOptions,
} from "@loveduk/map3d/dist/@types/Duk3dMap";
import * as Cesium from "cesium";
import "@loveduk/map3d/dist/css/bundle.css";

window.CESIUM_BASE_URL = "/lib/Cesium/";

interface Props {}

let drawlayer = {} as map3dduk.layer.GraphicLayer;
let primitiveDrawlayer = {} as map3dduk.layer.GraphicLayer;

let tdtLayer = null;
let cacheManager = {} as map3dduk.CacheManager;
const Index: React.FC<Props> = () => {
  const mapCache = useRef<map3dduk.Map>(null);
  useEffect(() => {
    if (!mapCache.current) {
      const acache = new map3dduk.CacheManager({
        storeUrls: ["/mapdata/"],
        expireTime: 15,
      });
      cacheManager = acache;

      const map = new map3dduk.Map("map", {
        terrain: {
          show: true,
          //   url: "/terrain",
        },

        control: {
          compass: true,
        },
        basemaps: [
          {
            type: map3dduk.LayerType.tdt,
            layer: "vec_d",
            imageryThemeGL: {
              enabled: false,
            },
          },
          {
            type: map3dduk.LayerType.tdt,
            layer: "vec_z",
          },
        ],
      });

      map.addControl(new map3dduk.control.LocationBar());
      map.addControl(new map3dduk.control.SwitchMode());
      map.addControl(new map3dduk.control.EagleEyeMap());

      // const swipe = new map3dduk.control.Swipe({});

      // map.addControl(swipe);

      // swipe.setRightImagery(
      //   new map3dduk.layer.TdtLayer({
      //     layer: "img_d",
      //   })
      // );

      // tdtLayer = new map3dduk.layer.TdtLayer({
      //   layer: "vec_d",
      //   imageryThemeGL: {
      //     enabled: true,
      //   },
      // });

      // map.addLayer(tdtLayer);

      const polygonArry = [
        91.47543905, 29.75871711, 91.47549227, 29.75873066, 91.47546198,
        29.7588471, 91.47562516, 29.75888194, 91.47595285, 29.75892367,
        91.47596455, 29.75889448, 91.47602279, 29.75890846, 91.47603876,
        29.75885689, 91.47576179, 29.75879843, 91.47577096, 29.75876455,
        91.47580068, 29.75876833, 91.47582948, 29.75868045, 91.47587327,
        29.75868737, 91.47589626, 29.75861984, 91.47581659, 29.75860127,
        91.47582266, 29.75857874, 91.47559753, 29.75852484, 91.47558676,
        29.75855037, 91.4754912, 29.75852845, 91.47543905, 29.75871711,
      ];

      const polygon333 = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(polygonArry)
        ),
        height: 4250.94,
        // 设置面的拉伸高度
        extrudedHeight: 4490.94,
      });
      debugger;
      const geometry = Cesium.PolygonGeometry.createGeometry(polygon333);

      const instances = new Cesium.GeometryInstance({
        geometry: geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromCssColorString("red").withAlpha(1) //设置高亮颜色
          ),
          show: new Cesium.ShowGeometryInstanceAttribute(true), //设置初始化后是否显示
        },
        // id: properties?.thisFloor,
        // id: properties,
      });

      console.log("加上了");

      const primitive = new Cesium.ClassificationPrimitive({
        geometryInstances: instances,
        //classificationType: Cesium.ClassificationType.CESIUM_3D_TILE, //只绘制在3dtiles上
        asynchronous: false,
      });

      const www = new Cesium.PrimitiveCollection();
      www.add(primitive);
      map.viewer.scene.primitives.add(www);

      const tilesetLayer = new map3dduk.layer.TilesetLayer({
        url: "/mapdata/3dtiles/gds-3dtile/tileset.json",
        position: {
          alt: 0,
        },
        flyTo: true,
      });

      map.addLayer(tilesetLayer);
      tilesetLayer.show = true;

      // tilesetLayer.on(map3dduk.EventType.load, () => {
      //   tilesetLayer.flyTo();
      // });

      // map.addLayer(
      //   new map3dduk.layer.TdtLayer({
      //     layer: "vec_z",
      //   })
      // );

      const layer = new map3dduk.layer.GraphicLayer({
        id: "sss",
        layerType: "entity",
        eventParent: false,
        isContinued: false,
        isAutoEditing: false,
        contextmenuItems: [
          {
            icon: "fa-edit",
            text: "删除",
            show: true,
            callback: (e) => {
              if (e.graphic) {
                e.graphic.destroy(true);
              }
            },
          },
          {
            icon: "fa-edit",
            text: "编辑",
            show: true,
            callback: (e: MapEntityClick) => {
              if (e.graphic) {
                (e.graphic as map3dduk.graphic.LabelEntity).startEditing();
              }
            },
          },
          {
            icon: "fa-edit",
            text: "结束编辑",
            show: (e: MapEntityClick) => {
              console.log("show", e);
              return false;
            },
            callback: (e) => {
              if (e.graphic) {
                (e.graphic as map3dduk.graphic.LabelEntity).stopEditing();
              }
            },
          },
          {
            icon: "fa-edit",
            text: "GeoJson",
            show: () => {
              return true;
            },
            callback: (e) => {
              if (e.graphic) {
                console.log(
                  (e.graphic as map3dduk.graphic.LabelEntity).toGeoJSON()
                );
              }
            },
          },
        ],
        contextOptions: {
          offsetX: 0,
          offsetY: 0,
        },
      });
      const layer2 = new map3dduk.layer.GraphicLayer({
        id: "aaa",
        layerType: "entity",
      });

      const primitiveLayer = new map3dduk.layer.GraphicLayer({
        id: "bbb",
        layerType: "primivite",
        contextmenuItems: [
          {
            icon: "fa-edit",
            text: "删除",
            show: true,
            callback: (e) => {
              if (e.graphic) {
                e.graphic.destroy(true);
              }
            },
          },
          {
            icon: "fa-edit",
            text: "编辑",
            show: true,
            callback: (e: MapEntityClick) => {
              if (e.graphic) {
                (e.graphic as map3dduk.graphic.LabelEntity).startEditing();
              }
            },
          },
          {
            icon: "fa-edit",
            text: "结束编辑",
            show: (e: MapEntityClick) => {
              console.log("show", e);
              return false;
            },
            callback: (e) => {
              if (e.graphic) {
                (e.graphic as map3dduk.graphic.LabelEntity).stopEditing();
              }
            },
          },
          {
            icon: "fa-edit",
            text: "GeoJson",
            show: () => {
              return true;
            },
            callback: (e) => {
              if (e.graphic) {
                console.log(
                  (e.graphic as map3dduk.graphic.LabelEntity).toGeoJSON()
                );
              }
            },
          },
        ],
      });
      primitiveDrawlayer = primitiveLayer;

      drawlayer = layer;

      layer.on(map3dduk.EventType.endEdit, (res) => {
        console.log("编辑完了", res);
      });

      layer.on(map3dduk.EventType.editing, (res) => {
        console.log("正在编辑", res);
      });

      const divLayer = new map3dduk.layer.GraphicLayer({
        layerType: "div",
      });

      map.addLayer(divLayer);

      map.addLayer(layer);

      map.addLayer(
        new map3dduk.layer.GraphicLayer({
          id: "bbbb",
          layerType: "entity",
        })
      );
      map.addLayer(layer2);
      // map.addLayer(primitiveLayer);

      const graphic = new map3dduk.graphic.LabelEntity({
        position: new map3dduk.LngLatPoint(112, 29, 1000),
        show: true,
        style: {
          text: "3232",
          scale: 10,
        },
      });

      const primitivegraphic = new map3dduk.graphic.LabelPrimitive({
        position: new map3dduk.LngLatPoint(112, 29, 100),
        show: true,
        style: {
          text: "我是一个primitive2",
          scale: 2,
          color: "red",
        },
      });

      const primitivegraphic2 = new map3dduk.graphic.LabelPrimitive({
        position: new map3dduk.LngLatPoint(112, 30, 100),
        show: true,
        style: {
          text: "我是一个primitive3",
          scale: 2,
          color: "red",
        },
      });

      primitiveLayer.addGraphic([primitivegraphic, primitivegraphic2]);

      const polylineGraphic = new map3dduk.graphic.PolylineEntity({
        positions: [
          [117.220337, 31.832987, 42.8],
          [117.220242, 31.835234, 45.6],
          [117.216263, 31.835251, 39.3],
          [117.217219, 31.819929, 35.8],
          [117.223096, 31.818342, 29.8],
          [117.249686, 31.818964, 40.1],
          [117.263171, 31.816664, 35.2],
          [117.278695, 31.816107, 35.5],
          [117.279826, 31.804185, 34.5],
          [117.286308, 31.804112, 29.2],
          [117.28621, 31.801059, 24.6],
        ],
        style: {
          material: map3dduk.MaterialUtil.createMaterialProperty(
            map3dduk.MaterialType.Spriteline,
            {
              color: Cesium.Color.GREEN,
              // duration: 20000,
              duration: 1000,
              image: "/images/color1.png",
            }
          ),
          clampToGround: true,
          color: "red",
          label: {
            text: "我是一根线",
            scale: 1,
            color: "yellow",
            clampToGround: false,

            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        },
      });

      const polygonGraphic = new map3dduk.graphic.PolygonEntity({
        positions: [
          [117.220337, 31.832987, 42.8],
          [117.220242, 31.835234, 45.6],
          [117.216263, 31.835251, 39.3],
          [117.217219, 31.819929, 35.8],
          [117.223096, 31.818342, 29.8],
          [117.249686, 31.818964, 40.1],
          [117.263171, 31.816664, 35.2],
          [117.278695, 31.816107, 35.5],
          [117.279826, 31.804185, 34.5],
          [117.286308, 31.804112, 29.2],
          [117.28621, 31.801059, 24.6],
          [117.220337, 31.832987, 42.8],
        ],
        style: {
          materialType: map3dduk.MaterialType.Color,
          color: "red",

          outlineStyle: {
            color: "white",
            clampToGround: true,
            material: map3dduk.MaterialUtil.createMaterialProperty(
              map3dduk.MaterialType.PolylineTrail,
              {
                color: Cesium.Color.GREEN,
                // duration: 20000,
                duration: 1000,
                image: "/images/color1.png",
              }
            ),
          },
          label: {
            text: "我是一个面",
            scale: 1,
            color: "yellow",
            clampToGround: false,

            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        },
      });

      const image = new map3dduk.graphic.BillboardEntity({
        position: new map3dduk.LngLatPoint(114, 29, 100),
        style: {
          image: "/images/map.png",
          height: 25,
          width: 20,
          scale: 5,
          label: {
            text: "我是一个图标",
            color: "yellow",
            scale: 3,
            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -20,
          },
        },
      });
      const imageprimitive = new map3dduk.graphic.BillboardPrimitive({
        position: new map3dduk.LngLatPoint(114, 31, 100),
        style: {
          image: "/images/map.png",
          height: 25,
          width: 20,
          scale: 3,
          label: {
            text: "我是一个图标primitive",
            color: "yellow",
            scale: 2,
            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -20,
          },
        },
      });

      primitiveLayer.addGraphic([imageprimitive]);

      console.log("graphic", graphic);

      layer.addGraphic([image, graphic, polylineGraphic, polygonGraphic]);

      // divLayer.bindClick((evt) => {

      // })

      graphic.setStyle({
        text: "哈哈哈哈",
        scale: 2,
        color: "red",
      });

      layer.on(map3dduk.EventType.click, (res) => {
        console.log("11111全局", res);
      });

      /*

      primitiveLayer.on(map3dduk.EventType.click, (res) => {
        console.log(11111, res);
      });

      */

      // layer.bindContextMenu(
      //   [
      //     {
      //       icon: "fa-edit",
      //       text: "eqewq",
      //       show: true,
      //       callback: (e) => {
      //         console.log(e);
      //       },
      //     },
      //   ],
      //   {
      //     offsetX: 0,
      //     offsetY: 0,
      //   }
      // );

      console.log("layer", layer);

      //layer.removeGraphic(graphic, true);

      mapCache.current = map;
      console.log("map", mapCache);
    }
  }, []);
  const style: React.CSSProperties = {
    width: "100%",
    height: "100vh",
    position: "fixed",
  };

  const handlerClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "billboard",
        style: {
          image: "/images/map.png",
          height: 25,
          width: 20,
          scale: 1,
          label: {
            text: "3434343",
            scale: 1,
            color: "yellow",

            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        },
        success: (e: Graphic) => {
          console.log("我是绘制的", e);
          if (e) {
            (e as map3dduk.graphic.BillboardEntity)?.setStyle({
              label: {
                scale: 2,
              },
            });
          }
        },
      });
    }
  };

  const drawModelClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "model",
        style: {
          uri: "/data/shebei1.glb",
          scale: 5,
          label: {
            text: "3434343",
            scale: 1,
            color: "yellow",
            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        } as Partial<ModelEntityStyleOptionslGraphics>,

        success: (e: unknown) => {
          console.log("我是绘制的", e);
        },
      });
    }
  };

  const exportgeoJson = () => {
    console.log(drawlayer.toGeoJSON());
  };

  const removeLayer = () => {
    mapCache.current?.removeLayer(drawlayer, true);
    mapCache.current?.removeLayer(tdtLayer as map3dduk.layer.TdtLayer, true);

    drawlayer = null;
  };

  const cacheSizeHandler = () => {
    if (cacheManager) {
      cacheManager?.calculateCacheSize();
    }
  };

  const exportImageClick = () => {
    if (document.querySelector("#map  .cesium-viewer")) {
      mapCache.current?.exportImage({
        dom: document.querySelector("#map  .cesium-viewer"),
        download: true,
      });
    }
  };

  const drawPointClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "point",
        style: {
          pixelSize: 15,
          outline: true,

          label: {
            text: "我是一个点",
            scale: 1,
            color: "yellow",
            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        } as Partial<PointEntityStyleOptions>,

        success: (e: unknown) => {
          console.log("我是绘制的", e);
        },
      });
    }
  };

  const drawPrimitiveLabelClick = () => {
    if (primitiveDrawlayer) {
      (primitiveDrawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "labelP",
        style: {
          text: "我是一个绘制的primitive",
          scale: 1,
          color: "yellow",
          hasPixelOffset: true,
          pixelOffsetX: 10,
          pixelOffsetY: -40,
        } as Partial<PointEntityStyleOptions>,

        success: (e: unknown) => {
          console.log("我是绘制的", e);
        },
      });
    }
  };

  const drawPrimitiveBillionClick = () => {
    if (primitiveDrawlayer) {
      (primitiveDrawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "billboardP",
        style: {
          image: "/images/map.png",
          height: 25,
          width: 20,
          scale: 1,
          label: {
            text: "3434343",
            scale: 1,
            color: "yellow",

            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        },
        success: (e: Graphic) => {
          console.log("我是绘制的", e);
          if (e) {
            (e as map3dduk.graphic.BillboardEntity)?.setStyle({
              label: {
                scale: 2,
              },
            });
          }
        },
      });
    }
  };

  const drawPolylinelClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "polyline",
        style: {
          color: "red",
          // materialType: map3dduk.MaterialType.Color,
          clampToGround: true,
          material: map3dduk.MaterialUtil.createMaterialProperty(
            map3dduk.MaterialType.Spriteline,
            {
              color: Cesium.Color.GREEN,
              // duration: 20000,
              duration: 1000,
              image: "/images/color1.png",
            }
          ),

          label: {
            text: "3434343",
            scale: 1,
            color: "yellow",
            hasPixelOffset: true,
            pixelOffsetX: 10,
            pixelOffsetY: -40,
          },
        } as Partial<PolylineEntityStyleOptions>,

        success: (e: unknown) => {
          console.log("我是绘制的", e);
        },
      });
    }
  };

  const drawPolygonClick = () => {
    if (drawlayer) {
      (drawlayer as map3dduk.layer.GraphicLayer).startDraw({
        type: "polygon",
        style: {
          color: "red",
          materialType: map3dduk.MaterialType.Color,
          clampToGround: true,
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString("white"),
          outlineWidth: 2,
          classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
          outlineStyle: {
            clampToGround: true,
          },
        } as Partial<PolygonEntityStyleOptions>,

        success: (e: unknown) => {
          console.log("我是绘制的", e);
        },
      });
    }
  };

  const removeAlllClick = () => {
    if (drawlayer) {
      drawlayer.removeAllGraphic();
    }
  };

  const drawEndClick = () => {
    if (drawlayer) {
      drawlayer.endEdit();
    }
  };

  const swipeHandler = () => {};
  return (
    <div>
      <div style={{ position: "absolute", zIndex: 9999, top: 0 }}>
        <Button onClick={drawPointClick}>绘制点</Button>
        <Button onClick={drawPrimitiveLabelClick}>绘制图元文字</Button>
        <Button onClick={drawPrimitiveBillionClick}>绘制图元图标</Button>

        <Button onClick={handlerClick}>绘制图标点</Button>
        <Button onClick={drawModelClick}>绘制模型</Button>
        <Button onClick={drawPolylinelClick}>绘制线</Button>
        <Button onClick={drawPolygonClick}>绘制面</Button>

        <Button onClick={removeAlllClick}>清除</Button>
        <Button onClick={drawEndClick}>结束标会</Button>

        <Button onClick={exportImageClick}>导出图片</Button>

        <Button onClick={exportgeoJson}>导出GEOJSON</Button>
        <Button onClick={removeLayer}>移除图层</Button>
        <Button onClick={cacheSizeHandler}>计算缓存大小</Button>
        <Button onClick={swipeHandler}>卷帘分析</Button>
      </div>
      <div style={{ ...style }} id="map"></div>
    </div>
  );
};

export default Index;
