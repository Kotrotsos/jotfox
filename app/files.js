const jp = require("fs-jetpack");
const { exec } = require("child_process");

class File {

  userPath;
  filename;
  index;
  constructor(userPath) { 
    this.userPath = userPath;
  }
  
  list() {
    // remember, this = Article
    return jp.list(this.userPath + "/userdata");
  }

  getIndex() {
    return this.index = jp.list(this.userPath + "/userdata").length - 1;
  }
  getCurrent() {
    return localStorage.getItem('currentFile').replace('.data', '');
  }
  
  add() {
    this.getIndex();
    jp.write(this.userPath + "/userdata/" + (this.index + 1) + '.data', '');
    localStorage.setItem('currentFile', (this.index + 1) + '.data');
  }

  previous() {
    let c = localStorage.getItem('currentFile').replace('.data', '') - 1;
    let max = file.getIndex();

    if (c == 0) c = max;
 
    localStorage.setItem('currentFile', c + '.data')
    return c + '.data'
  }
  next() {
    let c = localStorage.getItem('currentFile').replace('.data', '') ;
    let n = Number(c) + 1;
    let max = file.getIndex();
 
    if (n > max) n = 1;
 
    localStorage.setItem('currentFile', n + '.data')

    return n + '.data'
  }
  delete() {
    let c = localStorage.getItem('currentFile').replace('.data', '') ;
    let n = Number(c) - 1;
    let max = file.getIndex();

    jp.remove(this.userPath + "/userdata/" + c + ".data");
    localStorage.setItem('currentFile', n + '.data');
   
    process.chdir(this.userPath + "/userdata/");

    exec('count=0; for f in *; do [ -f "$f" ] && mv -f "$f" "$((++count)).${f##*.}"; done', (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
      });

    return n + '.data';
  }

}


export default File;