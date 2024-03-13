let group_imgs = [];
let group_filename = [];
let group_check = [];

const default_image_path = "./images/default.png";

const img = document.getElementById("image");
const grnm = document.getElementById("group_name");
const btn_start = document.getElementById("btn_start");
const btn_reset = document.getElementById("btn_reset");
const img_table = document.getElementById("img_table");

const snd_pi = new Audio("./sounds/pi.wav");
const snd_paan = new Audio("./sounds/paan.wav");

btn_start.addEventListener("click", startRoulette);
btn_reset.addEventListener("click", resetImage);

let loopId;
const loopMax = 30;
let loopCount = 0;
let chooseImageIndex;

const timeoutSets = [100, 100, 100, 250, 250, 250, 500, 750, 1000];

img.src = default_image_path;

function startRoulette() {
  loopCount = 0;
  chooseImageIndex = Math.floor(Math.random() * group_filename.length);
  changeImage();
}

//ファイル読み込み時のコールバック
document.getElementById("img_open").addEventListener("change", (e) => {
  let files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    let name = files[i].name;

    //重複アップロードを検知
    if (group_filename.includes(name)) {
      continue;
    }

    group_imgs.push(files[i]);
    group_filename.push(name);

    //ディスプレイを作成
    let row = document.createElement("tr");
    let cell_name = document.createElement("td");
    cell_name.innerHTML = name.replace(/\.[^/.]+$/, "");
    let cell_button = document.createElement("td");
    let check = document.createElement("input");
    check.type = "checkbox";
    check.checked = true;
    group_check.push(check);
    cell_button.appendChild(check);
    row.appendChild(cell_name);
    row.appendChild(cell_button);
    img_table.querySelector("tbody").appendChild(row);
  }

  console.log(group_filename);
});

function changeImage() {
  available_list = group_filename.filter(
    (i) => group_check[group_filename.indexOf(i)].checked
  );

  if (available_list.length == 0) {
    alert("ルーレットの対象がありません");
    return;
  }

  chooseImageIndex +=
    Math.floor(Math.random() * (available_list.length - 1)) + 1;

  //オーバーした分をリセット
  const index =
    chooseImageIndex -
    available_list.length *
      Math.floor(chooseImageIndex / available_list.length);

  console.log(index);

  img.src = "./images/" + available_list[index];
  grnm.innerHTML = available_list[index].replace(/\.[^/.]+$/, "");

  if (loopCount < loopMax) {
    loopCount++;

    let timeout;
    if (loopMax - loopCount >= timeoutSets.length) {
      timeout = 60;
    } else {
      timeout =
        timeoutSets[timeoutSets.length - Math.abs(loopMax - loopCount) - 1];
    }
    console.log(timeout);
    snd_pi.play();
    loopId = setTimeout(changeImage, timeout);
  } else {
    console.log("stopped");
    //選択されたものにチェック
    group_check[group_filename.indexOf(available_list[index])].checked = false;
    snd_paan.play();
  }
}

function resetImage() {
  img.src = default_image_path;
  grnm.innerHTML = "";
}
