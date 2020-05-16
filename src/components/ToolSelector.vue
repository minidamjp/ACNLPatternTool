<template>
  <div class="tool-selector">
    <button class="tool" :class="{picked: pickedPencil}" @click.prevent="pickToolPencil" @contextmenu.prevent="pickToolPencil">
      <img class="svg nav brown-circle" :src=pencilSvg />
    </button>
    <button class="tool" :class="{picked: pickedFloodFill}" @click.prevent="pickToolFloodFill" @contextmenu.prevent="pickToolFloodFill">
      <img class="svg nav brown-circle" :src=fillSvg />
    </button>
    <button class="tool" :class="{picked: pickedColorPicker}" @click.prevent="pickToolColorPicker" @contextmenu.prevent="pickToolColorPicker">
      <img class="svg nav brown-circle" :src=dropperSvg />
    </button>
    <button class="tool" :class="{picked: pickedRange}" @click.prevent="pickRange" @contextmenu.prevent="pickRange">
      Range
    </button>
    <button class="tool" @click.prevent="doUndo" @contextmenu.prevent="doUndo">
      Undo
    </button>
    <button class="tool" @click.prevent="doRedo" @contextmenu.prevent="doRedo">
      Redo
    </button>
    <button class="tool" @click.prevent="doClear" @contextmenu.prevent="doClear">
      Clear
    </button>
  </div>
</template>

<script>
import pencilSvg from '/assets/icons/bxs-pencil.svg'
import fillSvg from '/assets/icons/bxs-color-fill.svg';
import dropperSvg from '/assets/icons/bxs-eyedropper.svg';

export default {
  name: "ToolSelector",
  data: function() {
    return {
      pickedPencil: true,
      pickedFloodFill: false,
      pickedColorPicker: false,
      pickedRange: false,
      pencilSvg,
      fillSvg,
      dropperSvg,
    };
  },
  methods: {
    pickToolPencil(e) {
      this.setToolClass('pickedPencil');
      console.log(this.pickedPencil);
      this.$emit("newtool"+(e.which == 1?"":"alt"), function(x, y, tool){
        tool.drawPixel(x, y);
      });
    },
    pickToolFloodFill(e) {
      this.setToolClass('pickedFloodFill');
      this.$emit("newtool"+(e.which == 1?"":"alt"), function(x, y, tool){
        let newColor = tool.currentColor;
        let preColor = tool.getPixel(x, y);
        if (preColor === false){return;}//Abort if invalid pixel picked
        if (preColor === newColor){return;}//Abort if no color change
        let reColor = (x, y) => {
          let thisColor = tool.getPixel(x, y);
          if (thisColor === preColor){
            if (tool.setPixel(x, y, newColor) == newColor){
              //If there was a change, update neighbours
              reColor(x+1, y);
              reColor(x-1, y);
              reColor(x, y+1);
              reColor(x, y-1);
            }
          }
        };
        reColor(x, y);
        //Render changed version
        tool.render();
      });
    },
    pickToolColorPicker(e) {
      this.setToolClass('pickedColorPicker');
      this.$emit("newtool"+(e.which == 1?"":"alt"), function(x, y, tool){
        let newCol = tool.getPixel(x, y);
        if (newCol !== false){
          tool.currentColor = newCol;
          tool.onColorChange();
        }
      });
    },
    pickRange(e) {
      this.setToolClass('pickedRange');
      this.$emit(
        "newtool"+(e.which == 1?"":"alt"),
        function(x, y, tool){
          // Ignore click fired after mouseup
          if (!tool.drawing) {return;}
          if (tool.range.state == 0) {
            // not ranged
            tool.range.startPos = tool.range.endPos = {
              x,
              y,
            };
            tool.range.state = 1;
            tool.render();
          } else if (tool.range.state == 1) {
            // now ranging
            tool.range.endPos = {
              x,
              y,
            };
            tool.render();
          } else {
            // already ranged
            // noop
          }
        },
        function(x, y, tool){
          if (tool.range.state == 0) {
            // not ranged
          } else if (tool.range.state == 1) {
            // now ranging
            tool.range.state = 2;
          } else {
            // already ranged
            if (tool.range.isContained(x, y)) {
              tool.resetRange();
              tool.render();
              return;
            }
            let rect = tool.range.getRect();
            let dir = tool.range.getDirection(x, y);

            let pixels = {};
            for (let dx = 0; dx <= rect.x2 - rect.x1; ++dx) {
              for (let dy = 0; dy <= rect.y2 - rect.y1; ++dy) {
                pixels[`${dx},${dy}`] = tool.getPixel(rect.x1 + dx, rect.y1 + dy);
              }
            }
            for (let dx = 0; dx <= rect.x2 - rect.x1; ++dx) {
              for (let dy = 0; dy <= rect.y2 - rect.y1; ++dy) {
                tool.setPixel(rect.x1 + dx + dir.x, rect.y1 + dy + dir.y, pixels[`${dx},${dy}`]);
              }
            }
            tool.range.startPos = {
              x: rect.x1 + dir.x,
              y: rect.y1 + dir.y,
            };
            tool.range.endPos = {
              x: rect.x2 + dir.x,
              y: rect.y2 + dir.y,
            };
            tool.render();
          }
        }
      );
    },
    doUndo(e) {
      this.$emit("undoredo", false);
    },
    doRedo(e) {
      this.$emit("undoredo", true);
    },
    doClear(e) {
      this.$emit("clear");
    },
    setToolClass(tool) {
      this.pickedPencil = false;
      this.pickedFloodFill = false;
      this.pickedColorPicker =  false;
      this.pickedRange =  false;
      this.$data[tool] = true;
    },
  }
}
</script>

<style lang="scss" scoped>
  .tool-selector {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 0 35px 35px 0;
    height: 400px;
    width: 75px;
    background-color: #fae4dc;
    box-shadow: rgba(0,0,0,0.2) 0 0 8px;
  }

  .tool-selector button {
    height: 50px;
    width: 50px;
    border-radius: 100%;
  }

  .tool-selector button.picked {
    background-color: #57B7A8;
  }
</style>
