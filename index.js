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
let entries
const uploadText=document.querySelector(".uploadText")
const addButton=document.querySelector(".add")
const removeButton=document.querySelector(".remove")
const keyfield=document.querySelector(".keyfield")
keyfield.innerHTML=fieldArray.join("")
const upload=document.querySelector(".upload")
const downloadButton=document.querySelector(".download")
downloadButton.disabled=true
const statusText=document.querySelector(".status")

setInputs()

function inputUpdater(ele,i){
if(ele.value.trim().length==1||exceptions.includes(ele.value.trim().toLowerCase())){
    if(ele.classList.contains("oldkey")){
        keyChangeArray[i].oldkey=ele.value.trim().toLowerCase()
    }else{
        keyChangeArray[i].newkey=ele.value.trim().toLowerCase()
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
        ele.addEventListener("change",()=>inputUpdater(ele,i))
    })  
    document.querySelectorAll(".newkey").forEach((ele,i)=>{
        ele.value=keyChangeArray[i].newkey
        ele.addEventListener("change",()=>inputUpdater(ele,i))
    })
}

upload.addEventListener("click",()=>{
    uploadText.innerHTML="Uploading..."
    inputElement.click()
})
downloadButton.addEventListener("click",()=>{
    try{
        download()
        }
    catch(error){
        alert(`Something went wrong. ${error}`)
        statusText.innerHTML=`Something went wrong. ${error}`
        }
})
const inputElement = document.getElementById("input");
inputElement.addEventListener("change", (e)=>{
   openZip()
}, false);

async function download(){
    const blobWriter = new zip.BlobWriter("application/zip");
    const writer = new zip.ZipWriter(blobWriter);
    for(let i=0;i<entries.length;i++){
        if(entries[i].filename=="project.json"){
            statusText.innerHTML="Converting..."
            await writer.add("project.json", new zip.TextReader(convert(input)));
            statusText.innerHTML="Restoring ZIP..."
            continue
        }
        let data= await entries[i].getData(new zip.BlobWriter())
        await writer.add(entries[i].filename,new zip.BlobReader(data))
    }
    await writer.close();
    const blob = await blobWriter.getData();
    //
    //
    statusText.innerHTML="Downloading..."
    let file=new File([blob],`${inputElement.files[0].name}`)
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

async function openZip(){
    const file = inputElement.files[0];
    const reader = new zip.ZipReader(new zip.BlobReader(file));  
    entries = await reader.getEntries();
    for(let i=0;i<entries.length;i++){
        if(entries[i].filename=="project.json"){
            input=await entries[i].getData(new zip.TextWriter())
            uploadText.innerHTML=`Uploaded ${inputElement.files[0].name}`
        }
    }
    await reader.close();
    input= JSON.parse(input);
    downloadButton.disabled=false
}


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
  return JSON.stringify(output)
}
