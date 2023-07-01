import { Controller, Get, Post } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { FileInterceptor } from '@nestjs/platform-express';
import * as levenshtein from 'fast-levenshtein';
import {Body} from '@nestjs/common';
import { log } from 'console';
import * as _ from 'lodash';

@Controller('cats')
export class CatsController {

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
  @Post('timkiem')
    findProduct(@Body() body) {
        //console.log(body.key)
        // đọc file csv
   
        const workbook = xlsx.readFile('D:\\nestjs_tutorial\\tichhop\\src\\fulldata.xls');
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        const headerRow = jsonData[0] as string[];
        // đọc cột name 
        const columnData = jsonData.map(row => row[2]);
        const columColor = jsonData.map(row => row[5]);
        const columnRom = jsonData.map(row => row[7]);
        //đẩy vào tf idf
        var keywordArray = body.key.split(" ");
        console.log(jsonData[1][2]);
        // kiểm tra bộ nhớ
        var len = keywordArray.length;
        var rom='';
        if ((keywordArray[len-1]).includes("gb")||(keywordArray[len-1]).includes("tb"))  {
          rom = keywordArray[len-1];
          len = len -1;
        }
        // console.log(rom);
        // kiểm tra màu
        var color = '';
        for( let i=0; i< columColor.length; i++){
          if (keywordArray[len-1]== columColor[i].toLowerCase()){
            color = keywordArray[len-1];
            len = len -1;
            break;
          }
              
        }
         console.log(color);
        // ghép lại phần tên
        var name ='';
        for(let i =0; i< len; i++){
            name = name + keywordArray[i];
            if (i < len-1) name = name +' ';
        }
        console.log(name);
        var arr= [];
        //tìm theo từ khóa , nếu xuất hiện thì có thêm 1 lần xuất hiện trong mảng
        for (let i = 1; i < jsonData.length; i++) {
            // Lấy giá trị của phần tử tại vị trí i
            var temp = columnData[i].toLowerCase();
            if (levenshtein.get(temp,name)<=10)
            arr.push(jsonData[i])
          }
         
          //for (let )
          // đếm số lần xuất hiện của các từ trong từ khóa ứng với mỗi sản phẩm
        if(color ==''&& rom=='') return arr;
        else{
          if(color !=''){
            if(rom!=''){
              var result=[];
              for( var i=0;i<arr.length; i++){
                if(arr[i][5].toLowerCase()==color && arr[i][7].toLowerCase() == rom)
                  result.push(arr[i]);
              }
              return result;
            }
            else{
              var result=[];
              for( var i=0;i<arr.length; i++){
                if(arr[i][5].toLowerCase()==color)
                  result.push(arr[i]);
              }
              return result;
            }
          }
          else{
            var result=[];
              for( var i=0;i<arr.length; i++){
                if(arr[i][7].toLowerCase()==rom)
                  result.push(arr[i]);
              }
              return result;
          }
          
        }
}
  
@Post('default')
findProductdefault(@Body() body) {
    //console.log(body.key)
    // đọc file csv

    const workbook = xlsx.readFile('D:\\nestjs_tutorial\\tichhop\\src\\fulldata.xls');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const headerRow = jsonData[0] as string[];
    // đọc cột name 
    const columnData = jsonData.map(row => row[2]);
    const columColor = jsonData.map(row => row[5]);
    const columnRom = jsonData.map(row => row[7]);
    //đẩy vào tf idf
    var keywordArray = body.key;
    console.log(keywordArray);
    // kiểm tra bộ nhớ
   var arr=[];
    for (let i = 1; i < jsonData.length; i++) {
        // Lấy giá trị của phần tử tại vị trí i
        var temp = jsonData[i][9].toLowerCase();
        if (temp==keywordArray)
        arr.push(jsonData[i])
      }
     return arr;
      //for (let )
      // đếm số lần xuất hiện của các từ trong từ khóa ứng với mỗi sản phẩm
   
}

@Post('all')
findProductdefault_2(@Body() body) {
    //console.log(body.key)
    // đọc file csv

    const workbook = xlsx.readFile('D:\\nestjs_tutorial\\tichhop\\src\\fulldata.xls');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const headerRow = jsonData[0] as string[];
    // đọc cột name 
    //đẩy vào tf idf
    var keywordArray = body.key;
    console.log(keywordArray);
    // kiểm tra bộ nhớ
   var arr=[];
    for (let i = 1; i < jsonData.length; i++) {
        // Lấy giá trị của phần tử tại vị trí i
        var temp = jsonData[i][9].toLowerCase();
        if (temp.includes(keywordArray))
          arr.push(jsonData[i])
      }
     return arr;
      //for (let )
      // đếm số lần xuất hiện của các từ trong từ khóa ứng với mỗi sản phẩm
   
}
}

