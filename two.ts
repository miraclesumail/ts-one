import inquirer from "inquirer";
import Configstore from 'configstore'
import { getCurrentDirectoryBase } from "./tools";

const conf = new Configstore('ginit');

const promptList = [
  {
    type: "input",
    message: "设置一个用户名:",
    name: "name",
    default: "test_user" // 默认值
  },
  {
    type: "input",
    message: "请输入手机号:",
    name: "phone",
    validate: function(val: any) {
      if (val.match(/\d{11}/g)) {
        // 校验位数
        return true;
      }
      return "请输入11位数字";
    }
  },
  {
    type: "confirm",
    message: "是否使用监听？",
    name: "watch",
    prefix: "前缀"
  },
  {
    type: "list",
    message: "请选择一种水果:",
    name: "fruit",
    choices: ["Apple", "Pear", "Banana"],
    filter: function(val: any) {
      // 使用filter将回答变为小写
      return val.toLowerCase();
    }
  },
  {
    type: "checkbox",
    message: "选择颜色:",
    name: "color",
    choices: [
      {
        name: "red"
      },
      new inquirer.Separator(), // 添加分隔符
      {
        name: "blur",
        checked: true // 默认选中
      },
      {
        name: "green"
      },
      new inquirer.Separator("--- 分隔符 ---"), // 自定义分隔符
      {
        name: "yellow"
      }
    ],
    validate: function(val: any) {
      console.log(val);
      if (val.length) {
        // 校验位数
        return true;
      }
      return "请选择一种";
    }
  }
];

// console.log(getCurrentDirectoryBase());

async function ask() {
  const res = await inquirer.prompt(promptList);
  console.log(res);
}

ask();
// inquirer.prompt(promptList).then(res => console.log(res));
