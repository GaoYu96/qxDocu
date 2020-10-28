<template>
  <div>
    <h2 class="title">{{ tplInfo.templateDesc }}</h2>
    <!-- <div id="tempContent" class="tempContent">
          <div class="left" id="left">
         
           <div
                v-for="element in tplsArr_left"
                :key="element.partsInfo.partsId"
                class="leftDiv"
              >
                <li style="list-style: none;"></li>
              </div> 
       

          </div>
          <div class="right" id="right">
           
             
              <div
                v-for="element in tplsArr_right"
                :key="element.partsInfo.partsId"
                class="rightDiv"
              >
                <li style="list-style: none;"></li>
              </div>
            
         
          </div>
        </div> -->
    <div id="tempContent" class="tempContent">
      <div class="left" id="left">
         <draggable @update="datadragEnd" v-model="tplsArr_left"  v-bind="dragOptions">
              <transition-group>
        <div
          v-for="element in tplsArr_left"
          :key="element.partsInfo.partsId"
          class="leftDiv"
        >
          <li style="list-style: none"></li>
        </div>
         </transition-group>
            </draggable>
      </div>
      <div class="right" id="right">
        <draggable @update="datadragEnd" v-model="tplsArr_right"  v-bind="dragOptions">
              <transition-group>
        <div
          v-for="element in tplsArr_right"
          :key="element.partsInfo.partsId"
          class="rightDiv">
          <li style="list-style: none"></li>
        </div>
        </transition-group>
            </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue/dist/vue.esm.js";
import MForm from "../../../components/form";
import draggable from "vuedraggable";
export default {
  name: "tempPreview",
  data() {
    return {
      visible: false,
      tplInfo: {},
      tplsArr_right: [],
      tplsArr_left: [],
      msg:'',
      dragOptions: {
       
        group: 'sortlist',
        pull: true,
        put:true
        
      },
    };
  },
  components: {
    draggable
  },
  computed: {},
  created() {
    if (this.$route.query) {

        // this.msg = this.$route.query.msg
      // this.tplInfo = JSON.parse(this.$route.query.templateInfo);
     this.tplInfo = JSON.parse(sessionStorage.getItem('previewData')) 

        //  this.tplInfo = this.$store.state.previewData
  
      // console.log(this.tplInfo,"this.$store.state.previewData");
     
      this.tplsArr_right=[]
      // this.show()
    //  console.log(this,"this");
      setTimeout(()=>{
        this.show() 
        this.dataHandle();
      })
     
    }
  },
  watch: {
    // tplsArr_right(o, n) {
    //   this.setLayout();
    // },
  },
  methods: {
     datadragEnd(evt) {
      evt.preventDefault();
      console.log("拖动前的索引 :" + evt.oldIndex);
      console.log("拖动后的索引 :" + evt.newIndex);
      console.log(this.tplsArr_right,this.tplsArr_left);
    },
    show() {
      // console.log(this.tplInfo);
      var self=this
      console.log(self.$store.state.previewData.createTime,"this.$store.state.previewData");
    },
    dataHandle() {
      this.tplsArr_right = [];
      this.tplsArr_left = [];
      this.tplInfo.daTemplatePartsEntityList.forEach((item, index) => {
        var params = {
          partsId: item.partsId,
        };
        this.$http({
          url: this.$http.adornUrl("/templateData/addPartsView"),
          method: "GET",
          // data: this.$http.adornData(this.dataForm)
          params: params,
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // this.$emit('refreshDataList')
            this.tplsArr_right.push(data.data);
            setTimeout(()=>{
              this.setLayout()
            },200)
            
          } else {
            this.$message.error(data.msg);
          }
        });
      });
      // this.setLayout()
      // console.log(this.tplInfo, this.tplsArr_right, "after");
    },

    setLayout() {
      let rightArr = this.tplsArr_right;

      for (var i = 0; i < rightArr.length; i++) {
        var Profile = Vue.extend({
          template: rightArr[i].partsInfo.code,

          data: function () {
            return {
              partsData: rightArr[i],
            };
          },
          components: {
            MForm,
          },
          mounted() {},
          watch: {},
          methods: {},
        });
        new Profile().$mount(
          document.getElementsByClassName("rightDiv")[i].getElementsByTagName("li")[0]
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .title {
    margin: 10px auto;
    text-align: center;
  }
  .tempContent {
    border: 1px solid #ccc;
    width: 70%;
    margin:0 auto;
    height: calc(100vh - 240px);
    .left {
      //   display: inline-block;
      float: left;
      width: 28%;
      height: 100%;
      border: 1px dashed #ccc;
      // background-color:antiquewhite
    }
    .right {
      //   display: inline-block;
      float: right;
      width: 69%;
      height: 100%;
      border: 1px dashed #ccc;
      vertical-align: top;
      //  background-color:antiquewhite
    }
  }
}
</style>