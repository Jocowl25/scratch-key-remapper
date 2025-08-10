const keyChangeArray=[
    {oldkey:"w",newkey:"u"},
    {oldkey:"a",newkey:"g"},
    {oldkey:"s",newkey:"h"},
    {oldkey:"d",newkey:"j"},
]
const exceptions=[
    "up arrow","left arrow","right arrow","down arrow","space","any"
]
const fieldArray=[
`
    <div>
            <label> Old key:
            <input class="inputText oldkey" value="w" type="text" required  />
            </label>
            <label> New key:
            <input class="inputText newkey" value="u" type="text" required />
            </label>
    </div>
`,`
    <div>
            <label> Old key:
            <input class="inputText oldkey" value="a" type="text" required  />
            </label>
            <label> New key:
            <input class="inputText newkey" value="g" type="text" required  />
            </label>
        </div>
`,`
        <div>
            <label> Old key:
            <input class="inputText oldkey" value="s" type="text" required  />
            </label>
            <label> New key:
            <input class="inputText newkey" value="h" type="text" required />
            </label>
        </div>
`,`
    <div>
            <label> Old key:
            <input class="inputText oldkey" value="d" type="text" required />
            </label>
            <label> New key:
            <input class="inputText newkey" value="j" type="text" required />
            </label>
        </div>
`
]
const inputSet=`<div>
            <label> Old key:
            <input class="inputText oldkey" type="text" required />
            </label>
            <label> New key:
            <input class="inputText newkey" type="text" required />
            </label>
        </div>`

let input
const uploadText=document.querySelector(".uploadText")
const addButton=document.querySelector(".add")
const removeButton=document.querySelector(".remove")
const keyfield=document.querySelector(".keyfield")
keyfield.innerHTML=fieldArray.join("")
const upload=document.querySelector(".upload")
const download=document.querySelector(".download")
download.disabled=true
const statusText=document.querySelector(".status")

setInputs()

function change(ele,i){
if(ele.value.length==1||exceptions.includes(ele.value)){
    if(ele.classList.contains("oldkey")){
        keyChangeArray[i].oldkey=ele.value
    }else{
        keyChangeArray[i].newkey=ele.value
    }
}else{
    if(ele.classList.contains("oldkey")){
        ele.value=keyChangeArray[i].oldkey
    }else{
        ele.value=keyChangeArray[i].newkey
    }
}
console.log(keyChangeArray)
}

addButton.addEventListener("click",()=>{
    fieldArray.push(inputSet)
    keyChangeArray.push({oldkey:"",newkey:""})
    keyfield.innerHTML+=inputSet
    setInputs()
})
removeButton.addEventListener("click",()=>{
    if(fieldArray.length>1){
        fieldArray.pop(inputSet)
        keyChangeArray.pop({oldkey:"",newkey:""})
        keyfield.innerHTML=fieldArray.join("")
        setInputs()
    }
})

function setInputs(){
    document.querySelectorAll(".oldkey").forEach((ele,i)=>{
        ele.value=keyChangeArray[i].oldkey
        ele.addEventListener("change",()=>change(ele,i))
    })  
    document.querySelectorAll(".newkey").forEach((ele,i)=>{
        ele.value=keyChangeArray[i].newkey
        ele.addEventListener("change",()=>change(ele,i))
    })
}

upload.addEventListener("click",()=>{
    inputElement.click()
})
download.addEventListener("click",()=>{
    try{
        let file=new File([JSON.stringify(convert(input))],"project.json",{type: 'json'})
        const link = document.createElement('a')
        const url = URL.createObjectURL(file)
        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        statusText.innerHTML="Done!"
        }
    catch(error){
        alert(`Something went wrong. ${error}`)
        statusText.innerHTML=`Something went wrong. ${error}`
        }
})
const inputElement = document.getElementById("input");
inputElement.addEventListener("change", (e)=>{
    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener("load",() => {
        try{
            input= JSON.parse(reader.result);
            download.disabled=false
            uploadText.innerHTML=`Uploaded ${file.name}`
        }catch(error){
            alert("This isn't a JSON file! Please upload a different file.")
        }
    },
    false,
  );
}, false);

function convert(input){
        statusText.innerHTML="Converting..."
    let output=JSON.parse(JSON.stringify(input))
    input.targets.forEach((target,i)=>{
        let blocks=Object.keys(target.blocks)
        blocks.forEach(block=>{
            if(target.blocks[block].opcode=="event_whenkeypressed"||target.blocks[block].opcode=="sensing_keyoptions"){
                keyChangeArray.forEach(ele=>{
                    if(target.blocks[block].fields.KEY_OPTION[0]==ele.oldkey){
                        output.targets[i].blocks[block].fields.KEY_OPTION[0]=ele.newkey
                    }
                })
            
            }
        })
    })
    statusText.innerHTML="Downloading..."
  return output
}