<template>
  <div class="codemirror">
    <textarea id="myCm" ref="myCm"></textarea>
  
  </div>
</template>

<script>
import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
let CodeMirror = require("codemirror/lib/codemirror");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/sql-hint");


// import sqlFormatter from "sql-formatter";
export default {
  data() {
    return {
      cmOptions: {
        value:'',
        tabSize: 2,
        styleActiveLine: true,
        mode: this.mode,
        // theme: 'ambiance',
        lineNumbers: true, //是否在编辑器的左侧显示行号
        line: true,
        indentWithTabs: true,
        // smartIndent: true,
        matchBrackets: true,
        hintOptions: {
          completeSingle: false
        }
        // addModeClass: false
      },
      editor: null
    };
  },
  props: {
    codeContent: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: "sql"
    },
    tblColsMap: {
      //表名提示
      type: Object
    }
  },
  watch: {
    codeContent(newVal, oldVal) {
      if (!newVal) {
        this.editor.setValue("");
      } else {
        this.editor.setValue(newVal);
      }
      
    },
    tblColsMap(newVal, oldVal) {
      //表名提示
      this.editor.options.hintOptions.tables = newVal;
    }
  },
  components: {
    editorValue() {
      return this.editor.getValue();
    }
  },
  mounted() {
    this.initEditor();
  },
  methods: {

    initEditor() {

      this.editor = CodeMirror.fromTextArea(this.$refs.myCm, {
        mode: "text/x-mysql",
        lineNumbers: true,
        extraKeys: { Ctrl: "autocomplete" },
        hintOptions: {
          tables: {},
          completeSingle: false
        }
      });
      this.editor.on("inputRead", () => {
        this.editor.showHint();
      });
      this.editor.setValue(this.codeContent);
    },
    formatterSQL() {
      this.editor.setValue(sqlFormatter.format(this.editor.getValue()));
    },
    sqlChange() {
      // console.log("here");
      this.$emit("changeCodeContent", this.editor.getValue());
      // console.log(this.editor.getValue(),"this.editor.getValue()");
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .codemirror {
    width: 100%;
    height: 100%;
    // .codeEdit{
    //   width: 100%;
    //   border: 1px solid #ccc;
    // }
    .CodeMirror {
      height: 100% !important;
    }
  }
}
</style>